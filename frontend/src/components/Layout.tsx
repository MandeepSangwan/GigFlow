import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* SideNavBar */}
      <nav className="hidden md:flex bg-surface-container-lowest text-primary w-[280px] h-full fixed left-0 top-0 border-r border-outline-variant flex-col py-lg px-md z-50">
        {/* Header */}
        <div className="mb-xl px-sm">
          <div className="font-headline-md text-headline-md font-bold text-primary">Smart Leads</div>
          <div className="font-label-md text-label-md text-on-surface-variant mt-xs">Lead Management</div>
        </div>
        {/* Navigation Tabs */}
        <div className="flex-1 space-y-xs">
          <Link to="/" className="flex items-center px-md py-sm rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 opacity-90 transition-opacity">
            <span className="material-symbols-outlined mr-md" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link to="/" className="flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200">
            <span className="material-symbols-outlined mr-md">group</span>
            <span className="font-label-md text-label-md">Leads</span>
          </Link>
          <Link to="/analytics" className="w-full flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200">
            <span className="material-symbols-outlined mr-md">analytics</span>
            <span className="font-label-md text-label-md">Analytics</span>
          </Link>
          <Link to="/settings" className="w-full flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200">
            <span className="material-symbols-outlined mr-md">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
        </div>
        {/* Footer Actions */}
        <div className="mt-auto space-y-xs pt-md border-t border-outline-variant/30">
          <div className="px-sm pb-sm mb-md flex flex-col gap-xs">
            <span className="font-label-md text-label-md text-on-surface">{user?.name}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{user?.role}</span>
          </div>
          <button onClick={() => alert("Upgrade Plans feature coming soon!")} className="w-full mb-md flex items-center justify-center px-md py-sm bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
            Upgrade Plan
          </button>
          <button onClick={() => alert("Help Center coming soon!")} className="w-full flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined mr-md">help</span>
            <span className="font-label-md text-label-md">Help Center</span>
          </button>
          <a onClick={logout} className="flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined mr-md">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </a>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <div className="md:ml-[280px] min-h-screen flex flex-col w-full max-w-full md:max-w-[calc(100%-280px)]">
        {/* TopNavBar */}
        <header className="bg-surface text-primary docked full-width top-0 sticky z-40 border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-desktop h-16">
          {/* Mobile Brand (Hidden on Desktop) */}
          <div className="font-headline-md text-headline-md font-extrabold text-primary md:hidden">
            Smart Leads
          </div>
          {/* Left Actions (Search) */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-xl pr-md py-[8px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Search leads, emails..." type="text"/>
            </div>
          </div>
          {/* Trailing Icons / Navigation */}
          <div className="flex items-center space-x-md">
            <nav className="hidden md:flex space-x-md mr-md">
              <Link className="font-label-sm text-label-sm text-primary border-b-2 border-primary pb-1" to="/">Dashboard</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all pb-1" to="/">Leads</Link>
            </nav>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button onClick={() => alert("You have no new notifications.")} className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-surface-container relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button onClick={() => alert("Help/Support panel coming soon!")} className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-title-md text-title-md ml-sm cursor-pointer">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
