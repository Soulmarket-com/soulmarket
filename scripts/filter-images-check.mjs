// Verifica el bug de lazy-load + filtros del portfolio: pulsa cada filtro y
// comprueba que TODAS las imágenes visibles cargan (naturalWidth > 0).
// Uso: node scripts/filter-images-check.mjs (dev server activo en :4321)
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto('http://localhost:4321/portfolio', { waitUntil: 'networkidle0' });

const filters = await page.$$eval('.filter-btn', (btns) => btns.map((b) => b.dataset.filter));
let fallos = 0;

for (const f of filters) {
  await page.click(`.filter-btn[data-filter="${f}"]`);
  await new Promise((r) => setTimeout(r, 800));
  const result = await page.evaluate(async () => {
    const visibles = [...document.querySelectorAll('.portfolio-item:not(.is-hidden) img')];
    await Promise.allSettled(visibles.map((img) => img.decode?.()));
    return {
      total: visibles.length,
      sinCargar: visibles.filter((img) => !img.complete || img.naturalWidth === 0).length,
    };
  });
  const ok = result.sinCargar === 0;
  if (!ok) fallos++;
  console.log(`filtro ${String(f).padEnd(12)} visibles=${result.total} sin cargar=${result.sinCargar} ${ok ? '✓' : '✗'}`);
}

await browser.close();
process.exit(fallos ? 1 : 0);
