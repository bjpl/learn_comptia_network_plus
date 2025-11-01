import * as React from 'react';

interface StepperContextValue {
  activeStep: number;
  orientation: 'horizontal' | 'vertical';
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined);

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, activeStep, orientation = 'vertical', children, ...props }, ref) => {
    return (
      <StepperContext.Provider value={{ activeStep, orientation }}>
        <div
          ref={ref}
          className={`${orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col'} ${
            className || ''
          }`}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = 'Stepper';

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, index = 0, ...props }, ref) => {
    const context = React.useContext(StepperContext);
    if (!context) {
      throw new Error('Step must be used within Stepper');
    }

    const isActive = context.activeStep === index;
    const isCompleted = context.activeStep > index;

    return (
      <div
        ref={ref}
        className={`${context.orientation === 'horizontal' ? 'flex-1' : 'w-full'} ${className || ''}`}
        data-active={isActive}
        data-completed={isCompleted}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Step.displayName = 'Step';

export interface StepLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  optional?: React.ReactNode;
}

export const StepLabel = React.forwardRef<HTMLDivElement, StepLabelProps>(
  ({ className, children, optional, ...props }, ref) => {
    const parentStep = (ref as React.RefObject<HTMLDivElement>)?.current?.closest('[data-active]');
    const isActive = parentStep?.getAttribute('data-active') === 'true';
    const isCompleted = parentStep?.getAttribute('data-completed') === 'true';

    return (
      <div ref={ref} className={`flex items-center gap-2 ${className || ''}`} {...props}>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
            isCompleted
              ? 'border-blue-600 bg-blue-600 text-white'
              : isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-gray-300 text-gray-400'
          }`}
        >
          {isCompleted ? '✓' : null}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
            {children}
          </div>
          {optional && <div className="text-xs text-gray-500">{optional}</div>}
        </div>
      </div>
    );
  }
);
StepLabel.displayName = 'StepLabel';

export type StepContentProps = React.HTMLAttributes<HTMLDivElement>;

export const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`ml-10 mt-2 pb-4 ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
);
StepContent.displayName = 'StepContent';
