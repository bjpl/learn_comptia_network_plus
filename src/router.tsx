import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/shared/Layout';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </React.Suspense>
        ),
      },
    ],
  },
  // 404 Not Found
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingFallback />}>
          <NotFound />
        </React.Suspense>
      </ErrorBoundary>
    ),
  },
]);
