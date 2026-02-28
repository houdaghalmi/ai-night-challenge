'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RecommendationsDisplayGoogle() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Start with curated database, only use Google if API key exists
  const [useGoogleAPI, setUseGoogleAPI] = useState(
    !!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  );

  useEffect(() => {
    setLoading(true);
    fetchRecommendations();
  }, [useGoogleAPI]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const endpoint = useGoogleAPI
        ? '/api/recommendations-google'
        : '/api/recommendations';

      const response = await fetch(endpoint);
      const data = await response.json();

      // If Google API fails or is not configured, fallback to curated
      if (!response.ok) {
        if (useGoogleAPI) {
          console.log('Google API error, falling back to curated database');
          setUseGoogleAPI(false);
          return;
        }
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      // If Google API returns empty results, fallback to curated
      if (useGoogleAPI && data.recommendations?.length === 0) {
        console.log('Google API returned no results, falling back to curated database');
        setUseGoogleAPI(false);
        return;
      }

      setRecommendations(data.recommendations || []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#c7a667]"></div>
          <p className="mt-4 text-[#5d4037]">Finding your perfect destinations...</p>
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
            <p className="text-blue-600 font-semibold mb-2">
              💡 Using Curated Database
            </p>
            <p className="text-blue-700 text-sm">
              To enable Google Places (Real-time), add API keys to `.env.local` and restart the server.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-amber-600 font-semibold mb-3">No recommendations found</p>
            <p className="text-amber-700 text-sm mb-4">
              {recommendations.length === 0
                ? 'Please seed the destination database first'
                : error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#c7a667] text-white rounded-lg hover:bg-[#b39557] transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#5d4037] mb-4">
            Your Personalized Recommendations
          </h1>
          <p className="text-gray-600 mb-4">
            Discover Tunisia destinations perfectly matched to your preferences
          </p>
          <div className="flex justify-center gap-4">
            {process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY &&
              process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY !== 'your_google_places_api_key_here' &&
              process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY.length > 10 && (
                <button
                  onClick={() => setUseGoogleAPI(true)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    useGoogleAPI
                      ? 'bg-[#c7a667] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Google Places (Real-time)
                </button>
              )}
            <button
              onClick={() => setUseGoogleAPI(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !useGoogleAPI
                  ? 'bg-[#c7a667] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Curated Database
            </button>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-[#fffdf5] border border-[#e8dcc4] rounded-lg p-8 text-center">
            <p className="text-[#5d4037]">
              Complete your onboarding to receive personalized recommendations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((destination, index) => (
              <div
                key={destination.place_id || destination._id || index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                  {/* Rank & Score */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center bg-[#fffdf5] rounded-lg p-4">
                    <div className="text-4xl font-bold text-[#c7a667]">
                      #{index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-2xl font-semibold text-[#5d4037]">
                        {Math.round(destination.relevanceScore || 0)}
                      </div>
                      <div className="text-xs text-gray-600">Match Score</div>
                    </div>
                  </div>

                  {/* Destination Info */}
                  <div className="md:col-span-3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-serif text-[#5d4037] mb-2">
                        {destination.name}
                      </h2>

                      {/* Photo if available */}
                      {destination.photos && destination.photos.length > 0 && (
                        <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-100">
                          <img
                            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${destination.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {/* Rating */}
                        {destination.rating && (
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              Rating
                            </div>
                            <div className="text-sm font-semibold text-[#5d4037]">
                              ⭐ {destination.rating}
                              {destination.user_ratings_total && (
                                <span className="text-xs text-gray-600">
                                  {' '}
                                  ({destination.user_ratings_total})
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Address */}
                        {destination.vicinity ? (
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              Location
                            </div>
                            <div className="text-xs font-semibold text-[#5d4037] line-clamp-2">
                              {destination.vicinity}
                            </div>
                          </div>
                        ) : destination.estimatedCost ? (
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              Budget
                            </div>
                            <div className="text-sm font-semibold text-[#5d4037]">
                              ${destination.estimatedCost?.minBudget}-$
                              {destination.estimatedCost?.maxBudget}
                            </div>
                          </div>
                        ) : null}

                        {/* Open Status */}
                        {destination.opening_hours && (
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="text-xs text-gray-600 uppercase tracking-wide">
                              Status
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                destination.opening_hours.open_now
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {destination.opening_hours.open_now
                                ? '✓ Open Now'
                                : '✗ Closed'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Best For (if available) */}
                      {destination.bestFor && (
                        <div className="mb-4">
                          <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                            Best For
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {destination.bestFor.map((interest) => (
                              <span
                                key={interest}
                                className="bg-[#fffdf5] text-[#5d4037] text-xs font-semibold px-3 py-1 rounded-full border border-[#e8dcc4]"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Highlights */}
                      {destination.highlights && (
                        <div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                            Highlights
                          </div>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {destination.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-[#c7a667] mr-2">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Family Friendly Badge */}
                    {destination.familyFriendly && (
                      <div className="mt-4 inline-flex items-center bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200 w-fit">
                        ✓ Family Friendly
                      </div>
                    )}

                    {/* Google Maps Link */}
                    {destination.place_id && (
                      <div className="mt-4">
                        <a
                          href={`https://www.google.com/maps/place/?q=place_id:${destination.place_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-[#c7a667] text-white font-semibold rounded-lg hover:bg-[#b39557] transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
