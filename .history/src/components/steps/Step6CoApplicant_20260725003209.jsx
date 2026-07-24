import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step6Schema } from '../../schemas/step6Schema';
import { validatePAN } from '../../utils/validators';
import { useVerification } from '../../hooks/useVerification';
import Input from '../common/Input';

const Step6CoApplicant = () => {
  const { formData, updateFormData, setStep } = useFormStore();

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(step6Schema),
    defaultValues: formData,
  });

  const coApplicantPan = useWatch({ control, name: 'coApplicantPan' });
  const { status, errorMsg, verify } = useVerification(validatePAN, coApplicantPan, 'Personal');

  // Auto-default Relationship to Spouse if user is Married (Cross-step dependency)
  useEffect(() => {
    if (formData.maritalStatus === 'Married') {
      setValue('relationship', 'Spouse');
    }
  }, [formData.maritalStatus, setValue]);

  const onError = (err) => console.error("Co-Applicant Errors:", err);
  const onSubmit = (data) => {
    if (status !== 'verified') {
      alert("Please ensure Co-Applicant PAN is verified before proceeding.");
      return;
    }
    updateFormData(data);
    setStep(7); // Proceed to Documents
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Co-Applicant Details</h2>
      
      <Input label="Co-Applicant Full Name" {...register('coApplicantName')} error={errors.coApplicantName} />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Relationship to Applicant</label>
        <select {...register('relationship')} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue">
          <option value="">Select...</option>
          <option value="Spouse">Spouse</option>
          <option value="Parent">Parent</option>
          <option value="Sibling">Sibling</option>
          <option value="Business Partner">Business Partner</option>
        </select>
        {errors.relationship && <span className="text-brand-red text-xs">{errors.relationship.message}</span>}
      </div>

      <div className="relative">
        <Input 
          label="Co-Applicant PAN" 
          placeholder="AAAPP1234F"
          {...register('coApplicantPan', { onBlur: () => verify() })} 
          error={errors.coApplicantPan}
        />
        <div className="mt-1 text-sm">
          {status === 'loading' && <span className="text-brand-amber">Verifying...</span>}
          {status === 'verified' && <span className="text-brand-green font-bold">✅ Co-Applicant Verified</span>}
          {status === 'error' && <span className="text-brand-red">{errorMsg}</span>}
        </div>
      </div>

      <Input label="Co-Applicant Monthly Income (₹)" type="number" {...register('coApplicantIncome', { valueAsNumber: true })} error={errors.coApplicantIncome} />

      <div className="flex items-start gap-3 pt-2">
        <input 
          type="checkbox" 
          {...register('coApplicantConsent')} 
          className="w-5 h-5 mt-1 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
        />
        <div>
          <label className="text-sm text-gray-700 font-medium">
            I confirm that the co-applicant has consented to be part of this loan application and to a credit check.
          </label>
          {errors.coApplicantConsent && (
            <span role="alert" aria-live="polite" className="block text-brand-red text-xs mt-1">
              {errors.coApplicantConsent.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(5)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
        >
          Next Step (Documents)
        </button>
      </div>
    </form>
  );
};

export default Step6CoApplicant;