// CuántoMeToca.pe - Calculadora de vacaciones truncas y no gozadas (D. Leg. 713)
// Truncas = (RC / 12) x meses + (RC / 360) x días desde el último aniversario de ingreso

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  $("ultima-revision").textContent = CONFIG.ULTIMA_REVISION;

  $("form-vac").addEventListener("submit", e => {
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
    const pendientes = Number($("pendientes").value) || 0;
    const vac = vacacionesTruncas({ rc, ingreso, cese, regimen, pendientes });
    const total = vac.truncas + vac.noGozadas;

    const filas = [
      ["Sueldo básico", soles(sueldo)],
      ["Asignación familiar", soles(asigFam)],
      ["Promedio de ingresos variables", soles(rc - sueldo - asigFam)],
      ["<strong>Remuneración computable</strong>", `<strong>${soles(rc)}</strong>`],
      ["Días de vacaciones por año", regimen === "general" ? "30 días" : "15 días (REMYPE)"],
      [`Tiempo desde el ${fechaTexto(vac.desde)}`, tiempoTexto(vac.t)],
      ["Vacaciones truncas", soles(vac.truncas)]
    ];
    if (pendientes > 0) filas.push([`Vacaciones no gozadas (${pendientes} ${pendientes === 1 ? "periodo" : "periodos"})`, soles(vac.noGozadas)]);
    filas.push(["Total vacaciones (bruto)", soles(total), true]);

    const notas = [];
    if (vac.truncas === 0) notas.push("Necesitas al menos un mes de servicios para tener vacaciones truncas.");
    notas.push("Las vacaciones son remuneración: se les descuenta AFP u ONP y, si corresponde, impuesto a la renta.");
    if (pendientes > 0) notas.push("Si un periodo vencido no se gozó dentro del año siguiente, corresponde además una indemnización vacacional equivalente a otra remuneración.");

    out.innerHTML = cajaTotal("Te corresponderían aproximadamente", total, "Vacaciones al terminar tu vínculo laboral") +
      tablaDesglose(filas) + `<p class="note">${notas.join(" ")}</p>`;
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
