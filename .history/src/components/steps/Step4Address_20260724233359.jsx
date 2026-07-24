import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step4Schema } from '../../schemas/step4Schema';
import { usePinCodeLookup } from '../../hooks/usePinCodeLookup';
import Input from '../common/Input';

const Step4Address = () => {
  const { formData, updateFormData, setStep } = useFormStore();

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: formData,
  });

  // Watch these fields for real-time conditional rendering
  const residenceType = useWatch({ control, name: 'residenceType' });
  const pinCode = useWatch({ control, name: 'pinCode' });
  const sameAsPermanent = useWatch({ control, name: 'sameAsPermanent' });

  // PIN Code Lookup Hook
  const { result, isLoading, lookup } = usePinCodeLookup();

  // Auto-fill City/State when PIN is found
  useEffect(() => {
    if (pinCode && pinCode.length === 6) {
      lookup(pinCode);
    }
  }, [pinCode, lookup]);

  useEffect(() => {
    if (result.city && result.state) {
      setValue('city', result.city);
      setValue('state', result.state);
    }
  }, [result.city, result.state, setValue]);

  // Handle "Same as Permanent" auto-copy
  useEffect(() => {
    if (sameAsPermanent) {
      const currentValues = {
        permanentAddress1: formData.currentAddress1 || '',
        permanentAddress2: formData.currentAddress2 || '',
        permanentPinCode: formData.pinCode || '',
        permanentCity: formData.city || '',
        permanentState: formData.state || '',
      };
      // Only overwrite if they're empty or just changed
      setValue('permanentAddress1', currentValues.permanentAddress1);
      setValue('permanentAddress2', currentValues.permanentAddress2);
      setValue('permanentPinCode', currentValues.permanentPinCode);
      setValue('permanentCity', currentValues.permanentCity);
      setValue('permanentState', currentValues.permanentState);
    }
  }, [sameAsPermanent, formData, setValue]);

  const onError = (errors) => console.error("Address Errors:", errors);
  const onSubmit = (data) => {
    updateFormData(data);
    setStep(5); // Move to Employment Step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Address Details</h2>
      
      <div className="border-b pb-4 border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-2">Current Address</h3>
        <Input label="Address Line 1" {...register('currentAddress1')} error={errors.currentAddress1} />
        <Input label="Address Line 2 (Optional)" {...register('currentAddress2')} error={errors.currentAddress2} />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">PIN Code</label>
          <input 
            type="text" 
            maxLength="6"
            {...register('pinCode')} 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          {isLoading && <span className="text-brand-amber text-xs">Fetching location...</span>}
          {result.error && <span className="text-brand-red text-xs">{result.error}</span>}
          {errors.pinCode && <span className="text-brand-red text-xs">{errors.pinCode.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <Input label="City" {...register('city')} error={errors.city} />
          <Input label="State" {...register('state')} error={errors.state} />
        </div>

        <div className="space-y-2 mt-4">
          <label className="block text-sm font-medium text-gray-700">Residence Type</label>
          <div className="flex gap-4 flex-wrap">
            {['Owned', 'Rented', 'Company', 'Family'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={type} {...register('residenceType')} className="w-4 h-4 text-brand-blue" />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
          {errors.residenceType && <span className="text-brand-red text-xs">{errors.residenceType.message}</span>}
        </div>

        {residenceType === 'Rented' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <Input 
              label="Monthly Rent Amount (₹)" 
              type="number" 
              {...register('rentAmount', { valueAsNumber: true })} 
              error={errors.rentAmount} 
            />
          </div>
        )}

        <div className="mt-4">
          <Input 
            label="Years at Current Address" 
            type="number" 
            {...register('yearsAtAddress', { valueAsNumber: true })} 
            error={errors.yearsAtAddress} 
          />
        </div>
      </div>

      {/* Permanent Address Section */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <input 
            type="checkbox" 
            {...register('sameAsPermanent')} 
            className="w-5 h-5 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Same as Permanent Address</label>
        </div>

        {!sameAsPermanent && (
          <div className="border-t pt-4 border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Permanent Address</h3>
            <Input label="Address Line 1" {...register('permanentAddress1')} error={errors.permanentAddress1} />
            <Input label="Address Line 2 (Optional)" {...register('permanentAddress2')} error={errors.permanentAddress2} />
            <Input label="PIN Code" {...register('permanentPinCode')} error={errors.permanentPinCode} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" {...register('permanentCity')} error={errors.permanentCity} />
              <Input label="State" {...register('permanentState')} error={errors.permanentState} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(3)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
        >
          Next Step (Employment)
        </button>
      </div>
    </form>
  );
};

export default Step4Address;