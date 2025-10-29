import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { router } from './router';
import './index.css';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
