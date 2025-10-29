import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useProgressStore } from '../stores/progressStore';

const Dashboard: React.FC = () => {
  const { overallProgress } = useProgress();
  const getCategoryProgress = useProgressStore((state) => state.getCategoryProgress);

  const categories = [
    { id: 'osi', name: 'OSI Model', icon: '📚', color: 'blue', path: '/osi/layer-builder' },
    { id: 'appliances', name: 'Network Appliances', icon: '🖥️', color: 'cyan', path: '/appliances/comparison' },
    { id: 'cloud', name: 'Cloud Computing', icon: '☁️', color: 'purple', path: '/cloud/summary-builder' },
    { id: 'protocols', name: 'Protocols', icon: '🔌', color: 'green', path: '/protocols/trainer' },
    { id: 'media', name: 'Physical Media', icon: '🔗', color: 'yellow', path: '/media/selection-matrix' },
    { id: 'topologies', name: 'Topologies', icon: '🕸️', color: 'pink', path: '/topologies/analyzer' },
    { id: 'ipv4', name: 'IPv4 & Subnetting', icon: '🌐', color: 'indigo', path: '/ipv4/subnet-designer' },
    { id: 'modern', name: 'Modern Topics', icon: '🚀', color: 'red', path: '/modern/technology' },
    { id: 'assessment', name: 'Assessment', icon: '📝', color: 'gray', path: '/assessment/dashboard' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to CompTIA Network+</h1>
        <p className="text-lg opacity-90">Interactive learning platform for certification preparation</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Overall Completion</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {overallProgress.totalCompleted} / {overallProgress.totalComponents} components
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {overallProgress.percentage.toFixed(1)}% Complete
            </p>
          </div>

          {overallProgress.averageScore > 0 && (
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Score:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {overallProgress.averageScore.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Learning Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const progress = getCategoryProgress(category.id);
            const percentage = progress.totalComponents > 0
              ? (progress.componentsCompleted / progress.totalComponents) * 100
              : 0;

            return (
              <Link
                key={category.id}
                to={category.path}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl" role="img" aria-label={category.name}>
                    {category.icon}
                  </span>
                  {progress.componentsCompleted === progress.totalComponents && progress.totalComponents > 0 && (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>

                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-${category.color}-600 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {progress.componentsCompleted} / {progress.totalComponents || '?'} completed
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/assessment/simulator"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Scenario Simulator</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Practice real scenarios</p>
            </div>
          </Link>

          <Link
            to="/assessment/dashboard"
            className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Progress Dashboard</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your progress</p>
            </div>
          </Link>

          <Link
            to="/osi/layer-builder"
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Start Learning</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Begin with OSI Model</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
