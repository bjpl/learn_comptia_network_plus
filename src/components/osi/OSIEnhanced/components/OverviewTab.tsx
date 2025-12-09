/**
 * Overview tab component showing OSI layer cards
 */

import React from 'react';
import type { OSILayerNumber } from '../../osi-types';
import { PROTOCOLS, REAL_WORLD_SCENARIOS, LAYER_COLORS, LAYER_NAMES } from '../../osi-data';

interface OverviewTabProps {
  selectedLayer: OSILayerNumber | null;
  onLayerSelect: (layer: OSILayerNumber) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ selectedLayer, onLayerSelect }) => {
  return (
    <div
      className="space-y-6"
      role="tabpanel"
      id="overview-panel"
      aria-labelledby="overview-tab"
    >
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        OSI Model 7 Layers
      </h2>

      {/* Layer Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
          const layer = layerNum as OSILayerNumber;
          const protocols = PROTOCOLS.filter((p) => p.layer === layer);

          return (
            <button
              key={layer}
              onClick={() => onLayerSelect(layer)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                selectedLayer === layer
                  ? 'scale-105 border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-blue-400 dark:border-gray-700'
              } `}
              style={{
                backgroundColor:
                  selectedLayer === layer ? `${LAYER_COLORS[layer]}20` : undefined,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xl font-bold" style={{ color: LAYER_COLORS[layer] }}>
                  Layer {layer}
                </span>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: LAYER_COLORS[layer] }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {LAYER_NAMES[layer]}
              </h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {protocols.length} protocols
              </p>

              {selectedLayer === layer && (
                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Key Protocols:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {protocols.slice(0, 5).map((p) => (
                      <span
                        key={p.name}
                        className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {p.name}
                      </span>
                    ))}
                    {protocols.length > 5 && (
                      <span className="px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300">
                        +{protocols.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Layer Details */}
      {selectedLayer && (
        <div className="mt-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            Layer {selectedLayer}: {LAYER_NAMES[selectedLayer]}
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                Protocols:
              </h4>
              <div className="space-y-2">
                {PROTOCOLS.filter((p) => p.layer === selectedLayer).map((protocol) => (
                  <div
                    key={protocol.name}
                    className="rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {protocol.name}
                      </span>
                      {protocol.port && (
                        <span className="rounded bg-blue-100 px-2 py-1 font-mono text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Port {protocol.port}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {protocol.description}
                    </p>
                    {protocol.transport && (
                      <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                        {protocol.transport}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                Real-World Example:
              </h4>
              <div className="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 text-3xl">
                  {REAL_WORLD_SCENARIOS[selectedLayer].icon}
                </div>
                <h5 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  {REAL_WORLD_SCENARIOS[selectedLayer].title}
                </h5>
                <ul className="space-y-2 text-sm text-gray-900 dark:text-gray-100">
                  {REAL_WORLD_SCENARIOS[selectedLayer].steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">→</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Exam Tip:</strong> {REAL_WORLD_SCENARIOS[selectedLayer].examTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
