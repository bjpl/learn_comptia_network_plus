import React from 'react';
import type { QuestionViewProps } from '../types';

export const QuestionView: React.FC<QuestionViewProps> = ({ currentNode, onAnswer }) => (
  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900 dark:to-indigo-900">
    <div className="flex items-start space-x-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
        ?
      </div>
      <div className="flex-1">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {currentNode.text}
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => onAnswer('yes')}
            className="flex-1 rounded-lg bg-green-500 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-green-600 hover:shadow-lg"
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer('no')}
            className="flex-1 rounded-lg bg-red-500 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-red-600 hover:shadow-lg"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
);
