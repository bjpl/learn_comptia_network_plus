import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Network Appliance Comparison Matrix
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        CompTIA Network+ N10-008 - Interactive device comparison tool with 25+ networking
        appliances
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-900 dark:bg-blue-900 dark:text-blue-100">
          25+ Devices
        </span>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-900 dark:bg-green-900 dark:text-green-100">
          All OSI Layers
        </span>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-900 dark:bg-purple-900 dark:text-purple-100">
          20+ Exam Questions
        </span>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-900 dark:bg-orange-900 dark:text-orange-100">
          Decision Helper
        </span>
      </div>
    </div>
  );
};

export default Header;
