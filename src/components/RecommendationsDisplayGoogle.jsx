'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';

// Dynamically import Leaflet map to avoid server-side rendering issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  loading: () => <div className="w-full h-96 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e8dcc4' }}>Loading map...</div>,
  ssr: false,
});

export default function RecommendationsDisplayGoogle() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const { language, isLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();

  const t = translations[language];
  const themeColors = themes[theme];

  useEffect(() => {
    if (isLoaded && themeLoaded) {
      fetchRecommendations();
    }
  }, [isLoaded, themeLoaded]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      setRecommendations(data.recommendations || []);
      if (data.recommendations?.length > 0) {
        setSelectedDestination(data.recommendations[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !themeLoaded) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: themeColors.bg.primary }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: themeColors.accent.gold }}></div>
          <p className="mt-4" style={{ color: themeColors.text.primary }}>{t.recommendations.loading}</p>
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: themeColors.bg.primary }}>
        <div className="max-w-md mx-auto">
          <div className="rounded-lg p-6 text-center border" style={{ backgroundColor: themeColors.bg.secondary, borderColor: themeColors.accent.border }}>
            <p className="font-semibold mb-3" style={{ color: themeColors.accent.gold }}>{t.recommendations.noRecommendations}</p>
            <p className="text-sm mb-4" style={{ color: themeColors.text.secondary }}>
              {recommendations.length === 0
                ? t.recommendations.completeOnboarding
                : error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white rounded-lg transition"
              style={{ backgroundColor: themeColors.accent.gold }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: themeColors.bg.primary }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4 mt-14" style={{ color: themeColors.text.primary }}>
            {t.recommendations.title}
          </h1>
          <p style={{ color: themeColors.text.secondary }}>
            {t.recommendations.subtitle}
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: themeColors.bg.secondary, borderColor: themeColors.accent.border }}>
            <p style={{ color: themeColors.text.primary }}>
              {t.recommendations.completeOnboarding}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Map & Details */}
            <div className="lg:col-span-2">
              {selectedDestination && (
                <>
                  <div className="rounded-lg overflow-hidden shadow-lg mb-6">
                    <MapComponent destination={selectedDestination} destinations={recommendations} />
                  </div>

                  {/* Selected Destination Details */}
                  <div className="border rounded-lg p-6 shadow-lg" style={{ backgroundColor: themeColors.bg.primary, borderColor: themeColors.accent.border }}>
                    {selectedDestination.imageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden h-48" style={{ backgroundColor: themeColors.bg.secondary }}>
                        <img
                          src={selectedDestination.imageUrl}
                          alt={selectedDestination.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.parentElement.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <h2 className="text-3xl font-serif mb-4" style={{ color: themeColors.text.primary }}>
                      {selectedDestination.name}
                    </h2>

                    {selectedDestination.description && (
                      <p className="mb-4" style={{ color: themeColors.text.secondary }}>{selectedDestination.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {selectedDestination.relevanceScore && (
                        <div className="p-3 rounded border" style={{ backgroundColor: themeColors.bg.secondary, borderColor: themeColors.accent.border }}>
                          <div className="text-xs uppercase tracking-wide" style={{ color: themeColors.text.secondary }}>{t.recommendations.matchScore}</div>
                          <div className="text-2xl font-bold" style={{ color: themeColors.accent.gold }}>
                            {Math.round(selectedDestination.relevanceScore)}%
                          </div>
                        </div>
                      )}

                      {selectedDestination.estimatedCost && (
                        <div className="p-3 rounded border" style={{ backgroundColor: themeColors.bg.secondary, borderColor: themeColors.accent.border }}>
                          <div className="text-xs uppercase tracking-wide" style={{ color: themeColors.text.secondary }}>{t.recommendations.budget}</div>
                          <div className="text-sm font-semibold" style={{ color: themeColors.text.primary }}>
                            ${selectedDestination.estimatedCost?.minBudget}-$
                            {selectedDestination.estimatedCost?.maxBudget}
                          </div>
                        </div>
                      )}

                      {selectedDestination.crowdLevel && (
                        <div className="p-3 rounded border" style={{ backgroundColor: themeColors.bg.secondary, borderColor: themeColors.accent.border }}>
                          <div className="text-xs uppercase tracking-wide" style={{ color: themeColors.text.secondary }}>{t.recommendations.crowdLevel}</div>
                          <div className="text-sm font-semibold capitalize" style={{ color: themeColors.text.primary }}>
                            {selectedDestination.crowdLevel}
                          </div>
                        </div>
                      )}

                      {selectedDestination.activityLevel && (
                        <div className="p-3 rounded border" style={{ backgroundColor: themeColors.bg.secondary, borderColor: themeColors.accent.border }}>
                          <div className="text-xs uppercase tracking-wide" style={{ color: themeColors.text.secondary }}>{t.recommendations.activityLevel}</div>
                          <div className="text-sm font-semibold capitalize" style={{ color: themeColors.text.primary }}>
                            {selectedDestination.activityLevel}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedDestination.bestFor && selectedDestination.bestFor.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs uppercase tracking-wide mb-2" style={{ color: themeColors.text.secondary }}>{t.recommendations.bestFor}</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDestination.bestFor.map((interest) => (
                            <span
                              key={interest}
                              className="text-xs font-semibold px-3 py-1 rounded-full border"
                              style={{ backgroundColor: themeColors.bg.secondary, color: themeColors.text.primary, borderColor: themeColors.accent.border }}
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-wide mb-2" style={{ color: themeColors.text.secondary }}>{t.recommendations.highlights}</div>
                        <ul className="text-sm space-y-1" style={{ color: themeColors.text.secondary }}>
                          {selectedDestination.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2" style={{ color: themeColors.accent.gold }}>•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDestination.familyFriendly && (
                      <div className="mt-4 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border" style={{ backgroundColor: themeColors.bg.secondary, color: themeColors.accent.gold, borderColor: themeColors.accent.gold }}>
                        ✓ {t.recommendations.familyFriendly}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Recommendations List */}
            <div>
              <div className="sticky top-4">
                <h3 className="text-xl font-serif mb-4" style={{ color: themeColors.text.primary }}>{t.recommendations.allRecommendations}</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recommendations.map((destination, index) => (
                    <button
                      key={destination._id || index}
                      onClick={() => setSelectedDestination(destination)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition`}
                      style={{
                        backgroundColor: selectedDestination?._id === destination._id ? themeColors.bg.secondary : themeColors.bg.primary,
                        borderColor: selectedDestination?._id === destination._id ? themeColors.accent.gold : themeColors.accent.border,
                        color: themeColors.text.primary,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDestination?._id !== destination._id) {
                          e.currentTarget.style.borderColor = themeColors.accent.gold;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDestination?._id !== destination._id) {
                          e.currentTarget.style.borderColor = themeColors.accent.border;
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm line-clamp-2" style={{ color: themeColors.text.primary }}>
                          {destination.name}
                        </h4>
                        <span className="text-xs font-bold ml-2" style={{ color: themeColors.accent.gold }}>
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs capitalize" style={{ color: themeColors.text.secondary }}>
                          {destination.region || 'N/A'}
                        </span>
                        <span className="text-sm font-bold" style={{ color: themeColors.text.primary }}>
                          {Math.round(destination.relevanceScore || 0)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition"
            style={{ backgroundColor: themeColors.accent.gold }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {t.recommendations.backToDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}
