import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step3Schema } from '../../schemas/step3Schema';
import { validatePAN, validateAadhaar } from '../../utils/validators';
import { useVerification } from '../../hooks/useVerification';
import Input from '../common/Input';

const Step3KYC = () => {
  const { formData, updateFormData, setStep } = useFormStore();
  const loanType = formData.loanType || 'Personal';

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: formData,
  });

  const panValue = watch('panNumber');
  const aadhaarValue = watch('aadhaarNumber');

  // Run verification on blur/change
  const { status: panStatus, errorMsg: panError, verify: verifyPAN } = useVerification(validatePAN, panValue, loanType);
  const { status: aadhaarStatus, errorMsg: aadhaarError, verify: verifyAadhaar } = useVerification(validateAadhaar, aadhaarValue);

  // Auto-trigger verification on blur via onBlur event below
  const onError = (errors) => console.error("KYC Errors:", errors);

  const onSubmit = (data) => {
    // Prevent moving forward if verification is still loading or failed
    if (panStatus !== 'verified' || aadhaarStatus !== 'verified') {
      alert("Please ensure both PAN and Aadhaar are verified before proceeding.");
      return;
    }
    updateFormData(data);
    setStep(4); // Proceed to Address
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">KYC Verification</h2>
      
      <div className="relative">
        <Input 
          label="PAN Number" 
          placeholder="AAAAA9999A"
          {...register('panNumber', { 
            onBlur: () => verifyPAN() // Trigger verification on blur
          })} 
          error={errors.panNumber}
        />
        <div className="mt-1 text-sm">
          {panStatus === 'loading' && <span className="text-brand-amber">Verifying...</span>}
          {panStatus === 'verified' && <span className="text-brand-green font-bold">✅ Verified</span>}
          {panStatus === 'error' && <span className="text-brand-red">{panError}</span>}
        </div>
      </div>

      <div className="relative">
        <Input 
          label="Aadhaar Number" 
          placeholder="1234 5678 9012"
          {...register('aadhaarNumber', { 
            onBlur: () => verifyAadhaar() 
          })} 
          error={errors.aadhaarNumber}
        />
        <div className="mt-1 text-sm">
          {aadhaarStatus === 'loading' && <span className="text-brand-amber">Verifying...</span>}
          {aadhaarStatus === 'verified' && <span className="text-brand-green font-bold">✅ Verified</span>}
          {aadhaarStatus === 'error' && <span className="text-brand-red">{aadhaarError}</span>}
        </div>
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input 
          type="checkbox" 
          {...register('kycConsent')} 
          className="w-5 h-5 mt-1 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
        />
        <div>
          <label className="text-sm text-gray-700 font-medium">
            I explicitly consent to LendSwift verifying my KYC details with government databases.
          </label>
          {errors.kycConsent && (
            <span role="alert" aria-live="polite" className="block text-brand-red text-xs mt-1">
              {errors.kycConsent.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(2)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
        >
          Next Step (Address)
        </button>
      </div>
    </form>
  );
};

export default Step3KYC;