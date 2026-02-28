'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';

export default function PlaceCard({ place }) {
  const { language, isLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();
  const t = translations[language];
  const themeColors = themes[theme];

  if (!isLoaded || !themeLoaded) return null;

  // Get translated place data if available
  const translatedPlace = t.places[place.key] || place;
  const displayPlace = {
    ...place,
    name: translatedPlace.name || place.name,
    location: translatedPlace.location || place.location,
    category: translatedPlace.category || place.category,
    description: translatedPlace.description || place.description,
  };

  return (
    <Link href={`/destinations/${place.id}`}>
      <div
        className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow h-80 relative group cursor-pointer"
        style={{ backgroundColor: themeColors.bg.card }}
      >
        {/* Image Background */}
        <div className="relative h-full w-full">
          {displayPlace.image ? (
            <img
              src={displayPlace.image}
              alt={displayPlace.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: themeColors.bg.secondary }}>
              <span style={{ color: themeColors.text.light }}>No image</span>
            </div>
          )}

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          {/* Category Badge */}
          {displayPlace.category && (
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: themeColors.accent.gold }}
            >
              {displayPlace.category}
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold bg-black/60 backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {displayPlace.rating}
          </div>

          {/* Content at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="text-xl font-semibold mb-1 line-clamp-2">{displayPlace.name}</h3>

            <div className="flex items-center gap-1 text-sm mb-3 text-gray-200">
              <MapPin className="w-4 h-4" />
              {displayPlace.location}
            </div>

            {displayPlace.description && (
              <p className="text-sm text-gray-200 mb-4 line-clamp-2">{displayPlace.description}</p>
            )}

            {displayPlace.price !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {language === 'ar' ? 'ابتداءً من' : language === 'fr' ? 'À partir de' : 'Starting from'}
                </span>
                <span className="font-bold text-lg" style={{ color: themeColors.accent.gold }}>
                  {displayPlace.price === 0 ? (language === 'ar' ? 'مجاني' : language === 'fr' ? 'Gratuit' : 'Free') : `$${displayPlace.price}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
