'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, Globe, Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const { language, changeLanguage, isLoaded } = useLanguage();
  const { theme, changeTheme, isLoaded: themeLoaded } = useTheme();

  const t = translations[language];
  const themeColors = themes[theme];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.navbar.recommendations, href: '/recommendations' },
    { name: t.navbar.assistant, href: '/assistant' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  if (!isLoaded || !themeLoaded) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? `${themeColors.navbar.bg} backdrop-blur-md shadow-lg py-3` : 'py-6 bg-transparent'
      }`}
      style={
        isScrolled ? { backgroundColor: theme === 'dark' ? 'rgba(45, 36, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)' } : {}
      }
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
      
          <span className="hidden sm:inline text-2xl font-serif font-bold" style={{ color: themeColors.text.primary }}>
            Tourisia
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-semibold transition-colors"
              style={{ color: themeColors.text.primary }}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-6 w-px" style={{ backgroundColor: themeColors.accent.border }}></div>

          {/* Theme Toggle */}
          <button
            onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            style={{
              color: themeColors.text.primary,
              backgroundColor: theme === 'light' ? 'rgba(199, 166, 103, 0.1)' : 'rgba(212, 165, 116, 0.1)',
            }}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              style={{
                color: themeColors.text.primary,
                backgroundColor: isLanguageOpen ? `rgba(${theme === 'light' ? '199, 166, 103' : '212, 165, 116'}, 0.1)` : 'transparent',
              }}
            >
              <Globe className="w-4 h-4" />
              <span className="font-semibold text-sm">{language.toUpperCase()}</span>
            </button>
            {isLanguageOpen && (
              <div
                className="absolute top-full right-0 mt-2 rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundColor: themeColors.bg.primary }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-semibold transition-colors"
                    style={{
                      color: language === lang.code ? themeColors.accent.gold : themeColors.text.primary,
                      backgroundColor: language === lang.code ? `rgba(${theme === 'light' ? '199, 166, 103' : '212, 165, 116'}, 0.1)` : 'transparent',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = themeColors.bg.hover)}
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = language === lang.code ? `rgba(${theme === 'light' ? '199, 166, 103' : '212, 165, 116'}, 0.1)` : 'transparent')
                    }
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Avatar / Profile Dropdown */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                style={{
                  color: themeColors.text.primary,
                  backgroundColor: isProfileOpen ? `rgba(${theme === 'light' ? '199, 166, 103' : '212, 165, 116'}, 0.15)` : 'transparent',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white"
                  style={{ backgroundColor: themeColors.accent.gold }}
                >
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-semibold hidden sm:inline">{session.user?.name?.split(' ')[0]}</span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute top-full right-0 mt-2 rounded-lg shadow-lg overflow-hidden border"
                  style={{
                    backgroundColor: themeColors.bg.primary,
                    borderColor: themeColors.accent.border,
                  }}
                >
                  {/* User Info Header */}
                  <div
                    className="px-4 py-3 border-b"
                    style={{
                      backgroundColor: themeColors.bg.secondary,
                      borderColor: themeColors.accent.border,
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: themeColors.text.primary }}>
                      {session.user?.name}
                    </p>
                    <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                      {session.user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors"
                    style={{ color: themeColors.text.primary }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeColors.bg.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    {t.navbar.profile}
                  </Link>

                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-t text-left"
                    style={{
                      color: themeColors.text.primary,
                      borderColor: themeColors.accent.border,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeColors.bg.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut className="w-4 h-4" />
                    {t.navbar.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-6 py-2 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
              style={{ backgroundColor: themeColors.accent.gold }}
            >
              <User className="w-4 h-4" />
              {t.navbar.signIn}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: themeColors.text.primary }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 backdrop-blur-md p-6 flex flex-col gap-4 shadow-lg"
          style={{ backgroundColor: themeColors.navbar.bg === 'bg-white/95' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(45, 36, 32, 0.95)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-semibold py-2 border-b"
              style={{ color: themeColors.text.primary, borderColor: themeColors.accent.border }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <div className="pt-4 border-t" style={{ borderColor: themeColors.accent.border }}>
            <p className="text-sm font-semibold mb-3" style={{ color: themeColors.text.primary }}>
              Theme
            </p>
            <div className="flex gap-2">
              {['light', 'dark'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    changeTheme(m);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1 flex items-center justify-center gap-2"
                  style={{
                    color: theme === m ? (m === 'light' ? '#5d4037' : '#1a1410') : themeColors.text.primary,
                    backgroundColor: theme === m ? (m === 'light' ? '#c7a667' : '#d4a574') : themeColors.bg.secondary,
                  }}
                >
                  {m === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Language Switcher */}
          <div className="pt-4 border-t" style={{ borderColor: themeColors.accent.border }}>
            <p className="text-sm font-semibold mb-3" style={{ color: themeColors.text.primary }}>
              Language
            </p>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-1"
                  style={{
                    color: language === lang.code ? (theme === 'light' ? '#5d4037' : '#1a1410') : themeColors.text.primary,
                    backgroundColor: language === lang.code ? themeColors.accent.gold : themeColors.bg.secondary,
                  }}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: themeColors.accent.border }}>
            {session ? (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: themeColors.text.primary }}>
                  {session.user?.name}
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    style={{ color: themeColors.text.primary }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    {t.navbar.profile}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors text-left w-full"
                    style={{ color: themeColors.text.primary }}
                  >
                    <LogOut className="w-4 h-4" />
                    {t.navbar.logout}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-colors w-full"
                style={{ backgroundColor: themeColors.accent.gold }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                {t.navbar.signIn}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

