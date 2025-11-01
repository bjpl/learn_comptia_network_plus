import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary' | 'outline' | 'destructive';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300',
      secondary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300',
      outline:
        'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent',
      destructive: 'bg-red-500 dark:bg-red-600 text-white dark:text-red-100',
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className || ''}`}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
