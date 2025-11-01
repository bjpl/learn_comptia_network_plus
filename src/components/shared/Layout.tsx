import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { SkipLink } from '../accessibility/SkipLink';
import { useAppStore } from '../../stores/appStore';
import { breadcrumbMap } from '../../router';

export const Layout: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const location = useLocation();

  // Generate breadcrumbs using breadcrumbMap
  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; path: string }> = [];
    let path = location.pathname;

    // Always start with home
    breadcrumbs.unshift({ label: 'Home', path: '/' });

    // Build breadcrumb chain by following parent relationships
    const visited = new Set<string>();
    while (path && path !== '/' && !visited.has(path)) {
      visited.add(path);
      const breadcrumbData = breadcrumbMap[path];
      if (breadcrumbData) {
        breadcrumbs.push({ label: breadcrumbData.title, path });
        path = breadcrumbData.parent || '';
      } else {
        // Fallback for unmapped routes
        const segment = path.split('/').pop() || '';
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ label, path });
        break;
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Skip to main content link for accessibility - WCAG 2.4.1 */}
      <SkipLink />

      <Header />

      <div className="relative flex flex-1">
        <Sidebar />

        <main
          id="main-content"
          className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'ml-0'} `}
          role="main"
        >
          {/* Breadcrumb navigation */}
          {breadcrumbs.length > 1 && (
            <nav
              className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800"
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.path} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-200 dark:text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span
                        className="font-medium text-gray-900 dark:text-white"
                        aria-current="page"
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.path}
                        className="text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Page content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};
