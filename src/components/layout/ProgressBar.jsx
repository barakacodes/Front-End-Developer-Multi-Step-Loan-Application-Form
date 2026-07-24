import React from 'react';

const ProgressBar = ({ visibleSteps, currentStepId }) => {
  const currentIndex = visibleSteps.findIndex(step => step.id === currentStepId);
  const progress = ((currentIndex + 1) / visibleSteps.length) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-2 text-gray-500">
        <span>Step {currentIndex + 1} of {visibleSteps.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-brand-blue h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 text-center text-sm font-semibold text-gray-700">
        {visibleSteps[currentIndex]?.label || 'Start'}
      </div>
    </div>
  );
};

export default ProgressBar;