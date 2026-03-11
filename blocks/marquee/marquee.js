export default function decorate(block) {
  const rawText = block.textContent.trim();

  // Split on ** separator and filter out empty strings
  const items = rawText
    .split('**')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  // Clear the block
  block.textContent = '';

  // Build the scrolling track — duplicate items for seamless infinite loop
  const track = document.createElement('div');
  track.classList.add('marquee-track');

  // We render two identical sets so the second copy fills in as the first scrolls away
  for (let copy = 0; copy < 2; copy += 1) {
    items.forEach((text, index) => {
      const span = document.createElement('span');
      span.classList.add('marquee-item');
      span.textContent = text;
      track.appendChild(span);

      // Add a styled ** separator after each item
      if (index < items.length - 1 || copy === 0) {
        const sep = document.createElement('span');
        sep.classList.add('marquee-separator');
        sep.textContent = '**';
        track.appendChild(sep);
      }
    });
  }

  block.appendChild(track);
}
