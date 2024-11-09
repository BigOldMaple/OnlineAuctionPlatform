import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Home,
  LayoutGrid,
  ShoppingBag,
  PackageSearch,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
  ChevronDown,  
  ChevronUp     
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useTheme } from "../contexts/ThemeContext";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const { isDarkMode } = useTheme();

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const activeCategory = new URLSearchParams(location.search).get('category');

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.mobile-menu') && 
          !event.target.closest('.menu-button')) {
        setMenuOpen(false);
      }
      if (dropdownOpen && !event.target.closest('.categories-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, dropdownOpen]);

  const categories = [
    "Electronics",
    "Women's Clothing",
    "Men's Clothing",
    "Jewelry",
    "Home",
    "Books",
    "Toys",
    "Sports",
  ];

  const UserSection = ({ isMobile = false }) => (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center p-2">
          <div className="loading loading-spinner loading-sm text-primary" />
        </div>
      ) : isAuthenticated ? (
        <>
          {user && !isMobile && (
            <div className="flex items-center space-x-2">
              <div className="avatar">
                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-base-content font-medium hidden xl:block">
                {user.nickname}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              logout({ returnTo: window.location.origin });
              if (isMobile) setMenuOpen(false);
            }}
            className={`btn btn-ghost btn-sm gap-2 text-base-content hover:bg-base-200
              ${isMobile ? 'w-full justify-start' : ''}`}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            loginWithRedirect();
            if (isMobile) setMenuOpen(false);
          }}
          className={`btn btn-ghost btn-sm gap-2 text-base-content hover:bg-base-200
            ${isMobile ? 'w-full justify-start' : ''}`}
        >
          <LogIn className="h-4 w-4" />
          Login
        </button>
      )}
    </>
  );

  const NavLink = ({ to, icon: Icon, children, className = '', onClick = () => {} }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200
        ${isActivePath(to) 
          ? 'bg-slate-700 text-blue-400' 
          : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
        }
        ${className}
      `}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-[#0A0A0A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <NavLink 
              to="/" 
              icon={Home}
              className="text-xl font-bold"
            >
              AuctionSite
            </NavLink>

            {/* Categories Dropdown - Updated with chevron toggle */}
            <div className="relative categories-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200
                  ${activeCategory 
                    ? 'bg-slate-700 text-blue-400' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
                  }
                `}
              >
                <LayoutGrid className="h-5 w-5" />
                <span>Categories</span>
                {dropdownOpen ? (
                  <ChevronUp className="h-4 w-4 ml-1 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" />
                )}
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#0A0A0A] rounded-lg shadow-lg border border-slate-800 overflow-hidden z-50">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/results?category=${category.toLowerCase()}`}
                      className={`
                        flex items-center px-4 py-2 text-sm transition-colors duration-200
                        ${activeCategory === category.toLowerCase()
                          ? 'bg-slate-700 text-blue-400'
                          : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
                        }
                      `}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block w-96">
              <SearchBar />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink 
                to="/auctions" 
                icon={PackageSearch}
              >
                Auction List
              </NavLink>
              
              <NavLink 
                to="/bids" 
                icon={ShoppingBag}
              >
                My Bids
              </NavLink>

              {/* User Section */}
              {isLoading ? (
                <div className="h-10 w-10 rounded-full animate-pulse bg-slate-700" />
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-2 px-3">
                    <div className="w-8 h-8 rounded-full ring-2 ring-blue-400 overflow-hidden">
                      <img
                        src={user?.picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-300 font-medium hidden xl:block">
                      {user?.nickname}
                    </span>
                  </div>
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-200 ease-in-out
            ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
          `}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <SearchBar />
            
            <NavLink
              to="/auctions"
              icon={PackageSearch}
              onClick={() => setMenuOpen(false)}
              className="w-full"
            >
              Auction List
            </NavLink>
            
            <NavLink
              to="/bids"
              icon={ShoppingBag}
              onClick={() => setMenuOpen(false)}
              className="w-full"
            >
              My Bids
            </NavLink>

            {/* Mobile User Section */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 px-3 py-2 text-gray-300">
                  <User className="h-5 w-5" />
                  <span>{user?.nickname}</span>
                </div>
                <button
                  onClick={() => {
                    logout({ returnTo: window.location.origin });
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  loginWithRedirect();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;