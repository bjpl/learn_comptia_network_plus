import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';
import userEvent from '@testing-library/user-event';

// Component that throws an error
const ThrowError = ({ message = 'Test error' }: { message?: string }) => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for these tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Error Display', () => {
    it('should render error message', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('We encountered an error while loading this page.')).toBeInTheDocument();
    });

    it('should display error icon', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      const svg = screen.getByRole('img', { hidden: true });
      expect(svg).toBeInTheDocument();
    });

    it('should show error details when error has message', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError message="Network connection failed" />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Network connection failed')).toBeInTheDocument();
    });

    it('should show "Unknown error" when error has no message', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError message="" />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });
  });

  describe('Navigation Actions', () => {
    it('should render "Go to Home Page" link', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      const homeLink = screen.getByRole('link', { name: /go to home page/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render "Reload Page" button', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      const reloadButton = screen.getByRole('button', { name: /reload page/i });
      expect(reloadButton).toBeInTheDocument();
    });

    it('should call window.location.reload when reload button is clicked', async () => {
      const user = userEvent.setup();
      const reloadSpy = vi.fn();

      // Mock window.location.reload
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { reload: reloadSpy },
      });

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      const reloadButton = screen.getByRole('button', { name: /reload page/i });
      await user.click(reloadButton);

      expect(reloadSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes for layout', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      const { container } = render(<RouterProvider router={router} />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('min-h-screen');
      expect(mainDiv).toHaveClass('bg-gray-50');
      expect(mainDiv).toHaveClass('dark:bg-gray-900');
      expect(mainDiv).toHaveClass('flex');
      expect(mainDiv).toHaveClass('items-center');
      expect(mainDiv).toHaveClass('justify-center');
    });

    it('should apply dark mode classes', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      const { container } = render(<RouterProvider router={router} />);

      const heading = screen.getByText('Oops! Something went wrong');
      expect(heading).toHaveClass('dark:text-white');
    });
  });

  describe('Error Types', () => {
    it('should handle TypeError', () => {
      const ThrowTypeError = () => {
        throw new TypeError('Type error occurred');
      };

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowTypeError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Type error occurred')).toBeInTheDocument();
    });

    it('should handle ReferenceError', () => {
      const ThrowReferenceError = () => {
        throw new ReferenceError('Variable not defined');
      };

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowReferenceError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Variable not defined')).toBeInTheDocument();
    });

    it('should handle custom error messages', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError message="Custom authentication error: Token expired" />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Custom authentication error: Token expired')).toBeInTheDocument();
    });

    it('should handle very long error messages', () => {
      const longMessage = 'Error: '.repeat(50) + 'This is a very long error message';

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError message={longMessage} />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByRole('link', { name: /go to home page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      const heading = screen.getByRole('heading', { name: /oops! something went wrong/i });
      expect(heading.tagName).toBe('H1');
    });

    it('should have visible error message for screen readers', () => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowError message="Accessibility test error" />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      const errorMessage = screen.getByText('Accessibility test error');
      expect(errorMessage).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('should handle error without name property', () => {
      const CustomError = () => {
        const error: any = { message: 'Error without name' };
        throw error;
      };

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <CustomError />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Error without name')).toBeInTheDocument();
    });

    it('should handle null error', () => {
      const ThrowNull = () => {
        throw null;
      };

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowNull />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });

    it('should handle undefined error', () => {
      const ThrowUndefined = () => {
        throw undefined;
      };

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowUndefined />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });

    it('should handle string error', () => {
      const ThrowString = () => {
        throw 'String error message';
      };

      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <ThrowString />,
            errorElement: <ErrorBoundary />,
          },
        ],
        { initialEntries: ['/'] }
      );

      render(<RouterProvider router={router} />);

      // Router will convert string to error object
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
