// CuántoMeToca.pe - Calculadora de sueldo neto
// Neto = bruto - aporte a pensiones (ONP o AFP) - retención de quinta categoría (promedio mensual)

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  $("ultima-revision").textContent = CONFIG.ULTIMA_REVISION;
  $("uit-valor").textContent = soles(CONFIG.UIT);

  const toggleAfp = () => { $("campos-afp").hidden = $("sistema").value !== "afp"; };
  $("sistema").addEventListener("change", toggleAfp);
  toggleAfp();

  $("form-neto").addEventListener("submit", e => {
    e.preventDefault();
    const out = $("resultado");
    const sueldo = Number($("sueldo").value) || 0;
    if (sueldo <= 0) { out.innerHTML = `<p class="alert">Ingresa tu sueldo bruto mensual.</p>`; return; }

    const { asigFam, rc: bruto } = remuneracionComputable(sueldo, $("asignacion").checked, Number($("variables").value) || 0);
    const regimen = $("regimen").value;
    const filas = [
      ["Sueldo básico", soles(sueldo)],
      ["Asignación familiar", soles(asigFam)],
      ["Otros ingresos del mes", soles(bruto - sueldo - asigFam)],
      ["<strong>Sueldo bruto</strong>", `<strong>${soles(bruto)}</strong>`]
    ];

    // Pensiones
    let pension = 0;
    if ($("sistema").value === "onp") {
      pension = bruto * CONFIG.ONP;
      filas.push(["ONP (13%)", "− " + soles(pension)]);
    } else {
      const aporte = bruto * CONFIG.AFP_APORTE;
      const prima = Math.min(bruto, CONFIG.AFP_REM_MAX_ASEGURABLE) * CONFIG.AFP_PRIMA_SEGURO;
      const tasaCom = $("comision").value === "flujo" ? CONFIG.AFP_COMISION_FLUJO[$("afp").value] : 0;
      const comision = bruto * tasaCom;
      pension = aporte + prima + comision;
      filas.push(["AFP: aporte al fondo (10%)", "− " + soles(aporte)]);
      filas.push([`AFP: prima de seguro (${(CONFIG.AFP_PRIMA_SEGURO * 100).toFixed(2)}%)`, "− " + soles(prima)]);
      filas.push([`AFP: comisión ${tasaCom ? "por flujo (" + (tasaCom * 100).toFixed(2) + "%)" : "mixta (0% del sueldo)"}`, "− " + soles(comision)]);
    }

    // Quinta categoría: proyección anual = 12 sueldos + 2 gratificaciones + bonificación extraordinaria
    const factorGrati = CONFIG.REGIMEN_FACTOR[regimen];
    const gratisAnio = bruto * 2 * factorGrati;
    const bonoAnio = gratisAnio * CONFIG.BONO_ESSALUD;
    const anual = bruto * 12 + gratisAnio + bonoAnio;
    const { impuesto } = impuestoQuinta(anual);
    const quinta = impuesto / 12;
    filas.push(["Impuesto a la renta de 5.ª categoría (promedio mensual)", "− " + soles(quinta)]);

    const neto = bruto - pension - quinta;
    filas.push(["Sueldo neto a recibir", soles(neto), true]);

    out.innerHTML = cajaTotal("Tu sueldo neto mensual sería", neto,
      `Descuentos: ${soles(pension + quinta)} (${((pension + quinta) / bruto * 100).toFixed(1)}% del bruto)`) +
      tablaDesglose(filas) +
      `<p class="note">Ingreso anual proyectado para el impuesto: ${soles(anual)} (12 sueldos + gratificaciones + bonificación). ` +
      (impuesto > 0
        ? `Impuesto anual estimado: ${soles(impuesto)}. La retención real varía mes a mes; aquí mostramos el promedio.`
        : `No superas las 7 UIT (${soles(CONFIG.DEDUCCION_UIT * CONFIG.UIT)} al año), así que no pagas impuesto a la renta.`) +
      ` Tu empleador aporta además el 9% a EsSalud, que no se descuenta de tu sueldo.</p>`;
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
