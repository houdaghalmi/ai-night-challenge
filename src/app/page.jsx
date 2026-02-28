'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlaceCard from '@/components/PlaceCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';
import { useSession } from 'next-auth/react';

const trendingPlacesBase = [
  {
    id: 1,
    key: 'djerba',
    rating: 4.9,
    price: 120,
    image: '/assests/destinations/djerba.png',
  },
  {
    id: 2,
    key: 'sahara',
    rating: 5.0,
    price: 150,
    image: '/assests/destinations/sahara.png',
  },
  {
    id: 3,
    key: 'elJem',
    rating: 4.8,
    price: 35,
    image: '/assests/destinations/el_jem.png',
  },
  {
    id: 4,
    key: 'carthage',
    rating: 4.7,
    price: 25,
    image: '/assests/destinations/carthage.png',
  },
  {
    id: 5,
    key: 'sidiBouSaid',
    rating: 4.8,
    price: 0,
    image: '/assests/destinations/sidi_bou_said.png',
  },
  {
    id: 6,
    key: 'medina',
    rating: 4.6,
    price: 0,
    image: '/assests/destinations/medina.jpg',
  },
];

export default function Home() {
  const { data: session } = useSession();
  const { language, isLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();
  const [trendingPlaces, setTrendingPlaces] = useState([]);

  const t = translations[language];
  const themeColors = themes[theme];

  useEffect(() => {
    if (!isLoaded) return;

    // Build places with translations
    const places = trendingPlacesBase.map((place) => {
      const translated = t.places[place.key];
      return {
        ...place,
        name: translated.name,
        location: translated.location,
        category: translated.category,
        description: translated.description,
      };
    });
    setTrendingPlaces(places);
  }, [language, isLoaded, t]);

  if (!isLoaded || !themeLoaded) {
    return null;
  }

  return (
    <main style={{ backgroundColor: themeColors.bg.primary }}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6" style={{ backgroundColor: themeColors.bg.primary }}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6" style={{ color: themeColors.text.primary }}>
            {t.home.hero.title.split(t.home.hero.titleHighlight)[0]}
            <span style={{ color: themeColors.accent.gold }}>{t.home.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t.home.hero.description}
          </p>

          {session ? (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/recommendations"
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: themeColors.accent.gold, color: themeColors.text.inverse }}
              >
                {t.home.hero.getRecommendations}
              </Link>
              <Link
                href="/onboarding"
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors border-2"
                style={{ color: themeColors.accent.gold, borderColor: themeColors.accent.gold }}
              >
                {t.home.hero.updatePreferences}
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/auth/login"
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: themeColors.accent.gold, color: themeColors.text.inverse }}
              >
                {t.home.hero.getStarted}
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors border-2 hover:opacity-90"
                style={{ color: themeColors.accent.gold, borderColor: themeColors.accent.gold }}
              >
                {t.home.hero.createAccount}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t.home.trending.title.split(t.home.trending.titleHighlight)[0]}
            <span style={{ color: themeColors.accent.gold }}>{t.home.trending.titleHighlight}</span>
          </h2>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t.home.trending.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColors.accent.gold, color: themeColors.text.inverse }}
          >
            {t.home.trending.exploreAll}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6" style={{ color: themeColors.text.primary }}>
          {t.home.cta.title.split(t.home.cta.titleHighlight)[0]}
          <span style={{ color: themeColors.accent.gold }}>{t.home.cta.titleHighlight}</span>
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: themeColors.text.secondary }}>
          {t.home.cta.description}
        </p>
        {!session && (
          <Link
            href="/auth/register"
            className="inline-block px-10 py-4 rounded-lg font-semibold text-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColors.accent.gold, color: themeColors.text.inverse }}
          >
            {t.home.cta.button}
          </Link>
        )}
      </section>
    </main>
  );
}
