import React from 'react';
import type { SavedNetwork } from '../types';

interface SaveLoadPanelProps {
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  saveNetworkDesign: (name: string) => void;
  savedNetworks: SavedNetwork[];
  loadNetworkDesign: (saveId: string) => void;
  deleteNetworkDesign: (saveId: string) => void;
}

export const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({
  showSaveDialog,
  setShowSaveDialog,
  saveNetworkDesign,
  savedNetworks,
  loadNetworkDesign,
  deleteNetworkDesign,
}) => {
  if (!showSaveDialog) return null;

  return (
    <div className="mb-4 rounded border border-amber-300 bg-amber-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Save & Load Networks</h3>
        <button
          onClick={() => setShowSaveDialog(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Save Network */}
      <div className="mb-4 rounded bg-white p-3">
        <p className="mb-2 text-sm font-medium">Save Current Design</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Network name"
            id="save-name"
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
          />
          <button
            onClick={() => {
              const name = (document.getElementById('save-name') as HTMLInputElement)?.value;
              if (name) {
                saveNetworkDesign(name);
                (document.getElementById('save-name') as HTMLInputElement).value = '';
              }
            }}
            className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>

      {/* Load Networks */}
      {savedNetworks.length > 0 && (
        <div className="rounded bg-white p-3">
          <p className="mb-2 text-sm font-medium">Saved Designs</p>
          <div className="space-y-2">
            {savedNetworks.map((saved) => (
              <div
                key={saved.id}
                className="flex items-center justify-between rounded border border-gray-200 p-2"
              >
                <div className="text-sm">
                  <p className="font-medium">{saved.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(saved.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadNetworkDesign(saved.id)}
                    className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteNetworkDesign(saved.id)}
                    className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
