function initBubbleAnimation(pool, bubbles) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pool.classList.add('bubble-carousel--reduced-motion');
    return;
  }

  const count = bubbles.length || 1;
  const step = 100 / (count + 1);

  bubbles.forEach((bubble, index) => {
    const x = step * (index + 1); // even spacing across width

    // Random size around base Small/Medium/Large (±20%)
    let baseSize = 160; // default (medium)
    if (bubble.classList.contains('bubble-small')) {
      baseSize = 130;
    } else if (bubble.classList.contains('bubble-large')) {
      baseSize = 210;
    }
    const factor = 0.8 + Math.random() * 0.4; // 0.8–1.2
    const diameter = baseSize * factor;
    bubble.style.width = `${diameter}px`;
    bubble.style.height = `${diameter}px`;

    // Choose an animation variant: drift / deflate / pop
    const roll = Math.random();
    let variant;
    if (roll > 0.65) {
      variant = 'pop';
    } else if (roll > 0.35) {
      variant = 'deflate';
    } else {
      variant = 'drift';
    }
    bubble.classList.add(`bubble-variant-${variant}`);

    // Duration & delay per bubble
    let duration = 18 + Math.random() * 6; // 18–24s for soft drift
    if (variant === 'pop' || variant === 'deflate') {
      duration = 9 + Math.random() * 5; // 9–14s for zippier effects
    }
    const delay = index * 2 + Math.random() * 1.5;

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

  // Decide once whether we are on author or on Crosswalk.
  const isAuthorHost = typeof window !== 'undefined'
    && window.location
    && window.location.hostname.indexOf('author-') !== -1;

  // Clear block content and mark it as an origin.
  block.innerHTML = '';
  block.classList.add('bubble-carousel-origin');

  // On author, keep a small marker so the block stays clickable in UE.
  if (isAuthorHost) {
    block.classList.add('bubble-carousel-origin-author');
    const marker = document.createElement('div');
    marker.classList.add('bubble-carousel-marker');
    marker.textContent = 'Bubble';
    block.append(marker);
  }

  // Add this bubble to the shared pool for the section.
  const pool = getOrCreatePool(block);
  pool.append(bubble);

  const bubbles = Array.from(pool.querySelectorAll('.bubble'));
  initBubbleAnimation(pool, bubbles);
}
