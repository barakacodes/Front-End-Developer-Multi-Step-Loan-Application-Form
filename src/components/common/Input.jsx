import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1 mb-4 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      ref={ref}
      type={type}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent ${error ? 'border-brand-red' : 'border-gray-300'} ${className}`}
      {...props}
    />
    {error && (
      <span role="alert" aria-live="polite" className="text-brand-red text-xs mt-1">
        {error.message}
      </span>
    )}
  </div>
));
Input.displayName = 'Input';
export default Input;