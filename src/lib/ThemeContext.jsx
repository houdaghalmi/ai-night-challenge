'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    setIsLoaded(true);
  }, []);

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}
