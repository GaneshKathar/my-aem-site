import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the team block
 * @param {Element} block The team block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'team-card';

    const columns = [...row.children];

    // Column 0: photo
    if (columns[0]) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'team-card-image';
      imageWrapper.append(...columns[0].childNodes);
      li.append(imageWrapper);
    }

    // Column 1: name
    if (columns[1]) {
      const name = document.createElement('p');
      name.className = 'team-card-name';
      name.textContent = columns[1].textContent.trim();
      li.append(name);
    }

    // Column 2: role
    if (columns[2]) {
      const role = document.createElement('p');
      role.className = 'team-card-role';
      role.textContent = columns[2].textContent.trim();
      li.append(role);
    }

    ul.append(li);
  });

  // Replace authored images with optimized versions
  ul.querySelectorAll('picture > img').forEach((img) => {
    const pic = img.closest('picture');
    pic.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
