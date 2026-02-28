'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet map to avoid server-side rendering issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  loading: () => <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>,
  ssr: false,
});

export default function RecommendationsDisplayGoogle() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

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
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-amber-600 font-semibold mb-3">No recommendations found</p>
            <p className="text-amber-700 text-sm mb-4">
              {recommendations.length === 0
                ? 'Please complete your onboarding first to receive recommendations'
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#5d4037] mb-4">
            Your Personalized Recommendations
          </h1>
          <p className="text-gray-600">
            Discover Tunisia destinations perfectly matched to your preferences
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-[#fffdf5] border border-[#e8dcc4] rounded-lg p-8 text-center">
            <p className="text-[#5d4037]">
              Complete your onboarding to receive personalized recommendations.
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
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                    <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-100">
                      {selectedDestination.imageUrl ? (
                        <img
                          src={selectedDestination.imageUrl}
                          alt={selectedDestination.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image available
                        </div>
                      )}
                    </div>

                    <h2 className="text-3xl font-serif text-[#5d4037] mb-4">
                      {selectedDestination.name}
                    </h2>

                    {selectedDestination.description && (
                      <p className="text-gray-700 mb-4">{selectedDestination.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {selectedDestination.relevanceScore && (
                        <div className="bg-gradient-to-br from-[#fffdf5] to-[#f5ede0] p-3 rounded border border-[#e8dcc4]">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Match Score</div>
                          <div className="text-2xl font-bold text-[#c7a667]">
                            {Math.round(selectedDestination.relevanceScore)}%
                          </div>
                        </div>
                      )}

                      {selectedDestination.estimatedCost && (
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Budget</div>
                          <div className="text-sm font-semibold text-[#5d4037]">
                            ${selectedDestination.estimatedCost?.minBudget}-$
                            {selectedDestination.estimatedCost?.maxBudget}
                          </div>
                        </div>
                      )}

                      {selectedDestination.crowdLevel && (
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Crowd Level</div>
                          <div className="text-sm font-semibold text-[#5d4037] capitalize">
                            {selectedDestination.crowdLevel}
                          </div>
                        </div>
                      )}

                      {selectedDestination.activityLevel && (
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Activity Level</div>
                          <div className="text-sm font-semibold text-[#5d4037] capitalize">
                            {selectedDestination.activityLevel}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedDestination.bestFor && selectedDestination.bestFor.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">Best For</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDestination.bestFor.map((interest) => (
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

                    {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">Highlights</div>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {selectedDestination.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-[#c7a667] mr-2">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDestination.familyFriendly && (
                      <div className="mt-4 inline-flex items-center bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                        ✓ Family Friendly
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Recommendations List */}
            <div>
              <div className="sticky top-4">
                <h3 className="text-xl font-serif text-[#5d4037] mb-4">All Recommendations</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recommendations.map((destination, index) => (
                    <button
                      key={destination._id || index}
                      onClick={() => setSelectedDestination(destination)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedDestination?._id === destination._id
                          ? 'bg-[#fffdf5] border-[#c7a667]'
                          : 'bg-white border-gray-200 hover:border-[#c7a667]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-[#5d4037] text-sm line-clamp-2">
                          {destination.name}
                        </h4>
                        <span className="text-xs font-bold text-[#c7a667] ml-2">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 capitalize">
                          {destination.region || 'N/A'}
                        </span>
                        <span className="text-sm font-bold text-[#5d4037]">
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
            className="inline-block px-8 py-3 bg-[#c7a667] text-white font-semibold rounded-lg hover:bg-[#b39557] transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
