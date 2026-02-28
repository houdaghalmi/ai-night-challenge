'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

export function LanguageContextProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : 'en';
    const initialLanguage = savedLanguage || 'en';
    
    setLanguage(initialLanguage);
    document.documentElement.setAttribute('lang', initialLanguage);
    
    // Apply RTL for Arabic
    if (initialLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    
    setIsLoaded(true);
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.setAttribute('lang', newLanguage);
    
    // Apply RTL for Arabic
    if (newLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLanguage } }));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}
