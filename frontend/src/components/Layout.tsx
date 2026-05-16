import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Moon, Sun, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">Smart Leads</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            <a href="#" className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0" />
              Dashboard
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="mr-2 h-5 w-5" />
            <div className="flex-1 truncate">{user?.name}</div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 pl-7">{user?.role}</div>
          <button
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
