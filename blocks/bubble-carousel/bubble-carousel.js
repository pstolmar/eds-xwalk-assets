function initBubbleAnimation(pool, bubbles) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pool.classList.add('bubble-carousel--reduced-motion');
    return;
  }

  bubbles.forEach((bubble, index) => {
    const slot = index % 5;
    const baseX = 10 + slot * 18; // 10, 28, 46, 64, 82
    const jitter = (Math.random() * 8) - 4; // -4..+4
    let x = baseX + jitter;
    if (x < 5) x = 5;
    if (x > 95) x = 95;

    const duration = 10 + Math.random() * 10; // 10–20s
    const delay = index * 1.5 + Math.random() * 1.5; // staggered

    bubble.style.setProperty('--bubble-x', `${x}%`);
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

  // Collapse original block to avoid big vertical gaps, but keep it in DOM
  block.innerHTML = '';
  block.classList.add('bubble-carousel-origin');

  const pool = getOrCreatePool(block);
  pool.append(bubble);

  const bubbles = Array.from(pool.querySelectorAll('.bubble'));
  initBubbleAnimation(pool, bubbles);
}
