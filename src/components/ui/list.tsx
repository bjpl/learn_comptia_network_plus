import * as React from 'react';

export const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={`divide-y divide-gray-200 ${className || ''}`}
      {...props}
    />
  )
);
List.displayName = 'List';

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  button?: boolean;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, button, ...props }, ref) => (
    <li
      ref={ref}
      className={`flex items-center px-4 py-3 ${
        button ? 'cursor-pointer hover:bg-gray-50' : ''
      } ${className || ''}`}
      {...props}
    />
  )
);
ListItem.displayName = 'ListItem';

export const ListItemIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`mr-3 flex-shrink-0 ${className || ''}`}
      {...props}
    />
  )
);
ListItemIcon.displayName = 'ListItemIcon';

export const ListItemText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`flex-1 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
ListItemText.displayName = 'ListItemText';
