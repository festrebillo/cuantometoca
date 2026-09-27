// CuántoMeToca.pe - Calculadora de gratificación (Ley 27735)
// Fórmula: (remuneración computable / 6) x meses completos x factor de régimen
//          + bonificación extraordinaria (9% EsSalud o 6.75% EPS)

// Meses calendario completos trabajados dentro del semestre, según fecha de ingreso.
// Un mes solo cuenta si se trabajó desde su día 1.
function mesesDesdeIngreso(fechaIngreso, periodo, anio) {
  const inicioSemestre = periodo === "julio" ? 0 : 6;       // enero o julio (índice de mes)
  const f = new Date(fechaIngreso + "T00:00:00");
  if (isNaN(f)) return null;

  let primerMes;                                             // primer mes completo, contado 0..6
  if (f.getFullYear() < anio || (f.getFullYear() === anio && f.getMonth() < inicioSemestre)) {
    primerMes = 0;
  } else if (f.getFullYear() > anio) {
    return 0;
  } else {
    const relativo = f.getMonth() - inicioSemestre;
    primerMes = f.getDate() === 1 ? relativo : relativo + 1;
  }
  return Math.max(0, Math.min(6, 6 - primerMes));
}

function calcularGratificacion({ sueldo, asignacion, variables, meses, regimen, seguro }) {
  const asigFam = asignacion ? CONFIG.RMV * CONFIG.ASIGNACION_FAMILIAR_PCT : 0;
  const computable = sueldo + asigFam + variables;
  const factor = CONFIG.REGIMEN_FACTOR[regimen];
  const grati = (computable / 6) * meses * factor;
  const tasaBono = seguro === "eps" ? CONFIG.BONO_EPS : CONFIG.BONO_ESSALUD;
  const bono = grati * tasaBono;
  return { asigFam, computable, factor, grati, tasaBono, bono, total: grati + bono };
}

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  $("rmv-valor").textContent = soles(CONFIG.RMV * CONFIG.ASIGNACION_FAMILIAR_PCT);
  $("ultima-revision").textContent = CONFIG.ULTIMA_REVISION;

  // Si el usuario ingresa su fecha de ingreso, calculamos los meses por él.
  const actualizarMeses = () => {
    const fecha = $("ingreso").value;
    if (!fecha) return;
    const m = mesesDesdeIngreso(fecha, $("periodo").value, Number($("anio").value));
    if (m !== null) $("meses").value = String(m);
  };
  $("ingreso").addEventListener("change", actualizarMeses);
  $("periodo").addEventListener("change", actualizarMeses);
  $("anio").addEventListener("change", actualizarMeses);

  $("form-grati").addEventListener("submit", e => {
    e.preventDefault();
    const datos = {
      sueldo: Number($("sueldo").value) || 0,
      asignacion: $("asignacion").checked,
      variables: Number($("variables").value) || 0,
      meses: Number($("meses").value),
      regimen: $("regimen").value,
      seguro: $("seguro").value
    };
    const out = $("resultado");

    if (datos.sueldo <= 0) {
      out.innerHTML = `<p class="alert">Ingresa tu sueldo básico mensual.</p>`;
      return;
    }
    if (datos.regimen === "micro") {
      out.innerHTML = `<p class="alert">En el <strong>régimen de microempresa</strong> (REMYPE) la ley no otorga gratificaciones. Si tu empresa no está inscrita en el REMYPE, elige "Régimen general".</p>`;
      return;
    }
    if (datos.meses === 0) {
      out.innerHTML = `<p class="alert">Necesitas al menos <strong>un mes calendario completo</strong> trabajado en el semestre para recibir gratificación.</p>`;
      return;
    }

    const r = calcularGratificacion(datos);
    const periodoTxt = $("periodo").value === "julio" ? "Fiestas Patrias (julio)" : "Navidad (diciembre)";
    out.innerHTML = `
      <div class="result-total">
        Recibirías aproximadamente
        <span class="amount">${soles(r.total)}</span>
        Gratificación de ${periodoTxt} ${$("anio").value}
      </div>
      <table class="breakdown">
        <tr><td>Sueldo básico</td><td>${soles(datos.sueldo)}</td></tr>
        <tr><td>Asignación familiar</td><td>${soles(r.asigFam)}</td></tr>
        <tr><td>Promedio de ingresos variables</td><td>${soles(datos.variables)}</td></tr>
        <tr><td><strong>Remuneración computable</strong></td><td><strong>${soles(r.computable)}</strong></td></tr>
        <tr><td>Meses completos trabajados</td><td>${datos.meses} de 6</td></tr>
        ${r.factor < 1 ? `<tr><td>Régimen pequeña empresa</td><td>50%</td></tr>` : ""}
        <tr><td>Gratificación</td><td>${soles(r.grati)}</td></tr>
        <tr><td>Bonificación extraordinaria (${(r.tasaBono * 100).toFixed(2).replace(".00", "")}%)</td><td>${soles(r.bono)}</td></tr>
        <tr class="total"><td>Total a recibir</td><td>${soles(r.total)}</td></tr>
      </table>
      <p class="note">La gratificación no tiene descuentos de AFP, ONP ni EsSalud. Sí puede estar afecta al impuesto a la renta de quinta categoría si tus ingresos anuales superan 7 UIT.</p>`;
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
