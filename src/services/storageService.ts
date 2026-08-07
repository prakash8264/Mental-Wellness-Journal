import { JournalEntry, MoodLog, AppSettings, ThemeMode, Quote } from '@/types';

const KEYS = {
  JOURNAL_ENTRIES: 'journey_journal_entries',
  MOOD_LOGS: 'journey_mood_logs',
  THEME: 'journey_theme',
  SETTINGS: 'journey_settings',
  FAVOURITE_QUOTES: 'journey_favourite_quotes',
  LAST_PAGE: 'journey_last_page',
};

const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Mindful Soul',
  dailyReminder: true,
  reminderTime: '20:00',
  fontSize: 'medium',
  autoSaveInterval: 3,
  soundEffects: true,
};

// Storage keys and default settings
export const storageService = {
  // Journal Entries
  getEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(KEYS.JOURNAL_ENTRIES);
      if (!data) {
        return [];
      }
      const parsed: JournalEntry[] = JSON.parse(data);
      return parsed.filter((e) => !e.id.startsWith('entry-demo-'));
    } catch {
      return [];
    }
  },

  saveEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save journal entries', e);
    }
  },

  saveEntry(entry: JournalEntry): JournalEntry[] {
    const entries = this.getEntries();
    const existingIndex = entries.findIndex((e) => e.id === entry.id);
    let updated: JournalEntry[];

    if (existingIndex >= 0) {
      updated = [...entries];
      updated[existingIndex] = { ...entry, updatedAt: new Date().toISOString() };
    } else {
      updated = [entry, ...entries];
    }

    this.saveEntries(updated);
    return updated;
  },

  deleteEntry(id: string): JournalEntry[] {
    const entries = this.getEntries();
    const updated = entries.filter((e) => e.id !== id);
    this.saveEntries(updated);
    return updated;
  },

  // Mood Logs
  getMoodLogs(): MoodLog[] {
    try {
      const data = localStorage.getItem(KEYS.MOOD_LOGS);
      if (!data) {
        return [];
      }
      const parsed: MoodLog[] = JSON.parse(data);
      return parsed.filter((l) => !l.id.startsWith('mood-demo-'));
    } catch {
      return [];
    }
  },

  saveMoodLogs(logs: MoodLog[]): void {
    try {
      localStorage.setItem(KEYS.MOOD_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save mood logs', e);
    }
  },

  logMood(moodLog: MoodLog): MoodLog[] {
    const logs = this.getMoodLogs();
    const updated = [moodLog, ...logs];
    this.saveMoodLogs(updated);
    return updated;
  },

  deleteMoodLog(id: string): MoodLog[] {
    const logs = this.getMoodLogs();
    const updated = logs.filter((l) => l.id !== id);
    this.saveMoodLogs(updated);
    return updated;
  },

  // Settings & Theme
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getTheme(): ThemeMode {
    try {
      return (localStorage.getItem(KEYS.THEME) as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  },

  saveTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },

  // Favourite Quotes
  getFavouriteQuotes(): Quote[] {
    try {
      const data = localStorage.getItem(KEYS.FAVOURITE_QUOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFavouriteQuotes(quotes: Quote[]): void {
    try {
      localStorage.setItem(KEYS.FAVOURITE_QUOTES, JSON.stringify(quotes));
    } catch (e) {
      console.error('Failed to save favourite quotes', e);
    }
  },

  // Last Page
  getLastPage(): string {
    return localStorage.getItem(KEYS.LAST_PAGE) || '/';
  },

  saveLastPage(page: string): void {
    localStorage.setItem(KEYS.LAST_PAGE, page);
  },
};
