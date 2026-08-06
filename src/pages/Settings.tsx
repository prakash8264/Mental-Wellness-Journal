import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCog, 
  HiOutlineSun, 
  HiOutlineMoon, 
  HiOutlineHeart,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineUser,
  HiCheck
} from 'react-icons/hi';
import { useTheme } from '@/hooks/useTheme';
import { useJournalContext } from '@/context/JournalContext';
import { Button } from '@/components/Buttons/Button';
import { ThemeMode } from '@/types';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, favouriteQuotes, toggleFavouriteQuote } = useJournalContext();
  const [userName, setUserName] = useState(settings?.userName || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (settings?.userName !== undefined) {
      setUserName(settings.userName);
    }
  }, [settings?.userName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserName(val);
    updateSettings({ userName: val });
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ userName });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to reset all journal entries and mood logs? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b-3 border-[var(--border)] pb-4">
        <h1 className="text-3xl font-black text-[var(--text)] font-heading flex items-center gap-2">
          <HiOutlineCog className="text-[var(--cta)]" />
          <span>App Preferences & Settings</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-bold">
          Customize your theme, user profile, and journal preferences
        </p>
      </div>

      <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
        <h2 className="text-xl font-black text-[var(--text)] font-heading">
          Appearance & Theme
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light Cream', icon: <HiOutlineSun className="text-amber-500 text-2xl" /> },
            { id: 'dark', label: 'Dark Obsidian', icon: <HiOutlineMoon className="text-purple-400 text-2xl" /> },
          ].map((item) => {
            const isSelected = theme === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as ThemeMode)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-3 border-[var(--border)] transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[var(--primary)] text-[var(--text)] shadow-[4px_4px_0px_0px_var(--border)] -translate-y-1 font-black'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5'
                }`}
              >
                <div className="mb-2">{item.icon}</div>
                <span className="text-xs font-black">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
        <h2 className="text-xl font-black text-[var(--text)] font-heading flex items-center gap-2">
          <HiOutlineUser className="text-[var(--cta)]" />
          <span>User Profile</span>
        </h2>

        <form onSubmit={handleSaveName} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={userName}
              onChange={handleInputChange}
              placeholder="Your name or preferred nickname..."
              className="flex-1 w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-cream)] text-sm font-bold text-[var(--text)] border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <Button variant="primary" size="md" icon={isSaved ? <HiCheck /> : <HiOutlineSave />}>
              {isSaved ? 'Name Saved!' : 'Save Name'}
            </Button>
          </div>
          {isSaved && (
            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <HiCheck className="text-sm" />
              <span>Name saved to local storage and updated across dashboard!</span>
            </p>
          )}
        </form>
      </div>

      <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
        <h2 className="text-xl font-black text-[var(--text)] font-heading flex items-center gap-2">
          <HiOutlineHeart className="text-[var(--cta)]" />
          <span>Saved Favourite Quotes ({favouriteQuotes.length})</span>
        </h2>

        {favouriteQuotes.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] font-bold italic">No quotes saved to favourites yet. Click the heart icon on any daily quote card to save it here!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favouriteQuotes.map((q) => (
              <div
                key={q.id || q.quote}
                className="p-4 rounded-2xl clay-card bg-[var(--accent-purple)] border-2 border-[var(--border)] relative group"
              >
                <p className="text-xs font-bold text-[var(--text)] italic font-heading">
                  "{q.quote}"
                </p>
                <p className="text-[11px] font-black text-[var(--text)] mt-2">
                  — {q.author}
                </p>
                <button
                  onClick={() => toggleFavouriteQuote(q)}
                  className="absolute top-3 right-3 text-[var(--cta)] hover:underline text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="clay-card p-6 sm:p-8 rounded-3xl border-3 border-[var(--border)] bg-[var(--accent-pink)] space-y-4">
        <h2 className="text-xl font-black text-[var(--text)] font-heading">
          Danger Zone
        </h2>
        <p className="text-xs text-[var(--text)] font-bold">
          Reset all stored journal entries, mood logs, and settings to factory clean slate.
        </p>
        <Button variant="primary" size="sm" icon={<HiOutlineTrash />} onClick={handleClearAllData}>
          Reset All Stored Data
        </Button>
      </div>
    </div>
  );
};
