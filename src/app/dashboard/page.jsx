'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { COLORS } from '@/config/colors';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preferences, setPreferences] = useState(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for onboarding completion message
  useEffect(() => {
    const onboardingStatus = searchParams.get('onboarding');
    if (onboardingStatus === 'complete') {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [searchParams]);

  // Check authentication and onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth/login');
        return;
      }

      if (status === 'authenticated') {
        try {
          // Check if user has completed onboarding
          const response = await fetch('/api/preferences');
          const data = await response.json();

          setPreferences(data.preferences);

          // If no preferences and not coming from onboarding page, redirect
          if (!data.preferences && !searchParams.get('onboarding')) {
            router.push('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding:', error);
        } finally {
          setIsCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [status, router, searchParams]);

  if (status === 'loading' || isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.PRIMARY_DARK }}>
        <div style={{ color: COLORS.LIGHT_BG }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.PRIMARY_DARK }}>
      <nav className="py-4 px-6" style={{ backgroundColor: COLORS.LIGHT_BG }}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
            Tourisia Dashboard
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: COLORS.ACCENT_GOLD }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#b8935a')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.ACCENT_GOLD)}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-6 p-4 rounded-lg border-2 animate-pulse" style={{
            backgroundColor: '#fef3c7',
            borderColor: COLORS.ACCENT_GOLD,
          }}>
            <p className="text-center font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
              🎉 Onboarding complete! Your personalized recommendations are ready.
            </p>
          </div>
        )}

        <div className="rounded-lg p-8" style={{ backgroundColor: COLORS.LIGHT_BG }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
            Welcome, {session?.user?.name || 'User'}! 🌴
          </h2>
          
          <div className="space-y-6">
            <div>
              <p style={{ color: COLORS.PRIMARY_DARK }}>
                <strong>Email:</strong> {session?.user?.email}
              </p>
            </div>

            {/* Preferences Summary */}
            {preferences ? (
              <div className="mt-6 p-6 rounded-lg border-2" style={{ 
                borderColor: COLORS.ACCENT_GOLD,
                backgroundColor: 'white' 
              }}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  <span>✓</span> Your Travel Profile
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Traveler Type</p>
                    <p className="capitalize" style={{ color: COLORS.PRIMARY_DARK }}>
                      {preferences.travelPreferences.travelerType}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Budget</p>
                    <p className="capitalize" style={{ color: COLORS.PRIMARY_DARK }}>
                      {preferences.travelPreferences.budgetRange}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Duration</p>
                    <p style={{ color: COLORS.PRIMARY_DARK }}>
                      {preferences.travelPreferences.travelDuration} days
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Interested Regions</p>
                    <p className="capitalize" style={{ color: COLORS.PRIMARY_DARK }}>
                      {preferences.travelPreferences.preferredRegions.join(', ').replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">Activity Level</p>
                    <p className="capitalize" style={{ color: COLORS.PRIMARY_DARK }}>
                      {preferences.travelStyle.activityIntensity}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/onboarding')}
                  className="mt-6 w-full py-3 rounded-lg font-medium border-2 transition-colors"
                  style={{
                    borderColor: COLORS.ACCENT_GOLD,
                    color: COLORS.ACCENT_GOLD,
                  }}
                >
                  Update Preferences
                </button>
              </div>
            ) : searchParams.get('onboarding') === 'skipped' ? (
              <div className="mt-6 p-6 rounded-lg border-2 border-yellow-400 bg-yellow-50">
                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  ⚠️ Complete Your Profile
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  You skipped the onboarding. Complete it now to get personalized recommendations!
                </p>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full py-3 rounded-lg font-medium text-white"
                  style={{ backgroundColor: COLORS.ACCENT_GOLD }}
                >
                  Complete Onboarding
                </button>
              </div>
            ) : null}

            {/* Coming Soon Section */}
            <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: COLORS.PRIMARY_DARK }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.LIGHT_BG }}>
                🚀 Coming Soon
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: '#d1d5db' }}>
                <li>• AI-powered destination recommendations</li>
                <li>• Personalized itinerary generation</li>
                <li>• Local experiences and activities</li>
                <li>• Interactive map with suggestions</li>
                <li>• Smart budget planner</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
