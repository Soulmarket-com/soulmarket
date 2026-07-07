# Soulmarket — soulmarket.com

Web profesional de agencia de tres personas: José Miguel Díaz (desarrollo/técnica), Marcela Talero (marketing/comunicación) y Sergio Guild (audiovisual). Servicios: diseño/desarrollo web (estrella), diseño gráfico, video/fotografía y marketing digital. Portfolio + blog SEO + servicios con precios. Objetivo: captar clientes cuanto antes — priorizar velocidad, no over-engineer.

## Stack

- **Astro 7** (SSG) + **Tailwind CSS 4** (config vía `@theme` en `src/styles/global.css`, sin tailwind.config)
- Contenido: Content Collections + MDX (`portfolio`, `blog`) — sin CMS externo
- i18n: ES por defecto en raíz (`/`), inglés en `/en/`. Strings en `src/i18n/ui.ts`, helpers y rutas en `src/i18n/utils.ts`
- Deploy: GitHub Actions → VPS OVH vía SSH/rsync
- Gestor de paquetes: **pnpm**

## Comandos

- Dev server: `astro dev --background` (gestionar con `astro dev stop|status|logs`) — ver AGENTS.md
- Build: `pnpm build` · Preview: `pnpm preview`

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
