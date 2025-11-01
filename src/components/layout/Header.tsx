import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';

export const Header: React.FC = () => {
  const { theme, toggleTheme, progress } = useAppStore();
  const completionPercentage = Math.round((progress.componentsCompleted.length / 23) * 100);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">CompTIA Network+</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Interactive Learning Platform
              </p>
            </div>
          </Link>

          {/* Progress and Actions */}
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="hidden items-center space-x-2 md:flex">
              <span className="text-sm text-gray-700 dark:text-gray-300">Progress:</span>
              <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {completionPercentage}%
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme.mode === 'light' ? (
                <svg
                  className="h-5 w-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm font-semibold text-white">U</span>
              </div>
              <span className="hidden text-sm font-medium text-gray-700 sm:inline dark:text-gray-300">
                Student
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="px-4 pb-2 md:hidden">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            {completionPercentage}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};
