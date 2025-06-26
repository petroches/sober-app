// script.js (финальная версия)

// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);

const ethanolGrams = {
  beer: 19.7,
  wine: 14.2,
  cocktail: 15.8,
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
  const alcoholConsumed = quantity * ethanolGrams[drinkType];
  const { gender, weight, legalLimit } = getUserParams();
  const genderFactor = gender === 'Woman' ? 0.60 : 0.68;
  const bodyWater = weight * genderFactor;
  const initialPromille = alcoholConsumed / bodyWater;
  const eliminationRate = 0.15;
  const soberHours = Math.max(0, (initialPromille - legalLimit) / eliminationRate);
  return Math.ceil(soberHours * 2) / 2;
}

function updateResult() {
  const hours = calculateSoberTime(selectedDrink, selectedQuantity);
  resultDisplay.textContent = `${hours}h`;
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

// Обработка drink-карточек
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

// Обработка карусели с количеством напитков
document.querySelectorAll('.carousel-inner').forEach(inner => {
  inner.addEventListener('scroll', () => {
    const closest = getClosestItem(inner);
    if (closest && closest.dataset.qty) {
      selectedQuantity = parseInt(closest.dataset.qty, 10);
      updateResult();
    }
  });
});

// Открытие/закрытие bottom sheet
document.addEventListener('DOMContentLoaded', () => {
  updateResult();

  const openBtn = document.querySelector('.btn');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const backdrop = document.getElementById('settingsBackdrop');
  const sheet = document.getElementById('settingsSheet');

  function forceReflow(el) {
    void el.offsetHeight;
  }

  if (openBtn && closeBtn && backdrop && sheet) {
    openBtn.addEventListener('click', () => {
      backdrop.classList.add('visible');
      backdrop.classList.remove('hidden');
      sheet.classList.add('visible');
      sheet.classList.remove('hidden');

      // iOS Safari fix: принудительный reflow рамки
      setTimeout(() => {
        document.querySelectorAll('.carousel-indicator').forEach(forceReflow);
      }, 50);
    });

    function closeSheet() {
      backdrop.classList.remove('visible');
      sheet.classList.remove('visible');
      setTimeout(() => {
        backdrop.classList.add('hidden');
        sheet.classList.add('hidden');
      }, 300);
    }

    closeBtn.addEventListener('click', closeSheet);
    backdrop.addEventListener('click', closeSheet);
  }
});
