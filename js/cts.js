// CuántoMeToca.pe - Calculadora de CTS (D.S. 001-97-TR)
// CTS = (RC / 12) x meses + (RC / 360) x días, con RC = sueldo + asig. familiar + variables + 1/6 de la gratificación

// Semestre que se deposita: mayo = noviembre (año anterior) a abril; noviembre = mayo a octubre.
function semestreCts(deposito, anio) {
  return deposito === "mayo"
    ? { inicio: new Date(anio - 1, 10, 1), fin: new Date(anio, 3, 30), grati: "diciembre" }
    : { inicio: new Date(anio, 4, 1), fin: new Date(anio, 9, 31), grati: "julio" };
}

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  $("ultima-revision").textContent = CONFIG.ULTIMA_REVISION;

  const actualizarTiempo = () => {
    const ingreso = parseFecha($("ingreso").value);
    if (!ingreso) return;
    const s = semestreCts($("deposito").value, Number($("anio").value));
    const t = tiempoEntre(maxFecha(ingreso, s.inicio), s.fin);
    $("meses").value = String(Math.min(6, t.meses));
    $("dias").value = t.meses >= 6 ? 0 : t.dias;
  };
  ["ingreso", "deposito", "anio"].forEach(id => $(id).addEventListener("change", actualizarTiempo));

  $("form-cts").addEventListener("submit", e => {
    e.preventDefault();
    const out = $("resultado");
    const sueldo = Number($("sueldo").value) || 0;
    const regimen = $("regimen").value;
    if (sueldo <= 0) { out.innerHTML = `<p class="alert">Ingresa tu sueldo básico mensual.</p>`; return; }
    if (regimen === "micro") {
      out.innerHTML = `<p class="alert">En el <strong>régimen de microempresa</strong> (REMYPE) no corresponde CTS. Si tu empresa no está inscrita en el REMYPE, elige "Régimen general".</p>`;
      return;
    }

    const { asigFam, rc } = remuneracionComputable(sueldo, $("asignacion").checked, Number($("variables").value) || 0);
    const gratiIngresada = Number($("grati").value);
    const grati = gratiIngresada > 0 ? gratiIngresada : rc * CONFIG.REGIMEN_FACTOR[regimen];
    const rcCts = rc + grati / 6;
    const t = { meses: Number($("meses").value), dias: Math.min(29, Number($("dias").value) || 0) };
    if (t.meses === 0 && t.dias === 0) { out.innerHTML = `<p class="alert">Indica el tiempo trabajado en el semestre.</p>`; return; }

    const factor = CONFIG.CTS_FACTOR[regimen];
    const porMeses = (rcCts / 12) * t.meses * factor;
    const porDias = (rcCts / 360) * t.dias * factor;
    const total = porMeses + porDias;
    const deposito = $("deposito").value;

    out.innerHTML = cajaTotal("Tu CTS sería aproximadamente", total,
      `Depósito de ${deposito} ${$("anio").value} (hasta el 15 de ${deposito})`) +
      tablaDesglose([
        ["Sueldo básico", soles(sueldo)],
        ["Asignación familiar", soles(asigFam)],
        ["Promedio de ingresos variables", soles(rc - sueldo - asigFam)],
        [`1/6 de la gratificación de ${semestreCts(deposito, 2000).grati}`, soles(grati / 6)],
        ["<strong>Remuneración computable</strong>", `<strong>${soles(rcCts)}</strong>`],
        ["Tiempo trabajado", tiempoTexto(t)],
        ...(factor < 1 ? [["Régimen pequeña empresa", "50%"]] : []),
        ["Por meses", soles(porMeses)],
        ["Por días", soles(porDias)],
        ["Total CTS", soles(total), true]
      ]) +
      `<p class="note">${gratiIngresada > 0 ? "" : "Asumimos que recibiste la gratificación completa del semestre; si fue menor, escríbela en el campo opcional. "}La CTS no tiene descuentos: se deposita completa en tu cuenta CTS.</p>`;
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
