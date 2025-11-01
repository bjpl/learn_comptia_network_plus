import * as React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'error' | 'success' | 'warning';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      error:
        'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border-red-200 dark:border-red-800',
      success:
        'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 border-green-200 dark:border-green-800',
      warning:
        'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    };

    return (
      <div
        ref={ref}
        className={`relative w-full rounded-lg border p-4 ${variantStyles[variant]} ${className || ''}`}
        {...props}
      />
    );
  }
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={`mb-1 font-medium leading-none ${className || ''}`} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`text-sm ${className || ''}`} {...props} />
));
AlertDescription.displayName = 'AlertDescription';
