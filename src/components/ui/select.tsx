import * as React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    const selectElement = (
      <select
        ref={ref}
        className={`flex h-10 w-full rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
          className || ''
        }`}
        {...props}
      >
        {children}
      </select>
    );

    if (label) {
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {selectElement}
        </div>
      );
    }

    return selectElement;
  }
);
Select.displayName = 'Select';

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, fullWidth, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    />
  )
);
FormControl.displayName = 'FormControl';

export const InputLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium text-gray-700 ${className || ''}`}
      {...props}
    />
  )
);
InputLabel.displayName = 'InputLabel';

export interface MenuItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const MenuItem = React.forwardRef<HTMLOptionElement, MenuItemProps>(
  ({ className, ...props }, ref) => (
    <option ref={ref} className={className} {...props} />
  )
);
MenuItem.displayName = 'MenuItem';
