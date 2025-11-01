import React, { useState, useMemo } from 'react';
import { enhancedNetworkDevices, examQuestions } from './enhanced-appliances-data';
import OsiLayerFilter from './OsiLayerFilter';
import DomainVisualizer from './DomainVisualizer';
import DeviceDecisionHelper from './DeviceDecisionHelper';
import ExamQuestions from './ExamQuestions';
import type { ComparisonDevice } from './appliances-types';

type ViewMode = 'comparison' | 'feature-matrix' | 'decision-helper' | 'exam-questions';

const EnhancedComparisonMatrix: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([
    'managed-switch-24port',
    'cisco-router-4331',
    'stateful-firewall-fortigate',
  ]);
  const [selectedLayers, setSelectedLayers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<ComparisonDevice | null>(null);

  // Filter devices by OSI layer and search
  const filteredDevices = useMemo(() => {
    let devices = enhancedNetworkDevices;

    // Filter by OSI layer
    if (selectedLayers.length > 0) {
      devices = devices.filter((device) =>
        device.osiLayers?.some((layer) => selectedLayers.includes(layer))
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      devices = devices.filter(
        (device) =>
          device.name.toLowerCase().includes(term) ||
          device.type.toLowerCase().includes(term) ||
          device.examFocus?.some((focus) => focus.toLowerCase().includes(term)) ||
          device.whenToUse?.some((use) => use.toLowerCase().includes(term))
      );
    }

    return devices;
  }, [selectedLayers, searchTerm]);

  // Selected devices for comparison
  const selectedDevices = useMemo(
    () => enhancedNetworkDevices.filter((d) => selectedDeviceIds.includes(d.id)),
    [selectedDeviceIds]
  );

  // Device counts per OSI layer
  const deviceCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    enhancedNetworkDevices.forEach((device) => {
      device.osiLayers?.forEach((layer) => {
        counts[layer] = (counts[layer] || 0) + 1;
      });
    });
    return counts;
  }, []);

  const handleLayerToggle = (layer: number) => {
    setSelectedLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const addDevice = (deviceId: string) => {
    if (selectedDeviceIds.length < 5 && !selectedDeviceIds.includes(deviceId)) {
      setSelectedDeviceIds([...selectedDeviceIds, deviceId]);
    }
  };

  const removeDevice = (deviceId: string) => {
    setSelectedDeviceIds(selectedDeviceIds.filter((id) => id !== deviceId));
  };

  const handleRecommendation = (deviceIds: string[]) => {
    setSelectedDeviceIds(deviceIds.slice(0, 5));
    setViewMode('comparison');
  };

  const handleDeviceClick = (deviceId: string) => {
    const device = enhancedNetworkDevices.find((d) => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      if (!selectedDeviceIds.includes(deviceId) && selectedDeviceIds.length < 5) {
        addDevice(deviceId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Network Appliance Comparison Matrix
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            CompTIA Network+ N10-008 - Interactive device comparison tool with 25+ networking
            appliances
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              25+ Devices
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
              All OSI Layers
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
              20+ Exam Questions
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800">
              Decision Helper
            </span>
          </div>
        </div>

        {/* View mode tabs */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'comparison' as const, label: 'Device Comparison', icon: '📊' },
              { id: 'feature-matrix' as const, label: 'Feature Matrix', icon: '📋' },
              { id: 'decision-helper' as const, label: 'Which Device?', icon: '🧭' },
              { id: 'exam-questions' as const, label: 'Exam Questions', icon: '🎓' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex-1 rounded-lg px-4 py-3 font-semibold transition-all ${
                  viewMode === mode.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          {viewMode === 'comparison' && (
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Search */}
                <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                    Search Devices
                  </h3>
                  <input
                    type="text"
                    placeholder="Search by name, type, or function..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                {/* OSI Layer Filter */}
                <OsiLayerFilter
                  selectedLayers={selectedLayers}
                  onLayerToggle={handleLayerToggle}
                  deviceCounts={deviceCounts}
                />

                {/* Stats */}
                <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                    Statistics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Devices:</span>
                      <span className="font-semibold">{enhancedNetworkDevices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Filtered:</span>
                      <span className="font-semibold">{filteredDevices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Comparing:</span>
                      <span className="font-semibold">{selectedDeviceIds.length} / 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div className={viewMode === 'comparison' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {viewMode === 'comparison' && (
              <div className="space-y-6">
                {/* Device selector */}
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Available Devices ({filteredDevices.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredDevices
                      .filter((d) => !selectedDeviceIds.includes(d.id))
                      .map((device) => (
                        <button
                          key={device.id}
                          onClick={() => addDevice(device.id)}
                          disabled={selectedDeviceIds.length >= 5}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          + {device.name}
                          <span className="ml-2 text-xs opacity-75">
                            (Layer {device.primaryOsiLayer})
                          </span>
                        </button>
                      ))}
                  </div>
                  {selectedDeviceIds.length >= 5 && (
                    <div className="mt-3 rounded bg-yellow-50 p-2 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Maximum 5 devices can be compared at once. Remove a device to add another.
                    </div>
                  )}
                </div>

                {/* Comparison table */}
                {selectedDevices.length > 0 && (
                  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Device Comparison
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="border p-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              Feature
                            </th>
                            {selectedDevices.map((device) => (
                              <th key={device.id} className="min-w-[200px] border p-3">
                                <div className="flex items-start justify-between">
                                  <div className="text-left">
                                    <div className="font-bold text-gray-900 dark:text-gray-100">
                                      {device.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {device.manufacturer}
                                    </div>
                                    <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                      Layer {device.primaryOsiLayer}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => removeDevice(device.id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    title="Remove from comparison"
                                  >
                                    ×
                                  </button>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* OSI Layer */}
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td
                              colSpan={selectedDevices.length + 1}
                              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
                            >
                              OSI Layer Operation
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Primary Layer
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3">
                                Layer {device.primaryOsiLayer}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Description
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3 text-sm">
                                {device.osiLayerDescription}
                              </td>
                            ))}
                          </tr>

                          {/* Domains */}
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td
                              colSpan={selectedDevices.length + 1}
                              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
                            >
                              Collision & Broadcast Domains
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Collision Domains
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3">
                                <span className="capitalize">{device.collisionDomains}</span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Broadcast Domains
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3">
                                <span className="capitalize">{device.broadcastDomains}</span>
                              </td>
                            ))}
                          </tr>

                          {/* Specs */}
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td
                              colSpan={selectedDevices.length + 1}
                              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
                            >
                              Performance Specifications
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Throughput
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3">
                                {device.specs.throughput}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Ports
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3">
                                {device.specs.portCount || 'N/A'}
                              </td>
                            ))}
                          </tr>

                          {/* Pricing */}
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td
                              colSpan={selectedDevices.length + 1}
                              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
                            >
                              Pricing
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              Initial Cost
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3 font-semibold">
                                ${device.pricing.initialCost.toLocaleString()}
                              </td>
                            ))}
                          </tr>

                          {/* When to Use */}
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td
                              colSpan={selectedDevices.length + 1}
                              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
                            >
                              Use Cases
                            </td>
                          </tr>
                          <tr>
                            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                              When to Use
                            </td>
                            {selectedDevices.map((device) => (
                              <td key={device.id} className="border p-3">
                                {device.whenToUse && device.whenToUse.length > 0 ? (
                                  <ul className="list-inside list-disc text-sm">
                                    {device.whenToUse.slice(0, 3).map((use, idx) => (
                                      <li key={idx}>{use}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-sm text-gray-400 dark:text-gray-500">
                                    N/A
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Device details modal */}
                {selectedDevice && (
                  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedDevice.name}
                      </h3>
                      <button
                        onClick={() => setSelectedDevice(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>

                    <DomainVisualizer device={selectedDevice} />

                    {selectedDevice.examFocus && selectedDevice.examFocus.length > 0 && (
                      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
                        <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                          Exam Focus Points
                        </h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                          {selectedDevice.examFocus.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'feature-matrix' && (
              <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  Feature Matrix View
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border p-2 text-left font-semibold text-gray-900 dark:text-gray-100">
                          Device
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          Layer
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          Type
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          L3 Routing
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          VLANs
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          VPN
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          DPI
                        </th>
                        <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                          Initial Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevices.map((device) => (
                        <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="border p-2 font-medium text-gray-900 dark:text-gray-100">
                            {device.name}
                          </td>
                          <td className="border p-2 text-center">{device.primaryOsiLayer}</td>
                          <td className="border p-2 text-center capitalize">
                            {device.type.replace(/-/g, ' ')}
                          </td>
                          <td className="border p-2 text-center">
                            {device.features.layer3Routing ? '✓' : '✗'}
                          </td>
                          <td className="border p-2 text-center">
                            {device.features.vlanSupport ? '✓' : '✗'}
                          </td>
                          <td className="border p-2 text-center">
                            {device.features.vpnSupport ? '✓' : '✗'}
                          </td>
                          <td className="border p-2 text-center">
                            {device.features.deepPacketInspection ? '✓' : '✗'}
                          </td>
                          <td className="border p-2 text-right">
                            ${device.pricing.initialCost.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {viewMode === 'decision-helper' && (
              <DeviceDecisionHelper
                devices={enhancedNetworkDevices}
                onRecommendation={handleRecommendation}
              />
            )}

            {viewMode === 'exam-questions' && (
              <ExamQuestions questions={examQuestions} onDeviceClick={handleDeviceClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedComparisonMatrix;
