import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntry, MoodLog, MoodType, AppSettings, Quote } from '@/types';
import { storageService } from '@/services/storageService';
import { getTodayDateString, calculateStreak } from '@/utils/dateUtils';
import { calculateWordAndCharCount } from '@/utils/moodUtils';

interface JournalContextType {
  entries: JournalEntry[];
  moodLogs: MoodLog[];
  settings: AppSettings;
  favouriteQuotes: Quote[];
  todayMood: MoodLog | undefined;
  streakDays: number;
  
  // Actions
  saveEntry: (entryData: Partial<JournalEntry> & { title: string; content: string; mood: MoodType }) => JournalEntry;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntryByDate: (dateStr: string) => JournalEntry | undefined;
  
  logMood: (mood: MoodType, note?: string) => void;
  getMoodByDate: (dateStr: string) => MoodLog | undefined;
  
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleFavouriteQuote: (quote: Quote) => void;
  isQuoteFavourite: (quoteId: string) => boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => storageService.getEntries());
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => storageService.getMoodLogs());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [favouriteQuotes, setFavouriteQuotes] = useState<Quote[]>(() => storageService.getFavouriteQuotes());

  const todayStr = getTodayDateString();
  const todayMood = moodLogs.find((m) => m.date === todayStr);

  const allActivityDates = Array.from(
    new Set([
      ...entries.map((e) => e.date),
      ...moodLogs.map((m) => m.date),
    ])
  );
  const streakDays = calculateStreak(allActivityDates);

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
    const date = entryData.date || todayStr;
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

    // Also automatically update mood log for that date if not set or update it
    logMood(entryData.mood, entryData.title);

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

  const logMood = (mood: MoodType, note?: string) => {
    const newLog: MoodLog = {
      id: `mood-${Date.now()}`,
      date: todayStr,
      mood: mood,
      note: note,
      timestamp: new Date().toISOString(),
    };

    const updated = storageService.logMood(newLog);
    setMoodLogs(updated);
  };

  const getMoodByDate = (dateStr: string) => {
    return moodLogs.find((m) => m.date === dateStr);
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
        streakDays,
        saveEntry,
        deleteEntry,
        getEntryById,
        getEntryByDate,
        logMood,
        getMoodByDate,
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
