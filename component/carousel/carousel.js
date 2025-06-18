function updateCarouselPadding(carouselId) {
  const carousel = document.getElementById(carouselId);
  const item = carousel.querySelector('.carousel-item');
  const paddings = carousel.querySelectorAll('.carousel-padding');

  const itemWidth = item.offsetWidth;
  const itemMargin = parseFloat(getComputedStyle(item).marginLeft || 0);
  const totalItemWidth = itemWidth + itemMargin * 2;
  const carouselWidth = carousel.offsetWidth;
  const sidePadding = (carouselWidth - totalItemWidth) / 2;

  paddings.forEach(p => p.style.width = `${sidePadding}px`);
}

function scrollToSelectedExactly(carouselId) {
  const carousel = document.getElementById(carouselId);
  const selected = carousel.querySelector('.carousel-item.selected');
  if (!selected) return;

  const carouselCenter = carousel.offsetWidth / 2;
  const selectedOffset = selected.offsetLeft + selected.offsetWidth / 2;

  carousel.scrollLeft = selectedOffset - carouselCenter;
}

function getClosestItem(carouselId) {
  const carousel = document.getElementById(carouselId);
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

function updateSelectedItem(carouselId) {
  const items = document.querySelectorAll(`#${carouselId} .carousel-item`);
  const closestItem = getClosestItem(carouselId);
  items.forEach(item => item.classList.remove('selected'));
  if (closestItem) closestItem.classList.add('selected');
}

function snapToClosest(carouselId) {
  const carousel = document.getElementById(carouselId);
  const closestItem = getClosestItem(carouselId);
  if (!closestItem) return;

  const itemCenter = closestItem.offsetLeft + closestItem.offsetWidth / 2;
  const newScrollLeft = itemCenter - carousel.offsetWidth / 2;

  carousel.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  updateCarouselPadding('myCarousel');
  scrollToSelectedExactly('myCarousel');
  updateSelectedItem('myCarousel');

  // Delay before showing the carousel itself (not the wrapper or indicator)
  setTimeout(() => {
    document.getElementById('myCarousel').classList.add('ready');
  }, 300);
});

// Recalculate on resize
window.addEventListener('resize', () => {
  updateCarouselPadding('myCarousel');
  scrollToSelectedExactly('myCarousel');
  updateSelectedItem('myCarousel');
});

// Snap logic on scroll
let scrollTimeout = null;
document.getElementById('myCarousel').addEventListener('scroll', () => {
  updateSelectedItem('myCarousel');
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    snapToClosest('myCarousel');
  }, 100);
});
