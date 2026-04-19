import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineHome, HiOutlineCurrencyRupee, HiOutlineChartBar, HiOutlineUserGroup, HiOutlineCog, HiOutlineLogout, HiOutlineMoon, HiOutlineSun, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { to: '/dashboard', label: 'Home', icon: <HiOutlineHome size={20} /> },
    { to: '/expenses', label: 'History', icon: <HiOutlineCurrencyRupee size={20} /> },
    { to: '/analytics', label: 'Insights', icon: <HiOutlineChartBar size={20} /> },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin', icon: <HiOutlineHome size={20} /> },
    { to: '/admin/users', label: 'Users', icon: <HiOutlineUserGroup size={20} /> },
    { to: '/admin/expenses', label: 'Transactions', icon: <HiOutlineCurrencyRupee size={20} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      darkMode
        ? 'bg-surface-950/80 border-surface-800'
        : 'bg-white/80 border-surface-100'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>
              Tracki<span className="text-primary-500">fy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary-500/10 text-primary-500'
                    : darkMode
                    ? 'text-surface-400 hover:text-white hover:bg-surface-800'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                darkMode
                  ? 'text-yellow-400 hover:bg-surface-800'
                  : 'text-surface-500 hover:bg-surface-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <HiOutlineSun size={22} /> : <HiOutlineMoon size={22} />}
            </button>

            <div className={`hidden md:flex items-center gap-4 pl-4 border-l ${
              darkMode ? 'border-surface-800' : 'border-surface-100'
            }`}>
              <div className="text-right">
                <p className={`text-sm font-bold leading-tight ${darkMode ? 'text-white' : 'text-surface-900'}`}>
                  {user?.name}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Verified User'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-danger-500 hover:bg-danger-500/10 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Logout"
              >
                <HiOutlineLogout size={22} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-all ${
                darkMode ? 'text-white hover:bg-surface-800' : 'text-surface-700 hover:bg-surface-100'
              }`}
            >
              {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className={`md:hidden border-t animate-fade-in ${
          darkMode ? 'bg-surface-950 border-surface-800' : 'bg-white border-surface-100'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.to)
                    ? 'bg-primary-500/10 text-primary-500'
                    : darkMode
                    ? 'text-surface-400 hover:bg-surface-900'
                    : 'text-surface-600 hover:bg-surface-100'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className={`my-4 border-t ${darkMode ? 'border-surface-800' : 'border-surface-100'}`} />
            <div className="px-5 py-3 flex items-center justify-between">
              <div>
                 <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-surface-900'}`}>{user?.name}</p>
                 <p className={`text-xs font-medium ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>{user?.email}</p>
              </div>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="p-3 rounded-xl text-danger-500 hover:bg-danger-500/10 transition-all font-bold flex items-center gap-2"
              >
                <HiOutlineLogout size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
