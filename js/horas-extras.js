// CuántoMeToca.pe - Calculadora de horas extras (D.S. 007-2002-TR)
// Valor hora = (sueldo + asignación familiar) / 30 / horas de jornada diaria
// Primeras 2 horas diarias: +25%; a partir de la 3.ª: +35%; feriado o descanso: +100%

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  $("ultima-revision").textContent = CONFIG.ULTIMA_REVISION;

  // Ayuda: reparte las horas por día entre la tasa del 25% y la del 35%.
  const repartir = () => {
    const dias = Number($("dias-extra").value) || 0;
    const porDia = Number($("horas-dia").value) || 0;
    if (!dias || !porDia) return;
    $("h25").value = +(dias * Math.min(2, porDia)).toFixed(2);
    $("h35").value = +(dias * Math.max(0, porDia - 2)).toFixed(2);
  };
  $("dias-extra").addEventListener("input", repartir);
  $("horas-dia").addEventListener("input", repartir);

  $("form-he").addEventListener("submit", e => {
    e.preventDefault();
    const out = $("resultado");
    const sueldo = Number($("sueldo").value) || 0;
    const jornada = Number($("jornada").value) || 8;
    if (sueldo <= 0) { out.innerHTML = `<p class="alert">Ingresa tu sueldo básico mensual.</p>`; return; }

    const { asigFam, rc } = remuneracionComputable(sueldo, $("asignacion").checked, 0);
    const valorHora = rc / 30 / jornada;
    const h25 = Number($("h25").value) || 0;
    const h35 = Number($("h35").value) || 0;
    const hFer = Number($("hferiado").value) || 0;
    if (!h25 && !h35 && !hFer) { out.innerHTML = `<p class="alert">Ingresa las horas extras trabajadas en el mes.</p>`; return; }

    const p25 = h25 * valorHora * (1 + CONFIG.SOBRETASA_25);
    const p35 = h35 * valorHora * (1 + CONFIG.SOBRETASA_35);
    const pFer = hFer * valorHora * (1 + CONFIG.SOBRETASA_FERIADO);
    const total = p25 + p35 + pFer;

    const filas = [
      ["Sueldo + asignación familiar", soles(rc)],
      [`Valor de tu hora normal (÷ 30 días ÷ ${jornada} h)`, soles(valorHora)],
      [`${h25} h al 25% (${soles(valorHora * 1.25)} c/u)`, soles(p25)],
      [`${h35} h al 35% (${soles(valorHora * 1.35)} c/u)`, soles(p35)]
    ];
    if (hFer) filas.push([`${hFer} h en feriado o descanso al 100% (${soles(valorHora * 2)} c/u)`, soles(pFer)]);
    filas.push(["Total horas extras del mes", soles(total), true]);

    out.innerHTML = cajaTotal("Deberían pagarte por horas extras", total, "Adicional a tu sueldo del mes") +
      tablaDesglose(filas) +
      `<p class="note">Las horas extras son remuneración: se les descuenta AFP u ONP. Si las recibes de forma regular (3 de cada 6 meses), también suben tu gratificación y tu CTS.</p>`;
    out.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
