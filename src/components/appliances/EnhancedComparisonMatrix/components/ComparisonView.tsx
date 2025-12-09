import React from 'react';
import DeviceSelector from './DeviceSelector';
import ComparisonTable from './ComparisonTable';
import DeviceDetailsModal from './DeviceDetailsModal';
import type { ComparisonDevice } from '../../appliances-types';

interface ComparisonViewProps {
  filteredDevices: ComparisonDevice[];
  selectedDeviceIds: string[];
  selectedDevices: ComparisonDevice[];
  selectedDevice: ComparisonDevice | null;
  onAddDevice: (deviceId: string) => void;
  onRemoveDevice: (deviceId: string) => void;
  onCloseModal: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  filteredDevices,
  selectedDeviceIds,
  selectedDevices,
  selectedDevice,
  onAddDevice,
  onRemoveDevice,
  onCloseModal,
}) => {
  return (
    <div className="space-y-6">
      <DeviceSelector
        filteredDevices={filteredDevices}
        selectedDeviceIds={selectedDeviceIds}
        onAddDevice={onAddDevice}
      />
      <ComparisonTable selectedDevices={selectedDevices} onRemoveDevice={onRemoveDevice} />
      <DeviceDetailsModal device={selectedDevice} onClose={onCloseModal} />
    </div>
  );
};

export default ComparisonView;
