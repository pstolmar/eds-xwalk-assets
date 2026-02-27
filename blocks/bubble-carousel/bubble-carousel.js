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
  const rows = [...block.children];
  const container = document.createElement('div');
  container.classList.add('bubble-carousel');

  const bubbles = [];

  rows.forEach((row) => {
    const [imgCell, sizeCell] = row.children;
    const img = imgCell?.querySelector('img');
    if (!img) return;

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = (sizeCell?.textContent || 'medium').trim().toLowerCase();
    bubble.classList.add(`bubble--${size}`);

    const bubbleImg = img.cloneNode(true);
    bubbleImg.loading = 'lazy';
    bubbleImg.decoding = 'async';

    // UE instrumentation for a media field
    bubbleImg.setAttribute('data-aue-type', 'media');
    bubbleImg.setAttribute('data-aue-prop', 'imageReference');
    bubbleImg.setAttribute('data-aue-label', 'Bubble Image');

    // If later you have a DAM path on a data-attr, you could do:
    // const damPath = bubbleImg.dataset?.aemAssetPath;
    // if (damPath) bubbleImg.src = `${damPath}/jcr:content/renditions/bubble.png`;

    bubble.append(bubbleImg);
    container.append(bubble);
    bubbles.push(bubble);
  });

  block.innerHTML = '';
  block.append(container);

  // UE component instrumentation for the whole carousel
  container.setAttribute('data-aue-type', 'component');
  container.setAttribute('data-aue-label', 'Bubble Carousel');
  container.setAttribute('data-aue-model', 'bubble-carousel');

  initBubbleAnimation(container, bubbles);
}

