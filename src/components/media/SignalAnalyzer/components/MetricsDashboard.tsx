import React from 'react';
import type { CableType } from '../../signal-data';
import type { SignalMetrics, ComparisonMetrics } from '../types';

interface MetricsDashboardProps {
  metrics: SignalMetrics;
  compareMetrics: ComparisonMetrics;
  compareMode: boolean;
  selectedCable: CableType;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  compareMetrics,
  compareMode,
  selectedCable,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
        <div className="mb-1 text-sm text-blue-300">Attenuation</div>
        <div className="text-2xl font-bold" style={{ color: selectedCable.color }}>
          {metrics.attenuation.toFixed(2)} dB
        </div>
        {compareMode && (
          <div className="mt-1 text-sm text-gray-400">
            vs {compareMetrics.attenuation.toFixed(2)} dB
          </div>
        )}
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
        <div className="mb-1 text-sm text-blue-300">SNR</div>
        <div
          className="text-2xl font-bold"
          style={{
            color: metrics.snr > 20 ? '#22c55e' : metrics.snr > 10 ? '#f59e0b' : '#ef4444',
          }}
        >
          {metrics.snr.toFixed(1)} dB
        </div>
        {compareMode && (
          <div className="mt-1 text-sm text-gray-400">vs {compareMetrics.snr.toFixed(1)} dB</div>
        )}
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
        <div className="mb-1 text-sm text-blue-300">Received Signal</div>
        <div className="text-2xl font-bold" style={{ color: selectedCable.color }}>
          {metrics.receivedSignal.toFixed(1)} dBm
        </div>
        {compareMode && (
          <div className="mt-1 text-sm text-gray-400">
            vs {compareMetrics.receivedSignal.toFixed(1)} dBm
          </div>
        )}
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
        <div className="mb-1 text-sm text-blue-300">NEXT</div>
        <div className="text-2xl font-bold text-purple-400">
          {selectedCable.crosstalkNEXT ? `${metrics.crosstalkNEXT.toFixed(1)} dB` : 'N/A'}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          FEXT: {selectedCable.crosstalkFEXT ? `${metrics.crosstalkFEXT.toFixed(1)} dB` : 'N/A'}
        </div>
      </div>
    </div>
  );
};
