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
  // 1. Find potential "row" elements with max tolerance:
  //    - First try: wrapper DIV + child DIVs (container + items)
  //    - Fallback: direct child DIVs (old one-row layout)
  let rows = [...block.querySelectorAll(':scope > div > div')];

  if (!rows.length) {
    rows = [...block.querySelectorAll(':scope > div')];
  }

  // If still nothing, give up and leave original HTML intact
  if (!rows.length) {
    return;
  }

  const container = document.createElement('div');
  container.classList.add('bubble-carousel');

  const bubbles = [];

  rows.forEach((row) => {
    const img = row.querySelector('img');
    if (!img) return;

    // Try to derive size from model field or second paragraph, fallback to medium
    let size = 'medium';
    const sizeEl = row.querySelector('[data-aue-prop="size"]')
      || row.querySelector('p:nth-of-type(2)')
      || row.querySelector('span:nth-of-type(2)');

    if (sizeEl && sizeEl.textContent) {
      const txt = sizeEl.textContent.trim().toLowerCase();
      if (txt) size = txt;
    }

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

  // If we didn't get any valid bubbles, bail and keep original HTML
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
