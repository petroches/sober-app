function updateCarouselPadding(carousel) {
  const item = carousel.querySelector('.carousel-item');
  const paddings = carousel.querySelectorAll('.carousel-padding');

  const itemWidth = item.offsetWidth;
  const itemMargin = parseFloat(getComputedStyle(item).marginLeft || 0);
  const totalItemWidth = itemWidth + itemMargin * 2;
  const carouselWidth = carousel.offsetWidth;
  const sidePadding = (carouselWidth - totalItemWidth) / 2;

  paddings.forEach(p => p.style.width = `${sidePadding}px`);
}

function scrollToSelectedExactly(carousel) {
  const selected = carousel.querySelector('.carousel-item.selected');
  if (!selected) return;

  const carouselCenter = carousel.offsetWidth / 2;
  const selectedOffset = selected.offsetLeft + selected.offsetWidth / 2;

  carousel.scrollLeft = selectedOffset - carouselCenter;
}

function getClosestItem(carousel) {
  const items = carousel.querySelectorAll('.carousel-item');
  const centerX = carousel.scrollLeft + carousel.offsetWidth / 2;

  let closestItem = null;
  let minDistance = Infinity;

  items.forEach(item => {
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(centerX - itemCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestItem = item;
    }
  });

  return closestItem;
}

function updateSelectedItem(carousel) {
  const items = carousel.querySelectorAll('.carousel-item');
  const closestItem = getClosestItem(carousel);
  items.forEach(item => item.classList.remove('selected'));
  if (closestItem) closestItem.classList.add('selected');
}

function snapToClosest(carousel) {
  const closestItem = getClosestItem(carousel);
  if (!closestItem) return;

  const itemCenter = closestItem.offsetLeft + closestItem.offsetWidth / 2;
  const newScrollLeft = itemCenter - carousel.offsetWidth / 2;

  carousel.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel[data-carousel]');
  carousels.forEach(carousel => {
    updateCarouselPadding(carousel);
    scrollToSelectedExactly(carousel);
    updateSelectedItem(carousel);

    const wrapper = carousel.closest('.carousel-wrapper');
    setTimeout(() => {
      wrapper.classList.add('ready');
    }, 0);

    let scrollTimeout = null;
    carousel.addEventListener('scroll', () => {
      updateSelectedItem(carousel);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        snapToClosest(carousel);
      }, 100);
    });
  });

  window.addEventListener('resize', () => {
    carousels.forEach(carousel => {
      updateCarouselPadding(carousel);
      scrollToSelectedExactly(carousel);
      updateSelectedItem(carousel);
    });
  });
});
