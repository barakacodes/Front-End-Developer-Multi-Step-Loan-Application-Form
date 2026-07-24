import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '../../store/useFormStore';
import { step7Schema } from '../../schemas/step7Schema';
import FileUpload from '../common/FileUpload';
import SignatureCanvas from '../common/SignatureCanvas';
import Input from '../common/Input';

const Step7Documents = () => {
  const { formData, updateFormData, setStep } = useFormStore();
  const { loanType, employmentType } = formData;

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [signature, setSignature] = useState(formData.signature || null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(step7Schema),
    defaultValues: formData,
  });

  // 📋 Conditional Document Requirement Logic (According to the spec)
  const getRequiredDocs = () => {
    let docs = [];
    // Universal
    docs.push('panCard');
    docs.push('aadhaarCard');
    docs.push('bankStatements');

    // Based on Employment
    if (employmentType === 'Salaried') {
      docs.push('salarySlips');
    } else if (employmentType === 'Self-Employed' || employmentType === 'Business Owner') {
      docs.push('itrReturns');
    }

    // Based on Loan Type
    if (loanType === 'Home') {
      docs.push('propertyDocuments');
    } else if (loanType === 'Business') {
      docs.push('businessRegistration');
      docs.push('gstReturns');
    }
    
    // Photograph is always required
    docs.push('photograph');
    return docs;
  };

  const requiredDocs = getRequiredDocs();

  const handleFileChange = (docKey, file) => {
    setUploadedFiles(prev => ({ ...prev, [docKey]: file }));
  };

  const handleSignatureChange = (sigData) => {
    setSignature(sigData);
    setValue('signature', sigData || ''); // Update RHF state
  };

  const onError = (err) => console.error("Document Errors:", err);
  const onSubmit = (data) => {
    // Final check: ensure user actually signed
    if (!signature) {
      alert("Please sign the document before proceeding.");
      return;
    }
    // Check if mandatory docs are uploaded (you can add strict logic here if wanted)
    updateFormData({ ...data, signature, uploadedFiles });
    setStep(8); // Proceed to Review
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Document Upload & E-Signature</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredDocs.includes('panCard') && (
          <FileUpload 
            label="PAN Card Copy (PDF/JPG/PNG)" 
            onFileChange={(f) => handleFileChange('panCard', f)} 
            maxSizeMB={5}
          />
        )}
        {requiredDocs.includes('aadhaarCard') && (
          <FileUpload 
            label="Aadhaar Card (Front/Back) (PDF/JPG/PNG)" 
            onFileChange={(f) => handleFileChange('aadhaarCard', f)} 
            maxSizeMB={5}
          />
        )}
        {requiredDocs.includes('salarySlips') && (
          <FileUpload 
            label="Salary Slips (Last 3 months) (PDF)" 
            onFileChange={(f) => handleFileChange('salarySlips', f)} 
            acceptedTypes={['application/pdf']}
            maxSizeMB={5}
          />
        )}
        {requiredDocs.includes('bankStatements') && (
          <FileUpload 
            label="Bank Statements (Last 6 months) (PDF)" 
            onFileChange={(f) => handleFileChange('bankStatements', f)} 
            acceptedTypes={['application/pdf']}
            maxSizeMB={10}
          />
        )}
        {requiredDocs.includes('itrReturns') && (
          <FileUpload 
            label="ITR Returns (Last 2 years) (PDF)" 
            onFileChange={(f) => handleFileChange('itrReturns', f)} 
            acceptedTypes={['application/pdf']}
            maxSizeMB={5}
          />
        )}
        {requiredDocs.includes('propertyDocuments') && (
          <FileUpload 
            label="Property Documents (PDF)" 
            onFileChange={(f) => handleFileChange('propertyDocuments', f)} 
            acceptedTypes={['application/pdf']}
            maxSizeMB={10}
          />
        )}
        {requiredDocs.includes('businessRegistration') && (
          <FileUpload 
            label="Business Registration Certificate (PDF)" 
            onFileChange={(f) => handleFileChange('businessRegistration', f)} 
            acceptedTypes={['application/pdf']}
            maxSizeMB={5}
          />
        )}
        {requiredDocs.includes('gstReturns') && (
          <FileUpload 
            label="GST Returns (Last 4 quarters) (PDF)" 
            onFileChange={(f) => handleFileChange('gstReturns', f)} 
            acceptedTypes={['application/pdf']}
            maxSizeMB={5}
          />
        )}
        {requiredDocs.includes('photograph') && (
          <FileUpload 
            label="Passport Size Photograph (JPG/PNG)" 
            onFileChange={(f) => handleFileChange('photograph', f)} 
            acceptedTypes={['image/jpeg', 'image/png']}
            maxSizeMB={2}
          />
        )}
      </div>

      {/* E-Signature Section */}
      <div className="mt-8 p-4 border-t border-gray-200">
        <SignatureCanvas onSignatureChange={handleSignatureChange} error={errors.signature} />
        <input type="hidden" {...register('signature')} value={signature || ''} />
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => setStep(6)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 transition"
        >
          Next Step (Review)
        </button>
      </div>
    </form>
  );
};

export default Step7Documents;