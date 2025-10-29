import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error handler for the entire app
const errorHandler = (error: ErrorEvent) => {
  console.error('Global error:', error);
};

const rejectionHandler = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
};

window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', rejectionHandler);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
