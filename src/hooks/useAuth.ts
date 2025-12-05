/**
 * Authentication Hooks
 * Direct re-export of Zustand auth store
 */

// Export Zustand store as the primary authentication hook
export { useAuthStore } from '../stores/authStore';

/**
 * Usage:
 *
 * import { useAuthStore } from '../hooks/useAuth';
 * const { user, login, logout, isAuthenticated } = useAuthStore();
 */
