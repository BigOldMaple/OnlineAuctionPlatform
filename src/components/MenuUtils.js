// menuUtils.js
// This utility file provides a list of categories for the navigation menu 
// and a function to handle clicks outside specific elements to close open menus.

export const categories = [
  "Electronics",
  "Women's Clothing",
  "Men's Clothing",
  "Jewelry",
  "Home",
  "Books",
  "Toys",
  "Sports",
]; // Array of categories for dropdown menu options

export const handleClickOutside = (menuOpen, dropdownOpen, setMenuOpen, setDropdownOpen) => (event) => {
  // Closes the mobile menu if open and click occurs outside the menu area
  if (menuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
    setMenuOpen(false);
  }
  // Closes the categories dropdown if open and click occurs outside the dropdown area
  if (dropdownOpen && !event.target.closest('.categories-dropdown')) {
    setDropdownOpen(false);
  }
};