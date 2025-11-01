import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/shared/Layout';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Lazy load pages with prefetch hints
const Dashboard = React.lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));
const HomePage = React.lazy(() => import(/* webpackChunkName: "homepage" */ './pages/HomePage'));
const NotFound = React.lazy(() => import(/* webpackChunkName: "notfound" */ './pages/NotFound'));

// Optimized loading component
const LoadingFallback = () => <LoadingSpinner />;

// Wrapper for lazy loaded routes with Suspense
const LazyRoute: React.FC<{ component: React.LazyExoticComponent<React.ComponentType> }> = ({
  component: Component,
}) => (
  <React.Suspense fallback={<LoadingFallback />}>
    <Component />
  </React.Suspense>
);

// Breadcrumb navigation map
export const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  '/': { title: 'Home' },
  '/home': { title: 'Home' },
};

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
        element: <LazyRoute component={Dashboard} />,
      },
      {
        path: 'home',
        element: <LazyRoute component={HomePage} />,
      },
    ],
  },
  // 404 Not Found
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <LazyRoute component={NotFound} />
      </ErrorBoundary>
    ),
  },
]);
