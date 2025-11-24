import * as React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <hr
      ref={ref}
      className={`${
        orientation === 'horizontal'
          ? 'w-full border-t border-gray-200'
          : 'h-full border-l border-gray-200'
      } ${className || ''}`}
      {...props}
    />
  )
);
Divider.displayName = 'Divider';
