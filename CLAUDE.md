# Soulmarket — soulmarket.com

Web profesional de agencia de tres personas: José Miguel Díaz (desarrollo/técnica), Marcela Talero (marketing/comunicación) y Sergio Guild (audiovisual). Servicios: diseño/desarrollo web (estrella), diseño gráfico, video/fotografía y marketing digital. Portfolio + blog SEO + servicios con precios. Objetivo: captar clientes cuanto antes — priorizar velocidad, no over-engineer.

## Stack

- **Astro 7** (SSG) + **Tailwind CSS 4** (config vía `@theme` en `src/styles/global.css`, sin tailwind.config)
- Contenido de blog y portfolio: **Strapi CMS** (headless), no Content Collections/MDX — ver sección "Contenido (blog + portfolio)" más abajo
- i18n: ES por defecto en raíz (`/`), inglés en `/en/`. Strings en `src/i18n/ui.ts`, helpers y rutas en `src/i18n/utils.ts`
- Deploy: GitHub Actions → VPS OVH vía SSH/rsync
- Gestor de paquetes: **pnpm**

## Comandos

- Dev server: `astro dev --background` (gestionar con `astro dev stop|status|logs`) — ver AGENTS.md
- Build: `pnpm build` · Preview: `pnpm preview`

## Contenido (blog + portfolio)

- **Decisión (2026-07-15):** se pasó de Content Collections/MDX a **Strapi CMS** porque quien publica en el blog es la persona de marketing (no técnica) — necesita un panel de edición, no escribir Markdown y hacer commit/push.
- Backend: instancia de Strapi 5 en el VPS OVH, compartida con el blog de otro proyecto (nutroteca) pero con content-types propios de soulmarket. Detalle completo de la infraestructura en `ovhCloud/CLAUDE.md` (sección "Strapi compartido").
- API pública: `https://blog.soulmarket.es/api/soulmarket-articles` y `.../soulmarket-projects`. Panel admin: `https://blog.soulmarket.es/admin`.
- Content-types:
  - `soulmarket-article` (blog): title, slug, excerpt, content, coverImage, author, category, seoTitle, seoDescription
  - `soulmarket-project` (portfolio): title, slug, client, category, summary, description, coverImage, gallery, externalUrl, featured, order
  - Categorías (enum): `diseno-web`, `diseno-grafico`, `video-fotografia`, `marketing-digital` (+ `general` solo en articles)
  - Sin i18n todavía (solo ES) — pendiente si se necesita el blog también en `/en/`
- Auth: token de solo lectura (`soulmarket-build`) para consumir la API en build time (GitHub Actions corre en runner de GitHub, no en el VPS, así que la API tiene que ser accesible por HTTPS — no vale con `127.0.0.1`). Guardado como secret del repo `STRAPI_API_TOKEN` (`gh secret set`) y en `.env` local (gitignored) para `pnpm dev`/`pnpm build` en local.
- Contenido de prueba ya cargado (12 proyectos + 1 artículo, en español, migrado desde el MDX antiguo) para poder probar la integración antes de escribir contenido real.
- **Integración Astro↔Strapi conectada (2026-07-15):**
  - `src/lib/strapi.ts` — cliente de lectura (`getBlogPosts`, `getBlogPostBySlug`, `getPortfolioItems`, `getPortfolioItemBySlug`). Adapta la respuesta de Strapi a una forma compatible con el antiguo `CollectionEntry` (`{ id, data, content }`) para no tener que tocar los componentes de UI. Mapea las categorías de Strapi (`diseno-web`, etc.) a los ids que ya usaba la UI (`web`, `design`, `photo-video`, `marketing`).
  - `src/pages/blog/`, `src/pages/portfolio/` (+ espejos `en/`) y `src/pages/index.astro` (+ `en/`) usan `getBlogPosts`/`getPortfolioItems` en vez de `getCollection`.
  - El campo `content`/`description` de Strapi es markdown en texto plano (no MDX compilado) — se renderiza a HTML en build time con `marked` (`<Fragment set:html={marked.parse(...)} />` en los `[slug].astro`).
  - Fallback de imagen: los proyectos de portfolio sin `coverImage` en Strapi usan `/portfolio/mock-01.svg` (los content-types no tienen campo `tags`, así que las chips de tags quedan vacías por ahora).
  - `STRAPI_URL` y `STRAPI_API_TOKEN` inyectados en el workflow (`deploy.yml`, step "Build site") desde secrets del repo.
  - `src/content/blog/`, `src/content/portfolio/` (MDX) y `src/content.config.ts` siguen en el repo sin usarse (nadie las importa) — se pueden borrar cuando se confirme que no hace falta consultarlas como referencia.
- **Pendiente:** el contenido de Strapi no tiene i18n — las páginas `/en/blog` y `/en/portfolio` muestran el mismo contenido en español hasta que se añadan traducciones (ver comentarios `// El contenido de Strapi todavía no tiene i18n` en esas páginas).

## Estructura

- `src/components/sections/` — secciones de página (Hero, Story, Services, …); reciben `lang` como prop
- `src/components/ui/` — piezas reutilizables (AnimatedButton, TypeWriter)
- `src/pages/` — ES en raíz, EN espejado en `src/pages/en/`
- `src/pages/styleguide.astro` — página interna de referencia visual

## Convenciones de diseño

- Tokens en `src/styles/global.css` bajo `@theme`: paleta Resonance (`--color-primary-1..4`, gradiente `--gradient-primary`) conviviendo con tokens de marca originales (`accent`, `ink`, `paper`, …)
- Animaciones de entrada: clases `reveal` + `fadeInUp`/`fadeInRight` con `--reveal-delay`
- Toda cadena visible pasa por `t('clave')` de `useTranslations(lang)` — nunca texto hardcodeado, y siempre añadir la clave en ES y EN en `ui.ts`
- Enlaces internos vía `routes[lang]`, nunca rutas a mano
- Contraste AA: el coral vivo (`--color-accent`) solo para gráficos y tipografía grande; el texto pequeño acentuado usa `--color-accent-dark` (la utilidad `.text-accent` ya está oscurecida en global.css) y los botones coral llevan texto en tinta, nunca blanco

## SEO

- Todo cambio de SEO técnico (meta, hreflang, schema, robots, rendimiento) se documenta en `SEO.md` con fecha — es el registro vivo del proyecto
- Verificación móvil: `node scripts/mobile-check.mjs` con el dev server activo

## Skills del proyecto (`.claude/skills/`)

- `frontend-design` / `ui-ux-pro-max` — para construir o elevar UI
- `web-design-guidelines` — auditoría de accesibilidad y UX
- `seo-optimizer` — meta tags, schema, Core Web Vitals, keywords
