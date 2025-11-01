import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
          className || ''
        }`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export interface TextFieldProps extends Omit<InputProps, 'value' | 'onChange'> {
  label?: string;
  helperText?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${className || ''}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <Input ref={ref} error={error} {...props} />
        {helperText && (
          <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';
