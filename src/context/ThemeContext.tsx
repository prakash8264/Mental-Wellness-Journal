import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '@/types';
import { storageService } from '@/services/storageService';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => storageService.getTheme());

  const getSystemIsDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = storageService.getTheme();
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    let activeDark = theme === 'dark';

    if (activeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setIsDark(activeDark);
    storageService.saveTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
