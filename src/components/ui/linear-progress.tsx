import * as React from 'react';

export interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
}

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ className, value = 0, variant = 'determinate', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-1 w-full overflow-hidden rounded-full bg-gray-200 ${className || ''}`}
        {...props}
      >
        <div
          className={`h-full bg-blue-600 transition-all ${
            variant === 'indeterminate' ? 'animate-pulse' : ''
          }`}
          style={variant === 'determinate' ? { width: `${value}%` } : { width: '100%' }}
        />
      </div>
    );
  }
);
LinearProgress.displayName = 'LinearProgress';
