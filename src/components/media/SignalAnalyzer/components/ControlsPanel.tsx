import React from 'react';
import type { CableType } from '../../signal-data';
import { cableTypes } from '../../signal-data';

interface ControlsPanelProps {
  selectedCable: CableType;
  setSelectedCable: (cable: CableType) => void;
  compareMode: boolean;
  setCompareMode: (mode: boolean) => void;
  selectedCompareCable: CableType;
  setSelectedCompareCable: (cable: CableType) => void;
  distance: number;
  setDistance: (distance: number) => void;
  frequency: number;
  setFrequency: (frequency: number) => void;
  interferenceLevel: number;
  setInterferenceLevel: (level: number) => void;
  showEyeDiagram: boolean;
  setShowEyeDiagram: (show: boolean) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  selectedCable,
  setSelectedCable,
  compareMode,
  setCompareMode,
  selectedCompareCable,
  setSelectedCompareCable,
  distance,
  setDistance,
  frequency,
  setFrequency,
  interferenceLevel,
  setInterferenceLevel,
  showEyeDiagram,
  setShowEyeDiagram,
}) => {
  return (
    <div className="mb-6 rounded-lg border border-blue-500/30 bg-slate-800 p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-semibold text-blue-300">Configuration</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Cable Type Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Cable Type</label>
          <select
            value={selectedCable.id}
            onChange={(e) =>
              setSelectedCable(cableTypes.find((c) => c.id === e.target.value) || cableTypes[0])
            }
            className="w-full rounded border border-slate-600 bg-slate-700 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            {cableTypes.map((cable) => (
              <option key={cable.id} value={cable.id}>
                {cable.name} ({cable.bandwidth} {cable.category === 'copper' ? 'MHz' : 'MHz·km'})
              </option>
            ))}
          </select>
        </div>

        {/* Compare Mode */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="mr-2"
            />
            Compare with:
          </label>
          {compareMode && (
            <select
              value={selectedCompareCable.id}
              onChange={(e) =>
                setSelectedCompareCable(
                  cableTypes.find((c) => c.id === e.target.value) || cableTypes[1]
                )
              }
              className="w-full rounded border border-slate-600 bg-slate-700 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              {cableTypes
                .filter((c) => c.id !== selectedCable.id)
                .map((cable) => (
                  <option key={cable.id} value={cable.id}>
                    {cable.name}
                  </option>
                ))}
            </select>
          )}
        </div>

        {/* Distance Slider */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Distance: {distance}m
            {selectedCable.maxDistance < distance && (
              <span className="ml-2 text-red-400">
                (Exceeds max: {selectedCable.maxDistance}m)
              </span>
            )}
          </label>
          <input
            type="range"
            min="1"
            max={selectedCable.category === 'copper' ? 100 : 1000}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Frequency Slider */}
        {selectedCable.category === 'copper' && (
          <div>
            <label className="mb-2 block text-sm font-medium">Frequency: {frequency} MHz</label>
            <input
              type="range"
              min="1"
              max="600"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Interference Level */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Interference Level: {interferenceLevel} dB
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={interferenceLevel}
            onChange={(e) => setInterferenceLevel(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Eye Diagram Toggle */}
        <div className="flex items-center">
          <label className="flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={showEyeDiagram}
              onChange={(e) => setShowEyeDiagram(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Show Eye Diagram</span>
          </label>
        </div>
      </div>
    </div>
  );
};
