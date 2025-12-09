import React from 'react';

export const BestPractices: React.FC = () => {
  return (
    <div className="mt-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Infrastructure as Code Best Practices:
      </h3>
      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Core Principles:</h4>
          <ul className="list-inside list-disc space-y-1 text-gray-900 dark:text-gray-100">
            <li>Version control all infrastructure definitions</li>
            <li>Treat code and infrastructure the same</li>
            <li>Implement code reviews and testing</li>
            <li>Monitor and detect configuration drift</li>
            <li>Automate compliance checking</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
            Implementation Strategy:
          </h4>
          <ul className="list-inside list-disc space-y-1 text-gray-900 dark:text-gray-100">
            <li>Start with non-production environments</li>
            <li>Build reusable templates and modules</li>
            <li>Implement CI/CD pipelines for deployment</li>
            <li>Use consistent naming and documentation</li>
            <li>Enable audit logging and rollback capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
