import React from 'react';

interface OsiLayerFilterProps {
  selectedLayers: number[];
  onLayerToggle: (layer: number) => void;
  deviceCounts: Record<number, number>;
}

const osiLayers = [
  { number: 7, name: 'Application', color: 'bg-orange-500', examples: 'HTTP, DNS, SMTP' },
  { number: 6, name: 'Presentation', color: 'bg-orange-400', examples: 'SSL, JPEG, MPEG' },
  { number: 5, name: 'Session', color: 'bg-yellow-500', examples: 'NetBIOS, RPC' },
  { number: 4, name: 'Transport', color: 'bg-yellow-400', examples: 'TCP, UDP' },
  { number: 3, name: 'Network', color: 'bg-green-500', examples: 'IP, ICMP, Router' },
  { number: 2, name: 'Data Link', color: 'bg-blue-500', examples: 'Ethernet, Switch' },
  { number: 1, name: 'Physical', color: 'bg-purple-500', examples: 'Hub, Cable, NIC' },
];

const OsiLayerFilter: React.FC<OsiLayerFilterProps> = ({
  selectedLayers,
  onLayerToggle,
  deviceCounts,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Filter by OSI Layer</h3>

      <div className="space-y-2">
        {osiLayers.map((layer) => {
          const isSelected = selectedLayers.includes(layer.number);
          const deviceCount = deviceCounts[layer.number] || 0;

          return (
            <button
              key={layer.number}
              onClick={() => onLayerToggle(layer.number)}
              className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                isSelected
                  ? `${layer.color} border-gray-900 text-white shadow-lg`
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold ${
                      isSelected ? 'bg-white/20' : layer.color + ' text-white'
                    }`}
                  >
                    {layer.number}
                  </div>
                  <div>
                    <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      Layer {layer.number}: {layer.name}
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                      {layer.examples}
                    </div>
                  </div>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {deviceCount} devices
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Click multiple layers to see devices that operate at those levels.
          Devices may operate at multiple layers (e.g., Layer 3 switches work at Layer 2 and 3).
        </p>
      </div>

      {selectedLayers.length > 0 && (
        <button
          onClick={() => selectedLayers.forEach(onLayerToggle)}
          className="mt-3 w-full rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default OsiLayerFilter;
