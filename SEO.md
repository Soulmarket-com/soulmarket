# SEO técnico — soulmarket.com

Registro vivo de las acciones de SEO técnico del proyecto. Cada entrada lleva
fecha; al hacer cambios de SEO, documentarlos aquí.

---

## Estado por área

### Indexación y rastreo

| Acción | Estado | Dónde |
|---|---|---|
| `robots.txt` con sitemap declarado y `/styleguide` excluido | ✅ 2026-07-07 | `public/robots.txt` |
| Sitemap XML automático con alternates de idioma (es-ES / en-US) | ✅ | `@astrojs/sitemap` en `astro.config.mjs` (filtra `/styleguide`) |
| `noindex` en 404 y styleguide | ✅ | prop `noindex` de `Base.astro` |
| `noindex, nofollow` automático en la **preview de GitHub Pages** (evita contenido duplicado frente a producción) | ✅ 2026-07-07 | `Base.astro` — se activa cuando el build lleva `ASTRO_BASE` |
| Canonical siempre apuntando a producción (`https://soulmarket.com`), retirando la base de la preview | ✅ 2026-07-07 | `Base.astro` |
| Alta en Google Search Console + envío de sitemap | ⬜ pendiente (necesita el dominio en producción) | — |

### Internacionalización (ES/EN)

| Acción | Estado | Dónde |
|---|---|---|
| **Fix hreflang**: antes anunciaba rutas EN inexistentes (`/en/servicios` en vez de `/en/services`). Ahora usa el mapa real de rutas | ✅ 2026-07-07 | `translatePath()` en `src/i18n/utils.ts` + `Base.astro` |
| Alternates omitidos donde no hay traducción equivalente (detalles de blog/portfolio: slugs distintos por idioma) — mejor omitir que mentir | ✅ 2026-07-07 | `Base.astro` |
| `x-default` → versión ES (idioma principal del mercado) | ✅ | `Base.astro` |
| Selector de idioma lleva a la **página equivalente**, no a la home | ✅ 2026-07-07 | `Header.astro` |
| `lang` correcto en `<html>` y `og:locale` por idioma | ✅ | `Base.astro` |

### Datos estructurados (Schema.org)

| Acción | Estado | Dónde |
|---|---|---|
| `ProfessionalService` global (nombre, email, fundador, equipo, servicios, idiomas) | ✅ | `Base.astro` |
| `BlogPosting` en artículos (headline, fechas publicación/actualización, idioma, imagen, keywords, autor/publisher organización) | ✅ 2026-07-07 | `layouts/BlogPost.astro` |
| `BreadcrumbList` en detalle de portfolio/blog | ⬜ valorar | — |
| `LocalBusiness` con dirección | ⬜ pendiente de datos fiscales/dirección | — |

### Meta y social

| Acción | Estado | Dónde |
|---|---|---|
| Title único por página (`… | Soulmarket`), description por página | ✅ | prop de cada página → `Base.astro` |
| Open Graph + Twitter Card completos (title, description, image, url, site_name, locale, type article en posts) | ✅ | `Base.astro` |
| **Imagen OG por defecto** 1200×630 con la identidad (70 KB) | ✅ 2026-07-07 | `public/og-default.png` — fuente regenerable en `src/scripts/og-default-source.html` (Chrome headless: `google-chrome --headless=new --window-size=1200,630 --screenshot=og-default.png <html>`) |
| OG image específica por artículo/proyecto cuando tiene `image` en frontmatter | ✅ | `Base.astro` resuelve a URL absoluta de producción |

### Rendimiento / Core Web Vitals

| Acción | Estado | Dónde |
|---|---|---|
| SSG puro (Astro, 0 JS de framework; solo scripts pequeños de interacción) | ✅ | arquitectura |
| Imágenes con `width/height` (evita CLS) y `loading="lazy"` bajo el fold | ✅ | componentes |
| `preconnect` a Google Fonts + `display=swap` | ✅ | `Base.astro` |
| Animaciones respetan `prefers-reduced-motion` (incluido scroll suave) | ✅ 2026-07-07 | `global.css` |
| Sin overflow horizontal en móvil (verificado a 390px en las 8 rutas) | ✅ 2026-07-07 | `scripts/mobile-check.mjs` |
| **Self-hosting de fuentes** (eliminar dependencia de Google Fonts, mejora LCP y RGPD) | ⬜ pendiente (auditoría #9) | — |
| Auditoría Lighthouse completa | ⬜ pendiente (auditoría #9) | — |

### Contenido

| Acción | Estado |
|---|---|
| Artículo pilar de precios ("¿Cuánto cuesta una página web en España en 2026?") ES+EN | ✅ (pre-existente) |
| URLs limpias y descriptivas (`/servicios`, `/portfolio/<slug>`, sin parámetros) | ✅ |
| Jerarquía de encabezados única (un `h1` por página) | ✅ |
| Calendario editorial: 3-4 artículos más orientados a keywords transaccionales/locales | ⬜ pendiente (tarea #10) |
| Sustituir portfolio mock por casos reales con métricas (E-E-A-T) | ⬜ pendiente (tarea #4) |
| Textos alternativos descriptivos al meter imágenes reales | ⬜ recordatorio |

---

## Herramientas del proyecto

- **`scripts/mobile-check.mjs`** — `node scripts/mobile-check.mjs` (con dev server activo): mide overflow horizontal por página a 390×844 y captura pantallas móviles.
- **Regenerar OG**: editar `src/scripts/og-default-source.html` y capturar con Chrome headless (comando arriba).
- **Verificar hreflang tras el build**: `grep -o 'hreflang="[^"]*" href="[^"]*"' dist/servicios/index.html`.

## Notas

- La preview de GitHub Pages (`soulmarket-com.github.io/soulmarket/`) **no debe indexarse nunca**: lo garantiza el meta robots automático por `ASTRO_BASE`. No añadir la URL de la preview a ningún sitio público.
- El plan de keywords serio (volúmenes, competencia, mapa keyword→página) queda para cuando el dominio esté en producción y haya Search Console con datos reales.
