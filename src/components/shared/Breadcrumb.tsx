import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { breadcrumbMap } from '../../router';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Build breadcrumb trail
  const buildBreadcrumbs = () => {
    const breadcrumbs: Array<{ path: string; title: string }> = [];
    let path = currentPath;

    // Always start with home
    breadcrumbs.unshift({ path: '/', title: 'Home' });

    // Build breadcrumb chain by following parent relationships
    while (path && path !== '/') {
      const breadcrumbData = breadcrumbMap[path];
      if (breadcrumbData) {
        breadcrumbs.push({ path, title: breadcrumbData.title });
        path = breadcrumbData.parent || '';
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (currentPath === '/') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-white">
              {crumb.title}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {crumb.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
