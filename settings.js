document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settings-form");

  // Загрузить сохранённые значения
  const settings = getSettings();
  for (const key in settings) {
    if (form.elements[key]) {
      form.elements[key].value = settings[key];
    }
  }

  // Обработчик сохранения
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newSettings = {
      gender: form.elements.gender.value,
      age: parseInt(form.elements.age.value, 10),
      weight: parseInt(form.elements.weight.value, 10),
      country: form.elements.country.value,
      theme: form.elements.theme.value,
    };

    saveSettings(newSettings);

    // Применить тему
    applyTheme(newSettings.theme);

    // Вернуться на главную
    window.location.href = "index.html";
  });
});
