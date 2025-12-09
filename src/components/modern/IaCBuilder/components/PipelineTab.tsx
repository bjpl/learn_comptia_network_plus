import React from 'react';
import type { PipelineStage } from '../types';

const PIPELINE_STAGES: PipelineStage[] = [
  {
    name: 'Validate',
    description: 'Syntax and schema validation',
    status: 'success',
    duration: '12s',
  },
  {
    name: 'Test',
    description: 'Unit and integration tests',
    status: 'success',
    duration: '45s',
  },
  {
    name: 'Deploy (Staging)',
    description: 'Deploy to staging environment',
    status: 'success',
    duration: '2m 15s',
  },
  {
    name: 'Verify',
    description: 'Connectivity and configuration checks',
    status: 'running',
    duration: '1m 30s',
  },
  {
    name: 'Deploy (Production)',
    description: 'Production deployment',
    status: 'pending',
    duration: '-',
  },
];

export const PipelineTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
          NetOps CI/CD Pipeline
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Automated workflow for network configuration deployment
        </p>
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pipeline Stages
          </h4>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            Active
          </span>
        </div>

        <div className="space-y-4">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                  stage.status === 'success'
                    ? 'bg-green-500 text-white'
                    : stage.status === 'running'
                      ? 'animate-pulse bg-blue-500 text-white'
                      : stage.status === 'failed'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stage.status === 'success'
                  ? '✓'
                  : stage.status === 'running'
                    ? '⟳'
                    : stage.status === 'failed'
                      ? '✗'
                      : idx + 1}
              </div>
              <div className="flex-1 rounded-lg border-2 border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stage.name}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {stage.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {stage.duration}
                  </span>
                </div>
              </div>
              {idx < PIPELINE_STAGES.length - 1 && <div className="ml-6 h-8 w-px bg-gray-300"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Configuration */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Triggers</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Git push to main branch
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Pull request merge
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Scheduled: Daily at 2:00 AM
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Manual trigger
            </li>
          </ul>
        </div>

        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              Email: ops-team@example.com
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              Slack: #network-ops
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              PagerDuty: On failure
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              Dashboard: Real-time updates
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
