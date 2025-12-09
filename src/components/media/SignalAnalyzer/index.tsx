import React, { useRef } from 'react';
import { useSignalAnalyzerState } from './hooks/useTransformationState';
import { useSignalVisualization } from './hooks/useSignalVisualization';
import { useEyeDiagram } from './hooks/useEyeDiagram';
import { useBandwidthVisualization } from './hooks/useBandwidthVisualization';
import {
  calculateSignalMetrics,
  calculateComparisonMetrics,
  getEyeDiagramMetrics,
} from './utils/signalCalculations';
import { ControlsPanel } from './components/ControlsPanel';
import { MetricsDashboard } from './components/MetricsDashboard';
import { VisualizationCanvas } from './components/VisualizationCanvas';
import { CableSpecifications } from './components/CableSpecifications';
import { KeyConcepts } from './components/KeyConcepts';
import { InterferenceSources } from './components/InterferenceSources';

const SignalAnalyzer: React.FC = () => {
  const state = useSignalAnalyzerState();
  const {
    selectedCable,
    distance,
    frequency,
    interferenceLevel,
    showEyeDiagram,
    compareMode,
    selectedCompareCable,
  } = state;

  // Canvas refs
  const signalCanvasRef = useRef<HTMLCanvasElement>(null);
  const eyeDiagramCanvasRef = useRef<HTMLCanvasElement>(null);
  const bandwidthCanvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate metrics
  const metrics = calculateSignalMetrics(selectedCable, frequency, distance, interferenceLevel);
  const compareMetrics = calculateComparisonMetrics(
    selectedCompareCable,
    frequency,
    distance,
    interferenceLevel,
    compareMode
  );
  const eyeMetrics = getEyeDiagramMetrics(metrics.snr, metrics.attenuation);

  // Visualizations
  useSignalVisualization(
    signalCanvasRef,
    selectedCable,
    distance,
    frequency,
    interferenceLevel,
    compareMode,
    selectedCompareCable,
    metrics.receivedSignal
  );
  useEyeDiagram(eyeDiagramCanvasRef, eyeMetrics, showEyeDiagram);
  useBandwidthVisualization(bandwidthCanvasRef, selectedCable, distance, frequency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Signal Analyzer</h1>
          <p className="text-blue-200">
            Visualize signal degradation, attenuation, and interference in transmission media
          </p>
        </div>

        <ControlsPanel {...state} />

        <MetricsDashboard
          metrics={metrics}
          compareMetrics={compareMetrics}
          compareMode={compareMode}
          selectedCable={selectedCable}
        />

        {/* Visualizations */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VisualizationCanvas
            canvasRef={signalCanvasRef}
            title="Signal Strength Visualization"
            description={`Shows how the signal degrades over distance due to attenuation. The solid line represents ${selectedCable.name}.${
              compareMode ? ` The dashed line shows ${selectedCompareCable.name} for comparison.` : ''
            } Current Position: The marker shows signal strength at ${distance}m (${metrics.receivedSignal.toFixed(1)} dBm).`}
          />

          {showEyeDiagram && (
            <VisualizationCanvas
              canvasRef={eyeDiagramCanvasRef}
              title="Eye Diagram"
              description={`Visual representation of signal quality. A larger "eye opening" indicates better signal integrity. Metrics: Eye height reflects SNR, eye width shows timing margins. Jitter: ${eyeMetrics.jitter.toFixed(1)}%`}
            />
          )}

          <VisualizationCanvas
            canvasRef={bandwidthCanvasRef}
            title="Frequency Response"
            description="Shows attenuation characteristics at different frequencies for the selected cable. Higher frequencies experience greater attenuation, limiting usable bandwidth over distance."
          />
        </div>

        <CableSpecifications selectedCable={selectedCable} />

        <KeyConcepts />

        <InterferenceSources />
      </div>
    </div>
  );
};

export default SignalAnalyzer;
