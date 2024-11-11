import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Home,
  LayoutGrid,
  PackageSearch,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Heart
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useTheme } from "../contexts/ThemeContext";
import NavLink from "./NavLink";
import { categories, handleClickOutside } from "./MenuUtils";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const { isDarkMode } = useTheme();

  // Define `activeCategory` to get the category from the URL search parameters
  const activeCategory = new URLSearchParams(location.search).get('category');

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const outsideClickHandler = handleClickOutside(menuOpen, dropdownOpen, setMenuOpen, setDropdownOpen);
    document.addEventListener("mousedown", outsideClickHandler);
    return () => document.removeEventListener("mousedown", outsideClickHandler);
  }, [menuOpen, dropdownOpen]);

  return (
    <nav className="bg-[#0A0A0A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NavLink to="/" icon={Home} className="text-lg sm:text-xl font-bold truncate" closeMenu={false}>
              AuctionSite
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative categories-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap
                  ${activeCategory 
                    ? 'bg-slate-700 text-blue-400' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
                  }
                `}
              >
                <LayoutGrid className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="hidden sm:inline">Categories</span>
                {dropdownOpen ? (
                  <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                )}
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#0A0A0A] rounded-lg shadow-lg border border-slate-800 overflow-hidden z-50">
                  {categories.map((category) => (
                    <div
                      key={category}
                      onClick={() => {
                        navigate(`/results?category=${category.toLowerCase()}`);
                        setDropdownOpen(false);
                      }}
                      className={`
                        flex items-center px-4 py-2 text-sm w-full cursor-pointer
                        ${activeCategory === category.toLowerCase()
                          ? 'bg-slate-700 text-blue-400'
                          : 'text-gray-300 hover:bg-slate-800 hover:text-gray-100'
                        }
                      `}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block max-w-[24rem] lg:max-w-[32rem] flex-1">
              <SearchBar />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <div className="hidden xl:flex items-center gap-2">
              <NavLink to="/auctions" icon={PackageSearch} className="whitespace-nowrap">
                Auction List
              </NavLink>
              
              {isAuthenticated && (
                <>
                  <NavLink to="/watchlist" icon={Heart} className="whitespace-nowrap">
                    Watchlist
                  </NavLink>
                  <NavLink to="/account" icon={User} className="whitespace-nowrap">
                    Account
                  </NavLink>
                </>
              )}

              {isLoading ? (
                <div className="h-8 w-8 rounded-full animate-pulse bg-slate-700" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100 whitespace-nowrap"
                  >
                    <LogOut className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100 whitespace-nowrap"
                >
                  <LogIn className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden p-2 rounded-md text-gray-300 hover:bg-slate-800 hover:text-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden transition-all duration-200 ease-in-out
            ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
          `}
        >
          <div className="px-2 pt-2 pb-3 space-y-2">
            <SearchBar />
            
            <NavLink to="/auctions" icon={PackageSearch} className="w-full">
              Auction List
            </NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink to="/watchlist" icon={Heart} className="w-full">
                  Watchlist
                </NavLink>
                <NavLink to="/account" icon={User} className="w-full">
                  Account
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
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