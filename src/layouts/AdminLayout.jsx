import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiBookOpen, FiBarChart2, FiFileText, FiMonitor, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('admin_sidebar') === 'collapsed');

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('admin_sidebar', next ? 'collapsed' : 'expanded');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <aside className={`hidden lg:flex flex-col fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
          <button onClick={toggle} className="self-end mb-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
          <nav className="space-y-1">
            {sidebarLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={18} className="shrink-0" />
                {!collapsed && link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className={`flex-1 transition-all duration-200 ${collapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
