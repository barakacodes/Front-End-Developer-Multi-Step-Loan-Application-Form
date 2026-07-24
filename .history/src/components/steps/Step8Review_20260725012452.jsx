import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step8Schema } from '../../schemas/step8Schema';
import { calculateEMI } from '../../utils/emiCalculator';

const Step8Review = () => {
  const { formData, updateFormData, setStep, resetForm } = useFormStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(step8Schema),
    defaultValues: formData,
  });

  // Watch consents to enable/disable submit button
  const c1 = watch('consentAccurate');
  const c2 = watch('consentCIBIL');
  const c3 = watch('consentTerms');
  const c4 = watch('consentComm');
  const allChecked = c1 && c2 && c3 && c4;

  // Calculate EMI
  const { emi, totalInterest, totalPayment, processingFee, annualRate } = calculateEMI(
    formData.loanAmount || 0,
    formData.loanType,
    formData.loanTenure || 12
  );

  const onError = (err) => console.error("Review Errors:", err);
  const onSubmit = (data) => {
    updateFormData(data);
    // Generate UUID and finish
    const refNum = crypto.randomUUID().slice(0, 8).toUpperCase();
    setReferenceNumber(refNum);
    setIsSubmitted(true);
  };

  // Helper to display money in Indian format (₹10,50,000)
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-xl font-bold text-gray-800">Review & Pre-Approval Summary</h2>
      
      {/* Read-only Summary Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Summary */}
        <div className="border p-4 rounded bg-gray-50 relative">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2">Loan Details</h3>
          <p className="text-sm"><span className="font-medium">Type:</span> {formData.loanType}</p>
          <p className="text-sm"><span className="font-medium">Amount:</span> {formatINR(formData.loanAmount)}</p>
          <p className="text-sm"><span className="font-medium">Tenure:</span> {formData.loanTenure || 'N/A'} months</p>
          <button onClick={() => setStep(1)} className="absolute top-2 right-2 text-brand-blue text-xs hover:underline">Edit</button>
        </div>

        {/* Personal & KYC Summary */}
        <div className="border p-4 rounded bg-gray-50 relative">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2">Applicant Details</h3>
          <p className="text-sm"><span className="font-medium">Name:</span> {formData.fullName}</p>
          <p className="text-sm"><span className="font-medium">Email:</span> {formData.email}</p>
          <p className="text-sm"><span className="font-medium">PAN:</span> {formData.panNumber ? `****${formData.panNumber.slice(-4)}` : 'N/A'}</p>
          <button onClick={() => setStep(2)} className="absolute top-2 right-2 text-brand-blue text-xs hover:underline">Edit</button>
        </div>

        {/* Employment Summary */}
        <div className="border p-4 rounded bg-gray-50 relative">
          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2">Employment</h3>
          <p className="text-sm"><span className="font-medium">Type:</span> {formData.employmentType}</p>
          <p className="text-sm"><span className="font-medium">Monthly Income:</span> {formatINR(formData.monthlyNetSalary || formData.monthlyIncome || 0)}</p>
          <button onClick={() => setStep(5)} className="absolute top-2 right-2 text-brand-blue text-xs hover:underline">Edit</button>
        </div>

        {/* Financial Summary (EMI) */}
        <div className="border-2 border-brand-blue p-4 rounded bg-blue-50 relative">
          <h3 className="font-bold text-brand-blue border-b border-brand-blue pb-2 mb-2">Pre-Approval Offer</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Interest Rate:</span> {annualRate}% p.a.</p>
            <p><span className="font-medium">Monthly EMI:</span> <span className="font-bold text-brand-blue">{formatINR(emi)}</span></p>
            <p><span className="font-medium">Total Interest:</span> {formatINR(totalInterest)}</p>
            <p><span className="font-medium">Processing Fee:</span> {formatINR(processingFee)}</p>
            <p className="col-span-2"><span className="font-medium">Total Cost of Borrowing:</span> {formatINR(totalPayment)}</p>
          </div>
          <button onClick={() => setStep(1)} className="absolute top-2 right-2 text-brand-blue text-xs hover:underline">Edit</button>
        </div>
      </div>

      {/* Consents */}
      <div className="space-y-3 border-t pt-4 border-gray-200">
        <h3 className="font-semibold text-gray-800">Regulatory Consents</h3>
        {['consentAccurate', 'consentCIBIL', 'consentTerms', 'consentComm'].map((field) => (
          <div key={field} className="flex items-start gap-3">
            <input type="checkbox" {...register(field)} className="w-5 h-5 mt-1 text-brand-blue focus:ring-brand-blue" />
            <label className="text-sm text-gray-700">
              {field === 'consentAccurate' && "I confirm all information provided above is accurate and complete."}
              {field === 'consentCIBIL' && "I authorize LendSwift to check my credit score via CIBIL/Equifax."}
              {field === 'consentTerms' && "I agree to the Terms and Conditions of the loan agreement."}
              {field === 'consentComm' && "I consent to receive communications regarding this application."}
            </label>
            {errors[field] && <span className="text-brand-red text-xs">{errors[field].message}</span>}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(7)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="button" 
          onClick={handleSubmit(onSubmit, onError)}
          disabled={!allChecked}
          className={`px-6 py-2 rounded-md transition ${allChecked ? 'bg-brand-green text-white hover:bg-green-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
        >
          Submit Application
        </button>
      </div>

      {/* Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">✓</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">Your loan application has been received successfully.</p>
            <div className="bg-gray-50 p-3 rounded border mb-6">
              <p className="text-xs text-gray-500">Application Reference Number</p>
              <p className="text-lg font-mono font-bold text-brand-blue">{referenceNumber}</p>
            </div>
            <button 
              onClick={() => { resetForm(); setIsSubmitted(false); }}
              className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
            >
              Start New Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step8Review;