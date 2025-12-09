/**
 * Real-world scenarios tab component
 */

import React from 'react';
import type { OSILayerNumber } from '../../osi-types';
import { REAL_WORLD_SCENARIOS, LAYER_COLORS, LAYER_NAMES } from '../../osi-data';

export const ScenariosTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Real-World Scenarios by Layer
      </h2>

      {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
        const layer = layerNum as OSILayerNumber;
        const scenario = REAL_WORLD_SCENARIOS[layer];

        return (
          <div
            key={layer}
            className="rounded-lg border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white"
                style={{ backgroundColor: LAYER_COLORS[layer] }}
              >
                {scenario.icon}
              </div>
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Layer {layer} - {LAYER_NAMES[layer]}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {scenario.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  Process Flow:
                </h4>
                <ol className="space-y-2">
                  {scenario.steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  Key Protocols:
                </h4>
                <div className="mb-4 flex flex-wrap gap-2">
                  {scenario.protocols.map((protocol) => (
                    <span
                      key={protocol}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {protocol}
                    </span>
                  ))}
                </div>
                <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-red-900/20">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <div className="mb-1 font-semibold text-orange-900 dark:text-orange-100">
                        Exam Tip:
                      </div>
                      <p className="text-sm text-orange-950 dark:text-orange-100">
                        {scenario.examTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
