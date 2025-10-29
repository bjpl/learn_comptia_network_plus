import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../../src/contexts/ThemeContext';
import { useAppStore } from '../../../src/stores/appStore';

describe('ThemeContext', () => {
  beforeEach(() => {
    // Reset app store
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setTheme('light');
    });

    // Clear document classes
    document.documentElement.classList.remove('light', 'dark');

    // Mock meta theme-color tag
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'theme-color');
    metaTag.setAttribute('content', '#ffffff');
    document.head.appendChild(metaTag);
  });

  describe('ThemeProvider', () => {
    it('should provide theme context to children', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('light')).toBeInTheDocument();
    });

    it('should apply theme class to document root', () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should update theme class when theme changes', () => {
      const TestComponent = () => {
        const { toggleTheme } = useTheme();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Toggle');
      act(() => {
        button.click();
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should update meta theme-color tag', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>Set Dark</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByText('Set Dark');
      act(() => {
        button.click();
      });

      const metaTag = document.querySelector('meta[name="theme-color"]');
      expect(metaTag?.getAttribute('content')).toBe('#1a202c');
    });

    it('should handle missing meta theme-color tag gracefully', () => {
      // Remove meta tag
      const metaTag = document.querySelector('meta[name="theme-color"]');
      metaTag?.remove();

      expect(() => {
        render(
          <ThemeProvider>
            <div>Test</div>
          </ThemeProvider>
        );
      }).not.toThrow();
    });

    it('should provide all theme context methods', () => {
      const TestComponent = () => {
        const context = useTheme();
        return (
          <div>
            <div data-testid="theme">{context.theme}</div>
            <div data-testid="has-set">{typeof context.setTheme === 'function' ? 'yes' : 'no'}</div>
            <div data-testid="has-toggle">{typeof context.toggleTheme === 'function' ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('has-set')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-toggle')).toHaveTextContent('yes');
    });
  });

  describe('useTheme Hook', () => {
    it('should return theme context', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('should set theme to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle theme from light to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle theme from dark to light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('Theme Synchronization', () => {
    it('should sync theme with app store', () => {
      const { result: themeResult } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });
      const { result: storeResult } = renderHook(() => useAppStore());

      act(() => {
        themeResult.current.setTheme('dark');
      });

      expect(storeResult.current.theme).toBe('dark');
    });

    it('should reflect store changes in theme context', () => {
      const { result: themeResult } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });
      const { result: storeResult } = renderHook(() => useAppStore());

      act(() => {
        storeResult.current.setTheme('dark');
      });

      expect(themeResult.current.theme).toBe('dark');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid theme changes', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.setTheme('dark');
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should maintain theme across multiple provider instances', () => {
      const { result: result1 } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result1.current.setTheme('dark');
      });

      const { result: result2 } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result2.current.theme).toBe('dark');
    });

    it('should handle theme updates during unmount', () => {
      const { result, unmount } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
});
