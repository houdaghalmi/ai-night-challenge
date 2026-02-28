'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';

export default function RegisterPage() {
  const router = useRouter();
  const { language, isLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();
  const t = translations[language];
  const themeColors = themes[theme];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoaded || !themeLoaded || !t) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.register.passwordMismatch);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.auth.register.passwordShort);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || t.auth.register.registerFailed);
        return;
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/onboarding');
      } else {
        setError(signInResult?.error || t.auth.register.registerFailed);
      }
    } catch (err) {
      setError(t.auth.register.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-12 relative overflow-hidden pt-24"
      style={{ backgroundColor: themeColors.bg.primary }}
    >
    

      {/* Carte d'Invitation / Inscription */}
      <div
        className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 mt-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[1px] overflow-hidden"
        style={{ backgroundColor: themeColors.bg.card, borderColor: themeColors.accent.border }}
      >
        
        {/* Section Image : Identique au Login pour la cohérence */}
        <div className="relative hidden md:block group">
          <img
            src="/assests/robot.png"
            alt="Exploration Tunisie"
            className="h-full w-full object-cover grayscale-[10%] transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to left, ${themeColors.bg.card}, ${themeColors.bg.card}cc, transparent)`
            }}
          />
          
  
        </div>

        {/* Section Formulaire */}
        <div className="relative p-10 md:p-16 flex flex-col justify-center">
          {/* Ornements de coins */}
          <div
            className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl"
            style={{ borderColor: themeColors.accent.gold }}
          />
          <div
            className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 rounded-br-xl"
            style={{ borderColor: themeColors.accent.gold }}
          />

          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif mb-2" style={{ color: themeColors.text.primary }}>
              {t.auth.register.title}
            </h1>
            <div
              className="h-[2px] w-20 bg-gradient-to-r from-transparent via-transparent to-transparent mx-auto mb-3"
              style={{ backgroundImage: `linear-gradient(to right, transparent, ${themeColors.accent.gold}, transparent)` }}
            />
            <p className="font-serif italic" style={{ color: themeColors.text.secondary }}>
              {t.auth.register.subtitle}
            </p>
          </div>

          {error && (
            <div
              className="mb-6 flex items-center gap-3 rounded-xl p-4 text-sm border"
              style={{
                backgroundColor: theme === 'light' ? '#fee' : '#330000',
                color: theme === 'light' ? '#c33' : '#faa',
                borderColor: theme === 'light' ? '#fcc' : '#663',
              }}
            >
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom Complet */}
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
                {t.auth.register.name}
              </label>
              <div className="flex items-center">
                <User size={18} style={{ color: themeColors.accent.gold }} className="mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-transparent py-2 outline-none placeholder:opacity-40 font-medium"
                  style={{ color: themeColors.text.primary, caretColor: themeColors.accent.gold }}
                />
              </div>
            </div>

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
                {t.auth.register.email}
              </label>
              <div className="flex items-center">
                <Mail size={18} style={{ color: themeColors.accent.gold }} className="mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-transparent py-2 outline-none placeholder:opacity-40 font-medium"
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
                {t.auth.register.password}
              </label>
              <div className="flex items-center">
                <Lock size={18} style={{ color: themeColors.accent.gold }} className="mr-3" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 outline-none placeholder:opacity-40"
                  style={{ color: themeColors.text.primary, caretColor: themeColors.accent.gold }}
                />
              </div>
            </div>

            {/* Confirmation Mot de passe */}
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
                {t.auth.register.confirmPassword}
              </label>
              <div className="flex items-center">
                <ShieldCheck size={18} style={{ color: themeColors.accent.gold }} className="mr-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 outline-none placeholder:opacity-40"
                  style={{ color: themeColors.text.primary, caretColor: themeColors.accent.gold }}
                />
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative text-white py-4 rounded-full font-serif text-lg tracking-widest transition-all duration-300 mt-4 overflow-hidden"
              style={{
                backgroundColor: themeColors.accent.gold,
                boxShadow: `0 10px 20px ${themeColors.accent.gold}50`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 15px 30px ${themeColors.accent.gold}70`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 10px 20px ${themeColors.accent.gold}50`)}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : t.auth.register.signUp}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-serif text-sm" style={{ color: themeColors.text.secondary }}>
              {t.auth.register.haveAccount}{' '}
              <Link 
                href="/auth/login" 
                className="font-bold underline decoration-dotted"
                style={{ color: themeColors.accent.gold }}
              >
                {t.auth.register.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}