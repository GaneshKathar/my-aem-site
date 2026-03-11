/**
 * Testimonials block - auto-rotating carousel of client quotes.
 *
 * Authored content table rows: quote text | client name | company
 */

const ROTATE_INTERVAL = 5000;

function buildDots(count, container) {
  const nav = document.createElement('div');
  nav.className = 'testimonials-dots';
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'testimonials-dot';
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      container.dispatchEvent(new CustomEvent('goto', { detail: i }));
    });
    nav.append(dot);
  }
  return nav;
}

function showSlide(slides, dots, index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

export default function decorate(block) {
  const slides = [];

  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const slide = document.createElement('div');
    slide.className = 'testimonials-slide';

    const quote = document.createElement('blockquote');
    quote.className = 'testimonials-quote';
    quote.textContent = cols[0]?.textContent.trim() || '';

    const name = document.createElement('p');
    name.className = 'testimonials-name';
    name.textContent = cols[1]?.textContent.trim() || '';

    const company = document.createElement('p');
    company.className = 'testimonials-company';
    company.textContent = cols[2]?.textContent.trim() || '';

    slide.append(quote, name, company);
    slides.push(slide);
  });

  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'testimonials-track';
  slides.forEach((s) => track.append(s));
  block.append(track);

  if (slides.length <= 1) {
    if (slides.length === 1) slides[0].classList.add('active');
    return;
  }

  const dots = buildDots(slides.length, block);
  block.append(dots);
  const dotButtons = [...dots.querySelectorAll('.testimonials-dot')];

  let current = 0;
  slides[0].classList.add('active');

  const goto = (index) => {
    current = index;
    showSlide(slides, dotButtons, current);
  };

  block.addEventListener('goto', (e) => goto(e.detail));

  let timer = setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(slides, dotButtons, current);
  }, ROTATE_INTERVAL);

  /* pause on hover / focus for accessibility */
  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('focusin', () => clearInterval(timer));
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(slides, dotButtons, current);
    }, ROTATE_INTERVAL);
  };
  block.addEventListener('mouseleave', restart);
  block.addEventListener('focusout', restart);
}
