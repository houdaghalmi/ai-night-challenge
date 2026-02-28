'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('tourisia-language') || 'en';
    setLanguage(savedLanguage);
    setIsLoaded(true);
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('tourisia-language', lang);
    // Update document direction for RTL languages
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  return { language, changeLanguage, isLoaded };
}
