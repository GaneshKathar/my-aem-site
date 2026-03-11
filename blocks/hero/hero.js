export default function decorate(block) {
  // Wrap all non-picture children in a content div
  const content = document.createElement('div');
  [...block.children].forEach((child) => {
    if (child.querySelector('picture')) return;
    content.append(child);
  });
  block.append(content);
}
