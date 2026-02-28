'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/config/colors';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    travelerType: '',
    budgetRange: '',
    travelDuration: '',
    preferredRegions: [],
    beach: 0,
    cultureHistory: 0,
    desertAdventure: 0,
    foodGastronomy: 0,
    nightlife: 0,
    natureMountains: 0,
    shopping: 0,
    relaxationSpa: 0,
    accommodationType: [],
    transportationPreference: [],
    crowdTolerance: '',
    activityIntensity: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.travelerType) newErrors.travelerType = 'Please select an option';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    if (currentStep === 2) {
      if (!formData.budgetRange) newErrors.budgetRange = 'Please select an option';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    if (currentStep === 3) {
      const duration = parseInt(formData.travelDuration, 10);
      if (!formData.travelDuration || isNaN(duration) || duration < 1 || duration > 365) 
        newErrors.travelDuration = 'Please enter days (1-365)';
      if (formData.preferredRegions.length === 0) 
        newErrors.preferredRegions = 'Select at least one region';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    if (currentStep === 4) {
      const selectedInterests = Object.values({
        beach: formData.beach,
        cultureHistory: formData.cultureHistory,
        desertAdventure: formData.desertAdventure,
        foodGastronomy: formData.foodGastronomy,
        nightlife: formData.nightlife,
        natureMountains: formData.natureMountains,
        shopping: formData.shopping,
        relaxationSpa: formData.relaxationSpa,
      }).filter(v => v > 0).length;
      
      if (selectedInterests === 0) newErrors.interests = 'Rate at least one interest';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!formData.accommodationType.length || !formData.transportationPreference.length || 
        !formData.crowdTolerance || !formData.activityIntensity) {
      const newErrors = {};
      if (!formData.accommodationType.length) newErrors.accommodationType = 'Select at least one';
      if (!formData.transportationPreference.length) newErrors.transportationPreference = 'Select at least one';
      if (!formData.crowdTolerance) newErrors.crowdTolerance = 'Select an option';
      if (!formData.activityIntensity) newErrors.activityIntensity = 'Select an option';
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const duration = parseInt(formData.travelDuration, 10);
      if (isNaN(duration) || duration < 1 || duration > 365) {
        alert('Please enter a valid travel duration between 1 and 365 days');
        setIsLoading(false);
        return;
      }

      const preferencesData = {
        travelPreferences: {
          travelerType: formData.travelerType,
          budgetRange: formData.budgetRange,
          travelDuration: duration,
          preferredRegions: formData.preferredRegions,
        },
        interests: {
          beach: formData.beach,
          cultureHistory: formData.cultureHistory,
          desertAdventure: formData.desertAdventure,
          foodGastronomy: formData.foodGastronomy,
          nightlife: formData.nightlife,
          natureMountains: formData.natureMountains,
          shopping: formData.shopping,
          relaxationSpa: formData.relaxationSpa,
        },
        travelStyle: {
          accommodationType: formData.accommodationType,
          transportationPreference: formData.transportationPreference,
          crowdTolerance: formData.crowdTolerance,
          activityIntensity: formData.activityIntensity,
        },
      };

      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencesData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to save preferences');
      }

      router.push('/recommendations');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert(`Failed to save preferences: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.PRIMARY_DARK }}>
        <div style={{ color: COLORS.LIGHT_BG }}>Loading...</div>
      </div>
    );
  }

  const travelerTypes = [
    { value: 'solo', label: 'Solo Traveler' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'friends', label: 'Friends' },
  ];

  const budgetRanges = [
    { value: 'low', label: 'Budget', desc: 'Under $50/day' },
    { value: 'medium', label: 'Moderate', desc: '$50-150/day' },
    { value: 'high', label: 'Premium', desc: '$150-300/day' },
    { value: 'luxury', label: 'Luxury', desc: '$300+/day' },
  ];

  const regions = [
    { value: 'north', label: 'Northern Tunisia', desc: 'Tunis, Carthage, Bizerte' },
    { value: 'south', label: 'Southern Tunisia', desc: 'Tozeur, Douz, Matmata' },
    { value: 'coast', label: 'Coastal Areas', desc: 'Sousse, Hammamet, Monastir' },
    { value: 'desert', label: 'Sahara Desert', desc: 'Dunes, oases, adventures' },
    { value: 'historical_cities', label: 'Historical Cities', desc: 'Kairouan, El Jem' },
  ];

  const interests = [
    { key: 'beach', label: 'Beach & Water Sports', desc: 'Swimming, diving, beach relaxation' },
    { key: 'cultureHistory', label: 'Culture & History', desc: 'Museums, ruins, heritage sites' },
    { key: 'desertAdventure', label: 'Desert & Adventure', desc: 'Sahara, dunes, off-road experiences' },
    { key: 'foodGastronomy', label: 'Food & Gastronomy', desc: 'Local cuisine, cooking classes' },
    { key: 'nightlife', label: 'Nightlife', desc: 'Bars, clubs, entertainment' },
    { key: 'natureMountains', label: 'Nature & Mountains', desc: 'Hiking, wildlife, natural parks' },
    { key: 'shopping', label: 'Shopping', desc: 'Souks, markets, local crafts' },
    { key: 'relaxationSpa', label: 'Relaxation & Spa', desc: 'Wellness, hammams, thalassotherapy' },
  ];

  const accommodationTypes = [
    { value: 'hotel', label: 'Hotel', desc: 'Traditional hotels with services' },
    { value: 'resort', label: 'Resort', desc: 'All-inclusive resorts' },
    { value: 'airbnb', label: 'Airbnb', desc: 'Apartments & homes' },
    { value: 'guesthouse', label: 'Guest House', desc: 'Family-run accommodations' },
    { value: 'hostel', label: 'Hostel', desc: 'Budget-friendly shared spaces' },
    { value: 'camping', label: 'Camping', desc: 'Desert camps & glamping' },
  ];

  const transportationOptions = [
    { value: 'rental_car', label: 'Rental Car', desc: 'Freedom to explore' },
    { value: 'private_driver', label: 'Private Driver', desc: 'Comfortable & guided' },
    { value: 'public_transport', label: 'Public Transport', desc: 'Local experience, budget-friendly' },
    { value: 'organized_tours', label: 'Organized Tours', desc: 'Group tours with guide' },
    { value: 'taxi', label: 'Taxis', desc: 'On-demand rides' },
    { value: 'walking_cycling', label: 'Walking/Cycling', desc: 'Eco-friendly & active' },
  ];

  const crowdOptions = [
    { value: 'avoid_crowds', label: 'Avoid Crowds', desc: 'Hidden gems and quiet spots' },
    { value: 'neutral', label: 'Flexible', desc: 'Mix of popular and quiet places' },
    { value: 'popular_spots', label: 'Popular Spots', desc: 'Famous attractions and hotspots' },
  ];

  const intensityLevels = [
    { value: 'relaxed', label: 'Relaxed', desc: 'Slow pace, lots of rest time' },
    { value: 'moderate', label: 'Moderate', desc: 'Balanced mix of activity and rest' },
    { value: 'adventurous', label: 'Adventurous', desc: 'Action-packed, maximize experiences' },
  ];

  const RatingStars = ({ value, onChange }) => (
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

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
            Travel Preferences
          </h1>
          <p className="text-gray-500 text-lg">Step {currentStep} of 5</p>
        </div>

        {/* Horizontal Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all"
                  style={{
                    backgroundColor: step < currentStep ? COLORS.ACCENT_GOLD : 'white',
                    border: `2px solid ${step <= currentStep ? COLORS.ACCENT_GOLD : '#d1d5db'}`,
                    color: step < currentStep ? 'white' : (step === currentStep ? COLORS.ACCENT_GOLD : '#9ca3af'),
                  }}
                >
                  {step}
                </div>
                {/* Connecting Line */}
                {step < 5 && (
                  <div
                    className="w-12 h-0.5 mx-1"
                    style={{
                      backgroundColor: step < currentStep ? COLORS.ACCENT_GOLD : '#d1d5db',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
          {/* STEP 1: Traveler Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                Who are you traveling with?
              </h2>
              <p className="text-gray-600">Choose the option that best describes your travel group</p>
              <div className="grid grid-cols-2 gap-4">
                {travelerTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateFormData('travelerType', type.value)}
                    className="p-6 rounded-lg border-2 transition-all text-center hover:border-current"
                    style={{
                      borderColor: formData.travelerType === type.value ? COLORS.ACCENT_GOLD : '#e5e7eb',
                      backgroundColor: formData.travelerType === type.value ? '#fef9e7' : 'white',
                    }}
                  >
                    <div className="font-semibold text-lg text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors.travelerType && <p className="text-red-500 text-sm mt-2">{errors.travelerType}</p>}
            </div>
          )}

          {/* STEP 2: Budget Range */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                What's your daily budget?
              </h2>
              <p className="text-gray-600">Select your preferred daily budget range</p>
              <div className="grid grid-cols-2 gap-4">
                {budgetRanges.map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => updateFormData('budgetRange', budget.value)}
                    className="p-6 rounded-lg border-2 transition-all text-center hover:border-current"
                    style={{
                      borderColor: formData.budgetRange === budget.value ? COLORS.ACCENT_GOLD : '#e5e7eb',
                      backgroundColor: formData.budgetRange === budget.value ? '#fef9e7' : 'white',
                    }}
                  >
                    <div className="font-bold text-lg text-gray-900">{budget.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{budget.desc}</div>
                  </button>
                ))}
              </div>
              {errors.budgetRange && <p className="text-red-500 text-sm mt-2">{errors.budgetRange}</p>}
            </div>
          )}

          {/* STEP 3: Duration & Regions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: COLORS.PRIMARY_DARK }}>
                Travel duration and regions
              </h2>
              
              <div>
                <label className="block text-base font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
                  How many days will you travel?
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.travelDuration}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 365)) {
                      updateFormData('travelDuration', value);
                    }
                  }}
                  className="w-full px-4 py-3 border-2 rounded-lg text-center text-lg font-semibold"
                  style={{ borderColor: errors.travelDuration ? '#ef4444' : '#e5e7eb', color: 'black' }}
                  placeholder="7"
                />
                {errors.travelDuration && <p className="text-red-500 text-sm mt-2">{errors.travelDuration}</p>}
              </div>

              <div>
                <label className="block text-base font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
                  Which regions interest you? (Select at least one)
                </label>
                <div className="space-y-3">
                  {regions.map((region) => (
                    <button
                      key={region.value}
                      onClick={() => {
                        const updated = formData.preferredRegions.includes(region.value)
                          ? formData.preferredRegions.filter(r => r !== region.value)
                          : [...formData.preferredRegions, region.value];
                        updateFormData('preferredRegions', updated);
                      }}
                      className="w-full p-4 rounded-lg border-2 transition-all text-left hover:border-current"
                      style={{
                        borderColor: formData.preferredRegions.includes(region.value) ? COLORS.ACCENT_GOLD : '#e5e7eb',
                        backgroundColor: formData.preferredRegions.includes(region.value) ? '#fef9e7' : 'white',
                      }}
                    >
                      <div className="font-semibold text-gray-900">{region.label}</div>
                      <div className="text-sm text-gray-600">{region.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.preferredRegions && <p className="text-red-500 text-sm mt-2">{errors.preferredRegions}</p>}
              </div>
            </div>
          )}

          {/* STEP 4: Interests */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                Rate your interests
              </h2>
              <p className="text-gray-600">Rate from 1 (not interested) to 5 (very interested)</p>
              
              {errors.interests && <p className="text-red-500 font-semibold">{errors.interests}</p>}
              
              <div className="space-y-3">
                {interests.map((interest) => (
                  <div key={interest.key} className="p-4 rounded-lg border-2" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="block font-semibold text-gray-900">{interest.label}</span>
                        <span className="block text-sm text-gray-600">{interest.desc}</span>
                      </div>
                    </div>
                    <RatingStars 
                      value={formData[interest.key]} 
                      onChange={(v) => updateFormData(interest.key, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Travel Style */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: COLORS.PRIMARY_DARK }}>
                Your travel preferences
              </h2>

              <div>
                <label className="block text-base font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
                  Accommodation types
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {accommodationTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        const updated = formData.accommodationType.includes(type.value)
                          ? formData.accommodationType.filter(t => t !== type.value)
                          : [...formData.accommodationType, type.value];
                        updateFormData('accommodationType', updated);
                      }}
                      className="p-4 rounded-lg border-2 transition-all text-center hover:border-current"
                      style={{
                        borderColor: formData.accommodationType.includes(type.value) ? COLORS.ACCENT_GOLD : '#e5e7eb',
                        backgroundColor: formData.accommodationType.includes(type.value) ? '#fef9e7' : 'white',
                      }}
                    >
                      <div className="text-sm font-semibold text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
                {errors.accommodationType && <p className="text-red-500 text-sm mt-2">{errors.accommodationType}</p>}
              </div>

              <div>
                <label className="block text-base font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
                  Transportation preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {transportationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const updated = formData.transportationPreference.includes(option.value)
                          ? formData.transportationPreference.filter(t => t !== option.value)
                          : [...formData.transportationPreference, option.value];
                        updateFormData('transportationPreference', updated);
                      }}
                      className="p-4 rounded-lg border-2 transition-all text-center hover:border-current"
                      style={{
                        borderColor: formData.transportationPreference.includes(option.value) ? COLORS.ACCENT_GOLD : '#e5e7eb',
                        backgroundColor: formData.transportationPreference.includes(option.value) ? '#fef9e7' : 'white',
                      }}
                    >
                      <div className="text-sm font-semibold text-gray-900">{option.label}</div>
                    </button>
                  ))}
                </div>
                {errors.transportationPreference && <p className="text-red-500 text-sm mt-2">{errors.transportationPreference}</p>}
              </div>

              <div>
                <label className="block text-base font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
                  Crowd preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {crowdOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormData('crowdTolerance', option.value)}
                      className="p-4 rounded-lg border-2 transition-all text-center hover:border-current"
                      style={{
                        borderColor: formData.crowdTolerance === option.value ? COLORS.ACCENT_GOLD : '#e5e7eb',
                        backgroundColor: formData.crowdTolerance === option.value ? '#fef9e7' : 'white',
                      }}
                    >
                      <div className="text-xs font-semibold text-gray-900">{option.label}</div>
                    </button>
                  ))}
                </div>
                {errors.crowdTolerance && <p className="text-red-500 text-sm mt-2">{errors.crowdTolerance}</p>}
              </div>

              <div>
                <label className="block text-base font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
                  Activity level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {intensityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateFormData('activityIntensity', level.value)}
                      className="p-4 rounded-lg border-2 transition-all text-center hover:border-current"
                      style={{
                        borderColor: formData.activityIntensity === level.value ? COLORS.ACCENT_GOLD : '#e5e7eb',
                        backgroundColor: formData.activityIntensity === level.value ? '#fef9e7' : 'white',
                      }}
                    >
                      <div className="text-xs font-semibold text-gray-900">{level.label}</div>
                    </button>
                  ))}
                </div>
                {errors.activityIntensity && <p className="text-red-500 text-sm mt-2">{errors.activityIntensity}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-lg font-semibold border-2 transition-all text-base"
                style={{
                  borderColor: COLORS.ACCENT_GOLD,
                  color: COLORS.ACCENT_GOLD,
                  backgroundColor: 'white',
                }}
              >
                Back
              </button>
            )}
            
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-lg font-semibold text-white transition-all text-base"
                style={{ backgroundColor: COLORS.ACCENT_GOLD }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 text-base"
                style={{ backgroundColor: COLORS.ACCENT_GOLD }}
              >
                {isLoading ? 'Saving...' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
