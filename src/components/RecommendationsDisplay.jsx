'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RecommendationsDisplay() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-600 font-semibold">Unable to load recommendations</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-4 px-4 py-2 bg-[#c7a667] text-white rounded-lg hover:bg-[#b39557] transition"
          >
            Try Again
          </button>
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
          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((destination, index) => (
              <div
                key={destination._id}
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
                        {destination.relevanceScore}
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
                      <p className="text-gray-600 mb-4">
                        {destination.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {/* Travel Time */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">
                            Distance
                          </div>
                          <div className="text-sm font-semibold text-[#5d4037]">
                            {destination.travelTime?.fromTunis || 'N/A'}
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">
                            Budget
                          </div>
                          <div className="text-sm font-semibold text-[#5d4037]">
                            ${destination.estimatedCost?.minBudget}-$
                            {destination.estimatedCost?.maxBudget}
                          </div>
                        </div>

                        {/* Activity Level */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">
                            Activity
                          </div>
                          <div className="text-sm font-semibold text-[#5d4037] capitalize">
                            {destination.activityLevel}
                          </div>
                        </div>

                        {/* Crowd Level */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">
                            Crowds
                          </div>
                          <div className="text-sm font-semibold text-[#5d4037] capitalize">
                            {destination.crowdLevel}
                          </div>
                        </div>
                      </div>

                      {/* Best For */}
                      <div className="mb-4">
                        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                          Best For
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {destination.bestFor?.map((interest) => (
                            <span
                              key={interest}
                              className="bg-[#fffdf5] text-[#5d4037] text-xs font-semibold px-3 py-1 rounded-full border border-[#e8dcc4]"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

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
