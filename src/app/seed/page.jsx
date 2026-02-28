'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const seedDestinations = async () => {
    setLoading(true);
    setMessage('Seeding destinations...');
    try {
      const response = await fetch('/api/quickstart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMessage(JSON.stringify(data, null, 2));
      setStatus(response.ok ? 'success' : 'error');
    } catch (err) {
      setMessage('Error: ' + err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif text-[#5d4037] mb-8">Seed Database</h1>

        <button
          onClick={seedDestinations}
          disabled={loading}
          className="px-8 py-3 bg-[#c7a667] text-white font-semibold rounded-lg hover:bg-[#b39557] transition disabled:opacity-50"
        >
          {loading ? 'Seeding...' : 'Seed Destinations'}
        </button>

        {message && (
          <div
            className={`mt-8 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap break-words ${
              status === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            After seeding, visit <a href="/recommendations" className="font-semibold underline">/recommendations</a>
          </p>
        </div>
      </div>
    </div>
  );
}
