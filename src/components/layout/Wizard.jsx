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

  // EFFECT: Safely handle skipped/hidden steps
  useEffect(() => {
    // If the current step is NOT found in the visible list
    if (currentStepIndex === -1 && visibleSteps.length > 0) {
      
      // Try to find a valid visible step that comes AFTER the hidden step
      const nextValidStep = visibleSteps.find(step => step.id >= currentStep);
      
      // If we found a next step (like Step 7), go there. Otherwise, fall back to the very last visible step.
      const targetStepId = nextValidStep ? nextValidStep.id : visibleSteps[visibleSteps.length - 1].id;
      
      // Update the store to the correct visible step
      setStep(targetStepId);
    }
  }, [currentStepIndex, visibleSteps, currentStep, setStep]);

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