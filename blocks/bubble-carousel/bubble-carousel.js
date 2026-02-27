function initBubbleAnimation(pool, bubbles) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pool.classList.add('bubble-carousel--reduced-motion');
    return;
  }

  const count = bubbles.length || 1;
  const step = 100 / (count + 1);

  bubbles.forEach((bubble, index) => {
    let x = step * (index + 1);
    const jitter = (Math.random() - 0.5) * step * 0.4; // ±20% of step
    x += jitter;
    if (x < 5) x = 5;
    if (x > 95) x = 95;

    const duration = 12 + Math.random() * 10; // 12–22s
    const delay = index * 2 + Math.random() * 2; // stagger more

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

  // Keep a small marker in the original block so it stays clickable in UE,
  // but don't let it take a ton of vertical space.
  block.innerHTML = '';
  block.classList.add('bubble-carousel-origin');

  const marker = document.createElement('div');
  marker.classList.add('bubble-carousel-marker');
  marker.textContent = 'Bubble';
  block.append(marker);

  const pool = getOrCreatePool(block);
  pool.append(bubble);

  const bubbles = Array.from(pool.querySelectorAll('.bubble'));
  initBubbleAnimation(pool, bubbles);
}
