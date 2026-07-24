import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step5Schema } from '../../schemas/step5Schema';
import Input from '../common/Input';

// Sub-component for Salaried Fields
const SalariedFields = ({ register, errors }) => (
  <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
    <h3 className="font-semibold text-blue-800">Salaried Employee Details</h3>
    <Input label="Company Name" {...register('companyName')} error={errors.companyName} />
    <Input label="Designation" {...register('designation')} error={errors.designation} />
    <Input label="Monthly Net Salary (₹)" type="number" {...register('monthlyNetSalary', { valueAsNumber: true })} error={errors.monthlyNetSalary} />
  </div>
);

// Sub-component for Self-Employed Fields
const SelfEmployedFields = ({ register, errors }) => (
  <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-md">
    <h3 className="font-semibold text-green-800">Self-Employed Details</h3>
    <Input label="Business Name" {...register('businessName')} error={errors.businessName} />
    <Input label="Business Type" {...register('businessType')} error={errors.businessType} />
    <Input label="Annual Turnover (₹)" type="number" {...register('annualTurnover', { valueAsNumber: true })} error={errors.annualTurnover} />
    <Input label="Years in Business" type="number" {...register('yearsInBusiness', { valueAsNumber: true })} error={errors.yearsInBusiness} />
    <Input label="Monthly Income (₹)" type="number" {...register('monthlyIncome', { valueAsNumber: true })} error={errors.monthlyIncome} />
  </div>
);

// Sub-component for Business Owner Fields
const BusinessOwnerFields = ({ register, errors }) => (
  <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
    <h3 className="font-semibold text-purple-800">Business Owner Details</h3>
    <Input label="Business Name" {...register('businessName')} error={errors.businessName} />
    <Input label="Business Type" {...register('businessType')} error={errors.businessType} />
    <Input label="Annual Turnover (₹)" type="number" {...register('annualTurnover', { valueAsNumber: true })} error={errors.annualTurnover} />
    <Input label="Years in Business" type="number" {...register('yearsInBusiness', { valueAsNumber: true })} error={errors.yearsInBusiness} />
    <Input label="GST Number" {...register('gstNumber')} error={errors.gstNumber} placeholder="22AAAAA0000A1Z5" />
    <Input label="Office/Business Address" {...register('officeAddress')} error={errors.officeAddress} />
  </div>
);

const Step5Employment = () => {
  const { formData, updateFormData, setStep } = useFormStore();

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(step5Schema),
    defaultValues: formData,
  });

  const employmentType = useWatch({ control, name: 'employmentType' });

  const onError = (err) => console.error("Employment Errors:", err);
  const onSubmit = (data) => {
    updateFormData(data);
    setStep(6); // Proceed to Co-Applicant
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Employment & Income Details</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Employment Type</label>
        <div className="flex gap-4 flex-wrap">
          {['Salaried', 'Self-Employed', 'Business Owner'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={type} {...register('employmentType')} className="w-4 h-4 text-brand-blue" />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.employmentType && <span className="text-brand-red text-xs">{errors.employmentType.message}</span>}
      </div>

      {/* Common Field: Years of Experience */}
      <div className="mt-4">
        <Input 
          label="Years of Work Experience" 
          type="number" 
          {...register('yearsOfExperience', { valueAsNumber: true })} 
          error={errors.yearsOfExperience} 
        />
      </div>

      {/* CONDITIONAL RENDERING - The UI transforms based on selection */}
      <div className="mt-6">
        {employmentType === 'Salaried' && <SalariedFields register={register} errors={errors} />}
        {employmentType === 'Self-Employed' && <SelfEmployedFields register={register} errors={errors} />}
        {employmentType === 'Business Owner' && <BusinessOwnerFields register={register} errors={errors} />}
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(4)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
        >
          Next Step (Co-Applicant)
        </button>
      </div>
    </form>
  );
};

export default Step5Employment;