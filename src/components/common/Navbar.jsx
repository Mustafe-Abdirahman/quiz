import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiUser, FiGrid, FiBookOpen, FiFileText, FiMonitor, FiAward, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingsPath = user?.role === 'admin' ? '/admin/settings' : '/user/settings';
  const initials = (user?.fullName || user?.username || '?').split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);

  const navLinks = user?.role === 'admin'
    ? [
        { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
        { to: '/admin/users', label: 'Users', icon: FiUser },
        { to: '/admin/quizzes', label: 'Quizzes', icon: FiBookOpen },
        { to: '/admin/questions', label: 'Questions', icon: FiFileText },
        { to: '/admin/rooms', label: 'Rooms', icon: FiMonitor },
        { to: '/admin/competition', label: 'Monitor', icon: FiAward },
      ]
    : user
      ? [
          { to: '/user/dashboard', label: 'Dashboard', icon: FiGrid },
          { to: '/user/quizzes', label: 'Quizzes', icon: FiBookOpen },
          { to: '/user/rooms', label: 'Rooms', icon: FiMonitor },
          { to: '/user/leaderboard', label: 'Leaderboard', icon: FiAward },
        ]
      : [];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : user ? '/user/dashboard' : '/'} className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">QuizMaster</span>
          </Link>


          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle theme">
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {user && (
              <>
                <Link to={settingsPath} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">{initials}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{user.username}</span>
                </Link>
                <Link to={settingsPath} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden" title="Settings">
                  <FiSettings size={18} />
                </Link>
                <button onClick={handleLogout} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Logout">
                  <FiLogOut size={18} />
                </button>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          {user && (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.fullName || user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                </div>
              </div>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              <Link to={settingsPath} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <FiSettings size={16} />
                Settings
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
