import * as React from 'react';

interface AccordionContextValue {
  expanded: string | false;
  onChange: (panel: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultExpanded?: string;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, defaultExpanded, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState<string | false>(defaultExpanded || false);

    const handleChange = (panel: string) => {
      setExpanded(expanded === panel ? false : panel);
    };

    return (
      <AccordionContext.Provider value={{ expanded, onChange: handleChange }}>
        <div ref={ref} className={`space-y-2 ${className || ''}`} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

export interface AccordionSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  expandIcon?: React.ReactNode;
  panel: string;
}

export const AccordionSummary = React.forwardRef<HTMLDivElement, AccordionSummaryProps>(
  ({ className, children, expandIcon, panel, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) {throw new Error('AccordionSummary must be used within Accordion');}

    const isExpanded = context.expanded === panel;

    return (
      <div
        ref={ref}
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg border-b ${
          isExpanded ? 'bg-gray-50' : ''
        } ${className || ''}`}
        onClick={() => context.onChange(panel)}
        role="button"
        aria-expanded={isExpanded}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {expandIcon && (
          <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            {expandIcon}
          </div>
        )}
      </div>
    );
  }
);
AccordionSummary.displayName = 'AccordionSummary';

export interface AccordionDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  panel: string;
}

export const AccordionDetails = React.forwardRef<HTMLDivElement, AccordionDetailsProps>(
  ({ className, children, panel, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) {throw new Error('AccordionDetails must be used within Accordion');}

    const isExpanded = context.expanded === panel;

    if (!isExpanded) {return null;}

    return (
      <div ref={ref} className={`p-4 border-b ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
);
AccordionDetails.displayName = 'AccordionDetails';
