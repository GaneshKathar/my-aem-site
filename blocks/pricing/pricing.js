/**
 * Splits a price string like "29 $/Monthly" into the numeric part and the unit part.
 * @param {string} text - The raw price text from authored content
 * @returns {{ value: string, unit: string }}
 */
function parsePrice(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/^([\d,.]+)\s*(.*)/);
  if (match) {
    return { value: match[1], unit: match[2] };
  }
  return { value: trimmed, unit: '' };
}

/**
 * Builds a single pricing card element from the authored row columns.
 * @param {Element[]} columns - The child divs of a table row
 * @param {number} index - The card index (0-based)
 * @param {number} total - Total number of cards
 * @returns {Element}
 */
function buildCard(columns, index, total) {
  const card = document.createElement('div');
  card.className = 'pricing-card';

  // Highlight the middle card
  if (total >= 3 && index === Math.floor(total / 2)) {
    card.classList.add('pricing-card-featured');
  }

  // --- Price (first column) ---
  const priceCol = columns[0];
  if (priceCol) {
    const priceWrapper = document.createElement('div');
    priceWrapper.className = 'pricing-price';

    const raw = priceCol.textContent;
    const { value, unit } = parsePrice(raw);

    const priceValue = document.createElement('span');
    priceValue.className = 'pricing-price-value';
    priceValue.textContent = value;

    const priceUnit = document.createElement('span');
    priceUnit.className = 'pricing-price-unit';
    priceUnit.textContent = unit ? ` ${unit}` : '';

    priceWrapper.append(priceValue, priceUnit);
    card.append(priceWrapper);
  }

  // --- Plan name badge (second column) ---
  const planCol = columns[1];
  if (planCol) {
    const badge = document.createElement('span');
    badge.className = 'pricing-badge';
    badge.textContent = planCol.textContent.trim();
    card.append(badge);
  }

  // --- Feature list (third column) ---
  const featuresCol = columns[2];
  if (featuresCol) {
    const featureList = document.createElement('ul');
    featureList.className = 'pricing-features';

    // If the author used a <ul> in the cell, pull items from it; otherwise split by <br> / <p>
    const authoredList = featuresCol.querySelector('ul');
    if (authoredList) {
      [...authoredList.children].forEach((li) => {
        const item = document.createElement('li');
        // Support a "disabled" marker: if the text starts with "~" or is wrapped in <del>
        const text = li.textContent.trim();
        if (li.querySelector('del') || text.startsWith('~')) {
          item.classList.add('disabled');
          item.textContent = text.replace(/^~\s*/, '');
        } else {
          item.textContent = text;
        }
        featureList.append(item);
      });
    } else {
      // Fallback: treat each <p> or text node separated by <br> as a feature
      const paragraphs = featuresCol.querySelectorAll('p');
      if (paragraphs.length) {
        paragraphs.forEach((p) => {
          const item = document.createElement('li');
          const text = p.textContent.trim();
          if (p.querySelector('del') || text.startsWith('~')) {
            item.classList.add('disabled');
            item.textContent = text.replace(/^~\s*/, '');
          } else {
            item.textContent = text;
          }
          featureList.append(item);
        });
      }
    }
    card.append(featureList);
  }

  // --- CTA button (fourth column) ---
  const ctaCol = columns[3];
  if (ctaCol) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'pricing-cta';

    const link = ctaCol.querySelector('a');
    if (link) {
      link.className = 'pricing-cta-button';
      ctaWrapper.append(link);
    } else {
      // No link authored — create a button-style element with the text
      const btn = document.createElement('a');
      btn.className = 'pricing-cta-button';
      btn.href = '#';
      btn.textContent = ctaCol.textContent.trim();
      ctaWrapper.append(btn);
    }
    card.append(ctaWrapper);
  }

  return card;
}

/**
 * Loads and decorates the pricing block.
 * @param {Element} block The pricing block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'pricing-grid';

  rows.forEach((row, index) => {
    const columns = [...row.children];
    const card = buildCard(columns, index, rows.length);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
