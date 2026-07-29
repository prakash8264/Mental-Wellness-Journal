import { JournalEntry, MoodLog, AppSettings, ThemeMode, Quote } from '@/types';
import { FALLBACK_QUOTES } from '@/constants/quotes';

const KEYS = {
  JOURNAL_ENTRIES: 'serene_journal_entries',
  MOOD_LOGS: 'serene_mood_logs',
  THEME: 'serene_theme',
  SETTINGS: 'serene_settings',
  FAVOURITE_QUOTES: 'serene_favourite_quotes',
  LAST_PAGE: 'serene_last_page',
};

const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Mindful Soul',
  dailyReminder: true,
  reminderTime: '20:00',
  fontSize: 'medium',
  autoSaveInterval: 3,
  soundEffects: true,
};

// Seed initial demo data for a rich first-run experience
const INITIAL_DEMO_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-demo-1',
    title: 'Morning Sun & Quiet Reflections',
    content: `Woke up early today before the world started rushing. Watched the soft golden sunlight filter through the window with a warm mug of chamomile tea.\n\nTook 10 minutes to just breathe deeply. It felt so good to slow down my racing thoughts and acknowledge everything I am grateful for today. Setting a peaceful tone for the rest of the week!`,
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mood: 'calm',
    tags: ['Mindfulness', 'Morning Routine', 'Gratitude'],
    wordCount: 65,
    characterCount: 395,
    readingTimeMinutes: 1,
  },
  {
    id: 'entry-demo-2',
    title: 'Overcoming Midweek Stress',
    content: `Felt a wave of pressure around midday with deadlines accumulating. Instead of spiraling, I stepped away for a 15-minute mindful walk around the park.\n\nThe fresh air helped clear the cognitive fog. Reminded myself that I can only take things one step at a time.`,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    mood: 'stressed',
    tags: ['Work', 'Self-Care', 'Breathing'],
    wordCount: 52,
    characterCount: 310,
    readingTimeMinutes: 1,
  },
  {
    id: 'entry-demo-3',
    title: 'Breakthrough & Creative Energy',
    content: `Had an incredible brainstorming session today! Everything clicked after days of feeling stuck. It feels wonderful when creativity flows naturally without tension.\n\nCelebrated with a evening walk and listened to my favorite ambient playlist. Feeling genuinely excited about upcoming projects!`,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    mood: 'excited',
    tags: ['Creativity', 'Joy', 'Growth'],
    wordCount: 50,
    characterCount: 305,
    readingTimeMinutes: 1,
  },
];

const INITIAL_DEMO_MOODS: MoodLog[] = [
  {
    id: 'mood-demo-1',
    date: new Date().toISOString().split('T')[0],
    mood: 'calm',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'mood-demo-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    mood: 'stressed',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mood-demo-3',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    mood: 'excited',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mood-demo-4',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    mood: 'happy',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'mood-demo-5',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    mood: 'calm',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'mood-demo-6',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    mood: 'happy',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'mood-demo-7',
    date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
    mood: 'neutral',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export const storageService = {
  // Journal Entries
  getEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(KEYS.JOURNAL_ENTRIES);
      if (!data) {
        this.saveEntries(INITIAL_DEMO_ENTRIES);
        return INITIAL_DEMO_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ENTRIES;
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
        this.saveMoodLogs(INITIAL_DEMO_MOODS);
        return INITIAL_DEMO_MOODS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_MOODS;
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
    const existingIndex = logs.findIndex((l) => l.date === moodLog.date);
    let updated: MoodLog[];

    if (existingIndex >= 0) {
      updated = [...logs];
      updated[existingIndex] = moodLog;
    } else {
      updated = [moodLog, ...logs];
    }

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
      return data ? JSON.parse(data) : [FALLBACK_QUOTES[0]];
    } catch {
      return [FALLBACK_QUOTES[0]];
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
