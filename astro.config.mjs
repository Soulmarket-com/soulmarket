// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// En producción (VPS) la web vive en la raíz del dominio. Para la preview de
// GitHub Pages (usuario.github.io/repo/) el workflow pages.yml inyecta
// ASTRO_SITE y ASTRO_BASE; los enlaces internos usan withBase() (i18n/utils).
const site = process.env.ASTRO_SITE ?? 'https://soulmarket.com';
const base = process.env.ASTRO_BASE ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
        },
      },
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
