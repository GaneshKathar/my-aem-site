/**
 * Parses a numeric value from a stat string.
 * Handles formats like "1300", "900+", "300K", "9+".
 * @param {string} text - The stat text to parse
 * @returns {{ value: number, suffix: string }} The numeric value and any suffix
 */
function parseStatNumber(text) {
  const cleaned = text.trim();
  const match = cleaned.match(/^([\d,.]+)\s*([KkMm+]*[+]?)$/);
  if (!match) return { value: 0, suffix: '' };

  const numStr = match[1].replace(/,/g, '');
  const value = parseFloat(numStr);
  const suffix = match[2] || '';
  return { value, suffix };
}

/**
 * Animates a number from 0 to the target value.
 * @param {Element} el - The element to animate
 * @param {number} target - The target number
 * @param {string} suffix - Any suffix to append (e.g. "+", "K")
 * @param {number} duration - Animation duration in ms
 */
function animateCount(el, target, suffix, duration = 2000) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for a smooth deceleration
    const eased = 1 - (1 - progress) ** 3;
    const current = eased * target;

    if (isFloat) {
      el.textContent = `${current.toFixed(1)}${suffix}`;
    } else {
      el.textContent = `${Math.floor(current)}${suffix}`;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${isFloat ? target.toFixed(1) : target}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Loads and decorates the stats block.
 * Expects authored content as a table where each row has: icon | number | label
 * @param {Element} block The stats block element
 */
export default function decorate(block) {
  const items = [...block.children];

  items.forEach((row) => {
    const columns = [...row.children];
    row.classList.add('stats-item');

    // Column 0: icon
    if (columns[0]) {
      columns[0].classList.add('stats-icon');
    }

    // Column 1: number
    if (columns[1]) {
      columns[1].classList.add('stats-number');
      const rawText = columns[1].textContent.trim();
      const { value, suffix } = parseStatNumber(rawText);
      columns[1].dataset.target = value;
      columns[1].dataset.suffix = suffix;
      // Set initial display to 0 so animation starts from zero
      columns[1].textContent = `0${suffix}`;
    }

    // Column 2: label
    if (columns[2]) {
      columns[2].classList.add('stats-label');
    }
  });

  // IntersectionObserver to trigger count-up when the block scrolls into view
  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        block.querySelectorAll('.stats-number').forEach((el) => {
          const target = parseFloat(el.dataset.target) || 0;
          const suffix = el.dataset.suffix || '';
          animateCount(el, target, suffix);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(block);
}
