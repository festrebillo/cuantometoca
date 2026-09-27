// CuántoMeToca.pe - Calculadora de liquidación de beneficios sociales
// Liquidación = CTS trunca + gratificación trunca (+ bonificación) + vacaciones truncas y no gozadas
//               (+ indemnización si hubo despido arbitrario)

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  $("ultima-revision").textContent = CONFIG.ULTIMA_REVISION;

  $("form-liq").addEventListener("submit", e => {
    e.preventDefault();
    const out = $("resultado");
    const sueldo = Number($("sueldo").value) || 0;
    const ingreso = parseFecha($("ingreso").value);
    const cese = parseFecha($("cese").value);
    if (sueldo <= 0) { out.innerHTML = `<p class="alert">Ingresa tu sueldo básico mensual.</p>`; return; }
    if (!ingreso || !cese) { out.innerHTML = `<p class="alert">Ingresa tu fecha de ingreso y tu último día de trabajo.</p>`; return; }
    if (cese < ingreso) { out.innerHTML = `<p class="alert">La fecha de cese no puede ser anterior a la de ingreso.</p>`; return; }

    const regimen = $("regimen").value;
    const { asigFam, rc } = remuneracionComputable(sueldo, $("asignacion").checked, Number($("variables").value) || 0);
    const datos = { rc, ingreso, cese, regimen, seguro: $("seguro").value, pendientes: Number($("pendientes").value) || 0 };

    const cts = ctsTrunca(datos);
    const gr = gratiTrunca(datos);
    const vac = vacacionesTruncas(datos);
    const ind = $("despido").checked ? indemnizacion(datos) : null;
    const total = cts.monto + gr.grati + gr.bono + vac.truncas + vac.noGozadas + (ind ? ind.monto : 0);

    const filas = [
      ["<strong>Remuneración computable</strong>", `<strong>${soles(rc)}</strong>`],
      [`CTS trunca (${tiempoTexto(cts.t)} desde ${fechaTexto(cts.desde)})`, soles(cts.monto)],
      [`Gratificación trunca (${gr.meses} ${gr.meses === 1 ? "mes completo" : "meses completos"})`, soles(gr.grati)],
      [`Bonificación extraordinaria (${(gr.tasaBono * 100).toFixed(2).replace(".00", "")}%)`, soles(gr.bono)],
      [`Vacaciones truncas (${tiempoTexto(vac.t)} desde ${fechaTexto(vac.desde)})`, soles(vac.truncas)]
    ];
    if (datos.pendientes > 0) filas.push([`Vacaciones no gozadas (${datos.pendientes} ${datos.pendientes === 1 ? "periodo" : "periodos"})`, soles(vac.noGozadas)]);
    if (ind) filas.push([`Indemnización por despido arbitrario${ind.topado ? " (tope legal)" : ""}`, soles(ind.monto)]);
    filas.push(["Total liquidación (bruto)", soles(total), true]);

    const notas = [];
    if (regimen === "micro") notas.push("En microempresa no corresponden CTS ni gratificaciones; sí vacaciones (15 días por año).");
    if (datos.pendientes > 1) notas.push("Si no gozaste tus vacaciones dentro del año siguiente a ganarlas, también te corresponde una <strong>indemnización vacacional</strong> (una remuneración adicional por periodo), no incluida aquí.");
    notas.push("Las vacaciones sí tienen descuentos de AFP u ONP; la CTS y la gratificación no. Tu empleador debe pagarte la liquidación dentro de las 48 horas siguientes al cese.");
    notas.push("Calculamos la CTS trunca asumiendo que recibiste la última gratificación completa.");

    out.innerHTML = cajaTotal("Tu liquidación sería aproximadamente", total,
      `Trabajaste ${tiempoTexto(tiempoEntre(ingreso, cese))}`) +
      tablaDesglose(filas) + `<p class="note">${notas.join(" ")}</p>`;
  });
});
