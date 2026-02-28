'use client';

import { COLORS } from '@/config/colors';

export default function ProgressIndicator({ currentStep, totalSteps }) {
  const steps = [
    { number: 1, label: 'Travel Info' },
    { number: 2, label: 'Interests' },
    { number: 3, label: 'Travel Style' },
  ];

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: COLORS.ACCENT_GOLD,
            }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step.number <= currentStep
                    ? 'text-white'
                    : 'text-gray-400 bg-gray-200'
                }`}
                style={{
                  backgroundColor: step.number <= currentStep ? COLORS.ACCENT_GOLD : undefined,
                }}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  step.number === currentStep ? 'font-bold' : ''
                }`}
                style={{
                  color: step.number <= currentStep ? COLORS.ACCENT_GOLD : '#9ca3af',
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2 -mt-6" />
            )}
          </div>
        ))}
      </div>

      {/* Step Counter */}
      <div className="text-center mt-6">
        <span className="text-sm text-gray-600">
          Step <strong style={{ color: COLORS.ACCENT_GOLD }}>{currentStep}</strong> of {totalSteps}
        </span>
      </div>
    </div>
  );
}
