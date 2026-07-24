import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step2Schema } from '../../schemas/step2Schema';
import Input from '../common/Input';

const Step2PersonalInfo = () => {
  const { formData, updateFormData, setStep } = useFormStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  });

  const onError = (errors) => {
    console.error("❌ Step 2 Errors:", errors);
  };

  const onSubmit = (data) => {
    updateFormData(data);
    setStep(3); // Proceed to KYC step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>

      <Input 
        label="Full Name (as per PAN)" 
        {...register('fullName')} 
        error={errors.fullName} 
        placeholder="e.g., Rahul Sharma"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
        <input 
          type="date" 
          {...register('dateOfBirth')} 
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
        {errors.dateOfBirth && (
          <span role="alert" aria-live="polite" className="text-brand-red text-xs mt-1">
            {errors.dateOfBirth.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <div className="flex gap-4 flex-wrap">
          {['Male', 'Female', 'Other'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={type} {...register('gender')} className="w-4 h-4 text-brand-blue" />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <span role="alert" aria-live="polite" className="text-brand-red text-xs mt-1">
            {errors.gender.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Marital Status</label>
        <select {...register('maritalStatus')} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue">
          <option value="">Select...</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
        {errors.maritalStatus && (
          <span role="alert" aria-live="polite" className="text-brand-red text-xs mt-1">
            {errors.maritalStatus.message}
          </span>
        )}
      </div>

      <Input label="Email Address" type="email" {...register('email')} error={errors.email} />
      <Input label="Primary Mobile Number" type="tel" {...register('mobileNumber')} error={errors.mobileNumber} />
      <Input label="Alternate Mobile (Optional)" type="tel" {...register('alternateMobile')} error={errors.alternateMobile} />

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(1)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
        >
          Next Step (KYC)
        </button>
      </div>
    </form>
  );
};

export default Step2PersonalInfo;