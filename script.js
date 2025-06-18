// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);

// Alcohol absorption factors per drink type (in hours per unit)
const drinkFactors = {
  beer: 0.5,
  wine: 1.0,
  cocktail: 1.2,
  shot: 1.4
};

// DOM elements
const quantityOptions = document.querySelectorAll('.segmented-option');
const drinkCards = document.querySelectorAll('.drink-card');
const resultDisplay = document.getElementById('resultHours');

// Selected values by default
let selectedDrink = 'beer';
let selectedQuantity = 1;

// Listen for scroll or selection updates on carousels
document.querySelectorAll('.carousel[data-carousel]').forEach(carousel => {
  carousel.addEventListener('scroll', () => {
    const closest = getClosestItem(carousel);
    if (closest && closest.dataset.qty) {
      selectedQuantity = parseInt(closest.dataset.qty, 10);
      updateResult();
    }
  });
});

// Calculate and update display with estimated sobering time
function updateResult() {
  const factor = drinkFactors[selectedDrink];
  const rawHours = selectedQuantity * factor;
  const rounded = Math.ceil(rawHours * 2) / 2; // Round to nearest 0.5
  resultDisplay.textContent = `${rounded}h`;
}

// Handle drink card selection
drinkCards.forEach(card => {
  card.addEventListener('click', () => {
    // Delay logic slightly to allow :active style to render
    setTimeout(() => {
      drinkCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedDrink = card.dataset.drink;
      updateResult();
    }, 50);
  });
});

// Recalculate on load
document.addEventListener('DOMContentLoaded', () => {
  updateResult();
});

// Get closest item in carousel
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
