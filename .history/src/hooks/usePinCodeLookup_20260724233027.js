import { useState, useCallback } from 'react';
import { pinCodeData } from '../utils/pinCodeData';

export const usePinCodeLookup = () => {
  const [result, setResult] = useState({ city: '', state: '', postOffice: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);

  const lookup = useCallback((pinCode) => {
    setResult({ city: '', state: '', postOffice: '', error: '' });
    
    if (!pinCode || pinCode.length !== 6) {
      return;
    }

    setIsLoading(true);
    
    // Simulate a tiny delay for realism
    setTimeout(() => {
      const found = pinCodeData[pinCode];
      if (found) {
        setResult({ ...found, error: '' });
      } else {
        setResult({ city: '', state: '', postOffice: '', error: 'PIN code not found. Please verify.' });
      }
      setIsLoading(false);
    }, 300);
  }, []);

  return { result, isLoading, lookup };
};