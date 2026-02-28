'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Lock, Mail, Loader2, Compass } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';

export default function LoginPage() {
  const router = useRouter();
  const { language, isLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();
  const t = translations[language];
  const themeColors = themes[theme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoaded || !themeLoaded || !t) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.auth.login.error);
      } else if (result?.ok) {
        // Check if user has completed onboarding by fetching their preferences
        try {
          const preferencesResponse = await fetch('/api/preferences');
          if (preferencesResponse.ok) {
            const prefData = await preferencesResponse.json();
            // If user has preferences, redirect to recommendations
            if (prefData.preferences) {
              router.push('/recommendations');
            } else {
              // Otherwise, send to onboarding
              router.push('/onboarding');
            }
          } else {
            // If we can't check, default to onboarding (safest for new users)
            router.push('/onboarding');
          }
        } catch (err) {
          // Default to onboarding if preference check fails
          router.push('/onboarding');
        }
      }
    } catch (err) {
      setError(t.auth.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-12 relative overflow-hidden pt-24 "
      style={{ backgroundColor: themeColors.bg.primary }}
    >
    

      {/* Carte d'Invitation Principale */}
      <div
        className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 mt-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[1px] overflow-hidden"
        style={{ backgroundColor: themeColors.bg.card, borderColor: themeColors.accent.border }}
      >
        
        {/* Section Image : Invitation Visuelle */}
        <div className="relative hidden md:block group">
          <img
            src="/assests/robot.png"
            alt="Tourism Tunisia"
            className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to left, ${themeColors.bg.card}, ${themeColors.bg.card}cc, transparent)`
            }}
          />
          
          
        </div>

        {/* Section Formulaire : Style Papier Ancien */}
        <div className="relative p-10 md:p-20 flex flex-col justify-center">
          {/* Ornements de coins (SVG) */}
          <div
            className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl"
            style={{ borderColor: themeColors.accent.gold }}
          />
          <div
            className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 rounded-br-xl"
            style={{ borderColor: themeColors.accent.gold }}
          />

          <div className="text-center mb-10">
            <h1 className="text-5xl font-serif mb-4" style={{ color: themeColors.text.primary }}>
              {t.auth.login.title}
            </h1>
            <div
              className="h-[2px] w-24 bg-gradient-to-r from-transparent via-transparent to-transparent mx-auto mb-4"
              style={{ backgroundImage: `linear-gradient(to right, transparent, ${themeColors.accent.gold}, transparent)` }}
            />
            <p className="font-serif italic text-lg" style={{ color: themeColors.text.secondary }}>
              {t.auth.login.subtitle}
            </p>
          </div>

          {error && (
            <div
              className="mb-4 p-4 rounded border"
              style={{
                backgroundColor: theme === 'light' ? '#fee' : '#330000',
                color: theme === 'light' ? '#c33' : '#faa',
                borderColor: theme === 'light' ? '#fcc' : '#663',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div
              className="relative border-b-2 focus-within:transition-all"
              style={{ borderColor: themeColors.accent.border }}
              onFocus={(e) => (e.currentTarget.style.borderColor = themeColors.accent.gold)}
              onBlur={(e) => (e.currentTarget.style.borderColor = themeColors.accent.border)}
            >
              <label
                className="text-[10px] uppercase tracking-widest font-bold ml-1"
                style={{ color: themeColors.accent.gold }}
              >
                {t.auth.login.email}
              </label>
              <div className="flex items-center">
                <Mail size={18} style={{ color: themeColors.accent.gold }} className="mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-transparent py-3 outline-none placeholder:opacity-40 font-medium"
                  style={{ color: themeColors.text.primary, caretColor: themeColors.accent.gold }}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div
              className="relative border-b-2 focus-within:transition-all"
              style={{ borderColor: themeColors.accent.border }}
              onFocus={(e) => (e.currentTarget.style.borderColor = themeColors.accent.gold)}
              onBlur={(e) => (e.currentTarget.style.borderColor = themeColors.accent.border)}
            >
              <label
                className="text-[10px] uppercase tracking-widest font-bold ml-1"
                style={{ color: themeColors.accent.gold }}
              >
                {t.auth.login.password}
              </label>
              <div className="flex items-center">
                <Lock size={18} style={{ color: themeColors.accent.gold }} className="mr-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 outline-none placeholder:opacity-40"
                  style={{ color: themeColors.text.primary, caretColor: themeColors.accent.gold }}
                />
              </div>
            </div>

            {/* Bouton doré façon sceau royal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative text-white py-4 rounded-full font-serif text-xl tracking-widest transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: themeColors.accent.gold,
                boxShadow: `0 10px 20px ${themeColors.accent.gold}50`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 15px 30px ${themeColors.accent.gold}70`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 10px 20px ${themeColors.accent.gold}50`)}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : t.auth.login.signIn}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="font-serif" style={{ color: themeColors.text.secondary }}>
              {t.auth.login.noAccount}{' '}
              <Link 
                href="/auth/register" 
                className="block md:inline-block font-bold underline decoration-dotted underline-offset-4"
                style={{ color: themeColors.accent.gold }}
              >
                {t.auth.login.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}