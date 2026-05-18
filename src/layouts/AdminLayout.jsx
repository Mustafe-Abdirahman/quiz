import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiBookOpen, FiBarChart2, FiFileText, FiMonitor, FiMenu, FiX } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';

const sidebarLinks = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/quizzes', icon: FiBookOpen, label: 'Quizzes' },
  { to: '/admin/questions', icon: FiFileText, label: 'Questions' },
  { to: '/admin/competition', icon: FiBarChart2, label: 'Monitor' },
  { to: '/admin/rooms', icon: FiMonitor, label: 'Competition Rooms' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Hamburger toggle - mobile only */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="fixed top-20 left-4 z-50 lg:hidden p-2.5 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 z-40 flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="space-y-1">
            {sidebarLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin/dashboard'}
                onClick={closeSidebar}
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
