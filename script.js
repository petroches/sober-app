// script.js (обновлён: учитывает параметры из localStorage)

// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);

const ethanolGrams = {
  beer: 19.7,
  wine: 14.2,
  cocktail: 15.8, // 1 шот
  shot: 15.8
};

const drinkCards = document.querySelectorAll('.drink-card');
const resultDisplay = document.getElementById('resultHours');

let selectedDrink = 'beer';
let selectedQuantity = 1;

function getUserParams() {
  const gender = localStorage.getItem('gender') || 'Man';
  const weight = parseInt(localStorage.getItem('weight')) || 95;
  const age = parseInt(localStorage.getItem('age')) || 33;
  let legalLimit = parseFloat(localStorage.getItem('legalLimit'));
  if (isNaN(legalLimit)) legalLimit = 0.2;
  if (legalLimit === 0.0) legalLimit = 0.01;
  return { gender, weight, age, legalLimit };
}

function calculateSoberTime(drinkType, quantity) {
  const alcoholConsumed = quantity * ethanolGrams[drinkType]; // в граммах
  const { gender, weight, age, legalLimit } = getUserParams();
  const genderFactor = gender === 'Woman' ? 0.60 : 0.68; // r
  const bodyWater = weight * genderFactor; // в кг

  const initialPromille = alcoholConsumed / bodyWater; // BAC = A / (P * r), в ‰
  const eliminationRate = 0.15; // промилле в час (0.15‰/ч)

  const soberHours = Math.max(0, (initialPromille - legalLimit) / eliminationRate);

  // Округляем вверх до ближайших 0.5 часов
  const rounded = Math.ceil(soberHours * 2) / 2;

  return rounded;
}


// Обновление результата на экране
function updateResult() {
  const hours = calculateSoberTime(selectedDrink, selectedQuantity);
  resultDisplay.textContent = `${hours}h`;
}

// Обработчик скролла карусели с количеством напитков
document.querySelectorAll('.carousel[data-carousel]').forEach(carousel => {
  carousel.addEventListener('scroll', () => {
    const closest = getClosestItem(carousel);
    if (closest && closest.dataset.qty) {
      selectedQuantity = parseInt(closest.dataset.qty, 10);
      updateResult();
    }
  });
});

// Обработка кликов по карточкам напитков
drinkCards.forEach(card => {
  card.addEventListener('click', () => {
    setTimeout(() => {
      drinkCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedDrink = card.dataset.drink;
      updateResult();
    }, 50);
  });
});

// Пересчёт при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateResult();
});

// Вычисление ближайшего элемента в карусели
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

// Кнопка перехода к настройкам
document.querySelector('.btn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});
