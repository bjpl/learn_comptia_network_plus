import * as React from 'react';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, defaultValue, value, onValueChange, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || '');

    const handleTabChange = (newValue: string) => {
      if (value === undefined) {
        setActiveTab(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <div ref={ref} className={className} data-active-tab={value ?? activeTab} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onTabChange: handleTabChange } as never);
          }
          return child;
        })}
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className || ''}`} {...props} />
  )
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  ({ className, value, onClick, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm ${className || ''}`}
      onClick={(e) => {
        const parent = e.currentTarget.closest('[data-active-tab]');
        if (parent) {
          const onTabChange = (parent as any)['onTabChange'];
          if (typeof onTabChange === 'function') {
            (onTabChange as (value: string) => void)(value);
          }
        }
        onClick?.(e);
      }}
      {...props}
    />
  )
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, ...props }, ref) => (
    <div ref={ref} className={`mt-2 ${className || ''}`} data-value={value} {...props} />
  )
);
TabsContent.displayName = 'TabsContent';
