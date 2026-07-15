// Cliente de lectura para el backend de Strapi (blog + portfolio).
// Ver ovhCloud/CLAUDE.md ("Strapi compartido") para la infraestructura.

const STRAPI_URL = (import.meta.env.STRAPI_URL ?? 'https://blog.soulmarket.es').replace(/\/+$/, '');
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

// Categorías de Strapi (enum del content-type) → ids usados por la UI
// existente (PortfolioIndex, ProjectDetail, FeaturedPortfolio, i18n/ui.ts).
const CATEGORY_MAP: Record<string, string> = {
  'diseno-web': 'web',
  'diseno-grafico': 'design',
  'video-fotografia': 'photo-video',
  'marketing-digital': 'marketing',
  general: 'web',
};

const FALLBACK_PORTFOLIO_IMAGE = '/portfolio/mock-01.svg';

interface StrapiMedia {
  url: string;
  alternativeText: string | null;
}

interface StrapiArticleRaw {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string | null;
  category: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string;
  coverImage: StrapiMedia | null;
}

interface StrapiProjectRaw {
  title: string;
  slug: string;
  client: string | null;
  category: string;
  summary: string;
  description: string;
  externalUrl: string | null;
  featured: boolean;
  order: number;
  publishedAt: string;
  coverImage: StrapiMedia | null;
  gallery: StrapiMedia[] | null;
}

// Formas compatibles con el antiguo `CollectionEntry<'blog' | 'portfolio'>`
// de astro:content, para no tocar los componentes que ya consumían eso.
export interface BlogEntry {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    image?: string;
    imageAlt: string;
    tags: string[];
    draft: boolean;
    lang: 'es' | 'en';
  };
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface PortfolioEntry {
  id: string;
  data: {
    title: string;
    description: string;
    category: string;
    client?: string;
    date: Date;
    image: string;
    imageAlt: string;
    gallery: string[];
    tags: string[];
    featured: boolean;
    url?: string;
    lang: 'es' | 'en';
  };
  content: string;
}

function absoluteMediaUrl(media: StrapiMedia | null): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
}

async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Strapi request failed (${res.status}): ${path}`);
  }
  const json = await res.json();
  return json.data as T;
}

function toBlogEntry(a: StrapiArticleRaw): BlogEntry {
  return {
    id: a.slug,
    data: {
      title: a.title,
      description: a.excerpt,
      pubDate: new Date(a.publishedAt),
      image: absoluteMediaUrl(a.coverImage),
      imageAlt: a.coverImage?.alternativeText ?? '',
      tags: [],
      draft: false,
      lang: 'es',
    },
    content: a.content,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
  };
}

function toPortfolioEntry(p: StrapiProjectRaw): PortfolioEntry {
  return {
    id: p.slug,
    data: {
      title: p.title,
      description: p.summary,
      category: CATEGORY_MAP[p.category] ?? p.category,
      client: p.client ?? undefined,
      date: new Date(p.publishedAt),
      image: absoluteMediaUrl(p.coverImage) ?? FALLBACK_PORTFOLIO_IMAGE,
      imageAlt: p.coverImage?.alternativeText ?? p.title,
      gallery: (p.gallery ?? []).map((m) => absoluteMediaUrl(m)).filter((u): u is string => !!u),
      tags: [],
      featured: p.featured,
      url: p.externalUrl ?? undefined,
      lang: 'es',
    },
    content: p.description,
  };
}

export async function getBlogPosts(): Promise<BlogEntry[]> {
  const data = await strapiFetch<StrapiArticleRaw[]>(
    '/soulmarket-articles?populate=coverImage&sort=publishedAt:desc&pagination[pageSize]=100'
  );
  return data.map(toBlogEntry);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogEntry | null> {
  const data = await strapiFetch<StrapiArticleRaw[]>(
    `/soulmarket-articles?populate=coverImage&filters[slug][$eq]=${encodeURIComponent(slug)}`
  );
  return data[0] ? toBlogEntry(data[0]) : null;
}

export async function getPortfolioItems(): Promise<PortfolioEntry[]> {
  const data = await strapiFetch<StrapiProjectRaw[]>(
    '/soulmarket-projects?populate=coverImage&populate=gallery&sort=order:asc&pagination[pageSize]=100'
  );
  return data.map(toPortfolioEntry);
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioEntry | null> {
  const data = await strapiFetch<StrapiProjectRaw[]>(
    `/soulmarket-projects?populate=coverImage&populate=gallery&filters[slug][$eq]=${encodeURIComponent(slug)}`
  );
  return data[0] ? toPortfolioEntry(data[0]) : null;
}
