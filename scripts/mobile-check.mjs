// Herramienta de auditoría móvil: mide overflow horizontal por página y
// captura pantallas a 390x844. Uso: node scripts/mobile-check.mjs (dev server activo).
// el hero y el portfolio destacado a 390x844.
import puppeteer from 'puppeteer-core';

const BASE = 'http://localhost:4321';
const OUT = '/tmp/claude-1000/-home-nutroteca-Proyectos-Soulmarket/fccc4a0f-8455-4245-919a-41b74d1a3a6b/scratchpad';
const pages = ['/', '/servicios', '/portfolio', '/contacto', '/sobre-mi', '/blog', '/en/', '/privacidad'];

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

for (const path of pages) {
  await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 30000 });
  const r = await page.evaluate(() => ({
    scrollW: document.scrollingElement.scrollWidth,
    innerW: window.innerWidth,
  }));
  const flag = r.scrollW > r.innerW ? `  ⚠ OVERFLOW +${r.scrollW - r.innerW}px` : '  ✓';
  console.log(`${path.padEnd(14)} scrollW=${r.scrollW} innerW=${r.innerW}${flag}`);
}

// Capturas de la home: hero y portfolio destacado
await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: `${OUT}/pp-hero.png` });

await page.evaluate(() => document.getElementById('portfolio-home')?.scrollIntoView());
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: `${OUT}/pp-portfolio.png` });

await browser.close();
console.log('OK capturas en scratchpad');
