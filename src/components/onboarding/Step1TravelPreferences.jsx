'use client';

import { useState } from 'react';
import { COLORS } from '@/config/colors';

export default function Step1TravelPreferences({ data, updateData, onNext }) {
  const [formData, setFormData] = useState({
    travelerType: data.travelerType || '',
    budgetRange: data.budgetRange || '',
    travelDuration: data.travelDuration || '',
    travelDates: {
      startDate: data.travelDates?.startDate || '',
      endDate: data.travelDates?.endDate || '',
      flexible: data.travelDates?.flexible ?? true,
    },
    preferredRegions: data.preferredRegions || [],
  });

  const [errors, setErrors] = useState({});

  const travelerTypes = [
    { value: 'solo', label: 'Solo Traveler', icon: '🚶' },
    { value: 'couple', label: 'Couple', icon: '❤️' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Friends', icon: '👥' },
  ];

  const budgetRanges = [
    { value: 'low', label: 'Budget', desc: 'Under $50/day', icon: '💰' },
    { value: 'medium', label: 'Moderate', desc: '$50-150/day', icon: '💰💰' },
    { value: 'high', label: 'Premium', desc: '$150-300/day', icon: '💰💰💰' },
    { value: 'luxury', label: 'Luxury', desc: '$300+/day', icon: '💎' },
  ];

  const regions = [
    { value: 'north', label: 'Northern Tunisia', desc: 'Tunis, Carthage, Bizerte' },
    { value: 'south', label: 'Southern Tunisia', desc: 'Tozeur, Douz, Matmata' },
    { value: 'coast', label: 'Coastal Areas', desc: 'Sousse, Hammamet, Monastir' },
    { value: 'desert', label: 'Sahara Desert', desc: 'Dunes, oases, adventures' },
    { value: 'historical_cities', label: 'Historical Cities', desc: 'Kairouan, El Jem' },
  ];

  const handleSelectTravelerType = (value) => {
    setFormData({ ...formData, travelerType: value });
    setErrors({ ...errors, travelerType: '' });
  };

  const handleSelectBudget = (value) => {
    setFormData({ ...formData, budgetRange: value });
    setErrors({ ...errors, budgetRange: '' });
  };

  const handleRegionToggle = (value) => {
    const current = formData.preferredRegions;
    const updated = current.includes(value)
      ? current.filter(r => r !== value)
      : [...current, value];
    
    setFormData({ ...formData, preferredRegions: updated });
    setErrors({ ...errors, preferredRegions: '' });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.travelerType) {
      newErrors.travelerType = 'Please select traveler type';
    }
    if (!formData.budgetRange) {
      newErrors.budgetRange = 'Please select budget range';
    }
    if (!formData.travelDuration || formData.travelDuration < 1) {
      newErrors.travelDuration = 'Please enter valid duration (1-365 days)';
    }
    if (formData.preferredRegions.length === 0) {
      newErrors.preferredRegions = 'Please select at least one region';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateData(formData);
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
          Let's Plan Your Tunisia Adventure 🇹🇳
        </h2>
        <p className="text-gray-600 mb-6">
          Tell us about your travel plans to get personalized recommendations
        </p>
      </div>

      {/* Traveler Type */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          Who's traveling? *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {travelerTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleSelectTravelerType(type.value)}
              className="p-4 rounded-lg border-2 transition-all text-center hover:shadow-md"
              style={{
                borderColor: formData.travelerType === type.value ? COLORS.ACCENT_GOLD : '#e5e7eb',
                backgroundColor: formData.travelerType === type.value ? '#fef3c7' : 'white',
              }}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-semibold text-sm">{type.label}</div>
            </button>
          ))}
        </div>
        {errors.travelerType && (
          <p className="text-red-500 text-sm mt-1">{errors.travelerType}</p>
        )}
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          What's your budget? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgetRanges.map((budget) => (
            <button
              key={budget.value}
              type="button"
              onClick={() => handleSelectBudget(budget.value)}
              className="p-4 rounded-lg border-2 transition-all text-left hover:shadow-md"
              style={{
                borderColor: formData.budgetRange === budget.value ? COLORS.ACCENT_GOLD : '#e5e7eb',
                backgroundColor: formData.budgetRange === budget.value ? '#fef3c7' : 'white',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{budget.label}</span>
                <span className="text-xl">{budget.icon}</span>
              </div>
              <div className="text-sm text-gray-600">{budget.desc}</div>
            </button>
          ))}
        </div>
        {errors.budgetRange && (
          <p className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>
        )}
      </div>

      {/* Travel Duration */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          How many days will you travel? *
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={formData.travelDuration}
          onChange={(e) => setFormData({ ...formData, travelDuration: parseInt(e.target.value) || '' })}
          className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
          style={{
            borderColor: COLORS.ACCENT_GOLD,
            focusRing: COLORS.ACCENT_GOLD,
            color: 'black',
          }}
          placeholder="Enter number of days (e.g., 7)"
        />
        {errors.travelDuration && (
          <p className="text-red-500 text-sm mt-1">{errors.travelDuration}</p>
        )}
      </div>

      {/* Travel Dates (Optional) */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          Travel dates (optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <input
              type="date"
              value={formData.travelDates.startDate}
              onChange={(e) => setFormData({
                ...formData,
                travelDates: { ...formData.travelDates, startDate: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.ACCENT_GOLD }}
            />
          </div>
          <div>
            <input
              type="date"
              value={formData.travelDates.endDate}
              onChange={(e) => setFormData({
                ...formData,
                travelDates: { ...formData.travelDates, endDate: e.target.value }
              })}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.ACCENT_GOLD }}
            />
          </div>
        </div>
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={formData.travelDates.flexible}
            onChange={(e) => setFormData({
              ...formData,
              travelDates: { ...formData.travelDates, flexible: e.target.checked }
            })}
            className="mr-2"
          />
          My dates are flexible
        </label>
      </div>

      {/* Preferred Regions */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          Which regions interest you? * (Select all that apply)
        </label>
        <div className="space-y-3">
          {regions.map((region) => (
            <button
              key={region.value}
              type="button"
              onClick={() => handleRegionToggle(region.value)}
              className="w-full p-4 rounded-lg border-2 transition-all text-left hover:shadow-md"
              style={{
                borderColor: formData.preferredRegions.includes(region.value) 
                  ? COLORS.ACCENT_GOLD 
                  : '#e5e7eb',
                backgroundColor: formData.preferredRegions.includes(region.value) 
                  ? '#fef3c7' 
                  : 'white',
              }}
            >
              <div className="font-semibold mb-1">{region.label}</div>
              <div className="text-sm text-gray-600">{region.desc}</div>
            </button>
          ))}
        </div>
        {errors.preferredRegions && (
          <p className="text-red-500 text-sm mt-1">{errors.preferredRegions}</p>
        )}
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
        style={{ backgroundColor: COLORS.ACCENT_GOLD }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#b8935a')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.ACCENT_GOLD)}
      >
        Continue to Interests →
      </button>
    </form>
  );
}
