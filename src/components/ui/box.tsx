import * as React from 'react';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  component?: keyof JSX.IntrinsicElements;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, component = 'div', children, ...props }, ref) => {
    return React.createElement(component, { ref, className, ...props }, children);
  }
);
Box.displayName = 'Box';

export const Grid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`grid gap-4 ${className || ''}`} {...props} />
  )
);
Grid.displayName = 'Grid';

export const Typography = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { variant?: string }
>(({ className, variant, ...props }, ref) => {
  const variants: Record<string, string> = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    body1: 'text-base',
    body2: 'text-sm',
    caption: 'text-xs text-gray-500',
  };

  return (
    <p ref={ref} className={`${variant ? variants[variant] : ''} ${className || ''}`} {...props} />
  );
});
Typography.displayName = 'Typography';

export const Chip = Badge;

// Re-export Badge as Chip for MUI compatibility
import { Badge } from './badge';
