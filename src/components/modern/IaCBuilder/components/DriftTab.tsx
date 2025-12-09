import React from 'react';
import { driftExamples } from '../../modern-data';
import { getDriftSeverityColor } from '../utils';

export const DriftTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
          Configuration Drift Detection
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Identify unauthorized changes and maintain configuration compliance
        </p>
      </div>

      <div className="space-y-4">
        {driftExamples.map((drift) => (
          <div
            key={drift.hostId}
            className={`rounded-lg border-2 p-6 ${getDriftSeverityColor(drift.severity)}`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold">{drift.hostname}</h4>
                <p className="text-sm">Detected: {drift.detectedAt.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    drift.severity === 'critical'
                      ? 'bg-red-200'
                      : drift.severity === 'high'
                        ? 'bg-orange-200'
                        : drift.severity === 'medium'
                          ? 'bg-yellow-200'
                          : 'bg-blue-200'
                  }`}
                >
                  {drift.severity.toUpperCase()}
                </span>
                {drift.autoFixable && (
                  <div className="mt-1 text-xs">
                    <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                      Auto-fixable
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {drift.drifts.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-white bg-opacity-50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="font-semibold">{item.parameter}</span>
                    <span className="rounded bg-white px-2 py-1 text-xs">{item.category}</span>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-900">Expected:</span>{' '}
                      <code className="rounded bg-white px-2 py-1">
                        {String(item.expected)}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-900">Actual:</span>{' '}
                      <code className="rounded bg-white px-2 py-1">{String(item.actual)}</code>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="mb-1">
                      <span className="font-semibold">Impact:</span> {item.impact}
                    </div>
                    <div>
                      <span className="font-semibold">Recommendation:</span>{' '}
                      {item.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {drift.autoFixable && (
              <div className="mt-4 flex gap-2">
                <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  Auto-Fix All
                </button>
                <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Generate Remediation Playbook
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
