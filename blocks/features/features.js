/**
 * Loads and decorates the features block.
 *
 * Authored content is a table with one row per feature card.
 * Each row contains three cells: icon image | title | description.
 *
 * The decorate function transforms each row into a numbered feature card
 * with a counter circle (01, 02, 03, 04), an icon, a title, and a description.
 *
 * @param {Element} block The features block element
 */
export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    row.classList.add('features-card');

    // Create the numbered counter circle
    const counter = document.createElement('span');
    counter.classList.add('features-card-counter');
    counter.textContent = String(index + 1).padStart(2, '0');
    row.prepend(counter);

    // Assign classes to each cell: icon, title, description
    const cells = [...row.children].filter((child) => child.tagName === 'DIV');
    cells.forEach((cell, cellIndex) => {
      switch (cellIndex) {
        case 0:
          cell.classList.add('features-card-icon');
          break;
        case 1:
          cell.classList.add('features-card-title');
          break;
        case 2:
          cell.classList.add('features-card-description');
          break;
        default:
          break;
      }
    });
  });
}
