import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';

interface HomePageComponent {
  id: string;
  name: string;
  path: string;
  learningObjective: string;
  description: string;
}

interface ComponentCardProps {
  component: HomePageComponent;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const { progress } = useAppStore();
  const isCompleted = progress.componentsCompleted.includes(component.id);

  return (
    <Link
      to={component.path}
      className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
        isCompleted
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {component.name}
        </h3>
        {isCompleted && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            ✓ Complete
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {component.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {component.learningObjective}
        </span>
      </div>
    </Link>
  );
};
