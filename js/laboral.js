// CuántoMeToca.pe - funciones compartidas: fechas y cálculos de beneficios.
// Requiere js/config.js cargado antes.

const DIA_MS = 86400000;

// "2026-09-27" -> Date local (sin desfase por zona horaria)
function parseFecha(txt) {
  if (!txt) return null;
  const [y, m, d] = txt.split("-").map(Number);
  const f = new Date(y, m - 1, d);
  return isNaN(f) ? null : f;
}

function fechaTexto(f) {
  return f.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Tiempo trabajado entre dos fechas, ambas inclusive: { meses, dias }.
// Se usa para CTS, vacaciones e indemnización, que sí cuentan días sueltos.
function tiempoEntre(desde, hasta) {
  if (!desde || !hasta || hasta < desde) return { meses: 0, dias: 0 };
  const fin = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate() + 1);
  let meses = (fin.getFullYear() - desde.getFullYear()) * 12 + (fin.getMonth() - desde.getMonth());
  let ancla = new Date(desde.getFullYear(), desde.getMonth() + meses, desde.getDate());
  if (ancla > fin) {
    meses -= 1;
    ancla = new Date(desde.getFullYear(), desde.getMonth() + meses, desde.getDate());
  }
  let dias = Math.round((fin - ancla) / DIA_MS);
  if (dias >= 30) { meses += 1; dias -= 30; }
  return { meses, dias };
}

// Meses calendario completos entre dos fechas (para gratificación).
// Un mes cuenta solo si se trabajó del primer al último día.
function mesesCompletos(desde, hasta) {
  if (!desde || !hasta || hasta < desde) return 0;
  const primero = desde.getDate() === 1
    ? desde.getFullYear() * 12 + desde.getMonth()
    : desde.getFullYear() * 12 + desde.getMonth() + 1;
  const esUltimoDia = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate() + 1).getDate() === 1;
  const ultimo = esUltimoDia
    ? hasta.getFullYear() * 12 + hasta.getMonth()
    : hasta.getFullYear() * 12 + hasta.getMonth() - 1;
  return Math.max(0, ultimo - primero + 1);
}

const maxFecha = (a, b) => (a > b ? a : b);

// Remuneración computable básica: sueldo + asignación familiar + promedio de variables.
function remuneracionComputable(sueldo, asignacion, variables) {
  const asigFam = asignacion ? CONFIG.RMV * CONFIG.ASIGNACION_FAMILIAR_PCT : 0;
  return { asigFam, rc: sueldo + asigFam + variables };
}

// Proporcional por meses y días de un beneficio anual equivalente a "base".
const proporcional = (base, t) => (base / 12) * t.meses + (base / 360) * t.dias;

// --- CTS trunca: desde el último 1 de mayo o 1 de noviembre hasta el cese ---
function inicioPeriodoCts(cese) {
  const y = cese.getFullYear(), m = cese.getMonth();
  if (m >= 4 && m <= 9) return new Date(y, 4, 1);    // mayo - octubre
  if (m >= 10) return new Date(y, 10, 1);            // noviembre - diciembre
  return new Date(y - 1, 10, 1);                     // enero - abril
}

function ctsTrunca({ rc, ingreso, cese, regimen }) {
  const desde = maxFecha(ingreso, inicioPeriodoCts(cese));
  const t = tiempoEntre(desde, cese);
  const sextoGrati = (rc * CONFIG.REGIMEN_FACTOR[regimen]) / 6;
  const rcCts = rc + sextoGrati;
  const monto = proporcional(rcCts, t) * CONFIG.CTS_FACTOR[regimen];   // RC/12 por mes + RC/360 por día
  return { desde, t, sextoGrati, rcCts, monto };
}

// --- Gratificación trunca: meses completos del semestre en curso ---
function gratiTrunca({ rc, ingreso, cese, regimen, seguro }) {
  const inicio = new Date(cese.getFullYear(), cese.getMonth() < 6 ? 0 : 6, 1);
  const desde = maxFecha(ingreso, inicio);
  const meses = mesesCompletos(desde, cese);
  const grati = (rc / 6) * meses * CONFIG.REGIMEN_FACTOR[regimen];
  const tasaBono = seguro === "eps" ? CONFIG.BONO_EPS : CONFIG.BONO_ESSALUD;
  return { desde, meses, grati, tasaBono, bono: grati * tasaBono };
}

// --- Vacaciones truncas: desde el último aniversario de ingreso hasta el cese ---
function ultimoAniversario(ingreso, cese) {
  let a = new Date(cese.getFullYear(), ingreso.getMonth(), ingreso.getDate());
  if (a > cese) a = new Date(cese.getFullYear() - 1, ingreso.getMonth(), ingreso.getDate());
  return maxFecha(a, ingreso);
}

function vacacionesTruncas({ rc, ingreso, cese, regimen, pendientes }) {
  const factor = CONFIG.VACACIONES_FACTOR[regimen];
  const total = tiempoEntre(ingreso, cese);
  const desde = ultimoAniversario(ingreso, cese);
  const t = tiempoEntre(desde, cese);
  // Se requiere al menos un mes de servicios para tener vacaciones truncas.
  const truncas = total.meses >= 1 ? proporcional(rc, t) * factor : 0;
  const noGozadas = (pendientes || 0) * rc * factor;
  return { desde, t, factor, truncas, noGozadas };
}

// --- Indemnización por despido arbitrario ---
function indemnizacion({ rc, ingreso, cese, regimen }) {
  const { diasPorAnio, topeDias } = CONFIG.INDEMNIZACION[regimen];
  const t = tiempoEntre(ingreso, cese);
  const diario = rc / 30;
  const porAnio = diario * diasPorAnio;
  const bruto = (porAnio / 12) * t.meses + (porAnio / 360) * t.dias;
  const tope = diario * topeDias;
  return { t, porAnio, monto: Math.min(bruto, tope), topado: bruto > tope };
}

// --- Impuesto a la renta de quinta categoría (anual) ---
function impuestoQuinta(rentaBrutaAnual) {
  const uit = CONFIG.UIT;
  let neta = rentaBrutaAnual - CONFIG.DEDUCCION_UIT * uit;
  if (neta <= 0) return { neta: 0, impuesto: 0 };
  let impuesto = 0, piso = 0, resto = neta;
  for (const tr of CONFIG.TRAMOS_RENTA) {
    const techo = tr.hastaUIT * uit;
    const tramo = Math.min(resto, techo - piso);
    if (tramo <= 0) break;
    impuesto += tramo * tr.tasa;
    resto -= tramo;
    piso = techo;
  }
  return { neta, impuesto };
}

// Texto "X meses y Y días"
function tiempoTexto(t) {
  const m = t.meses === 1 ? "1 mes" : `${t.meses} meses`;
  const d = t.dias === 1 ? "1 día" : `${t.dias} días`;
  return `${m} y ${d}`;
}

// Tabla de desglose a partir de filas [etiqueta, valor, esTotal]
function tablaDesglose(filas) {
  return `<table class="breakdown">${filas.map(([k, v, total]) =>
    `<tr${total ? ' class="total"' : ""}><td>${k}</td><td>${v}</td></tr>`).join("")}</table>`;
}

function cajaTotal(titulo, monto, sub) {
  return `<div class="result-total">${titulo}<span class="amount">${soles(monto)}</span>${sub || ""}</div>`;
}
