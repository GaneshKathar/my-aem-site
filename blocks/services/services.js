export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'services-card';

    const columns = [...row.children];
    const iconCol = columns[0];
    const bodyCol = columns[1];

    // Icon area
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'services-card-icon';
    const picture = iconCol.querySelector('picture');
    if (picture) {
      iconWrapper.append(picture);
    }
    li.append(iconWrapper);

    // Body area: title, description, arrow button
    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'services-card-body';

    let linkHref = '#';

    // Find and extract the last link for the arrow button
    const allLinks = bodyCol.querySelectorAll('a');
    if (allLinks.length > 0) {
      const lastLink = allLinks[allLinks.length - 1];
      linkHref = lastLink.href;

      // If the link is the sole child of its parent paragraph, remove that paragraph
      const parentP = lastLink.closest('p');
      if (parentP && parentP.textContent.trim() === lastLink.textContent.trim()) {
        parentP.remove();
      } else {
        // Otherwise just remove the link element itself
        lastLink.remove();
      }
    }

    // Remaining children become title and description
    const remaining = [...bodyCol.children];
    remaining.forEach((child) => {
      const tagName = child.tagName.toLowerCase();
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        child.className = 'services-card-title';
      } else {
        child.className = 'services-card-description';
      }
      bodyWrapper.append(child);
    });

    li.append(bodyWrapper);

    // Arrow button
    const arrowButton = document.createElement('a');
    arrowButton.className = 'services-card-arrow';
    arrowButton.href = linkHref;
    arrowButton.setAttribute('aria-label', 'Learn more');
    arrowButton.innerHTML = '<span class="arrow-icon">\u2192</span>';
    li.append(arrowButton);

    ul.append(li);
  });

  block.replaceChildren(ul);
}
