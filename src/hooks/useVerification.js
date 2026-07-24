import { useState } from 'react';

export const useVerification = (validatorFn, value, loanType = 'Personal') => {
  const [status, setStatus] = useState('idle'); // idle, loading, verified, error
  const [errorMsg, setErrorMsg] = useState(null);

  const verify = () => {
    if (!value) {
      setStatus('idle');
      setErrorMsg(null);
      return;
    }

    // Run the client-side validation first
    const isValid = validatorFn(value, loanType);
    
    if (!isValid) {
      setStatus('error');
      setErrorMsg('Invalid format');
      return;
    }

    // Simulate the 1.5s backend API call
    setStatus('loading');
    setErrorMsg(null);

    setTimeout(() => {
      setStatus('verified');
    }, 1500);
  };

  return { status, errorMsg, verify };
};