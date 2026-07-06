// Parallax de formas + píldora que sigue al cursor, compartido por las
// tarjetas de Servicios y Equipo. Solo con puntero fino y sin
// prefers-reduced-motion; en táctil no se registra nada.
export function initPointerParallax(selector = '.parallax-art') {
  const fine = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
  if (!fine.matches) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((art) => {
    if (art.dataset.parallaxInit) return;
    art.dataset.parallaxInit = 'true';

    art.addEventListener('pointermove', (e) => {
      const rect = art.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      art.style.setProperty('--px', (x / rect.width - 0.5).toFixed(3));
      art.style.setProperty('--py', (y / rect.height - 0.5).toFixed(3));
      art.style.setProperty('--mx', x.toFixed(1));
      art.style.setProperty('--my', y.toFixed(1));
    });

    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--px', '0');
      art.style.setProperty('--py', '0');
    });
  });
}
