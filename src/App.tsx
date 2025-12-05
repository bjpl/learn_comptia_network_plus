import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { router } from './router';
import MobileWarningModal from './components/shared/MobileWarningModal';
import './index.css';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <MobileWarningModal allowContinue={true} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
