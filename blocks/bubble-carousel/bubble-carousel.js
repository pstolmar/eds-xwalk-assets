function initBubbleAnimation(pool, bubbles) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pool.classList.add('bubble-carousel--reduced-motion');
    return;
  }

  const count = bubbles.length || 1;
  const step = 100 / (count + 1);

  bubbles.forEach((bubble, index) => {
    const x = step * (index + 1); // even spacing across width

    const duration = 14 + Math.random() * 6; // 14–20s
    const delay = index * 2 + Math.random() * 1.5; // staggered start

    bubble.style.left = `${x}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
  });
}

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

  // Try to read size from UE prop or from second paragraph text; default to medium.
  let size = 'medium';
  const sizePropEl = block.querySelector('[data-aue-prop="size"]');
  const sizeTextEl = sizePropEl || block.querySelector('p:nth-of-type(2)');

  if (sizeTextEl && sizeTextEl.textContent) {
    const txt = sizeTextEl.textContent.trim().toLowerCase();
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

  // Keep a small marker only on author hosts so blocks are still clickable in UE,
  // but never show it on Crosswalk (.aem.page/.aem.live).
  const isAuthorHost = typeof window !== 'undefined' && window.location && window.location.hostname.indexOf('author-') !== -1;

  block.innerHTML = '';
  block.classList.add('bubble-carousel-origin');

  if (isAuthorHost) {
    const marker = document.createElement('div');
    marker.classList.add('bubble-carousel-marker');
    marker.textContent = 'Bubble';
    block.append(marker);
  }

  const pool = getOrCreatePool(block);
  pool.append(bubble);

  const bubbles = Array.from(pool.querySelectorAll('.bubble'));
  initBubbleAnimation(pool, bubbles);
}
