// script.js (обновлён: учитывает параметры из localStorage)

// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);

// Alcohol absorption factors per drink type (in grams of pure alcohol)
const drinkFactors = {
  beer: 0.5,      // условные единицы алкоголя на напиток
  wine: 1.0,
  cocktail: 1.2,
  shot: 1.4
};

// DOM elements
const drinkCards = document.querySelectorAll('.drink-card');
const resultDisplay = document.getElementById('resultHours');

// Selected values by default
let selectedDrink = 'beer';
let selectedQuantity = 1;

// Подгружаем параметры из localStorage (с дефолтами)
function getUserParams() {
  const gender = localStorage.getItem('gender') || 'Man';
  const weight = parseInt(localStorage.getItem('weight')) || 95;
  const age = parseInt(localStorage.getItem('age')) || 33;
  let legalLimit = parseFloat(localStorage.getItem('legalLimit'));
  if (isNaN(legalLimit)) legalLimit = 0.2;
  if (legalLimit === 0.0) legalLimit = 0.01; // порог чувствительности прибора
  return { gender, weight, age, legalLimit };
}

// Формула расчета времени до достижения безопасного уровня алкоголя в крови
function calculateSoberTime(drinkType, quantity) {
  const factor = drinkFactors[drinkType];
  const { gender, weight, age, legalLimit } = getUserParams();

  // Вес в кг → в граммы
  const gramsPerKg = 1.2; // скорость распада алкоголя в г/кг/ч

  // Уточнённые коэффициенты на основе пола
  const genderFactor = gender === 'Woman' ? 0.7 : 0.68;

  // Расчёт общего количества алкоголя (в граммах), условно
  const alcoholConsumed = quantity * factor * 14; // масштабируемая величина

  // Эффективная масса тела (масса × коэффициент пола)
  const bodyWater = weight * genderFactor;

  // Примерное содержание алкоголя в крови (‰)
  const promille = alcoholConsumed / bodyWater;

  // Скорость распада: 0.015 ‰ в час
  const breakdownRate = 0.015;

  // Время до безопасной нормы
  const hours = Math.max(0, (promille - legalLimit) / breakdownRate);
  return Math.round(hours * 10) / 10; // округление до 1 знака после запятой
  //return Math.ceil(hours * 2) / 2; // округление до 0.5 часа
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
