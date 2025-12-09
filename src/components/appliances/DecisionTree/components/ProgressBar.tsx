import React from 'react';
import { decisionTreeData } from '../../appliances-data';

interface ProgressBarProps {
  history: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ history }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Progress:</span>
      <div className="h-2 flex-1 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${(history.length / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {history.length} / ~5 steps
      </span>
    </div>

    <div className="flex items-center space-x-2 overflow-x-auto text-xs text-gray-500 dark:text-gray-400">
      {history.map((nodeId, index) => {
        const node = decisionTreeData.get(nodeId);
        return (
          <React.Fragment key={nodeId}>
            {index > 0 && <span>→</span>}
            <span
              className={`whitespace-nowrap ${index === history.length - 1 ? 'font-semibold text-blue-600' : ''}`}
            >
              {node?.text.slice(0, 25)}...
            </span>
          </React.Fragment>
        );
      })}
    </div>
  </div>
);
