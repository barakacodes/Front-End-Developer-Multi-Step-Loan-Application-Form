import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignatureCanvas = ({ onSignatureChange, error }) => {
  const sigPadRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Handle signature changes
  const handleEnd = () => {
    if (!sigPadRef.current) return;
    const isEmpty = sigPadRef.current.isEmpty();
    setIsEmpty(isEmpty);
    if (!isEmpty) {
      const dataURL = sigPadRef.current.toDataURL('image/png');
      onSignatureChange(dataURL);
    } else {
      onSignatureChange(null);
    }
  };

  const clearSignature = () => {
    sigPadRef.current.clear();
    setIsEmpty(true);
    onSignatureChange(null);
  };

  // Resize canvas for mobile responsiveness
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = sigPadRef.current?.getCanvas();
      if (canvas) {
        const parentWidth = canvas.parentElement.clientWidth;
        // Maintaining a reasonable aspect ratio for signatures
        canvas.width = Math.min(parentWidth, 600);
        canvas.height = 150;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">E-Signature</label>
      <div className={`border-2 rounded overflow-hidden ${error ? 'border-brand-red' : 'border-gray-300'}`}>
        <SignaturePad
          ref={sigPadRef}
          canvasProps={{ className: 'w-full h-32 bg-white' }}
          onEnd={handleEnd}
        />
      </div>
      <div className="flex justify-between mt-1">
        <button type="button" onClick={clearSignature} className="text-sm text-gray-500 hover:text-brand-red transition">Clear</button>
        {error && <span role="alert" className="text-brand-red text-xs">{error}</span>}
      </div>
    </div>
  );
};

export default SignatureCanvas;