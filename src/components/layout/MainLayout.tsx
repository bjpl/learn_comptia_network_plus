import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../store';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const { theme } = useAppStore();

  // Generate breadcrumbs from path
  const breadcrumbs = React.useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      path: '/' + paths.slice(0, index + 1).join('/'),
    }));
  }, [location.pathname]);

  return (
    <div className={theme.mode === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    <a
                      href="/"
                      className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Home
                    </a>
                  </li>
                  {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.path} className="flex items-center">
                      <svg
                        className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {index === breadcrumbs.length - 1 ? (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {crumb.label}
                        </span>
                      ) : (
                        <a
                          href={crumb.path}
                          className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {crumb.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Page Content */}
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
