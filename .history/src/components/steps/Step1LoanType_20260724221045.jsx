import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';
import Input from '../common/Input';

const Step1LoanType = () => {
  const { formData, updateFormData, setStep } = useFormStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData(data);
    setStep(2); // Go to next step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Loan Type & Basic Info</h2>
      <Input label="Loan Amount (₹)" type="number" {...register('loanAmount')} error={errors.loanAmount} />
      
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition">
          Next Step
        </button>
      </div>
    </form>
  );
};

export default Step1LoanType;