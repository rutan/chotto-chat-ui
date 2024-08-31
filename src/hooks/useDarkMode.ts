import { useCallback, useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('dark-mode');
    try {
      return stored ? JSON.parse(stored) : false;
    } catch (_) {
      return false;
    }
  });

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('dark-mode', JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
