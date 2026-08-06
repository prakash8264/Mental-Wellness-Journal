import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntry, MoodLog, MoodType, AppSettings, Quote } from '@/types';
import { storageService } from '@/services/storageService';
import { quoteService } from '@/services/quoteService';
import { getTodayDateString, getCurrentTimeString } from '@/utils/dateUtils';
import { calculateWordAndCharCount } from '@/utils/moodUtils';

interface JournalContextType {
  entries: JournalEntry[];
  moodLogs: MoodLog[];
  settings: AppSettings;
  favouriteQuotes: Quote[];
  todayMood: MoodLog | undefined;
  dailyQuote: Quote | null;
  quoteLoading: boolean;
  
  // Actions
  saveEntry: (entryData: Partial<JournalEntry> & { title: string; content: string; mood: MoodType }) => JournalEntry;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntryByDate: (dateStr: string) => JournalEntry | undefined;
  
  logMood: (mood: MoodType, note?: string, targetDate?: string, targetTime?: string) => MoodLog;
  deleteMoodLog: (id: string) => void;
  getMoodByDate: (dateStr: string) => MoodLog | undefined;
  getMoodsByDate: (dateStr: string) => MoodLog[];
  
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleFavouriteQuote: (quote: Quote) => void;
  isQuoteFavourite: (quoteId: string) => boolean;
  fetchDailyQuote: (forceRefresh?: boolean) => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => storageService.getEntries());
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => storageService.getMoodLogs());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [favouriteQuotes, setFavouriteQuotes] = useState<Quote[]>(() => storageService.getFavouriteQuotes());
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

  const fetchDailyQuote = async (forceRefresh = false) => {
    setQuoteLoading(true);
    try {
      const data = await quoteService.getRandomQuote();
      setDailyQuote(data);
    } catch {
      setDailyQuote(quoteService.getRandomFallbackQuote());
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyQuote(false);
  }, []);

  const todayStr = getTodayDateString();
  const todayMoods = moodLogs.filter((m) => m.date === todayStr);
  const todayMood = todayMoods.length > 0 ? todayMoods[0] : undefined;

  // Sync to storage on updates
  useEffect(() => {
    storageService.saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    storageService.saveMoodLogs(moodLogs);
  }, [moodLogs]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveFavouriteQuotes(favouriteQuotes);
  }, [favouriteQuotes]);

  const saveEntry = (entryData: Partial<JournalEntry> & { title: string; content: string; mood: MoodType }): JournalEntry => {
    let date = entryData.date || todayStr;
    if (date > todayStr) {
      date = todayStr;
    }
    const { words, chars, readingTime } = calculateWordAndCharCount(entryData.content);

    const newOrUpdatedEntry: JournalEntry = {
      id: entryData.id || `entry-${Date.now()}`,
      title: entryData.title || 'Untitled Entry',
      content: entryData.content || '',
      date: date,
      createdAt: entryData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mood: entryData.mood || 'calm',
      tags: entryData.tags || ['Reflection'],
      wordCount: words,
      characterCount: chars,
      readingTimeMinutes: readingTime,
    };

    const updatedEntries = storageService.saveEntry(newOrUpdatedEntry);
    setEntries(updatedEntries);

    // Also automatically log mood for that date if not already logged
    logMood(entryData.mood, entryData.title, date);

    return newOrUpdatedEntry;
  };

  const deleteEntry = (id: string) => {
    const updated = storageService.deleteEntry(id);
    setEntries(updated);
  };

  const getEntryById = (id: string) => {
    return entries.find((e) => e.id === id);
  };

  const getEntryByDate = (dateStr: string) => {
    return entries.find((e) => e.date === dateStr);
  };

  const logMood = (mood: MoodType, note?: string, targetDate?: string, targetTime?: string): MoodLog => {
    const today = getTodayDateString();
    const nowTime = getCurrentTimeString();
    
    let dateStr = targetDate || today;
    let timeStr = targetTime || nowTime;

    if (dateStr > today) {
      dateStr = today;
    }
    if (dateStr === today && timeStr > nowTime) {
      timeStr = nowTime;
    }

    const newLog: MoodLog = {
      id: `mood-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: dateStr,
      time: timeStr,
      mood: mood,
      note: note,
      timestamp: new Date().toISOString(),
    };

    const updated = storageService.logMood(newLog);
    setMoodLogs(updated);
    return newLog;
  };

  const deleteMoodLog = (id: string) => {
    const updated = storageService.deleteMoodLog(id);
    setMoodLogs(updated);
  };

  const getMoodByDate = (dateStr: string) => {
    return moodLogs.find((m) => m.date === dateStr);
  };

  const getMoodsByDate = (dateStr: string): MoodLog[] => {
    return moodLogs.filter((m) => m.date === dateStr);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
  };

  const toggleFavouriteQuote = (quote: Quote) => {
    setFavouriteQuotes((prev) => {
      const exists = prev.some((q) => q.quote === quote.quote);
      if (exists) {
        return prev.filter((q) => q.quote !== quote.quote);
      } else {
        return [...prev, quote];
      }
    });
  };

  const isQuoteFavourite = (quoteId: string) => {
    return favouriteQuotes.some((q) => q.id === quoteId || q.quote === quoteId);
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        moodLogs,
        settings,
        favouriteQuotes,
        todayMood,
        dailyQuote,
        quoteLoading,
        fetchDailyQuote,
        saveEntry,
        deleteEntry,
        getEntryById,
        getEntryByDate,
        logMood,
        deleteMoodLog,
        getMoodByDate,
        getMoodsByDate,
        updateSettings,
        toggleFavouriteQuote,
        isQuoteFavourite,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournalContext = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournalContext must be used within a JournalProvider');
  }
  return context;
};
