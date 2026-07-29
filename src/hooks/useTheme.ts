import { useThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  const { theme, isDark, setTheme, toggleTheme } = useThemeContext();
  return { theme, isDark, setTheme, toggleTheme };
}
