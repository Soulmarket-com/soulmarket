import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Progressive enhancement: sin JS o con reduced-motion la página queda
// perfectamente usable con los reveals CSS básicos de global.css.
export function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('has-anim');

  splitTitleReveals();
  parallaxLayers();
  counters();
  drawMarks();
  imageReveals();
}

/* Titulares que se revelan palabra a palabra desde una máscara.
   Solo actúa sobre títulos de texto plano (sin hijos como TypeWriter). */
function splitTitleReveals() {
  const titles = document.querySelectorAll<HTMLElement>(
    '.section-title, .section-title-small, .section-title-medium, .section-title-large'
  );

  titles.forEach((el) => {
    if (el.children.length > 0) return; // contiene <br>, TypeWriter u otros nodos
    const text = el.textContent?.trim();
    if (!text) return;

    el.innerHTML = text
      .split(/\s+/)
      .map(
        (w) =>
          `<span class="split-w"><span class="split-i">${w}</span></span>`
      )
      .join(' ');

    // El título pasa a ser propiedad de GSAP: anular el reveal CSS si lo tiene
    el.classList.remove('reveal', 'fadeInUp', 'fadeIn');
    el.style.opacity = '1';

    gsap.to(el.querySelectorAll('.split-i'), {
      y: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

/* Capas con data-parallax="0.15" se desplazan suavemente al hacer scroll */
function parallaxLayers() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.15');
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });
}

/* Cifras con data-counter cuentan desde 0 conservando prefijo/sufijo (+30, 98%, <24h) */
function counters() {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const raw = el.textContent?.trim() ?? '';
    const match = raw.match(/^([^\d]*)(\d+)(.*)$/);
    if (!match) return;
    const [, prefix, num, suffix] = match;
    const target = parseInt(num, 10);
    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(state.value)}${suffix}`;
      },
    });
  });
}

/* El subrayado coral de .mark-decoration se dibuja al entrar en viewport */
function drawMarks() {
  document.querySelectorAll<HTMLElement>('.mark-decoration').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-drawn'),
    });
  });
}

/* Imágenes de tarjetas: entran con clip + zoom-out suave */
function imageReveals() {
  document
    .querySelectorAll<HTMLImageElement>('main img[loading="lazy"]')
    .forEach((img) => {
      gsap.fromTo(
        img,
        { clipPath: 'inset(0 0 100% 0)', scale: 1.25 },
        {
          clipPath: 'inset(0 0 0% 0)',
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: img, start: 'top 90%', once: true },
        }
      );
    });
}
