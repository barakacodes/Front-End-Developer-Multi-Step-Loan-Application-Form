import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step1Schema } from '../../schemas/step1Schema';
import Input from '../common/Input';

const Step1LoanType = () => {
  const { formData, updateFormData, setStep } = useFormStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  });

  const selectedLoanType = watch('loanType');
  const getMaxAmount = (type) => {
    if (type === 'Personal') return 1000000;
    if (type === 'Home') return 10000000;
    if (type === 'Business') return 5000000;
    return 1000000;
  };
  const maxAmount = getMaxAmount(selectedLoanType);

  // This triggers if there are validation errors (like missing loanType)
  const onError = (errors) => {
    console.error("❌ Validation Errors:", errors); // Check your F12 console for this!
  };

  const onSubmit = (data) => {
    updateFormData(data);
    setStep(2); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Loan Type & Basic Info</h2>
      
      {/* Radio Group for Loan Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Loan Type</label>
        <div className="flex gap-4 flex-wrap">
          {['Personal', 'Home', 'Business'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value={type} 
                {...register('loanType')} 
                className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.loanType && (
          <span role="alert" aria-live="polite" className="text-brand-red text-xs mt-1">
            {errors.loanType.message}
          </span>
        )}
      </div>

      {/* Amount Input with Dynamic Max */}
      <div className="relative">
        <Input 
          label="Loan Amount (₹)" 
          type="number" 
          {...register('loanAmount', { valueAsNumber: true })}
          error={errors.loanAmount} 
          placeholder="e.g., 500000"
        />
        <p className="text-xs text-gray-500 mt-1">
          Max allowed: <span className="font-medium">₹{maxAmount.toLocaleString('en-IN')}</span>
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};

export default Step1LoanType;