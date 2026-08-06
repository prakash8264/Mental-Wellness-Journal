import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineBookOpen, 
  HiOutlineChartBar, 
  HiOutlineCog 
} from 'react-icons/hi';
import { ROUTES } from '@/constants/routes';

const mobileNavItems = [
  { name: 'Home', path: ROUTES.DASHBOARD, icon: <HiOutlineHome /> },
  { name: 'Journal', path: ROUTES.JOURNAL, icon: <HiOutlineBookOpen /> },
  { name: 'Analytics', path: ROUTES.ANALYTICS, icon: <HiOutlineChartBar /> },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: <HiOutlineCog /> },
];

export const MobileNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="clay-card p-2 flex items-center justify-around max-w-md mx-auto bg-[var(--bg-card)] border-3 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--border)] rounded-2xl">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 text-xs font-bold border-2 ${
                isActive
                  ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] font-black'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
