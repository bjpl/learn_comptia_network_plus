import React from 'react';

export const Instructions: React.FC = () => {
  return (
    <div className="mt-4 rounded bg-blue-50 p-4">
      <h4 className="mb-2 text-sm font-semibold">💡 How to use:</h4>
      <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
        <li>Click device type buttons to add devices to the canvas</li>
        <li>Drag devices to reposition them</li>
        <li>Click the 🔗 button on a device, then click another device to create a connection</li>
        <li>Click Start Simulation to see traffic flows and device loads</li>
        <li>Watch for alerts when devices become overloaded</li>
      </ul>
    </div>
  );
};
