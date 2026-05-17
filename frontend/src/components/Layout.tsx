import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSidebarLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return "flex items-center px-md py-sm rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 opacity-90 transition-opacity";
    }
    return "flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200";
  };
  
  const getTopLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return "font-label-sm text-label-sm text-primary border-b-2 border-primary pb-1";
    }
    return "font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all pb-1";
  };

  return (
    <div className="bg-background text-on-background min-h-[100dvh] pb-16 md:pb-0">
      {/* SideNavBar (Desktop Only) */}
      <nav className="hidden md:flex bg-surface-container-lowest text-primary w-[280px] h-full fixed left-0 top-0 border-r border-outline-variant flex-col py-lg px-md z-50">
        {/* Header */}
        <div className="mb-xl px-sm">
          <div className="font-headline-md text-headline-md font-bold text-primary">Smart Leads</div>
          <div className="font-label-md text-label-md text-on-surface-variant mt-xs">Lead Management</div>
        </div>
        {/* Navigation Tabs */}
        <div className="flex-1 space-y-xs">
          <Link to="/" className={getSidebarLinkClass("/")}>
            <span className="material-symbols-outlined mr-md" style={location.pathname === "/" ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link to="/analytics" className={getSidebarLinkClass("/analytics")}>
            <span className="material-symbols-outlined mr-md" style={location.pathname === "/analytics" ? { fontVariationSettings: "'FILL' 1" } : {}}>analytics</span>
            <span className="font-label-md text-label-md">Analytics</span>
          </Link>
          <Link to="/settings" className={getSidebarLinkClass("/settings")}>
            <span className="material-symbols-outlined mr-md" style={location.pathname === "/settings" ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
        </div>
        {/* Footer Actions */}
        <div className="mt-auto space-y-xs pt-md border-t border-outline-variant/30">
          <div className="px-sm pb-sm mb-md flex flex-col gap-xs">
            <span className="font-label-md text-label-md text-on-surface">{user?.name}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{user?.role}</span>
          </div>
          <a onClick={logout} className="flex items-center px-md py-sm rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors duration-200 cursor-pointer">
            <span className="material-symbols-outlined mr-md">logout</span>
            <span className="font-label-md text-label-md">Logout</span>
          </a>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <div className="md:ml-[280px] min-h-screen flex flex-col w-full max-w-full md:max-w-[calc(100%-280px)]">
        {/* TopNavBar */}
        <header className="bg-surface text-primary docked full-width top-0 sticky z-30 border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16">
          {/* Mobile Brand */}
          <div className="font-headline-md text-headline-md font-extrabold text-primary md:hidden">
            Smart Leads
          </div>

          {/* Left Actions (Empty space to replace removed search bar on desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md"></div>

          {/* Trailing Icons / Navigation */}
          <div className="flex items-center space-x-xs sm:space-x-md ml-auto">
            <nav className="hidden md:flex space-x-md mr-md">
              <Link className={getTopLinkClass("/")} to="/">Dashboard</Link>
            </nav>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} 
                className="p-xs text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-surface-container relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="fixed top-[72px] left-4 right-4 md:absolute md:top-auto md:left-auto md:right-0 md:mt-2 md:w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50 flex flex-col shadow-2xl">
                  <div className="px-md py-sm bg-surface-container border-b border-outline-variant font-title-md text-title-md text-on-surface">
                    Inbox
                  </div>
                  <div className="max-h-[60vh] md:max-h-[300px] overflow-y-auto">
                    <div className="p-md border-b border-outline-variant/50 hover:bg-surface-container/50 cursor-pointer transition-colors">
                      <div className="font-title-md text-title-md text-primary">New Lead Assigned</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Jane Doe from Website has been assigned to you.</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant/70 mt-xs">2 hours ago</div>
                    </div>
                    <div className="p-md hover:bg-surface-container/50 cursor-pointer transition-colors">
                      <div className="font-title-md text-title-md text-on-surface">Weekly Report Ready</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Your conversion metrics for this week are ready to view.</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant/70 mt-xs">1 day ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} 
                className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-title-md text-title-md ml-xs sm:ml-sm cursor-pointer hover:opacity-90 transition-opacity"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {showProfile && (
                <div className="fixed top-[72px] left-4 right-4 md:absolute md:top-auto md:left-auto md:right-0 md:mt-2 md:w-[320px] bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant p-md z-50 shadow-2xl">
                  <div className="flex items-center gap-md mb-md border-b border-outline-variant/50 pb-md">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md text-headline-md">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-title-md text-title-md text-on-surface truncate">{user?.name || 'Mandeep Sangwan'}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant truncate">{user?.email || 'mandeep@example.com'}</div>
                    </div>
                  </div>
                  <div className="font-body-md text-body-md text-on-surface-variant mb-md">
                    <strong>Role:</strong> {user?.role || 'Sales User'}<br/>
                    <strong>Status:</strong> Active<br/>
                    <strong>Timezone:</strong> IST
                  </div>
                  <button 
                    onClick={logout} 
                    className="w-full py-sm rounded-lg border border-error/50 text-error hover:bg-error-container transition-colors font-title-md text-title-md flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined mr-xs text-[18px]">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-x-hidden pt-md md:pt-margin-desktop relative">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[64px] bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center z-40 px-2 pb-safe">
        <Link to="/" className={`flex flex-col items-center justify-center w-16 h-full ${location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[24px]" style={location.pathname === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
          <span className="text-[10px] font-medium mt-1">Dashboard</span>
        </Link>
        <Link to="/analytics" className={`flex flex-col items-center justify-center w-16 h-full ${location.pathname === '/analytics' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[24px]" style={location.pathname === '/analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}>analytics</span>
          <span className="text-[10px] font-medium mt-1">Analytics</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center justify-center w-16 h-full ${location.pathname === '/settings' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[24px]" style={location.pathname === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
