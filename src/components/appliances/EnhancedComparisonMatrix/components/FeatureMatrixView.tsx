import React from 'react';
import type { ComparisonDevice } from '../../appliances-types';

interface FeatureMatrixViewProps {
  filteredDevices: ComparisonDevice[];
}

const FeatureMatrixView: React.FC<FeatureMatrixViewProps> = ({ filteredDevices }) => {
  return (
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
              <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">Layer</th>
              <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">Type</th>
              <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">
                L3 Routing
              </th>
              <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">VLANs</th>
              <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">VPN</th>
              <th className="border p-2 font-semibold text-gray-900 dark:text-gray-100">DPI</th>
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
  );
};

export default FeatureMatrixView;
