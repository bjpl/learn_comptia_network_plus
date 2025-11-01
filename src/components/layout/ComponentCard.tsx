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
      className={`block rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
        isCompleted
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 hover:border-blue-500 dark:border-gray-700'
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{component.name}</h3>
        {isCompleted && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-900 dark:bg-green-900/30 dark:text-green-300">
            ✓ Complete
          </span>
        )}
      </div>

      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{component.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          {component.learningObjective}
        </span>
      </div>
    </Link>
  );
};
