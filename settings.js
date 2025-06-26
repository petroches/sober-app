// settings.js (переписан с localStorage)

// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);

function goBack() {
  window.location.href = "index.html";
}

// Сохранить в localStorage
function saveSetting(key, value) {
  localStorage.setItem(key, value);
}

// Инициализация segmented controls (Gender)
document.querySelectorAll('.segmented-control').forEach(control => {
  const options = control.querySelectorAll('.segmented-option');

  options.forEach(option => {
    option.addEventListener('click', () => {
      setTimeout(() => {
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        const gender = option.dataset.qty;
        saveSetting('gender', gender);
        updateResult();
      }, 50);
    });
  });
});

// Получить ближайший элемент в центре карусели
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

// Подключаем обработчики для всех трёх каруселей
const carousels = document.querySelectorAll('.carousel[data-carousel]');
carousels.forEach((carousel, index) => {
  carousel.addEventListener('scroll', () => {
    const closest = getClosestItem(carousel);
    if (!closest) return;
    const value = closest.textContent;

    if (index === 0) {
      saveSetting('age', value);
    } else if (index === 1) {
      saveSetting('weight', value);
      updateResult();
    } else if (index === 2) {
      saveSetting('legalLimit', value);
      updateResult();
    }
  });
});

// При загрузке страницы подставить сохранённые значения
window.addEventListener('DOMContentLoaded', () => {
  const gender = localStorage.getItem('gender');
  const age = localStorage.getItem('age');
  const weight = localStorage.getItem('weight');
  const legalLimit = localStorage.getItem('legalLimit');

  if (gender) {
    document.querySelectorAll('.segmented-option').forEach(opt => {
      if (opt.dataset.qty === gender) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  }

  [age, weight, legalLimit].forEach((val, i) => {
    if (!val) return;
    const carousel = carousels[i];
    const items = carousel.querySelectorAll('.carousel-item');
    items.forEach(item => {
      if (item.textContent === val) {
        item.classList.add('selected');
        setTimeout(() => {
          const offset = item.offsetLeft + item.offsetWidth / 2 - carousel.offsetWidth / 2;
          carousel.scrollLeft = offset;
        }, 0);
      } else {
        item.classList.remove('selected');
      }
    });
  });
});
