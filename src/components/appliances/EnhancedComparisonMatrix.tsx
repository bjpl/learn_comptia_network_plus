import React, { useState } from 'react';
import { enhancedNetworkDevices, examQuestions } from './enhanced-appliances-data';
import DeviceDecisionHelper from './DeviceDecisionHelper';
import ExamQuestions from './ExamQuestions';
import { useDeviceFilters, useDeviceSelection, useDeviceCounts } from './EnhancedComparisonMatrix/hooks';
import { Header, ViewModeTabs, Sidebar, ComparisonView, FeatureMatrixView } from './EnhancedComparisonMatrix/components';
import type { ViewMode } from './EnhancedComparisonMatrix/types';

const EnhancedComparisonMatrix: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');
  const [selectedLayers, setSelectedLayers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    selectedDeviceIds,
    selectedDevices,
    selectedDevice,
    setSelectedDevice,
    addDevice,
    removeDevice,
    handleDeviceClick,
    handleRecommendation,
  } = useDeviceSelection({
    devices: enhancedNetworkDevices,
    initialSelectedIds: ['managed-switch-24port', 'cisco-router-4331', 'stateful-firewall-fortigate'],
  });

  const { filteredDevices } = useDeviceFilters({
    devices: enhancedNetworkDevices,
    selectedLayers,
    searchTerm,
  });

  const deviceCounts = useDeviceCounts(enhancedNetworkDevices);

  const handleLayerToggle = (layer: number) => {
    setSelectedLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const handleRecommendationWithView = (deviceIds: string[]) => {
    handleRecommendation(deviceIds);
    setViewMode('comparison');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <Header />
        <ViewModeTabs viewMode={viewMode} onViewModeChange={setViewMode} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {viewMode === 'comparison' && (
            <Sidebar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedLayers={selectedLayers}
              onLayerToggle={handleLayerToggle}
              deviceCounts={deviceCounts}
              totalDevices={enhancedNetworkDevices.length}
              filteredCount={filteredDevices.length}
              selectedCount={selectedDeviceIds.length}
            />
          )}

          <div className={viewMode === 'comparison' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {viewMode === 'comparison' && (
              <ComparisonView
                filteredDevices={filteredDevices}
                selectedDeviceIds={selectedDeviceIds}
                selectedDevices={selectedDevices}
                selectedDevice={selectedDevice}
                onAddDevice={addDevice}
                onRemoveDevice={removeDevice}
                onCloseModal={() => setSelectedDevice(null)}
              />
            )}

            {viewMode === 'feature-matrix' && <FeatureMatrixView filteredDevices={filteredDevices} />}

            {viewMode === 'decision-helper' && (
              <DeviceDecisionHelper
                devices={enhancedNetworkDevices}
                onRecommendation={handleRecommendationWithView}
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
