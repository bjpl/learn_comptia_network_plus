/**
 * Encapsulation tab component
 */

import React from 'react';
import type { OSILayerNumber } from '../../osi-types';
import { ENCAPSULATION_EXAMPLE, MTU_VALUES, LAYER_COLORS } from '../../osi-data';

export const EncapsulationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Data Encapsulation Process
      </h2>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-sm text-blue-950 dark:text-blue-100">
          <strong>Original Data:</strong>{' '}
          <span className="font-mono">{ENCAPSULATION_EXAMPLE.originalData}</span>
        </p>
      </div>

      <div className="space-y-4">
        {ENCAPSULATION_EXAMPLE.steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white"
                style={{ backgroundColor: LAYER_COLORS[step.layer as OSILayerNumber] }}
              >
                L{step.layer}
              </div>
              <div className="flex-1 rounded-lg border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {step.layerName} Layer
                  </h3>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {step.pdu}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Action:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    {step.action}
                  </span>
                </div>
                <div className="break-all rounded bg-gray-50 p-3 font-mono text-sm dark:bg-gray-900">
                  {step.content}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{step.description}</p>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                    {step.size} bytes
                  </span>
                </div>
              </div>
            </div>
            {idx < ENCAPSULATION_EXAMPLE.steps.length - 1 && (
              <div className="my-2 ml-6 flex items-center gap-2">
                <div className="h-6 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  ↓ Encapsulation
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MTU Values */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          Common MTU Values (Exam Knowledge)
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(MTU_VALUES).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {value.size}
              </div>
              <div className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                {value.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
