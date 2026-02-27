function initBubbleAnimation(container, bubbles) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.classList.add('bubble-carousel--reduced-motion');
    return;
  }

  const assignBubble = (bubble, index) => {
    const x = 10 + Math.random() * 80; // 10%–90%
    const delay = index * 2 + Math.random(); // slight stagger
    bubble.style.setProperty('--bubble-x', `${x}%`);
    bubble.style.animationDelay = `${delay}s`;
  };

  bubbles.forEach(assignBubble);

  bubbles.forEach((bubble, index) => {
    bubble.addEventListener('animationiteration', () => assignBubble(bubble, index));
  });
}

export default function decorate(block) {
  // NEW: support for container + items structure
  let rowContainer = block;
  if (
    block.children.length === 1 &&
    block.firstElementChild &&
    block.firstElementChild.tagName === 'DIV'
  ) {
    rowContainer = block.firstElementChild;
  }

  const rows = [...rowContainer.children];
  const container = document.createElement('div');
  container.classList.add('bubble-carousel');

  const bubbles = [];

  rows.forEach((row) => {
    // Try various ways to find the image and size
    const img = row.querySelector('img');
    if (!img) return;

    // Prefer an explicit "size" field, but fall back to any text in the row
    let sizeText = '';
    const sizeField =
      row.querySelector('[data-aue-prop="size"]') ||
      row.querySelector('p:nth-of-type(2)') ||
      row.querySelector('span:nth-of-type(2)');
    if (sizeField && sizeField.textContent) {
      sizeText = sizeField.textContent.trim().toLowerCase();
    }

    const size = sizeText || 'medium';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble', `bubble-${size}`);

    const bubbleImg = img.cloneNode(true);
    bubbleImg.loading = 'lazy';
    bubbleImg.decoding = 'async';

    // UE instrumentation for a media field
    bubbleImg.setAttribute('data-aue-type', 'media');
    bubbleImg.setAttribute('data-aue-prop', 'imageReference');
    bubbleImg.setAttribute('data-aue-label', 'Bubble Image');

    bubble.append(bubbleImg);
    container.append(bubble);
    bubbles.push(bubble);
  });

  // If no rows found, leave the original content alone instead of wiping it
  if (!bubbles.length) {
    return;
  }

  block.innerHTML = '';
  block.append(container);

  // UE component instrumentation for the whole carousel
  container.setAttribute('data-aue-type', 'component');
  container.setAttribute('data-aue-label', 'Bubble Carousel');
  container.setAttribute('data-aue-model', 'bubble-carousel');

  initBubbleAnimation(container, bubbles);
}
