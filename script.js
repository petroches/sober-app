const drinkFactors = {
  beer: 0.5,
  wine: 1.0,
  cocktail: 1.2,
  shot: 1.4
};

const quantityOptions = document.querySelectorAll('.quantity-option');
const drinkCards = document.querySelectorAll('.drink-card');
const resultDisplay = document.getElementById('resultHours');

let selectedDrink = 'beer';
let selectedQuantity = 1;

function updateResult() {
  const factor = drinkFactors[selectedDrink];
  const settings = getSettings();

  let modifier = 1.0;

  // Влияние пола
  if (settings.gender === "female") modifier *= 1.1;

  // Влияние веса (чем больше вес, тем меньше влияние)
  if (settings.weight > 0) modifier *= 70 / settings.weight;

  // Влияние страны
  if (settings.country === "RS") modifier *= 1.2; // например, жестче нормы в Сербии

  const rawHours = selectedQuantity * factor * modifier;
  const rounded = Math.ceil(rawHours * 2) / 2;
  resultDisplay.textContent = `${rounded}h`;
}

drinkCards.forEach(card => {
  card.addEventListener('click', () => {
    drinkCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedDrink = card.dataset.drink;
    updateResult();
  });
});

quantityOptions.forEach(option => {
  option.addEventListener('click', () => {
    quantityOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    selectedQuantity = parseInt(option.dataset.qty);
    updateResult();
  });
});

// Тема при загрузке
const userSettings = getSettings();
applyTheme(userSettings.theme);

updateResult();
