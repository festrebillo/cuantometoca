// CuántoMeToca.pe - valores legales usados por todas las calculadoras.
// Cuando cambie la ley (p. ej. nuevo sueldo mínimo), SOLO se actualiza este archivo
// y se anota el cambio en DOCUMENTACION.md.
const CONFIG = {
  // Remuneración Mínima Vital. Vigente desde 01/01/2025 (D.S. N.° 006-2024-TR).
  // Anunciado aumento a S/ 1,300 (sep-2026) aún sin decreto: revisar periódicamente.
  RMV: 1130,

  // Asignación familiar = 10% de la RMV (Ley 25129).
  ASIGNACION_FAMILIAR_PCT: 0.10,

  // Bonificación extraordinaria sobre la gratificación (Ley 29351 / Ley 30334):
  // equivale al aporte del empleador que no se paga sobre la gratificación.
  BONO_ESSALUD: 0.09,
  BONO_EPS: 0.0675,

  // Proporción de gratificación según régimen laboral.
  REGIMEN_FACTOR: {
    general: 1,      // Régimen general
    pequena: 0.5,    // Pequeña empresa (REMYPE): media remuneración
    micro: 0         // Microempresa (REMYPE): no corresponde
  },

  // Vacaciones: 30 días en régimen general; 15 días en REMYPE (pequeña y micro).
  VACACIONES_FACTOR: { general: 1, pequena: 0.5, micro: 0.5 },

  // CTS: régimen general 1 sueldo/año; pequeña empresa 1/2; microempresa no corresponde.
  CTS_FACTOR: { general: 1, pequena: 0.5, micro: 0 },

  // Indemnización por despido arbitrario (en días de remuneración por año y tope en días).
  INDEMNIZACION: {
    general: { diasPorAnio: 45, topeDias: 360 },   // 1.5 sueldos por año, tope 12 sueldos
    pequena: { diasPorAnio: 20, topeDias: 120 },
    micro:   { diasPorAnio: 10, topeDias: 90 }
  },

  // Unidad Impositiva Tributaria 2026 (D.S. N.° 301-2025-EF).
  UIT: 5500,

  // Impuesto a la renta de quinta categoría: deducción de 7 UIT y tramos en UIT.
  DEDUCCION_UIT: 7,
  TRAMOS_RENTA: [
    { hastaUIT: 5, tasa: 0.08 },
    { hastaUIT: 20, tasa: 0.14 },
    { hastaUIT: 35, tasa: 0.17 },
    { hastaUIT: 45, tasa: 0.20 },
    { hastaUIT: Infinity, tasa: 0.30 }
  ],

  // Sistema de pensiones.
  ONP: 0.13,
  AFP_APORTE: 0.10,
  AFP_PRIMA_SEGURO: 0.0137,          // Desde enero 2026 (Ley 32123)
  AFP_REM_MAX_ASEGURABLE: 12672.65,  // Tope para la prima; jul-sep 2026 (SBS), se actualiza cada trimestre
  AFP_COMISION_FLUJO: {              // % sobre el sueldo (solo comisión por flujo; la mixta cobra 0% sobre el sueldo)
    habitat: 0.0147,
    integra: 0.0155,
    prima: 0.0160,
    profuturo: 0.0169
  },

  // Horas extras (D.S. 007-2002-TR): primeras 2 horas +25%, siguientes +35%; feriado/descanso +100%.
  SOBRETASA_25: 0.25,
  SOBRETASA_35: 0.35,
  SOBRETASA_FERIADO: 1.00,

  ULTIMA_REVISION: "septiembre 2026"
};

// Formatea números como moneda peruana: S/ 1,234.56
function soles(n) {
  return "S/ " + n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Año actual en el pie de página
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
});
