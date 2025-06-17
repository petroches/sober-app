document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-wrapper');

  carousels.forEach(wrapper => {
    const control = wrapper.querySelector('.carousel-control');
    const valuesAttr = wrapper.dataset.values;
    const key = wrapper.dataset.carousel;

    const values = valuesAttr.split(',').map(v => v.trim());
    const repeat = 5;
    const allValues = Array(repeat).fill(values).flat();

    allValues.forEach(val => {
      const el = document.createElement('div');
      el.className = 'carousel-option';
      el.textContent = val;
      el.dataset.value = val;
      control.appendChild(el);
    });

    const optionWidth = 4 * 16;
    const middleIndex = Math.floor(allValues.length / 2);
    control.scrollLeft = middleIndex * optionWidth - control.offsetWidth / 2 + optionWidth / 2;

    function highlightAndSave(selectedEl) {
      control.querySelectorAll('.carousel-option').forEach(opt => opt.classList.remove('selected'));
      selectedEl.classList.add('selected');
      localStorage.setItem(`carousel_${key}`, selectedEl.dataset.value);
    }

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

      const maxScroll = control.scrollWidth - control.offsetWidth;
      if (control.scrollLeft < optionWidth) {
        control.scrollLeft += values.length * optionWidth;
      } else if (control.scrollLeft > maxScroll - optionWidth) {
        control.scrollLeft -= values.length * optionWidth;
      }
    }

    let scrollTimeout;
    control.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(centerToClosest, 100);
    });

    // Drag
    let isDragging = false;
    let startX, scrollStart;

    control.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX - control.offsetLeft;
      scrollStart = control.scrollLeft;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        centerToClosest();
      }
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x = e.pageX - control.offsetLeft;
      const walk = startX - x;
      control.scrollLeft = scrollStart + walk;
    });

    // Restore selection from localStorage
    const savedValue = localStorage.getItem(`carousel_${key}`);
    if (savedValue && values.includes(savedValue)) {
      const index = allValues.findIndex(v => v === savedValue);
      const targetScroll = index * optionWidth + optionWidth / 2 - control.offsetWidth / 2;
      control.scrollLeft = targetScroll;
    }

    setTimeout(centerToClosest, 100);
  });

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
});
