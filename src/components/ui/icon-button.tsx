import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'medium', children, ...props }, ref) => {
    const sizeStyles = {
      small: 'h-8 w-8 text-sm',
      medium: 'h-10 w-10 text-base',
      large: 'h-12 w-12 text-lg'
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${sizeStyles[size]} ${
          className || ''
        }`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
