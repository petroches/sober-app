// Enable :active styles on iOS Safari
document.addEventListener('touchstart', () => {}, true);

// Go back to the main page when the close button is clicked
function goBack() {
  window.location.href = "index.html";
}

// Initialize segmented controls: handle selection highlighting
const allControls = document.querySelectorAll('.segmented-control');

allControls.forEach(control => {
  const options = control.querySelectorAll('.segmented-option');

  options.forEach(option => {
    option.addEventListener('click', () => {
      // Delay logic slightly to allow :active state to render
      setTimeout(() => {
        // Remove 'selected' from all options in this control
        options.forEach(o => o.classList.remove('selected'));

        // Add 'selected' to the clicked option
        option.classList.add('selected');
      }, 50); // ~1 frame delay for :active to be visible
    });
  });
});
