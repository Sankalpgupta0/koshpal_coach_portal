import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { logout } from '../api';

function Header({ onMenuClick, title }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || user.email?.split('@')[0] || 'Coach';
  const userEmail = user.email || '';

  // Get initials for profile picture
  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback clear if API fails
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-4 py-3 border-b lg:px-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-primary)',
        height: '89px',
        position: 'relative',
        zIndex: 50
      }}
    >
      {/* Left side - Menu button and title */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:opacity-80 lg:hidden"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)'
          }}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        {title && (
          <h1
            className="text-xl font-semibold lg:text-2xl"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)' }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Right side - Theme toggle, Notifications and user profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {/* <button
          className="relative p-2 rounded-lg hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)'
          }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute w-[18px] h-[18px] px-2 py-[2px] flex items-center justify-center rounded-full font-semibold text-[10px] flex-shrink-0 -top-1 -right-1"
            style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
          >
            3
          </span>
        </button> */}

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 transition-transform rounded-full hover:scale-105"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)'
            }}
          >
            <span className="text-sm font-bold">{getInitials(userName)}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-bg-card)', // Use CSS variable for theme compatibility
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-primary)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* User Info Header */}
              <div className="px-4 py-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                >
                  {getInitials(userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-[15px]" style={{ color: 'var(--color-text-primary)' }}>{userName}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>@{userEmail.split('@')[0]}</p>
                </div>
              </div>

              {/* Menu Options */}
              <div className="py-1">
                <button
                  onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:opacity-80 transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <Settings className="w-5 h-5 opacity-70" />
                  <span className="flex-1 text-left">Settings</span>
                </button>

                <div className="h-[1px] my-1 mx-4" style={{ backgroundColor: 'var(--color-border-primary)' }}></div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:opacity-80 transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <HelpCircle className="w-5 h-5 opacity-70" />
                  <span className="flex-1 text-left">Help</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:opacity-80 transition-colors mt-1"
                  style={{ color: 'var(--color-semantic-red-50)' }} // Using semantic red for logout if available
                >
                  <LogOut className="w-5 h-5 opacity-70" />
                  <span className="flex-1 text-left">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;