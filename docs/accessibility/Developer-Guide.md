# Accessibility Developer Guide

**CompTIA Network+ Learning Platform**

This guide provides practical patterns and best practices for maintaining WCAG 2.1 Level AA compliance in the CompTIA Network+ learning platform.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Common Patterns](#common-patterns)
3. [Component Examples](#component-examples)
4. [Testing Your Code](#testing-your-code)
5. [Common Mistakes](#common-mistakes)
6. [Tools & Extensions](#tools--extensions)

---

## Quick Reference

### Accessibility Hooks

```tsx
import {
  useAnnouncement, // Screen reader announcements
  useFocusManagement, // Focus handling
  useFocusTrap, // Modal focus traps
  useKeyboardShortcuts, // Keyboard shortcuts
} from '@/hooks/accessibility';
```

### Accessibility Components

```tsx
import {
  SkipLink, // Skip navigation link
  LiveRegion, // ARIA live region
} from '@/components/accessibility';
```

---

## Common Patterns

### 1. Form Inputs with Labels

**✅ CORRECT:**

```tsx
<div className="form-field">
  <label htmlFor="user-email" className="form-label">
    Email Address
    <span className="required" aria-label="required">
      *
    </span>
  </label>
  <input
    id="user-email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    aria-describedby="email-hint email-error"
    aria-required="true"
    aria-invalid={hasError}
    className="form-input"
  />
  <span id="email-hint" className="hint-text">
    We'll never share your email
  </span>
  {hasError && (
    <span id="email-error" className="error-text" role="alert">
      Please enter a valid email address
    </span>
  )}
</div>
```

**❌ INCORRECT:**

```tsx
{/* Missing label association */}
<label>Email:</label>
<input type="email" value={email} />

{/* No error announcement */}
{error && <span className="error">{error}</span>}
```

---

### 2. Buttons vs Links

**Use `<button>` for actions:**

```tsx
// ✅ Actions that change state
<button onClick={handleSubmit}>Submit Form</button>
<button onClick={handleDelete}>Delete Item</button>
<button onClick={() => setIsOpen(true)}>Open Modal</button>
```

**Use `<a>` for navigation:**

```tsx
// ✅ Navigation to different pages
<Link to="/dashboard">Dashboard</Link>
<a href="#main-content">Skip to content</a>
```

**❌ NEVER:**

```tsx
// Don't use div/span as buttons
<div onClick={handleClick}>Click Me</div>

// Don't use buttons for navigation
<button onClick={() => navigate('/home')}>Home</button>
```

---

### 3. Dynamic Content Announcements

```tsx
import { useAnnouncement } from '@/hooks/accessibility';
import { LiveRegion } from '@/components/accessibility';

export const MyComponent = () => {
  const { announcement, announce } = useAnnouncement();

  const handleSubmit = async () => {
    try {
      const result = await submitForm();

      // Announce success (polite - waits for pause)
      announce(`Form submitted successfully. Score: ${result.score}%`, 'polite');
    } catch (error) {
      // Announce error (assertive - immediate)
      announce('Error: Form submission failed. Please try again.', 'assertive');
    }
  };

  return (
    <div>
      {/* Your component content */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Live region for announcements */}
      <LiveRegion message={announcement?.message} priority={announcement?.priority} />
    </div>
  );
};
```

---

### 4. Focus Management

#### Moving Focus to New Content

```tsx
import { useFocusManagement } from '@/hooks/accessibility';

export const SearchResults = ({ results, isLoading }) => {
  const { ref, moveFocus } = useFocusManagement();

  useEffect(() => {
    if (results.length > 0 && !isLoading) {
      // Move focus to results when they appear
      moveFocus();
    }
  }, [results, isLoading, moveFocus]);

  return (
    <div ref={ref} tabIndex={-1} role="region" aria-label="Search results">
      <h2>Search Results ({results.length})</h2>
      {/* Results content */}
    </div>
  );
};
```

#### Focus Trap in Modals

```tsx
import { useFocusTrap, useFocusManagement } from '@/hooks/accessibility';

export const Modal = ({ isOpen, onClose, children }) => {
  const containerRef = useFocusTrap(isOpen);
  const { saveFocus, restoreFocus } = useFocusManagement();

  useEffect(() => {
    if (isOpen) {
      saveFocus(); // Save current focus
    } else {
      restoreFocus(); // Restore focus on close
    }
  }, [isOpen, saveFocus, restoreFocus]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">Modal Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

---

### 5. Keyboard Shortcuts

```tsx
import { useKeyboardShortcuts } from '@/hooks/accessibility';

export const MyComponent = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  const shortcuts = [
    {
      key: '/',
      handler: () => searchRef.current?.focus(),
      description: 'Focus search field',
    },
    {
      key: 'n',
      ctrl: true,
      handler: handleNew,
      description: 'Create new item',
    },
    {
      key: 's',
      ctrl: true,
      handler: handleSave,
      description: 'Save changes',
    },
    {
      key: 'Escape',
      handler: handleClose,
      description: 'Close modal',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <div>
      <input ref={searchRef} type="search" />
      {/* Component content */}
    </div>
  );
};
```

---

### 6. Icon Buttons

```tsx
// ✅ CORRECT - Icon with accessible label
<button
  onClick={handleDelete}
  aria-label="Delete item"
  className="icon-button"
>
  <TrashIcon aria-hidden="true" />
</button>

// ✅ CORRECT - Icon with visible text
<button onClick={handleSave} className="button">
  <SaveIcon aria-hidden="true" />
  <span>Save Changes</span>
</button>

// ❌ INCORRECT - No accessible name
<button onClick={handleDelete}>
  <TrashIcon />
</button>
```

---

### 7. Loading States

```tsx
export const LoadingComponent = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div role="status" aria-live="polite" aria-busy="true" className="loading-container">
        <div className="spinner" aria-hidden="true" />
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};
```

---

### 8. Error Messages

```tsx
export const FormField = ({ value, error, onChange }) => {
  const errorId = `error-${useId()}`;
  const hintId = `hint-${useId()}`;

  return (
    <div className="form-field">
      <label htmlFor={inputId}>Field Label</label>
      <input
        id={inputId}
        value={value}
        onChange={onChange}
        aria-describedby={`${hintId} ${error ? errorId : ''}`}
        aria-invalid={!!error}
      />
      <span id={hintId} className="hint">
        Helpful hint text
      </span>
      {error && (
        <span id={errorId} className="error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
```

---

### 9. Data Tables

```tsx
export const DataTable = ({ data }) => {
  return (
    <table role="table" aria-label="User data table">
      <caption>User Information</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <th scope="row">{user.name}</th>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button aria-label={`Edit ${user.name}`}>
                <EditIcon aria-hidden="true" />
              </button>
              <button aria-label={`Delete ${user.name}`}>
                <DeleteIcon aria-hidden="true" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

### 10. Touch Targets

```tsx
// ✅ CORRECT - Minimum 44x44px
<button className="min-w-[44px] min-h-[44px] p-3">
  <Icon />
</button>

// ✅ CORRECT - Larger clickable area for small elements
<label className="flex items-center gap-2 p-3 cursor-pointer">
  <input type="radio" className="h-4 w-4" />
  <span>Option text makes entire label clickable</span>
</label>

// ❌ INCORRECT - Too small
<button className="p-1">
  <Icon className="w-3 h-3" />
</button>
```

---

## Component Examples

### Accessible Card Component

```tsx
interface CardProps {
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}

export const AccessibleCard: React.FC<CardProps> = ({
  title,
  description,
  action,
  actionLabel = 'Learn more',
}) => {
  return (
    <article className="card" aria-labelledby={`card-title-${useId()}`}>
      <h3 id={`card-title-${useId()}`}>{title}</h3>
      <p>{description}</p>
      {action && (
        <button
          onClick={action}
          className="card-button"
          aria-label={`${actionLabel} about ${title}`}
        >
          {actionLabel}
        </button>
      )}
    </article>
  );
};
```

### Accessible Dropdown

```tsx
export const Dropdown = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = useId();

  return (
    <div className="dropdown">
      <label id={`${dropdownId}-label`} htmlFor={dropdownId}>
        {label}
      </label>
      <select
        id={dropdownId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-labelledby={`${dropdownId}-label`}
        className="dropdown-select"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
```

---

## Testing Your Code

### 1. Keyboard Testing

```bash
# Navigate with Tab
Tab         # Move forward
Shift+Tab   # Move backward

# Activate elements
Enter       # Activate links and buttons
Space       # Activate buttons and checkboxes
Arrow keys  # Navigate radio groups and dropdowns

# Close dialogs
Escape      # Close modal/dialog
```

### 2. Screen Reader Testing

**NVDA (Windows - Free):**

```bash
# Download: https://www.nvaccess.org/download/
Insert+Down    # Read all
Insert+F7      # List elements
H              # Next heading
D              # Next landmark
F              # Next form field
```

**VoiceOver (Mac - Built-in):**

```bash
Cmd+F5         # Enable VoiceOver
VO+A           # Read all
VO+U           # Rotor (list elements)
VO+H           # Next heading
VO+J           # Jump to element
```

### 3. Automated Testing

```bash
# Run E2E accessibility tests
npm run test:e2e

# Run specific accessibility tests
npx playwright test tests/e2e/accessibility.spec.ts

# Generate accessibility report
npm run test:e2e -- --reporter=html
```

---

## Common Mistakes

### ❌ Mistake 1: Clickable Divs

```tsx
// WRONG
<div onClick={handleClick}>Click me</div>

// RIGHT
<button onClick={handleClick}>Click me</button>
```

### ❌ Mistake 2: Missing Alt Text

```tsx
// WRONG
<img src="logo.png" />

// RIGHT - Informative image
<img src="logo.png" alt="Company logo" />

// RIGHT - Decorative image
<img src="decorative.png" alt="" aria-hidden="true" />
```

### ❌ Mistake 3: Color-Only Information

```tsx
// WRONG - Relies on color alone
<span className="text-red-500">Error</span>
<span className="text-green-500">Success</span>

// RIGHT - Icon + text + color
<span className="text-red-500" role="alert">
  <ErrorIcon aria-hidden="true" />
  Error: Operation failed
</span>
```

### ❌ Mistake 4: Auto-Playing Content

```tsx
// WRONG
<video src="intro.mp4" autoPlay />

// RIGHT
<video
  src="intro.mp4"
  controls
  aria-label="Introduction video"
>
  <track kind="captions" src="captions.vtt" />
</video>
```

### ❌ Mistake 5: Placeholder as Label

```tsx
// WRONG - Disappears when typing
<input type="text" placeholder="Enter your name" />

// RIGHT
<label htmlFor="name">Name:</label>
<input
  id="name"
  type="text"
  placeholder="e.g., John Smith"
  aria-describedby="name-hint"
/>
<span id="name-hint">Enter your full name</span>
```

---

## Tools & Extensions

### Browser Extensions

- **axe DevTools** - Comprehensive accessibility testing
- **WAVE** - Visual feedback on accessibility issues
- **Lighthouse** - Built-in Chrome audit tool
- **Accessibility Insights** - Microsoft's testing tool

### VS Code Extensions

- **axe Accessibility Linter** - Real-time linting
- **webhint** - Best practices checker
- **ESLint** with `eslint-plugin-jsx-a11y`

### Command Line Tools

```bash
# Install pa11y
npm install -g pa11y

# Test a page
pa11y http://localhost:3000

# Test with specific standard
pa11y --standard WCAG2AA http://localhost:3000
```

---

## Quick Checklist

Before submitting a PR, verify:

- [ ] All interactive elements keyboard accessible
- [ ] Focus visible on all focusable elements
- [ ] Color contrast meets 4.5:1 ratio (normal text)
- [ ] Color contrast meets 3:1 ratio (large text, UI elements)
- [ ] All images have alt text (or alt="" if decorative)
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Dynamic content changes announced
- [ ] Modal dialogs trap focus
- [ ] Skip link present on pages with navigation
- [ ] Headings in logical order (single H1)
- [ ] ARIA attributes used correctly
- [ ] Touch targets minimum 44x44px
- [ ] No auto-playing media
- [ ] Tested with keyboard only
- [ ] Tested with screen reader
- [ ] axe DevTools shows no violations

---

## Getting Help

### Internal Resources

- `/docs/accessibility/WCAG-Compliance-Report.md` - Implementation details
- `/docs/accessibility/Testing-Guide.md` - Testing procedures
- `/src/hooks/accessibility/` - Accessibility hooks
- `/src/components/accessibility/` - Accessibility components

### External Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Remember:** Accessibility is not optional. It's a requirement for all users to have equal access to our platform.
