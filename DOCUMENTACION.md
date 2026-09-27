# CuántoMeToca.pe — Documentación del proyecto

## 1. Objetivo
Crear una **web de calculadoras laborales gratuitas para Perú** que genere ingresos pasivos con **Google AdSense** (y más adelante con productos propios, como plantillas de Excel), sin necesidad de salir en cámara ni de atender clientes.

**Cómo gana dinero:** la gente busca en Google, por ejemplo "calcular gratificación 2026", entra al sitio, usa la calculadora y ve anuncios. Mientras más herramientas y visitas, más ingresos.

**Expectativa realista:** pocos soles los primeros 3–6 meses y crecimiento entre los 6 y los 12 meses. No hay ingresos garantizados, pero el riesgo económico es mínimo (solo el dominio).

## 2. Alcance
**Versión 1.0 (actual):**
- Página de inicio con el catálogo de herramientas
- 6 calculadoras: **gratificación, CTS, sueldo neto, liquidación, vacaciones truncas y horas extras**, cada una con guía, ejemplo y preguntas frecuentes
- Pruebas automáticas de fórmulas y páginas (`tests/`)
- Páginas que exige AdSense: Acerca de, Contacto, Política de privacidad y Términos
- SEO básico: títulos, descripciones, `sitemap.xml`, `robots.txt` y datos estructurados de preguntas frecuentes (FAQ)

**Ideas de siguientes herramientas:** préstamos e intereses, tipo de cambio, recibo por honorarios (4.ª categoría), subsidio por maternidad o descanso médico.

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
| Skills de diseño de Claude (Taste Skill `redesign-existing-projects`, Emil Kowalski `emil-design-eng`) | Auditoría y rediseño visual v1.1 | Gratis (código abierto) |
| Google Fonts: Geist y Geist Mono | Tipografía del sitio y de los montos | Gratis |
| Microsoft Edge *headless* | Pruebas y capturas de pantalla (también genera `og-image.png`) | Gratis, ya instalado |

## 4. Estructura
```
CuantoMeToca/   (carpeta aún llamada CalculaPE; renombrar con VS Code cerrado)
├── index.html                 Inicio: catálogo de herramientas
├── gratificacion.html         Calculadora de gratificación + guía + FAQ
├── acerca.html                Acerca de (requisito de AdSense)
├── contacto.html              Contacto (requisito de AdSense)
├── politica-privacidad.html   Privacidad y cookies de Google (requisito de AdSense)
├── terminos.html              Términos de uso
├── 404.html                   Página "no encontrada" (GitHub Pages la usa sola). ⚠️ Tiene <base href="/cuantometoca/">: cambiar a "/" al pasar al dominio propio
├── favicon.svg                Ícono de la pestaña ("S/" sobre rojo)
├── og-image.png               Imagen que aparece al compartir un enlace en WhatsApp/Facebook (1200×630)
├── recursos/og-image.html     Fuente de og-image.png; se regenera con Edge (ver bitácora v1.1)
├── css/styles.css             Estilos compartidos (modo claro y oscuro, móvil primero)
├── js/config.js               ⚠️ Valores legales (RMV, tasas) — único archivo que se toca cuando cambia la ley
├── cts.html, sueldo-neto.html, liquidacion.html, vacaciones-truncas.html, horas-extras.html
├── js/laboral.js              Funciones compartidas: fechas (meses y días), CTS/grati/vacaciones truncas, indemnización, quinta categoría
├── js/gratificacion.js        Lógica de cada calculadora (un archivo por página)
├── js/cts.js, sueldo-neto.js, liquidacion.js, vacaciones.js, horas-extras.js
├── tests/pruebas.html         21 pruebas de las fórmulas con casos resueltos a mano
├── tests/paginas.html         Prueba de punta a punta: llena cada formulario y revisa el total
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
| Resultado con aspecto de boleta de pago (v1.1) | El usuario viene a comprobar su dinero: montos en fuente monoespaciada, filas punteadas y total con doble línea se leen como un documento confiable. |
| Un solo color de acento y grises cálidos (v1.1) | Menos ruido visual; el rojo queda para acciones y totales. En modo oscuro el botón usa texto oscuro para mantener el contraste. |
| Animación mínima (v1.1) | Solo al presionar botones, al aparecer el resultado (280 ms) y en el menú de preguntas. Se respeta "reducir movimiento" del sistema. |
| Desplazamiento al resultado centralizado en `config.js` (v1.1) | Antes, en celular, los avisos de error aparecían debajo del formulario sin que el usuario los viera. |
| Explicaciones y FAQ en cada calculadora | AdSense rechaza sitios con poco contenido; el texto útil también posiciona en Google. |

### Base legal de la calculadora de gratificación
- **Ley 27735:** gratificación = (remuneración computable ÷ 6) × meses calendario completos del semestre.
- **Remuneración computable** = sueldo básico + asignación familiar + promedio de ingresos variables regulares (recibidos al menos 3 de 6 meses).
- **Asignación familiar** = 10% de la RMV (Ley 25129). RMV = **S/ 1,130** (D.S. 006-2024-TR, vigente desde 01/01/2025).
- **Bonificación extraordinaria** = 9% (EsSalud) o 6.75% (EPS) de la gratificación (Leyes 29351 y 30334).
- **REMYPE:** pequeña empresa = 50%; microempresa = no corresponde.
- La gratificación no tiene descuentos de AFP, ONP ni EsSalud; sí puede estar afecta al impuesto de quinta categoría.

### Base legal del resto de calculadoras
- **CTS (D.S. 001-97-TR):** (RC ÷ 12) × meses + (RC ÷ 360) × días; RC incluye 1/6 de la gratificación del periodo. Pequeña empresa 50%, microempresa no corresponde.
- **Sueldo neto:** ONP 13%; AFP 10% de aporte + 1.37% de prima de seguro (Ley 32123, con tope de S/ 12,672.65, remuneración máxima asegurable de jul-sep 2026) + comisión por flujo (Habitat 1.47%, Integra 1.55%, Prima 1.60%, Profuturo 1.69%) o 0% si es mixta.
- **Quinta categoría:** ingreso anual proyectado (12 sueldos + 2 gratificaciones + bonificación) − 7 UIT; tramos de 8 / 14 / 17 / 20 / 30%. UIT 2026 = **S/ 5,500** (D.S. 301-2025-EF). Se muestra el promedio mensual.
- **Vacaciones (D. Leg. 713):** truncas = (RC ÷ 12) × meses + (RC ÷ 360) × días desde el último aniversario; mínimo 1 mes de servicios. REMYPE: 15 días (50%).
- **Indemnización por despido arbitrario:** general 1.5 RC por año (tope 12 RC); pequeña empresa 20 días por año (tope 120 días); microempresa 10 días por año (tope 90 días).
- **Horas extras (D.S. 007-2002-TR):** valor hora = (sueldo + asignación) ÷ 30 ÷ jornada; +25% las 2 primeras, +35% las siguientes; feriado o descanso +100%.
- **Simplificaciones declaradas en la web:** la CTS trunca asume que se recibió la última gratificación completa; no se incluye la indemnización vacacional ni la deducción adicional de 3 UIT.

## 6. Bitácora
### 2026-09-27 — v0.1: creación del proyecto
- **Qué:** estructura del sitio, calculadora de gratificación, páginas legales, SEO básico y repositorio git.
- **Por qué:** se eligió este método entre varias opciones (YouTube, TikTok, plantillas de Canva, servicios, micro-SaaS) porque es la única que cumple a la vez: sin cámara, ingreso pasivo, inversión mínima y aprovecha la programación con Claude.
- **Cómo:** HTML, CSS y JS puro. Antes de programar se verificó en la web que la RMV vigente sigue siendo S/ 1,130 (hay un aumento a S/ 1,300 anunciado en sep-2026, todavía sin decreto).

### 2026-09-27 — v0.2: cambio de nombre a CuántoMeToca.pe
- **Qué:** se cambió la marca de "CalculaPE" a **CuántoMeToca.pe** y las direcciones provisionales `TU-DOMINIO.com` por `https://festrebillo.github.io/cuantometoca`.
- **Por qué:** `calcula.pe` ya está registrado y tiene una web activa; usarlo generaría confusión y no se podría comprar ese dominio. "Cuánto me toca" es exactamente cómo busca la gente ("¿cuánto me toca de gratificación?"), lo que ayuda en Google. Se revisó que `cuantometoca.com` está tomado y `cuantometoca.net` libre; el `.pe` parece libre (se confirma al comprarlo en punto.pe).
- **Cómo:** reemplazo en todos los archivos con `sed`. Correo de contacto provisional: `contacto@cuantometoca.pe` (hay que crearlo al comprar el dominio).

### 2026-09-27 — v0.2 publicada en internet
- **Qué:** se creó el repositorio público https://github.com/festrebillo/cuantometoca y se activó **GitHub Pages** (rama `main`, carpeta raíz). Sitio en vivo: https://festrebillo.github.io/cuantometoca/
- **Por qué:** hosting gratis permanente. Publicar pronto permite que Google empiece a indexar el sitio, que es lo que más tarda. AdSense no aprueba subdominios `github.io`, así que se postulará al comprar `cuantometoca.pe`; GitHub Pages redirige automáticamente la dirección vieja al dominio nuevo.
- **Cómo:** `gh repo create --public --source=. --push` y `gh api POST repos/.../pages`.
- **Cómo publicar cambios desde ahora:** `git add -A`, `git commit -m "mensaje"` y `git push`. La web se actualiza sola en aproximadamente 1 minuto.

### 2026-09-27 — v1.0: las 6 calculadoras completas
- **Qué:** nuevas calculadoras de CTS, sueldo neto, liquidación, vacaciones truncas y horas extras, cada una con guía, ejemplo, preguntas frecuentes (datos estructurados FAQ) y enlaces a las demás. La página de inicio enlaza todas y el sitemap se actualizó.
- **Por qué:** Fer pidió terminar todas las calculadoras. Con 6 herramientas y contenido original el sitio ya cumple lo que AdSense suele exigir. Los enlaces internos ayudan al SEO y hacen que cada visitante vea más páginas (más anuncios).
- **Cómo:**
  - Los cálculos comunes están en `js/laboral.js`, para no repetir código; los valores legales nuevos (UIT, AFP, ONP, sobretasas, topes) están en `js/config.js`.
  - Antes de programar se verificaron en la web la UIT 2026 y las tasas de AFP de 2026.
  - Las páginas se generaron con un script de Python para que todas tengan el mismo diseño.
  - **Pruebas:** 21 pruebas de fórmulas y 6 de punta a punta, todas pasando, ejecutadas con Microsoft Edge en modo *headless* (no hay Node instalado).
  - Comando: `msedge --headless=new --allow-file-access-from-files --virtual-time-budget=15000 --dump-dom "file:///D:/Proyectos%20Claude/CalculaPE/tests/paginas.html"`

### 2026-09-27 — v1.1: rediseño visual con las skills de diseño
- **Qué:** nuevo diseño en todo el sitio sin tocar ninguna fórmula:
  - **Tipografía:** Geist para textos y Geist Mono para montos; títulos más grandes y compactos.
  - **Colores:** paleta cálida con un solo acento; el rojo se suavizó un poco.
  - **Resultado:** ahora se lee como una boleta de pago.
  - **Formularios:** campos de 48 px (fáciles de tocar en celular), flecha propia en las listas y anillo de foco visible.
  - **Portada:** nuevo encabezado, valores legales en vivo (sueldo mínimo, asignación familiar y UIT, leídos de `config.js`) y tarjeta destacada de gratificación con un ejemplo de resultado. Se quitó la etiqueta "Disponible", que se repetía en todas las tarjetas.
  - **Menú:** marca la página actual.
  - **Accesibilidad:** enlace "Saltar al contenido".
  - **Archivos nuevos:** favicon, página 404, e imagen y etiquetas para compartir (Open Graph).
  - **Corrección:** el espacio superior de la página no se aplicaba (`.wrap` anulaba el `padding` de `main`).
- **Por qué:** el diseño anterior funcionaba pero se veía genérico. En temas de dinero la apariencia influye en la confianza, y un sitio pulido se comparte más y retiene mejor (importante para AdSense).
- **Cómo:**
  - Se siguió la auditoría de la skill `redesign-existing-projects` (Taste Skill) y los criterios de animación de `emil-design-eng` (Emil Kowalski).
  - Las cabeceras de las 11 páginas se actualizaron con un script de Python.
  - Las calculadoras ya no llaman a `scrollIntoView`; ahora `config.js` observa `#resultado`, lo anima y lo muestra.
  - Las capturas de móvil se hicieron dentro de un iframe de 390 px, porque Edge *headless* no permite ventanas de menos de 492 px.
  - **Pruebas:** 21/21 fórmulas y 6/6 de punta a punta pasan después del cambio.
  - **Regenerar `og-image.png`:** `msedge --headless=new --window-size=1200,630 --virtual-time-budget=8000 --screenshot="og-image.png" "file:///D:/Proyectos%20Claude/CalculaPE/recursos/og-image.html"`
  - ⚠️ El ejemplo de la portada (S/ 2,848.17) y la imagen para compartir usan la RMV actual: si cambia la RMV, actualizarlos a mano.

## 7. Próximos pasos
1. [ ] **Probar la calculadora** abriendo `gratificacion.html` en el navegador (doble clic).
2. [ ] **Comprar `cuantometoca.pe`** (punto.pe o un registrador autorizado) y reemplazar `https://festrebillo.github.io/cuantometoca` por el dominio (incluye `og:url`/`og:image`, y en `404.html` cambiar `<base href="/cuantometoca/">` por `<base href="/">`). En VS Code: Ctrl+Shift+H.
3. [ ] **Crear el correo `contacto@cuantometoca.pe`** (por ejemplo con reenvío gratis de Cloudflare Email Routing).
4. [x] **Publicar:** en GitHub Pages ✅ (2026-09-27).
5. [ ] **Dar de alta el sitio en Google Search Console** y enviar el `sitemap.xml`.
6. [x] **Agregar calculadoras:** CTS, sueldo neto, liquidación, vacaciones y horas extras ✅ (2026-09-27).
7. [ ] **Postular a AdSense** cuando haya al menos 4–5 herramientas con contenido. Al ser aprobado, pegar su script en el `<head>` y crear el archivo `ads.txt`.
8. [ ] **Revisar valores cada trimestre:** (si cambia la RMV, actualizar también el ejemplo de la portada y `og-image.png`) remuneración máxima asegurable de la AFP (SBS), comisiones de AFP y UIT cada enero. **Vigilar la RMV:** si sale el decreto del aumento a S/ 1,300, actualizar `js/config.js` y registrarlo en esta bitácora.
