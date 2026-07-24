import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { STEP_CONFIG } from '../../config/stepRegistry';
import ProgressBar from './ProgressBar';

const Wizard = () => {
  const currentStep = useFormStore((state) => state.currentStep);
  const StepComponent = STEP_CONFIG[currentStep - 1]?.component || STEP_CONFIG[0].component;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <ProgressBar />
      <div className="mt-8">
        <StepComponent />
      </div>
    </div>
  );
};

export default Wizard;