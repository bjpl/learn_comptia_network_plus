import React, { useState, useMemo } from 'react';
import { networkDevices } from './appliances-data';

interface ComparisonMatrixProps {
  initialDevices?: string[];
}

type SortField = 'name' | 'throughput' | 'cost1yr' | 'cost5yr' | 'maxConnections';
type SortDirection = 'asc' | 'desc';

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ initialDevices = [] }) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(
    initialDevices.length > 0 ? initialDevices : networkDevices.slice(0, 3).map((d) => d.id)
  );
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterCategory, setFilterCategory] = useState<'all' | 'physical' | 'virtual' | 'cloud'>(
    'all'
  );
  const [filterType, setFilterType] = useState<string>('all');

  const selectedDevices = useMemo(
    () => networkDevices.filter((d) => selectedDeviceIds.includes(d.id)),
    [selectedDeviceIds]
  );

  const availableDevices = useMemo(() => {
    let filtered = networkDevices.filter((d) => !selectedDeviceIds.includes(d.id));

    if (filterCategory !== 'all') {
      filtered = filtered.filter((d) => d.category === filterCategory);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((d) => d.type === filterType);
    }

    return filtered;
  }, [selectedDeviceIds, filterCategory, filterType]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDevices = useMemo(() => {
    const devices = [...selectedDevices];

    devices.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'cost1yr':
          aVal = a.pricing.totalCostYear1;
          bVal = b.pricing.totalCostYear1;
          break;
        case 'cost5yr':
          aVal = a.pricing.totalCost5Years;
          bVal = b.pricing.totalCost5Years;
          break;
        case 'maxConnections':
          aVal = a.specs.maxConnections;
          bVal = b.specs.maxConnections;
          break;
        case 'throughput':
          // Parse throughput strings for comparison
          aVal = parseThroughput(a.specs.throughput);
          bVal = parseThroughput(b.specs.throughput);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return devices;
  }, [selectedDevices, sortField, sortDirection]);

  const parseThroughput = (throughput: string): number => {
    const match = throughput.match(/(\d+(?:\.\d+)?)\s*(Mbps|Gbps)/i);
    if (!match) {
      return 0;
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    return unit === 'gbps' ? value * 1000 : value;
  };

  const addDevice = (deviceId: string) => {
    setSelectedDeviceIds([...selectedDeviceIds, deviceId]);
  };

  const removeDevice = (deviceId: string) => {
    setSelectedDeviceIds(selectedDeviceIds.filter((id) => id !== deviceId));
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'physical':
        return 'bg-blue-100 text-blue-800';
      case 'virtual':
        return 'bg-green-100 text-green-800';
      case 'cloud':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeatureIcon = (supported: boolean) => {
    return supported ? (
      <span className="text-green-500" title="Supported">
        ✓
      </span>
    ) : (
      <span className="text-gray-300" title="Not supported">
        ✗
      </span>
    );
  };

  const uniqueTypes = Array.from(new Set(networkDevices.map((d) => d.type)));

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold">Network Appliance Comparison Matrix</h2>

        {/* Device Selector */}
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Add Devices to Compare</h3>
          <div className="mb-3 flex gap-2">
            <select
              className="rounded border px-3 py-2"
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as 'all' | 'physical' | 'virtual' | 'cloud')
              }
            >
              <option value="all">All Categories</option>
              <option value="physical">Physical</option>
              <option value="virtual">Virtual</option>
              <option value="cloud">Cloud</option>
            </select>

            <select
              className="rounded border px-3 py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableDevices.map((device) => (
              <button
                key={device.id}
                onClick={() => addDevice(device.id)}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              >
                + {device.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left font-semibold">Feature</th>
              {sortedDevices.map((device) => (
                <th key={device.id} className="min-w-[200px] border p-3 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{device.name}</div>
                      <div className="text-xs text-gray-500">{device.model}</div>
                      <span
                        className={`mt-1 inline-block rounded px-2 py-1 text-xs ${getCategoryBadgeColor(device.category)}`}
                      >
                        {device.category}
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
            {/* Basic Info */}
            <tr className="bg-gray-50">
              <td colSpan={selectedDevices.length + 1} className="border p-2 font-semibold">
                Basic Information
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">Manufacturer</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.manufacturer || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">Type</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 capitalize">
                  {device.type}
                </td>
              ))}
            </tr>

            {/* Performance Specs */}
            <tr className="bg-gray-50">
              <td colSpan={selectedDevices.length + 1} className="border p-2 font-semibold">
                Performance Specifications
              </td>
            </tr>
            <tr>
              <td
                className="cursor-pointer border p-3 font-medium hover:bg-gray-50"
                onClick={() => handleSort('throughput')}
              >
                Throughput {sortField === 'throughput' && (sortDirection === 'asc' ? '↑' : '↓')}
              </td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.specs.throughput}
                </td>
              ))}
            </tr>
            <tr>
              <td
                className="cursor-pointer border p-3 font-medium hover:bg-gray-50"
                onClick={() => handleSort('maxConnections')}
              >
                Max Connections{' '}
                {sortField === 'maxConnections' && (sortDirection === 'asc' ? '↑' : '↓')}
              </td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.specs.maxConnections.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">Memory</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.specs.memoryGB ? `${device.specs.memoryGB} GB` : 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">Power Consumption</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.specs.powerConsumption}
                </td>
              ))}
            </tr>

            {/* Features */}
            <tr className="bg-gray-50">
              <td colSpan={selectedDevices.length + 1} className="border p-2 font-semibold">
                Features
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">Layer 3 Routing</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 text-center">
                  {getFeatureIcon(device.features.layer3Routing)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">VPN Support</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 text-center">
                  {getFeatureIcon(device.features.vpnSupport)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">Deep Packet Inspection</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 text-center">
                  {getFeatureIcon(device.features.deepPacketInspection)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">High Availability</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 text-center">
                  {getFeatureIcon(device.features.highAvailability)}
                </td>
              ))}
            </tr>

            {/* Pricing */}
            <tr className="bg-gray-50">
              <td colSpan={selectedDevices.length + 1} className="border p-2 font-semibold">
                Total Cost of Ownership
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">Initial Cost</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  ${device.pricing.initialCost.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td
                className="cursor-pointer border p-3 font-medium hover:bg-gray-50"
                onClick={() => handleSort('cost1yr')}
              >
                Year 1 Total {sortField === 'cost1yr' && (sortDirection === 'asc' ? '↑' : '↓')}
              </td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 font-semibold">
                  ${device.pricing.totalCostYear1.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">3-Year Total</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  ${device.pricing.totalCost3Years.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td
                className="cursor-pointer border p-3 font-medium hover:bg-gray-50"
                onClick={() => handleSort('cost5yr')}
              >
                5-Year Total {sortField === 'cost5yr' && (sortDirection === 'asc' ? '↑' : '↓')}
              </td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3 font-semibold">
                  ${device.pricing.totalCost5Years.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* Use Cases */}
            <tr className="bg-gray-50">
              <td colSpan={selectedDevices.length + 1} className="border p-2 font-semibold">
                Use Cases & Analysis
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium">Best For</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  <ul className="list-inside list-disc text-sm">
                    {device.useCase.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">Pros</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  <ul className="list-inside list-disc text-sm text-green-700">
                    {device.pros.slice(0, 3).map((pro, idx) => (
                      <li key={idx}>{pro}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium">Cons</td>
              {sortedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  <ul className="list-inside list-disc text-sm text-red-700">
                    {device.cons.slice(0, 3).map((con, idx) => (
                      <li key={idx}>{con}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {selectedDevices.length > 0 && (
        <div className="mt-6 rounded bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold">Comparison Summary</h3>
          <p className="text-sm text-gray-700">
            Comparing {selectedDevices.length} device{selectedDevices.length !== 1 ? 's' : ''}. Most
            affordable (Year 1):{' '}
            <strong>
              {
                sortedDevices.reduce((min, d) =>
                  d.pricing.totalCostYear1 < min.pricing.totalCostYear1 ? d : min
                ).name
              }
            </strong>{' '}
            at $
            {sortedDevices
              .reduce((min, d) => (d.pricing.totalCostYear1 < min.pricing.totalCostYear1 ? d : min))
              .pricing.totalCostYear1.toLocaleString()}
            . Highest throughput:{' '}
            <strong>
              {
                sortedDevices.reduce((max, d) =>
                  parseThroughput(d.specs.throughput) > parseThroughput(max.specs.throughput)
                    ? d
                    : max
                ).name
              }
            </strong>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonMatrix;
