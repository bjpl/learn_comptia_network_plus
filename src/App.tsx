import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './router';
import MobileWarningModal from './components/shared/MobileWarningModal';
import './index.css';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <MobileWarningModal allowContinue={true} />
            <RouterProvider router={router} />
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
