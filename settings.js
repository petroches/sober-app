function goBack() {
  window.location.href = "index.html";
}

const allControls = document.querySelectorAll('.quantity-control');

allControls.forEach(control => {
  const options = control.querySelectorAll('.quantity-option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
});
