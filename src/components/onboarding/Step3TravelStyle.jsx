'use client';

import { useState } from 'react';
import { COLORS } from '@/config/colors';

export default function Step3TravelStyle({ data, updateData, onNext, onBack, isLoading }) {
  const [formData, setFormData] = useState({
    accommodationType: data.accommodationType || [],
    transportationPreference: data.transportationPreference || [],
    crowdTolerance: data.crowdTolerance || '',
    activityIntensity: data.activityIntensity || '',
  });

  const [errors, setErrors] = useState({});

  const accommodationTypes = [
    { value: 'hotel', label: 'Hotel', icon: '🏨', desc: 'Traditional hotels with services' },
    { value: 'resort', label: 'Resort', icon: '🏖️', desc: 'All-inclusive resorts' },
    { value: 'airbnb', label: 'Airbnb', icon: '🏠', desc: 'Apartments & homes' },
    { value: 'guesthouse', label: 'Guest House', icon: '🏡', desc: 'Family-run accommodations' },
    { value: 'hostel', label: 'Hostel', icon: '🏕️', desc: 'Budget-friendly shared spaces' },
    { value: 'camping', label: 'Camping', icon: '⛺', desc: 'Desert camps & glamping' },
  ];

  const transportationOptions = [
    { value: 'rental_car', label: 'Rental Car', icon: '🚗', desc: 'Freedom to explore' },
    { value: 'private_driver', label: 'Private Driver', icon: '🚙', desc: 'Comfortable & guided' },
    { value: 'public_transport', label: 'Public Transport', icon: '🚌', desc: 'Local experience, budget-friendly' },
    { value: 'organized_tours', label: 'Organized Tours', icon: '🚐', desc: 'Group tours with guide' },
    { value: 'taxi', label: 'Taxis', icon: '🚕', desc: 'On-demand rides' },
    { value: 'walking_cycling', label: 'Walking/Cycling', icon: '🚴', desc: 'Eco-friendly & active' },
  ];

  const crowdOptions = [
    { 
      value: 'avoid_crowds', 
      label: 'Avoid Crowds', 
      icon: '🏞️', 
      desc: 'Hidden gems and quiet spots' 
    },
    { 
      value: 'neutral', 
      label: 'Flexible', 
      icon: '🤷', 
      desc: 'Mix of popular and quiet places' 
    },
    { 
      value: 'popular_spots', 
      label: 'Popular Spots', 
      icon: '🌟', 
      desc: 'Famous attractions and hotspots' 
    },
  ];

  const intensityLevels = [
    { 
      value: 'relaxed', 
      label: 'Relaxed', 
      icon: '😌', 
      desc: 'Slow pace, lots of rest time' 
    },
    { 
      value: 'moderate', 
      label: 'Moderate', 
      icon: '🚶', 
      desc: 'Balanced mix of activity and rest' 
    },
    { 
      value: 'adventurous', 
      label: 'Adventurous', 
      icon: '🏃', 
      desc: 'Action-packed, maximize experiences' 
    },
  ];

  const handleAccommodationToggle = (value) => {
    const current = formData.accommodationType;
    const updated = current.includes(value)
      ? current.filter(t => t !== value)
      : [...current, value];
    
    setFormData({ ...formData, accommodationType: updated });
    setErrors({ ...errors, accommodationType: '' });
  };

  const handleTransportToggle = (value) => {
    const current = formData.transportationPreference;
    const updated = current.includes(value)
      ? current.filter(t => t !== value)
      : [...current, value];
    
    setFormData({ ...formData, transportationPreference: updated });
    setErrors({ ...errors, transportationPreference: '' });
  };

  const validate = () => {
    const newErrors = {};
    
    if (formData.accommodationType.length === 0) {
      newErrors.accommodationType = 'Please select at least one accommodation type';
    }
    if (formData.transportationPreference.length === 0) {
      newErrors.transportationPreference = 'Please select at least one transportation option';
    }
    if (!formData.crowdTolerance) {
      newErrors.crowdTolerance = 'Please select your crowd preference';
    }
    if (!formData.activityIntensity) {
      newErrors.activityIntensity = 'Please select your activity intensity';
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
          Your Travel Style 🎒
        </h2>
        <p className="text-gray-600 mb-6">
          Help us understand how you like to travel for the best recommendations
        </p>
      </div>

      {/* Accommodation Type */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          Preferred accommodation types * (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accommodationTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleAccommodationToggle(type.value)}
              className="p-4 rounded-lg border-2 transition-all text-left hover:shadow-md"
              style={{
                borderColor: formData.accommodationType.includes(type.value) 
                  ? COLORS.ACCENT_GOLD 
                  : '#e5e7eb',
                backgroundColor: formData.accommodationType.includes(type.value) 
                  ? '#fef3c7' 
                  : 'white',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{type.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {errors.accommodationType && (
          <p className="text-red-500 text-sm mt-1">{errors.accommodationType}</p>
        )}
      </div>

      {/* Transportation Preference */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          How do you prefer to get around? * (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {transportationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleTransportToggle(option.value)}
              className="p-4 rounded-lg border-2 transition-all text-left hover:shadow-md"
              style={{
                borderColor: formData.transportationPreference.includes(option.value) 
                  ? COLORS.ACCENT_GOLD 
                  : '#e5e7eb',
                backgroundColor: formData.transportationPreference.includes(option.value) 
                  ? '#fef3c7' 
                  : 'white',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {errors.transportationPreference && (
          <p className="text-red-500 text-sm mt-1">{errors.transportationPreference}</p>
        )}
      </div>

      {/* Crowd Tolerance */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          What about crowds? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {crowdOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setFormData({ ...formData, crowdTolerance: option.value });
                setErrors({ ...errors, crowdTolerance: '' });
              }}
              className="p-4 rounded-lg border-2 transition-all text-center hover:shadow-md"
              style={{
                borderColor: formData.crowdTolerance === option.value 
                  ? COLORS.ACCENT_GOLD 
                  : '#e5e7eb',
                backgroundColor: formData.crowdTolerance === option.value 
                  ? '#fef3c7' 
                  : 'white',
              }}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-semibold mb-1">{option.label}</div>
              <div className="text-sm text-gray-600">{option.desc}</div>
            </button>
          ))}
        </div>
        {errors.crowdTolerance && (
          <p className="text-red-500 text-sm mt-1">{errors.crowdTolerance}</p>
        )}
      </div>

      {/* Activity Intensity */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
          What's your preferred activity level? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {intensityLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => {
                setFormData({ ...formData, activityIntensity: level.value });
                setErrors({ ...errors, activityIntensity: '' });
              }}
              className="p-4 rounded-lg border-2 transition-all text-center hover:shadow-md"
              style={{
                borderColor: formData.activityIntensity === level.value 
                  ? COLORS.ACCENT_GOLD 
                  : '#e5e7eb',
                backgroundColor: formData.activityIntensity === level.value 
                  ? '#fef3c7' 
                  : 'white',
              }}
            >
              <div className="text-3xl mb-2">{level.icon}</div>
              <div className="font-semibold mb-1">{level.label}</div>
              <div className="text-sm text-gray-600">{level.desc}</div>
            </button>
          ))}
        </div>
        {errors.activityIntensity && (
          <p className="text-red-500 text-sm mt-1">{errors.activityIntensity}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-4 rounded-lg font-semibold border-2 transition-all disabled:opacity-50"
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
          disabled={isLoading}
          className="flex-1 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
          style={{ backgroundColor: COLORS.ACCENT_GOLD }}
          onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#b8935a')}
          onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = COLORS.ACCENT_GOLD)}
        >
          {isLoading ? 'Saving...' : 'Complete Setup ✓'}
        </button>
      </div>
    </form>
  );
}
