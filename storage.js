const SETTINGS_KEY = "user_settings";

function getSettings() {
  const defaults = {
    gender: "male",
    age: 30,
    weight: 70,
    country: "RU",
    theme: "auto",
  };

  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch (e) {
    return defaults;
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyTheme(mode) {
  const html = document.documentElement;
  html.dataset.theme = mode;
}
