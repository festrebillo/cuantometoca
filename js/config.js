// CalculaPE - valores legales usados por todas las calculadoras.
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
