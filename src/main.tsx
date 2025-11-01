import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { reportWebVitals, markPerformance } from './utils/performance';

// Mark app initialization start
markPerformance('app-init-start');

// Error handler for the entire app
const errorHandler = (error: ErrorEvent) => {
  console.error('Global error:', error);
};

const rejectionHandler = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
};

window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', rejectionHandler);

// Remove initial loading state
const rootElement = document.getElementById('root');
const loadingElement = document.getElementById('root-loading');
if (loadingElement) {
  loadingElement.remove();
}

// Mark before React render
markPerformance('react-render-start');

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Mark after React render
markPerformance('react-render-end');

// Report Web Vitals
reportWebVitals((metric) => {
  // You can send metrics to analytics service here
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }
});
