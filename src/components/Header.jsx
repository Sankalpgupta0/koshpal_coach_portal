import { Menu, Bell, User } from 'lucide-react';

function Header({ onMenuClick, title }) {
  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  // const userName = user.email?.split('@')[0] || 'Coach';

  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-4 py-3 border-b lg:px-6"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-primary)',
        height: '89px'
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
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Right side - Notifications and user profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:opacity-80"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)'
          }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge - can be made dynamic */}
          <span
            className="absolute flex items-center justify-center w-3 h-3 text-xs rounded-full -top-1 -right-1"
            style={{ backgroundColor: 'var(--color-error)' }}
          >
            3
          </span>
        </button>

        {/* User profile */}
        {/* <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Welcome back
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {userName}
            </p>
          </div>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)'
            }}
          >
            <User className="w-5 h-5" />
          </div>
        </div> */}
      </div>
    </header>
  );
}

export default Header;