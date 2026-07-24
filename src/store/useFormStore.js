import { create } from 'zustand';

export const useFormStore = create((set) => ({
  currentStep: 1,
  formData: {}, // Accumulates all step data

  setStep: (step) => set({ currentStep: step }),
  updateFormData: (newData) => set((state) => ({
    formData: { ...state.formData, ...newData },
  })),
  resetForm: () => set({ currentStep: 1, formData: {} }),
}));