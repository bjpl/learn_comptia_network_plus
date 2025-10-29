#!/bin/bash
# Comprehensive TypeScript error fixes

echo "Fixing TypeScript strict mode errors..."

# Fix Badge component - add missing variants
cat > src/components/ui/badge.tsx << 'EOF'
import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary' | 'outline' | 'destructive';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-900',
      success: 'bg-green-100 text-green-900',
      warning: 'bg-yellow-100 text-yellow-900',
      error: 'bg-red-100 text-red-900',
      secondary: 'bg-blue-100 text-blue-900',
      outline: 'border border-gray-300 text-gray-700 bg-transparent',
      destructive: 'bg-red-500 text-white'
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
EOF

echo "✓ Fixed Badge component variants"

# Run typecheck to see remaining errors
npm run typecheck

echo "Script completed. Check output above for remaining errors."
