'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug-setup')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setStatus({ error: err.message });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">System Status Check</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#5d4037]">System Status Check</h1>
        
        <div className="space-y-6">
          {/* Database Status */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">📦 Database Status</h2>
            <div className="space-y-2">
              <p><strong>Destinations Count:</strong> {status?.databases?.destinationsCount || 0}</p>
              <p><strong>Destinations Seeded:</strong> {status?.databases?.destinationsSeeded ? '✅ Yes' : '❌ No'}</p>
              {status?.message && <p className="text-sm text-gray-600">{status.message}</p>}
            </div>
          </div>

          {/* User Status */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">👤 User Status</h2>
            <div className="space-y-2">
              <p><strong>Logged In:</strong> {status?.user?.id !== 'not-logged-in' ? '✅ Yes' : '❌ No'}</p>
              <p><strong>User ID:</strong> {status?.user?.id || 'Not logged in'}</p>
              <p><strong>Has Preferences:</strong> {status?.user?.hasPreferences ? '✅ Yes' : '❌ No (Complete onboarding)'}</p>
              
              {status?.user?.preferences && (
                <div className="mt-4 bg-white p-4 rounded border border-gray-300">
                  <h3 className="font-semibold mb-2">Your Preferences:</h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(status.user.preferences, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4">🔧 Quick Actions</h2>
            <div className="space-y-3">
              {!status?.databases?.destinationsSeeded && (
                <div>
                  <p className="text-sm mb-2">⚠️ Database needs seeding</p>
                  <button
                    onClick={() => {
                      fetch('/api/debug-setup', { method: 'POST' })
                        .then(() => window.location.reload());
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Seed Database Now
                  </button>
                </div>
              )}
              
              {status?.user?.id === 'not-logged-in' && (
                <div>
                  <p className="text-sm mb-2">⚠️ You need to log in first</p>
                  <Link href="/auth/login" className="inline-block px-4 py-2 bg-[#c7a667] text-white rounded hover:bg-[#b39557]">
                    Go to Login
                  </Link>
                </div>
              )}
              
              {status?.user?.id !== 'not-logged-in' && !status?.user?.hasPreferences && (
                <div>
                  <p className="text-sm mb-2">⚠️ You need to complete onboarding</p>
                  <Link href="/onboarding" className="inline-block px-4 py-2 bg-[#c7a667] text-white rounded hover:bg-[#b39557]">
                    Complete Onboarding
                  </Link>
                </div>
              )}
              
              {status?.databases?.destinationsSeeded && status?.user?.hasPreferences && (
                <div>
                  <p className="text-sm mb-2 text-green-600">✅ Everything is ready!</p>
                  <Link href="/recommendations" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    View My Recommendations
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {status?.error && (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h2 className="text-xl font-semibold mb-2 text-red-600">❌ Error</h2>
              <p className="text-red-700">{status.error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
