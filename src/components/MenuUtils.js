// utils/menuUtils.js
export const categories = [
    "Electronics",
    "Women's Clothing",
    "Men's Clothing",
    "Jewelry",
    "Home",
    "Books",
    "Toys",
    "Sports",
  ];
  
  export const handleClickOutside = (menuOpen, dropdownOpen, setMenuOpen, setDropdownOpen) => (event) => {
    if (menuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
      setMenuOpen(false);
    }
    if (dropdownOpen && !event.target.closest('.categories-dropdown')) {
      setDropdownOpen(false);
    }
  };
  