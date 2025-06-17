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

// Calculate and update display with estimated sobering time
function updateResult() {
  const factor = drinkFactors[selectedDrink];
  const rawHours = selectedQuantity * factor;
  const rounded = Math.ceil(rawHours * 2) / 2; // Round to nearest 0.5
  resultDisplay.textContent = `${rounded}h`;
}

// Handle drink card selection
card.addEventListener('click', () => {
  // Delay logic slightly to allow :active style to render
  setTimeout(() => {
    drinkCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedDrink = card.dataset.drink;
    updateResult();
  }, 50); // 50ms достаточно
});


// Handle quantity segmented control selection
quantityOptions.forEach(option => {
  option.addEventListener('click', () => {
    quantityOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    selectedQuantity = parseInt(option.dataset.qty);
    updateResult();
  });
});

// Initial render
updateResult();

// Navigate to settings page on button click
document.querySelector('.btn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});

// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);
