export type MoodType = 
  | 'happy' 
  | 'excited' 
  | 'calm' 
  | 'neutral' 
  | 'sad' 
  | 'depressed' 
  | 'angry' 
  | 'anxious' 
  | 'stressed';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgLight: string;
  bgDark: string;
  textColor: string;
  description: string;
  score: number; // 1-10 scale for analytics calculations
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string YYYY-MM-DD
  createdAt: string; // Full ISO timestamp
  updatedAt: string; // Full ISO timestamp
  mood: MoodType;
  tags: string[];
  wordCount: number;
  characterCount: number;
  readingTimeMinutes: number;
}

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm format e.g. "08:42" or "11:52"
  mood: MoodType;
  note?: string;
  timestamp: string;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category?: string;
}

export interface AppSettings {
  userName: string;
  dailyReminder: boolean;
  reminderTime: string;
  fontSize: 'small' | 'medium' | 'large';
  autoSaveInterval: number; // seconds
  soundEffects: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
