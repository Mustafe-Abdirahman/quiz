import { NavLink } from 'react-router-dom';
import { FiGrid, FiBookOpen, FiAward, FiUsers } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';

const sidebarLinks = [
  { to: '/user/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/user/quizzes', icon: FiBookOpen, label: 'Quizzes' },
  { to: '/user/leaderboard', icon: FiAward, label: 'Leaderboard' },
  { to: '/user/rooms', icon: FiUsers, label: 'Competition' },
];

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {sidebarLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/user/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 lg:pl-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
