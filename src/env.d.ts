/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL?: string;
  readonly STRAPI_API_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
