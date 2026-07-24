import React, { useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { STEP_CONFIG } from '../../config/stepRegistry';
import ProgressBar from './ProgressBar';

const Wizard = () => {
  const { currentStep, formData, setStep } = useFormStore();

  // Calculate the visible steps based on the current formData
  const visibleSteps = STEP_CONFIG.filter(step => step.isVisible(formData));
  
  // Find the index of the current step in the visible list
  const currentStepIndex = visibleSteps.findIndex(step => step.id === currentStep);

  // EFFECT: If the current step is NOT found in the visible list (e.g. user changed loan amount),
  // automatically bump them to the nearest valid visible step.
  useEffect(() => {
    if (currentStepIndex === -1 && visibleSteps.length > 0) {
      // Step is hidden, navigate to the first visible step that is >= currentStep
      // Usually, this just falls back to the closest valid step.
      setStep(visibleSteps[0].id);
    }
  }, [currentStepIndex, visibleSteps, setStep]);

  // If there are no visible steps (should never happen), render nothing
  if (currentStepIndex === -1 || visibleSteps.length === 0) {
    return <div>Loading...</div>;
  }

  const StepComponent = visibleSteps[currentStepIndex].component;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <ProgressBar visibleSteps={visibleSteps} currentStepId={currentStep} />
      <div className="mt-8">
        <StepComponent />
      </div>
    </div>
  );
};

export default Wizard;