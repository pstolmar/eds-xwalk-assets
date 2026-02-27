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
  // Collect all images in this block – each one becomes a bubble.
  const images = Array.from(block.querySelectorAll('img'));

  if (!images.length) {
    return;
  }

  // Collect size fields in DOM order.
  const sizeEls = Array.from(block.querySelectorAll('[data-aue-prop="size"]'));

  const container = document.createElement('div');
  container.classList.add('bubble-carousel');

  const bubbles = [];

  images.forEach((img, index) => {
    let size = 'medium';

    if (sizeEls[index] && sizeEls[index].textContent) {
      const txt = sizeEls[index].textContent.trim().toLowerCase();
      if (txt === 'small' || txt === 'medium' || txt === 'large') {
        size = txt;
      }
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

  // Replace original content only if we successfully created bubbles.
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
