import React from 'react';
import type { CableType } from '../../signal-data';
import { standards } from '../../signal-data';

interface CableSpecificationsProps {
  selectedCable: CableType;
}

export const CableSpecifications: React.FC<CableSpecificationsProps> = ({ selectedCable }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Cable Specifications */}
      <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-blue-300">Cable Specifications</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Type:</span>
            <span className="font-medium">{selectedCable.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Category:</span>
            <span className="font-medium capitalize">{selectedCable.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Bandwidth:</span>
            <span className="font-medium">
              {selectedCable.bandwidth} {selectedCable.category === 'copper' ? 'MHz' : 'MHz·km'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Max Distance:</span>
            <span className="font-medium">{selectedCable.maxDistance}m</span>
          </div>
          {selectedCable.impedance && (
            <div className="flex justify-between">
              <span className="text-gray-400">Impedance:</span>
              <span className="font-medium">{selectedCable.impedance}Ω</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">EMI Susceptibility:</span>
            <span className="font-medium capitalize">{selectedCable.emiSusceptibility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Standard:</span>
            <span className="font-medium">{selectedCable.standard}</span>
          </div>
        </div>
      </div>

      {/* TIA/EIA Standard Details */}
      <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-blue-300">Standard Reference</h3>
        {standards[selectedCable.standard as keyof typeof standards] && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Standard Name:</span>
              <span className="font-medium">
                {standards[selectedCable.standard as keyof typeof standards].name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bandwidth:</span>
              <span className="font-medium">
                {standards[selectedCable.standard as keyof typeof standards].bandwidth}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Distance:</span>
              <span className="font-medium">
                {standards[selectedCable.standard as keyof typeof standards].maxDistance}
              </span>
            </div>
            <div className="mt-4">
              <span className="mb-2 block text-gray-400">Applications:</span>
              <div className="flex flex-wrap gap-2">
                {standards[selectedCable.standard as keyof typeof standards].applications.map(
                  (app) => (
                    <span
                      key={app}
                      className="rounded bg-blue-900/50 px-2 py-1 text-xs font-medium"
                    >
                      {app}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
