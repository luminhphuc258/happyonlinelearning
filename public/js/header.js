// Get references to the elements
const toggleOpen = document.getElementById('toggleOpen');
const toggleClose = document.getElementById('toggleClose');
const collapseMenu = document.getElementById('collapseMenu');

// Event listener to open the menu
toggleOpen.addEventListener('click', () => {
  collapseMenu.classList.remove('max-lg:hidden');
  collapseMenu.classList.add('max-lg:flex');
});

// Event listener to close the menu
toggleClose.addEventListener('click', () => {
  collapseMenu.classList.remove('max-lg:flex');
  collapseMenu.classList.add('max-lg:hidden');
});
