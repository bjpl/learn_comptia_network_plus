import React from 'react';
import { interferenceTypes } from '../../signal-data';

export const InterferenceSources: React.FC = () => {
  return (
    <div className="mt-6 rounded-lg border border-blue-500/30 bg-slate-800 p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-blue-300">Common Interference Sources</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {interferenceTypes.map((interference) => (
          <div
            key={interference.id}
            className="rounded border-l-4 bg-slate-700 p-4"
            style={{ borderLeftColor: interference.color }}
          >
            <h4 className="mb-2 font-semibold text-white">{interference.name}</h4>
            <p className="mb-2 text-xs text-gray-300">{interference.description}</p>
            <div className="text-sm">
              <div className="text-gray-400">Impact: {interference.impact} dB</div>
              <div className="text-gray-400">Frequency: {interference.frequency} MHz</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
