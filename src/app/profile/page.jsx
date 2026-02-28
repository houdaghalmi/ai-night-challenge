'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';
import { User, Mail, Phone, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, isLoaded: langLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();

  const t = translations[language];
  const themeColors = themes[theme];

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Load user data
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
      });
    }
  }, [session]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (!langLoaded || !themeLoaded || status === 'loading') {
    return null;
  }

  if (!session) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t.profile.success });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: t.profile.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t.profile.error });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: session.user.name || '',
      email: session.user.email || '',
      phone: session.user.phone || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <div style={{ backgroundColor: themeColors.bg.primary, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        className="pt-24 pb-12 px-6"
        style={{ backgroundColor: themeColors.bg.primary }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
            style={{ color: themeColors.text.primary }}
          >
            {t.profile.title}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t.profile.subtitle}
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Success/Error Message */}
          {message.text && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3 border"
              style={{
                backgroundColor: message.type === 'success'
                  ? theme === 'light' ? '#f0fdf4' : '#064e3b'
                  : theme === 'light' ? '#fef2f2' : '#7f1d1d',
                color: message.type === 'success'
                  ? theme === 'light' ? '#15803d' : '#86efac'
                  : theme === 'light' ? '#dc2626' : '#fca5a5',
                borderColor: message.type === 'success'
                  ? theme === 'light' ? '#bbf7d0' : '#10b981'
                  : theme === 'light' ? '#fecaca' : '#f87171',
              }}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          )}

          {/* Profile Card */}
          <div
            className="rounded-2xl shadow-lg p-8 border"
            style={{
              backgroundColor: themeColors.bg.card,
              borderColor: themeColors.accent.border,
            }}
          >
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottomColor: themeColors.accent.border, borderBottomWidth: 1 }}>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: themeColors.accent.gold }}
              >
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-semibold" style={{ color: themeColors.text.primary }}>
                  {session.user?.name}
                </h2>
                <p style={{ color: themeColors.text.secondary }}>
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: themeColors.text.primary }}
                >
                  {t.profile.fullName}
                </label>
                <div className="flex items-center gap-3">
                  <User size={20} style={{ color: themeColors.accent.gold }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex-1 px-4 py-3 rounded-lg border-2 outline-none transition-colors"
                    style={{
                      backgroundColor: isEditing ? themeColors.bg.primary : themeColors.bg.secondary,
                      color: themeColors.text.primary,
                      borderColor: isEditing ? themeColors.accent.gold : themeColors.accent.border,
                      cursor: isEditing ? 'text' : 'default',
                    }}
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: themeColors.text.primary }}
                >
                  {t.profile.email}
                </label>
                <div className="flex items-center gap-3">
                  <Mail size={20} style={{ color: themeColors.accent.gold }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="flex-1 px-4 py-3 rounded-lg border-2 outline-none"
                    style={{
                      backgroundColor: themeColors.bg.secondary,
                      color: themeColors.text.secondary,
                      borderColor: themeColors.accent.border,
                      cursor: 'not-allowed',
                      opacity: 0.7,
                    }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: themeColors.text.light }}>
                  (Read-only)
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: themeColors.text.primary }}
                >
                  {t.profile.phoneNumber}{' '}
                  <span style={{ color: themeColors.text.secondary }}>
                    {t.profile.phoneOptional}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <Phone size={20} style={{ color: themeColors.accent.gold }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="xx xxx xxx"
                    className="flex-1 px-4 py-3 rounded-lg border-2 outline-none transition-colors"
                    style={{
                      backgroundColor: isEditing ? themeColors.bg.primary : themeColors.bg.secondary,
                      color: themeColors.text.primary,
                      borderColor: isEditing ? themeColors.accent.gold : themeColors.accent.border,
                      cursor: isEditing ? 'text' : 'default',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: themeColors.accent.gold }}
                  >
                    {loading ? 'Saving...' : t.profile.save}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-colors"
                    style={{
                      color: themeColors.text.primary,
                      borderColor: themeColors.accent.gold,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {t.profile.cancel}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: themeColors.accent.gold }}
                  >
                    {language === 'ar' ? 'تعديل الملف' : language === 'fr' ? 'Modifier' : 'Edit Profile'}
                  </button>
                  <Link
                    href="/onboarding"
                    className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-colors flex items-center justify-center gap-2 text-center"
                    style={{
                      color: themeColors.accent.gold,
                      borderColor: themeColors.accent.gold,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {t.profile.updatePreferences}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
