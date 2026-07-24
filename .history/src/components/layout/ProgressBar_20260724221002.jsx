import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { STEP_CONFIG } from '../../config/stepRegistry';

const ProgressBar = () => {
  const currentStep = useFormStore((state) => state.currentStep);
  const progress = (currentStep / STEP_CONFIG.length) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-2 text-gray-500">
        <span>Step {currentStep} of {STEP_CONFIG.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 text-center text-sm font-semibold text-gray-700">
        {STEP_CONFIG[currentStep - 1]?.label || 'Start'}
      </div>
    </div>
  );
};

export default ProgressBar;