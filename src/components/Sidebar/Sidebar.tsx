import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineBookOpen, 
  HiOutlineChartBar, 
  HiOutlineCog,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi';
import { useTheme } from '@/hooks/useTheme';
import { useJournalContext } from '@/context/JournalContext';
import { ROUTES } from '@/constants/routes';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: <HiOutlineHome /> },
  { name: 'Journal', path: ROUTES.JOURNAL, icon: <HiOutlineBookOpen /> },
  { name: 'Analytics', path: ROUTES.ANALYTICS, icon: <HiOutlineChartBar /> },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: <HiOutlineCog /> },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { settings } = useJournalContext();

  const getInitials = (name: string) => {
    if (!name) return 'MS';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = settings?.userName || 'Mindful Soul';
  const initials = getInitials(displayName);

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] sticky top-4 my-4 ml-4 clay-card p-6 z-30">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b-3 border-[var(--border)]">
        <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[var(--primary)] border-3 border-[var(--text)] flex items-center justify-center text-xl shadow-[3px_3px_0px_0px_var(--text)] group-hover:-rotate-6 transition-transform duration-200">
            🌿
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text)] font-heading">
              Serene
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              Mindfulness Journal
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2.5 py-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 border-2 ${
                isActive
                  ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--text)] shadow-[3px_3px_0px_0px_var(--text)] font-black -translate-y-0.5'
                  : 'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`text-xl ${isActive ? 'text-[var(--text)]' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Dark Mode Switch & User Footer */}
      <div className="pt-4 border-t-3 border-[var(--border)] space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--bg-cream)] border-2 border-[var(--border)] hover:bg-[var(--secondary)] transition-colors text-xs font-bold text-[var(--text)] cursor-pointer shadow-[2px_2px_0px_0px_var(--border)]"
        >
          <span className="flex items-center gap-2.5">
            {isDark ? <HiOutlineMoon className="text-[var(--primary)] text-base" /> : <HiOutlineSun className="text-[var(--cta)] text-base" />}
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-mint)] border border-[var(--text)] text-[10px] font-black uppercase text-[var(--text)]">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[var(--border)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--secondary)] border-2 border-[var(--text)] flex items-center justify-center text-[var(--text)] text-xs font-black shadow-[2px_2px_0px_0px_var(--text)]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text)] truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium truncate">
              Daily Journaler
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
