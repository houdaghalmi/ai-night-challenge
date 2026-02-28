'use client';

import { useTheme } from '@/lib/useTheme';
import { themes } from '@/lib/themes';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }) {
  const { theme, isLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLoaded || !mounted) {
    return children;
  }

  const themeColors = themes[theme];

  return (
    <div style={{ backgroundColor: themeColors.bg.primary, color: themeColors.text.primary }}>
      {children}
    </div>
  );
}
