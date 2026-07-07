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

export const routes = {
  es: {
    home: '/',
    services: '/servicios',
    portfolio: '/portfolio',
    blog: '/blog',
    about: '/sobre-mi',
    contact: '/contacto',
    privacy: '/privacidad',
  },
  en: {
    home: '/en/',
    services: '/en/services',
    portfolio: '/en/portfolio',
    blog: '/en/blog',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy',
  },
} as const;

export type Routes = typeof routes[Lang];
