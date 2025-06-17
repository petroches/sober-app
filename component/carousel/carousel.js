document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-wrapper');

  carousels.forEach(wrapper => {
    const control = wrapper.querySelector('.carousel-control');
    const valuesAttr = wrapper.dataset.values;
    const key = wrapper.dataset.carousel;

    const values = valuesAttr.split(',').map(v => v.trim());
    const repeat = 5;
    const allValues = Array(repeat).fill(values).flat();

    const optionWidth = 4 * 16;
    const totalChunk = values.length * optionWidth;
    const midpointChunk = Math.floor(repeat / 2);

    let isDragging = false;
    let dragMoved = false;
    let startX, scrollStart;

    allValues.forEach(val => {
      const el = document.createElement('div');
      el.className = 'carousel-option';
      el.textContent = val;
      el.dataset.value = val;

      el.addEventListener('click', () => {
        if (dragMoved) return;
        const targetScroll = el.offsetLeft + optionWidth / 2 - control.offsetWidth / 2;
        smoothScrollTo(control, targetScroll, 300);
        highlightAndSave(el);
      });

      control.appendChild(el);
    });

    function centerToClosest() {
      const centerX = control.scrollLeft + control.offsetWidth / 2;
      const options = Array.from(control.querySelectorAll('.carousel-option'));

      let closest = null;
      let minDist = Infinity;

      options.forEach(opt => {
        const box = opt.getBoundingClientRect();
        const optionCenter = box.left + box.width / 2;
        const dist = Math.abs(optionCenter - window.innerWidth / 2);
        if (dist < minDist) {
          minDist = dist;
          closest = opt;
        }
      });

      if (closest) {
        const target = closest.offsetLeft + optionWidth / 2 - control.offsetWidth / 2;
        smoothScrollTo(control, target, 300);
        highlightAndSave(closest);
      }

      const currentOffset = control.scrollLeft;
      const buffer = totalChunk * Math.floor(repeat / 3);
      const scrollLimit = control.scrollWidth - control.offsetWidth;

      if (currentOffset < buffer) {
        control.scrollLeft = currentOffset + totalChunk * Math.floor(repeat / 2);
      } else if (currentOffset > scrollLimit - buffer) {
        control.scrollLeft = currentOffset - totalChunk * Math.floor(repeat / 2);
      }
    }

    function highlightAndSave(selectedEl) {
      control.querySelectorAll('.carousel-option').forEach(opt => opt.classList.remove('selected'));
      selectedEl.classList.add('selected');
      localStorage.setItem(`carousel_${key}`, selectedEl.dataset.value);
    }

    function smoothScrollTo(element, to, duration = 300) {
      const start = element.scrollLeft;
      const change = to - start;
      const startTime = performance.now();

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 2);
        element.scrollLeft = start + change * ease;
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    control.scrollLeft = totalChunk * midpointChunk;

    let savedValue = localStorage.getItem(`carousel_${key}`);
    const defaultValue = wrapper.dataset.default;

    if (!savedValue && defaultValue && values.includes(defaultValue)) {
      savedValue = defaultValue;
    }

    if (savedValue && values.includes(savedValue)) {
      const indexInOriginal = values.indexOf(savedValue);
      const indexInFull = Math.floor(repeat / 2) * values.length + indexInOriginal;
      const targetScroll = indexInFull * optionWidth + optionWidth / 2 - control.offsetWidth / 2;
      control.scrollLeft = targetScroll;
    }

    setTimeout(centerToClosest, 100);

    let scrollTimeout;
    control.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(centerToClosest, 150);
    });

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      control.addEventListener('mousedown', e => {
        isDragging = true;
        dragMoved = false;
        startX = e.pageX - control.offsetLeft;
        scrollStart = control.scrollLeft;
      });

      window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        dragMoved = true;
        const x = e.pageX - control.offsetLeft;
        const walk = startX - x;
        control.scrollLeft = scrollStart + walk;
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          dragMoved = false;
          centerToClosest();
        }
      });
    }
  });
});
