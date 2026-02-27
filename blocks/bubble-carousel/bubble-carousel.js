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

// Find or create a shared pool container within the closest section.
function getOrCreatePool(block) {
  const section = block.closest('.section, main, body') || document.body;
  let pool = section.querySelector('.bubble-carousel-pool');

  if (!pool) {
    pool = document.createElement('div');
    pool.classList.add('bubble-carousel', 'bubble-carousel-pool');
    section.append(pool);
  }

  return pool;
}

export default function decorate(block) {
  const img = block.querySelector('img');
  if (!img) return;

  let size = 'medium';
  const sizeEl = block.querySelector('[data-aue-prop="size"]');
  if (sizeEl && sizeEl.textContent) {
    const txt = sizeEl.textContent.trim().toLowerCase();
    if (txt === 'small' || txt === 'medium' || txt === 'large') {
      size = txt;
    }
  }

  const bubble = document.createElement('div');
  bubble.classList.add('bubble', `bubble-${size}`);

  const bubbleImg = img.cloneNode(true);
  bubbleImg.loading = 'lazy';
  bubbleImg.decoding = 'async';

  bubbleImg.setAttribute('data-aue-type', 'media');
  bubbleImg.setAttribute('data-aue-prop', 'imageReference');
  bubbleImg.setAttribute('data-aue-label', 'Bubble Image');

  bubble.append(bubbleImg);

  // Replace block content with a lightweight marker to keep UE happy.
  block.innerHTML = '';
  block.classList.add('bubble-carousel-origin');

  // Add the bubble into a shared pool for this section.
  const pool = getOrCreatePool(block);
  pool.append(bubble);

  // Instrument shared pool once per section.
  if (!pool.dataset.aueInitialized) {
    pool.setAttribute('data-aue-type', 'component');
    pool.setAttribute('data-aue-label', 'Bubble Carousel');
    pool.setAttribute('data-aue-model', 'bubble-carousel');
    pool.dataset.aueInitialized = 'true';
  }

  // Start / update animation.
  const bubbles = Array.from(pool.querySelectorAll('.bubble'));
  initBubbleAnimation(pool, bubbles);
}
