import React from 'react';

interface NavigationButtonsProps {
  history: string[];
  onGoBack: () => void;
  onReset: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  history,
  onGoBack,
  onReset,
}) => (
  <div className="flex items-center justify-between gap-2">
    <button
      onClick={onGoBack}
      disabled={history.length <= 1}
      className={`rounded-lg px-4 py-2 font-medium transition-colors ${
        history.length <= 1
          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
          : 'bg-gray-500 text-white hover:bg-gray-600'
      }`}
    >
      Back
    </button>

    <button
      onClick={onReset}
      className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
    >
      Restart
    </button>
  </div>
);
