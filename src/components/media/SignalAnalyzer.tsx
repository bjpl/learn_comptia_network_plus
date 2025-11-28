import React, { useState, useEffect, useRef } from 'react';
import type { CableType } from './signal-data';
import {
  cableTypes,
  interferenceTypes,
  calculateAttenuation,
  calculateCrosstalk,
  calculateSNR,
  calculateEyeDiagramMetrics,
  standards,
} from './signal-data';

const SignalAnalyzer: React.FC = () => {
  const [selectedCable, setSelectedCable] = useState<CableType>(cableTypes[0]);
  const [distance, setDistance] = useState<number>(50);
  const [frequency, setFrequency] = useState<number>(100);
  const [interferenceLevel, setInterferenceLevel] = useState<number>(5);
  const [showEyeDiagram, setShowEyeDiagram] = useState<boolean>(true);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedCompareCable, setSelectedCompareCable] = useState<CableType>(cableTypes[1]);

  const signalCanvasRef = useRef<HTMLCanvasElement>(null);
  const eyeDiagramCanvasRef = useRef<HTMLCanvasElement>(null);
  const bandwidthCanvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const INITIAL_SIGNAL_STRENGTH = 0; // dBm

  // Calculations
  const attenuation = calculateAttenuation(selectedCable, frequency, distance);
  const crosstalkNEXT = calculateCrosstalk(selectedCable, distance, 'NEXT');
  const crosstalkFEXT = calculateCrosstalk(selectedCable, distance, 'FEXT');
  const snr = calculateSNR(INITIAL_SIGNAL_STRENGTH, attenuation, interferenceLevel);
  const eyeMetrics = calculateEyeDiagramMetrics(snr, attenuation);
  const receivedSignal = INITIAL_SIGNAL_STRENGTH - attenuation;

  // Comparison calculations
  const compareAttenuation = compareMode
    ? calculateAttenuation(selectedCompareCable, frequency, distance)
    : 0;
  const compareSNR = compareMode
    ? calculateSNR(INITIAL_SIGNAL_STRENGTH, compareAttenuation, interferenceLevel)
    : 0;
  const compareReceivedSignal = compareMode ? INITIAL_SIGNAL_STRENGTH - compareAttenuation : 0;

  // Draw signal strength visualization
  useEffect(() => {
    const canvas = signalCanvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Horizontal grid lines (dB levels)
    for (let db = -100; db <= 0; db += 10) {
      const y = ((db + 100) / 100) * (height - 40) + 20;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${db} dB`, 45, y + 3);
    }

    // Vertical grid lines (distance)
    const maxDist = selectedCable.category === 'copper' ? 100 : 1000;
    const step = selectedCable.category === 'copper' ? 20 : 200;
    for (let d = 0; d <= maxDist; d += step) {
      const x = (d / maxDist) * (width - 70) + 50;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d}m`, x, height - 5);
    }

    // Draw signal degradation curve
    ctx.strokeStyle = selectedCable.color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let d = 0; d <= maxDist; d += 1) {
      const x = (d / maxDist) * (width - 70) + 50;
      const atten = calculateAttenuation(selectedCable, frequency, d);
      const signal = INITIAL_SIGNAL_STRENGTH - atten;
      const y = ((signal + 100) / 100) * (height - 40) + 20;

      if (d === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw comparison cable if enabled
    if (compareMode) {
      ctx.strokeStyle = selectedCompareCable.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      for (let d = 0; d <= maxDist; d += 1) {
        const x = (d / maxDist) * (width - 70) + 50;
        const atten = calculateAttenuation(selectedCompareCable, frequency, d);
        const signal = INITIAL_SIGNAL_STRENGTH - atten;
        const y = ((signal + 100) / 100) * (height - 40) + 20;

        if (d === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw current position marker
    const currentX = (distance / maxDist) * (width - 70) + 50;
    const currentY = ((receivedSignal + 100) / 100) * (height - 40) + 20;

    ctx.fillStyle = selectedCable.color;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw interference level
    if (interferenceLevel > 0) {
      const noiseY = ((-interferenceLevel + 100) / 100) * (height - 40) + 20;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(50, noiseY);
      ctx.lineTo(width - 20, noiseY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Noise Floor', width - 130, noiseY - 5);
    }

    // Draw labels
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Signal Strength Over Distance', width / 2, 15);
  }, [
    selectedCable,
    distance,
    frequency,
    interferenceLevel,
    compareMode,
    selectedCompareCable,
    receivedSignal,
  ]);

  // Draw eye diagram
  useEffect(() => {
    if (!showEyeDiagram) {
      return;
    }

    const canvas = eyeDiagramCanvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Center lines
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Calculate eye opening
    const eyeHeightPx = (eyeMetrics.eyeHeight / 100) * (height * 0.6);
    const eyeWidthPx = (eyeMetrics.eyeWidth / 100) * (width * 0.6);
    const jitterPx = eyeMetrics.jitter * 2;

    // Draw multiple signal traces to create eye pattern
    const numTraces = 20;
    const alpha = Math.min(0.3, 0.8 / numTraces);

    for (let i = 0; i < numTraces; i++) {
      const phase = (i / numTraces) * Math.PI * 2;
      const jitterOffset = Math.sin(phase) * jitterPx;

      // Rising edge
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const x1 = width / 2 - eyeWidthPx / 2 + jitterOffset;
      const x2 = width / 2 + jitterOffset;
      const y1 = height / 2 + eyeHeightPx / 2;
      const y2 = height / 2 - eyeHeightPx / 2;

      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(x1 + (x2 - x1) * 0.5, y1, x2, y2);
      ctx.stroke();

      // Falling edge
      const x3 = width / 2 + jitterOffset;
      const x4 = width / 2 + eyeWidthPx / 2 + jitterOffset;

      ctx.moveTo(x3, y2);
      ctx.quadraticCurveTo(x3 + (x4 - x3) * 0.5, y2, x4, y1);
      ctx.stroke();
    }

    // Draw eye opening measurement lines
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Height measurement
    ctx.beginPath();
    ctx.moveTo(width - 30, height / 2 - eyeHeightPx / 2);
    ctx.lineTo(width - 30, height / 2 + eyeHeightPx / 2);
    ctx.stroke();

    // Width measurement
    ctx.beginPath();
    ctx.moveTo(width / 2 - eyeWidthPx / 2, 20);
    ctx.lineTo(width / 2 + eyeWidthPx / 2, 20);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw labels
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Eye Diagram', width / 2, 15);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'right';
    ctx.fillText(`Height: ${eyeMetrics.eyeHeight.toFixed(1)}%`, width - 35, height / 2);
    ctx.fillText(`Width: ${eyeMetrics.eyeWidth.toFixed(1)}%`, width / 2, 35);

    // Quality indicator
    const qualityColor = {
      excellent: '#22c55e',
      good: '#3b82f6',
      marginal: '#f59e0b',
      poor: '#ef4444',
    }[eyeMetrics.quality];

    ctx.fillStyle = qualityColor;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Quality: ${eyeMetrics.quality.toUpperCase()}`, 10, height - 10);
  }, [eyeMetrics, showEyeDiagram]);

  // Draw bandwidth vs distance graph
  useEffect(() => {
    const canvas = bandwidthCanvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Horizontal grid (frequency/bandwidth)
    const maxFreq = selectedCable.category === 'copper' ? 600 : 2000;
    const freqStep = selectedCable.category === 'copper' ? 100 : 500;

    for (let f = 0; f <= maxFreq; f += freqStep) {
      const y = height - 20 - (f / maxFreq) * (height - 40);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      const label = selectedCable.category === 'copper' ? `${f} MHz` : `${f} nm`;
      ctx.fillText(label, 45, y + 3);
    }

    // Vertical grid (distance)
    const maxDist = selectedCable.category === 'copper' ? 100 : 1000;
    const distStep = selectedCable.category === 'copper' ? 20 : 200;

    for (let d = 0; d <= maxDist; d += distStep) {
      const x = 50 + (d / maxDist) * (width - 70);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d}m`, x, height - 5);
    }

    // Draw frequency response curves
    selectedCable.attenuation.forEach((point, idx) => {
      const y = height - 20 - (point.frequency / maxFreq) * (height - 40);
      const x = 50 + (distance / maxDist) * (width - 70);

      ctx.fillStyle = selectedCable.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (idx < selectedCable.attenuation.length - 1) {
        const nextPoint = selectedCable.attenuation[idx + 1];
        const y2 = height - 20 - (nextPoint.frequency / maxFreq) * (height - 40);

        ctx.strokeStyle = selectedCable.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }
    });

    // Current frequency marker
    const currentFreqY = height - 20 - (frequency / maxFreq) * (height - 40);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, currentFreqY);
    ctx.lineTo(width - 20, currentFreqY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Current: ${frequency} ${selectedCable.category === 'copper' ? 'MHz' : 'nm'}`,
      width - 150,
      currentFreqY - 5
    );

    // Labels
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Frequency Response', width / 2, 15);
  }, [selectedCable, distance, frequency]);

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

        {/* Controls Panel */}
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
                    {cable.name} ({cable.bandwidth} {cable.category === 'copper' ? 'MHz' : 'MHz·km'}
                    )
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

        {/* Metrics Dashboard */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
            <div className="mb-1 text-sm text-blue-300">Attenuation</div>
            <div className="text-2xl font-bold" style={{ color: selectedCable.color }}>
              {attenuation.toFixed(2)} dB
            </div>
            {compareMode && (
              <div className="mt-1 text-sm text-gray-400">
                vs {compareAttenuation.toFixed(2)} dB
              </div>
            )}
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
            <div className="mb-1 text-sm text-blue-300">SNR</div>
            <div
              className="text-2xl font-bold"
              style={{
                color: snr > 20 ? '#22c55e' : snr > 10 ? '#f59e0b' : '#ef4444',
              }}
            >
              {snr.toFixed(1)} dB
            </div>
            {compareMode && (
              <div className="mt-1 text-sm text-gray-400">vs {compareSNR.toFixed(1)} dB</div>
            )}
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
            <div className="mb-1 text-sm text-blue-300">Received Signal</div>
            <div className="text-2xl font-bold" style={{ color: selectedCable.color }}>
              {receivedSignal.toFixed(1)} dBm
            </div>
            {compareMode && (
              <div className="mt-1 text-sm text-gray-400">
                vs {compareReceivedSignal.toFixed(1)} dBm
              </div>
            )}
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4">
            <div className="mb-1 text-sm text-blue-300">NEXT</div>
            <div className="text-2xl font-bold text-purple-400">
              {selectedCable.crosstalkNEXT ? `${crosstalkNEXT.toFixed(1)} dB` : 'N/A'}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              FEXT: {selectedCable.crosstalkFEXT ? `${crosstalkFEXT.toFixed(1)} dB` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Signal Strength Over Distance */}
          <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4 shadow-xl">
            <canvas ref={signalCanvasRef} width={600} height={400} className="w-full" />
            <div className="mt-4 text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-blue-300">Signal Strength Visualization:</strong> Shows how
                the signal degrades over distance due to attenuation. The solid line represents{' '}
                {selectedCable.name}.
                {compareMode &&
                  ` The dashed line shows ${selectedCompareCable.name} for comparison.`}
              </p>
              <p>
                <strong className="text-yellow-300">Current Position:</strong> The marker shows
                signal strength at {distance}m ({receivedSignal.toFixed(1)} dBm).
              </p>
            </div>
          </div>

          {/* Eye Diagram */}
          {showEyeDiagram && (
            <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4 shadow-xl">
              <canvas ref={eyeDiagramCanvasRef} width={600} height={400} className="w-full" />
              <div className="mt-4 text-sm text-gray-300">
                <p className="mb-2">
                  <strong className="text-blue-300">Eye Diagram:</strong> Visual representation of
                  signal quality. A larger "eye opening" indicates better signal integrity.
                </p>
                <p>
                  <strong className="text-green-300">Metrics:</strong> Eye height reflects SNR, eye
                  width shows timing margins. Jitter: {eyeMetrics.jitter.toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {/* Bandwidth vs Distance */}
          <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4 shadow-xl">
            <canvas ref={bandwidthCanvasRef} width={600} height={400} className="w-full" />
            <div className="mt-4 text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-blue-300">Frequency Response:</strong> Shows attenuation
                characteristics at different frequencies for the selected cable.
              </p>
              <p>
                Higher frequencies experience greater attenuation, limiting usable bandwidth over
                distance.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Information */}
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

        {/* Key Concepts */}
        <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-semibold text-blue-300">Key Concepts</h3>
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-white">Attenuation</h4>
              <p className="mb-2 text-gray-300">
                Loss of signal strength as it travels through the transmission medium, measured in
                decibels (dB). Higher frequencies experience greater attenuation.
              </p>
              <p className="italic text-blue-300">
                Formula: Loss (dB) = (dB/100m) × (Distance/100m)
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">SNR (Signal-to-Noise Ratio)</h4>
              <p className="mb-2 text-gray-300">
                Ratio of signal power to noise power, measured in dB. Higher SNR means clearer
                signal and better data integrity. Minimum 10dB recommended.
              </p>
              <p className="italic text-blue-300">Formula: SNR (dB) = Signal - Noise</p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">NEXT (Near-End Crosstalk)</h4>
              <p className="mb-2 text-gray-300">
                Interference between wire pairs at the transmitting end. Higher NEXT values (in dB)
                indicate better isolation and less crosstalk.
              </p>
              <p className="italic text-blue-300">Cat6a typical: 50.3dB @ 100MHz</p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">FEXT (Far-End Crosstalk)</h4>
              <p className="mb-2 text-gray-300">
                Interference between wire pairs at the receiving end. Generally less problematic
                than NEXT due to signal attenuation over distance.
              </p>
              <p className="italic text-blue-300">Typically 10-15dB lower than NEXT</p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">Eye Diagram</h4>
              <p className="mb-2 text-gray-300">
                Oscilloscope display showing digital signal quality. The "eye opening" represents
                timing margins and voltage levels. Larger opening = better signal integrity.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-white">EMI/RFI Interference</h4>
              <p className="mb-2 text-gray-300">
                Electromagnetic (EMI) and Radio Frequency (RFI) interference from external sources.
                Shielded cables (STP, FTP) provide better protection than UTP.
              </p>
            </div>
          </div>
        </div>

        {/* Interference Types Reference */}
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
      </div>
    </div>
  );
};

export default SignalAnalyzer;
