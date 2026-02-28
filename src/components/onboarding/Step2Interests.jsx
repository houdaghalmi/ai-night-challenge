'use client';

import { useState } from 'react';
import { COLORS } from '@/config/colors';

export default function Step2Interests({ data, updateData, onNext, onBack }) {
  const [formData, setFormData] = useState({
    beach: data.beach || 0,
    cultureHistory: data.cultureHistory || 0,
    desertAdventure: data.desertAdventure || 0,
    foodGastronomy: data.foodGastronomy || 0,
    nightlife: data.nightlife || 0,
    natureMountains: data.natureMountains || 0,
    shopping: data.shopping || 0,
    relaxationSpa: data.relaxationSpa || 0,
  });

  const [errors, setErrors] = useState({});

  const interests = [
    { key: 'beach', label: 'Beach & Water Sports', icon: '🏖️', desc: 'Swimming, diving, beach relaxation' },
    { key: 'cultureHistory', label: 'Culture & History', icon: '🏛️', desc: 'Museums, ruins, heritage sites' },
    { key: 'desertAdventure', label: 'Desert & Adventure', icon: '🐪', desc: 'Sahara, dunes, off-road experiences' },
    { key: 'foodGastronomy', label: 'Food & Gastronomy', icon: '🍽️', desc: 'Local cuisine, cooking classes' },
    { key: 'nightlife', label: 'Nightlife', icon: '🎉', desc: 'Bars, clubs, entertainment' },
    { key: 'natureMountains', label: 'Nature & Mountains', icon: '⛰️', desc: 'Hiking, wildlife, natural parks' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️', desc: 'Souks, markets, local crafts' },
    { key: 'relaxationSpa', label: 'Relaxation & Spa', icon: '💆', desc: 'Wellness, hammams, thalassotherapy' },
  ];

  const handleRatingChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, general: '' });
  };

  const validate = () => {
    const selectedInterests = Object.values(formData).filter(v => v > 0).length;
    
    if (selectedInterests === 0) {
      setErrors({ general: 'Please select at least one interest by rating it' });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateData(formData);
      onNext();
    }
  };

  const RatingStars = ({ value, onChange }) => {
    return (
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl transition-transform hover:scale-110 focus:outline-none"
            style={{
              color: star <= value ? COLORS.ACCENT_GOLD : '#d1d5db',
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
          What Interests You Most? ✨
        </h2>
        <p className="text-gray-600 mb-6">
          Rate your interests from 1 to 5 stars (1 = not interested, 5 = very interested)
        </p>
      </div>

      {errors.general && (
        <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
          <p className="text-red-600 text-sm font-medium">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
        {interests.map((interest) => (
          <div
            key={interest.key}
            className="p-5 rounded-lg border-2 transition-all"
            style={{
              borderColor: formData[interest.key] > 0 ? COLORS.ACCENT_GOLD : '#e5e7eb',
              backgroundColor: formData[interest.key] > 0 ? '#fef3c7' : 'white',
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{interest.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1" style={{ color: COLORS.PRIMARY_DARK }}>
                  {interest.label}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{interest.desc}</p>
                <div className="flex items-center gap-4">
                  <RatingStars
                    value={formData[interest.key]}
                    onChange={(value) => handleRatingChange(interest.key, value)}
                  />
                  {formData[interest.key] > 0 && (
                    <span className="text-sm font-medium" style={{ color: COLORS.ACCENT_GOLD }}>
                      {formData[interest.key] === 1 && 'Not interested'}
                      {formData[interest.key] === 2 && 'Slightly interested'}
                      {formData[interest.key] === 3 && 'Interested'}
                      {formData[interest.key] === 4 && 'Very interested'}
                      {formData[interest.key] === 5 && 'Extremely interested'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interest Summary */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="text-sm text-gray-600">
          <strong>Selected interests:</strong>{' '}
          {Object.values(formData).filter(v => v > 0).length} out of {interests.length}
        </div>
        {Object.entries(formData).filter(([_, v]) => v >= 4).length > 0 && (
          <div className="text-sm mt-2" style={{ color: COLORS.ACCENT_GOLD }}>
            <strong>Top priorities:</strong>{' '}
            {interests
              .filter(i => formData[i.key] >= 4)
              .map(i => i.label)
              .join(', ')}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-lg font-semibold border-2 transition-all"
          style={{
            borderColor: COLORS.ACCENT_GOLD,
            color: COLORS.ACCENT_GOLD,
            backgroundColor: 'white',
          }}
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: COLORS.ACCENT_GOLD }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#b8935a')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.ACCENT_GOLD)}
        >
          Continue to Travel Style →
        </button>
      </div>
    </form>
  );
}
