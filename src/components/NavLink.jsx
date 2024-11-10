// components/NavLink.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavLink = ({ to, icon: Icon, children, className = '', closeMenu = true, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActivePath = (path) => location.pathname === path;

  const handleNavigate = () => {
    if (onNavigate) onNavigate();
    navigate(to);
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
