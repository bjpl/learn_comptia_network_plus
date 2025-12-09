import React from 'react';
import DomainVisualizer from '../../DomainVisualizer';
import type { ComparisonDevice } from '../../appliances-types';

interface DeviceDetailsModalProps {
  device: ComparisonDevice | null;
  onClose: () => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ device, onClose }) => {
  if (!device) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{device.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <DomainVisualizer device={device} />

      {device.examFocus && device.examFocus.length > 0 && (
        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
          <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Exam Focus Points
          </h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
            {device.examFocus.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeviceDetailsModal;
