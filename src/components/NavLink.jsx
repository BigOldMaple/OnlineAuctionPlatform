// NavLink.js
// This component renders a navigation link button. It can be customized with a target path (`to`), 
// an optional icon, and children elements. It highlights the active link and allows an optional 
// callback (`onNavigate`) when navigating.

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavLink = ({ to, icon: Icon, children, className = '', closeMenu = true, onNavigate }) => {
  const location = useLocation(); // Get current route location
  const navigate = useNavigate(); // Function to navigate to a different route

  const isActivePath = (path) => location.pathname === path; // Check if the current path matches the target path

  const handleNavigate = () => {
    if (onNavigate) onNavigate(); // If provided, call the onNavigate callback
    navigate(to); // Navigate to the specified path
  };

  return (
    <button
      onClick={handleNavigate}
      className={`
        flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap
        ${isActivePath(to) 
          ? 'bg-slate-700 text-blue-400' 
          : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
        }
        ${className}
      `}
    >
      {Icon && <Icon className="h-4 sm:h-5 w-4 sm:w-5" />}
      <span>{children}</span>
    </button>
  );
};

export default NavLink;
