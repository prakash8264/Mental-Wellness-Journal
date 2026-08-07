import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineBookOpen, 
  HiOutlineChartBar, 
  HiOutlineCog,
  HiOutlineSun, 
  HiOutlineMoon, 
  HiPlus
} from 'react-icons/hi';
import { useTheme } from '@/hooks/useTheme';
import { ROUTES } from '@/constants/routes';

const navLinks = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: <HiOutlineHome /> },
  { name: 'Journal', path: ROUTES.JOURNAL, icon: <HiOutlineBookOpen /> },
  { name: 'Analytics', path: ROUTES.ANALYTICS, icon: <HiOutlineChartBar /> },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: <HiOutlineCog /> },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-4 z-50 w-full px-4 mb-8">
      <div className="clay-card px-6 py-3.5 max-w-6xl mx-auto bg-[var(--bg-card)] border-3 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--border)] rounded-3xl">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-pink)] border-3 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-xl text-[var(--text)] font-bold group-hover:-rotate-6 transition-transform">
              🌿
            </div>
            <div>
              <span className="text-xl font-black text-[var(--text)] font-heading tracking-tight block leading-none">
                Journey
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">
                Mindfulness
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-all px-3.5 py-1.5 rounded-xl border-2 ${
                    isActive
                      ? 'bg-[var(--secondary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] font-black'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-cream)]'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] flex items-center justify-center text-[var(--text)] font-bold hover:bg-[var(--accent-yellow)] transition-colors cursor-pointer"
            >
              {isDark ? <HiOutlineSun className="text-amber-400 text-xl" /> : <HiOutlineMoon className="text-[var(--text)] text-xl" />}
            </button>

            {/* Primary CTA Green Button */}
            <button
              onClick={() => navigate(ROUTES.JOURNAL)}
              className="btn-primary text-sm py-2 px-4 sm:px-5 flex items-center gap-1.5"
            >
              <HiPlus className="text-base" />
              <span>New Entry</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
