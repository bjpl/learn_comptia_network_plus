import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  // Extract error message from various error types
  const getErrorMessage = (): string => {
    if (!error) {
      return 'Unknown error';
    }

    if (error instanceof Error) {
      return error.message || 'Unknown error';
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message) || 'Unknown error';
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Unknown error';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We encountered an error while loading this page.
        </p>

        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left dark:border-red-800 dark:bg-red-900/20">
          <p className="font-mono text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Go to Home Page
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="block w-full rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};
