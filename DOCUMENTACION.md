# CuántoMeToca.pe — Documentación del proyecto

## 1. Objetivo
Crear una **web de calculadoras laborales gratuitas para Perú** que genere ingresos pasivos con **Google AdSense** (y más adelante con productos propios, como plantillas de Excel), sin necesidad de salir en cámara ni de atender clientes.

**Cómo gana dinero:** la gente busca en Google, por ejemplo "calcular gratificación 2026", entra al sitio, usa la calculadora y ve anuncios. Mientras más herramientas y visitas, más ingresos.

**Expectativa realista:** pocos soles los primeros 3–6 meses y crecimiento entre los 6 y los 12 meses. No hay ingresos garantizados, pero el riesgo económico es mínimo (solo el dominio).

## 2. Alcance
**Versión 0.1 (actual):**
- Página de inicio con el catálogo de herramientas
- Calculadora de gratificación (julio y diciembre)
- Páginas que exige AdSense: Acerca de, Contacto, Política de privacidad y Términos
- SEO básico: títulos, descripciones, `sitemap.xml`, `robots.txt` y datos estructurados de preguntas frecuentes (FAQ)

**Siguientes calculadoras:** CTS, sueldo neto, liquidación, vacaciones truncas y horas extras.

## 3. Herramientas
| Herramienta | Para qué | Costo |
|---|---|---|
| HTML + CSS + JavaScript puro | El sitio completo, sin frameworks | Gratis |
| Git | Control de versiones | Gratis |
| GitHub + GitHub Pages o Vercel | Repositorio y hosting | Gratis |
| Dominio (.com o .pe) | Dirección propia, recomendada para AdSense | ~S/ 40–120 al año |
| Google Search Console | Que Google indexe el sitio | Gratis |
| Google AdSense | Monetización con anuncios | Gratis (Google se queda con una comisión) |
| Claude | Programación, contenidos y SEO | Suscripción que ya se tiene |

## 4. Estructura
```
CuantoMeToca/   (carpeta aún llamada CalculaPE; renombrar con VS Code cerrado)
├── index.html                 Inicio: catálogo de herramientas
├── gratificacion.html         Calculadora de gratificación + guía + FAQ
├── acerca.html                Acerca de (requisito de AdSense)
├── contacto.html              Contacto (requisito de AdSense)
├── politica-privacidad.html   Privacidad y cookies de Google (requisito de AdSense)
├── terminos.html              Términos de uso
├── css/styles.css             Estilos compartidos (modo claro y oscuro, móvil primero)
├── js/config.js               ⚠️ Valores legales (RMV, tasas) — único archivo que se toca cuando cambia la ley
├── js/gratificacion.js        Lógica de la calculadora de gratificación
├── robots.txt / sitemap.xml   Indicaciones para Google
├── .gitignore                 Excluye .env del repositorio
├── .env.example               Plantilla de variables sensibles (hoy no se usa ninguna)
└── DOCUMENTACION.md           Este archivo
```

## 5. Decisiones (y su porqué)
| Decisión | Por qué |
|---|---|
| Web de herramientas en lugar de blog | Las calculadoras mantienen visitas aunque la IA responda preguntas en los buscadores; los artículos no. Además, no requiere cámara ni clientes. |
| Nicho: beneficios laborales de Perú | Búsquedas recurrentes cada año (picos en mayo, julio, noviembre y diciembre), en español y con competencia manejable. |
| Gratificación como primera calculadora | La de diciembre se paga hasta el 15/12; publicando en octubre se alcanza a captar ese pico de búsquedas. |
| Sitio estático, sin frameworks | Hosting gratis, carga muy rápida (Google la premia), cero mantenimiento de servidores. |
| Valores legales en `js/config.js` | Cuando cambie la ley (p. ej. la RMV) se actualiza un solo archivo y todas las calculadoras quedan al día. |
| Cálculos en el navegador | No se guardan datos personales, lo que simplifica la privacidad y genera confianza. |
| Explicaciones y FAQ en cada calculadora | AdSense rechaza sitios con poco contenido; el texto útil también posiciona en Google. |

### Base legal de la calculadora de gratificación
- **Ley 27735:** gratificación = (remuneración computable ÷ 6) × meses calendario completos del semestre.
- **Remuneración computable** = sueldo básico + asignación familiar + promedio de ingresos variables regulares (recibidos al menos 3 de 6 meses).
- **Asignación familiar** = 10% de la RMV (Ley 25129). RMV = **S/ 1,130** (D.S. 006-2024-TR, vigente desde 01/01/2025).
- **Bonificación extraordinaria** = 9% (EsSalud) o 6.75% (EPS) de la gratificación (Leyes 29351 y 30334).
- **REMYPE:** pequeña empresa = 50%; microempresa = no corresponde.
- La gratificación no tiene descuentos de AFP, ONP ni EsSalud; sí puede estar afecta al impuesto de quinta categoría.

## 6. Bitácora
### 2026-09-27 — v0.1: creación del proyecto
- **Qué:** estructura del sitio, calculadora de gratificación, páginas legales, SEO básico y repositorio git.
- **Por qué:** se eligió este método entre varias opciones (YouTube, TikTok, plantillas de Canva, servicios, micro-SaaS) porque es la única que cumple a la vez: sin cámara, ingreso pasivo, inversión mínima y aprovecha la programación con Claude.
- **Cómo:** HTML, CSS y JS puro. Antes de programar se verificó en la web que la RMV vigente sigue siendo S/ 1,130 (hay un aumento a S/ 1,300 anunciado en sep-2026, todavía sin decreto).

### 2026-09-27 — v0.2: cambio de nombre a CuántoMeToca.pe
- **Qué:** se cambió la marca de "CalculaPE" a **CuántoMeToca.pe** y las direcciones provisionales `TU-DOMINIO.com` por `https://festrebillo.github.io/cuantometoca`.
- **Por qué:** `calcula.pe` ya está registrado y tiene una web activa; usarlo generaría confusión y no se podría comprar ese dominio. "Cuánto me toca" es exactamente cómo busca la gente ("¿cuánto me toca de gratificación?"), lo que ayuda en Google. Se revisó que `cuantometoca.com` está tomado y `cuantometoca.net` libre; el `.pe` parece libre (se confirma al comprarlo en punto.pe).
- **Cómo:** reemplazo en todos los archivos con `sed`. Correo de contacto provisional: `contacto@cuantometoca.pe` (hay que crearlo al comprar el dominio).

## 7. Próximos pasos
1. [ ] **Probar la calculadora** abriendo `gratificacion.html` en el navegador (doble clic).
2. [ ] **Comprar `cuantometoca.pe`** (punto.pe o un registrador autorizado) y reemplazar `https://festrebillo.github.io/cuantometoca` por el dominio. En VS Code: Ctrl+Shift+H.
3. [ ] **Crear el correo `contacto@cuantometoca.pe`** (por ejemplo con reenvío gratis de Cloudflare Email Routing).
4. [ ] **Publicar:** subir el repositorio a GitHub y conectarlo a Vercel o GitHub Pages.
5. [ ] **Dar de alta el sitio en Google Search Console** y enviar el `sitemap.xml`.
6. [ ] **Agregar calculadoras:** CTS (antes del 15 de noviembre), sueldo neto y liquidación.
7. [ ] **Postular a AdSense** cuando haya al menos 4–5 herramientas con contenido. Al ser aprobado, pegar su script en el `<head>` y crear el archivo `ads.txt`.
8. [ ] **Vigilar la RMV:** si sale el decreto del aumento a S/ 1,300, actualizar `js/config.js` y registrarlo en esta bitácora.
