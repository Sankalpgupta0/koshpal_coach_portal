import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, LogOut, Moon, Sun, Menu } from 'lucide-react';
import { logout, getMyProfile, updateMyProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Settings() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
    
    // Load user profile
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Try to get profile from API
      try {
        const profile = await getMyProfile();
        const profileData = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || user.email || '',
          phone: profile.phoneNumber || '',
        };
        setFormData(profileData);
        setOriginalData(profileData);
      } catch (err) {
        // Fallback to user data from localStorage
        const fallbackData = {
          firstName: user.email?.split('@')[0] || 'Coach',
          lastName: '',
          email: user.email || '',
          phone: '',
        };
        setFormData(fallbackData);
        setOriginalData(fallbackData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Update profile via API
      await updateMyProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
      });
      
      setOriginalData(formData);
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'C';
    return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Clear local storage anyway
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center flex-1 p-4 overflow-y-auto sm:p-6 md:p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin" 
               style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ${isSidebarOpen ? 'lg:blur-0 blur-[2px]' : ''}`}
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        
        <Header 
          title="Settings" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Settings
              </h1>
              <p className="mb-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Manage your account and preferences
              </p>
            </div>

            {/* Profile Information Card */}
      <div
        className="p-6 rounded-lg sm:p-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Profile Information
          </h2>
        </div>

        {/* Profile Photo Section */}
        <div
          className="flex flex-col items-start gap-6 pb-8 mb-8 border-b sm:flex-row sm:items-center"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <span>{getInitials(formData.firstName, formData.lastName)}</span>
          </div>

          {/* Name and Email */}
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="mb-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {formData.email}
            </p>
            <button
              className="px-4 py-2 text-sm font-semibold text-white transition-opacity rounded-lg hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Change Photo
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label
                className="block mb-2 text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-input-bg)',
                  borderColor: 'var(--color-input-border)',
                  color: 'var(--color-input-text)',
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                className="block mb-2 text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-input-bg)',
                  borderColor: 'var(--color-input-border)',
                  color: 'var(--color-input-text)',
                }}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              className="block mb-2 text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 pr-24 transition-all border rounded-lg cursor-not-allowed focus:outline-none opacity-60"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-input-border)',
                  color: 'var(--color-text-secondary)',
                }}
              />
              <span
                className="absolute px-3 py-1 text-xs font-semibold -translate-y-1/2 rounded right-3 top-1/2"
                style={{
                  backgroundColor: 'var(--color-success-light)',
                  color: 'var(--color-success-darkest)',
                }}
              >
                Verified
              </span>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="block mb-2 text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 transition-all border rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-input-border)',
                color: 'var(--color-input-text)',
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col justify-end gap-3 pt-6 mt-8 border-t sm:flex-row"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-3 text-sm font-semibold transition-opacity rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {saving && (
              <div
                className="w-4 h-4 border-2 rounded-full border-t-transparent animate-spin"
                style={{ borderColor: 'white', borderTopColor: 'transparent' }}
              />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preferences & Account Actions Section */}
      <div
        className="p-6 mt-6 rounded-lg sm:p-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Preferences & Account
          </h2>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 mb-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                ) : (
                  <Sun className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                )}
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Dark Mode
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: isDarkMode ? 'var(--color-primary)' : 'var(--color-border-secondary)',
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

        {/* Divider */}
        <div className="my-6 border-t" style={{ borderColor: 'var(--color-border-primary)' }} />

        {/* Logout Button */}
        <div>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Account Actions
          </h3>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-semibold transition-opacity rounded-lg sm:w-auto hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'white',
            }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
