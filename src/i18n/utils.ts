import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first in ui) return first as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return (ui[lang] as Record<string, string>)[key]
      ?? (ui[defaultLang] as Record<string, string>)[key]
      ?? key;
  };
}

// Antepone la base de despliegue (p. ej. /soulmarket en la preview de GitHub
// Pages) a una ruta absoluta interna. Las URLs externas pasan sin tocar.
export function withBase(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${path}`;
}

export const routes = {
  es: {
    home: withBase('/'),
    services: withBase('/servicios'),
    portfolio: withBase('/portfolio'),
    blog: withBase('/blog'),
    about: withBase('/sobre-mi'),
    contact: withBase('/contacto'),
    privacy: withBase('/privacidad'),
  },
  en: {
    home: withBase('/en/'),
    services: withBase('/en/services'),
    portfolio: withBase('/en/portfolio'),
    blog: withBase('/en/blog'),
    about: withBase('/en/about'),
    contact: withBase('/en/contact'),
    privacy: withBase('/en/privacy'),
  },
} as const;

export type Routes = typeof routes[Lang];
