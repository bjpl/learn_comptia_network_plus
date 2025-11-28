/**
 * Authentication Hooks
 * Provides unified access to authentication state and actions
 */

// Re-export useAuth from context for backward compatibility
export { useAuth } from '../contexts/AuthContext';

// Export direct Zustand store hook for new code (recommended)
export { useAuthStore } from '../stores/authStore';

/**
 * Usage:
 *
 * // Backward compatible (uses Context wrapper):
 * import { useAuth } from '../hooks/useAuth';
 * const { user, login, logout } = useAuth();
 *
 * // Direct Zustand store (recommended for new code):
 * import { useAuthStore } from '../hooks/useAuth';
 * const { user, login, logout } = useAuthStore();
 *
 * // Both provide the same interface and share the same state
 */
