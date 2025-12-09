/**
 * Header component with title and shortcuts button
 */

import React from 'react';

export const DemoHeader: React.FC = () => {
  const handleShowShortcuts = () => {
    const shortcuts = [
      'Space: Play/Pause animation',
      'Arrow Left/Right: Switch traffic types',
      'R: Reset animation',
    ];
    alert('Keyboard Shortcuts:\n\n' + shortcuts.join('\n'));
  };

  return (
    <div className="demo-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Traffic Type Demonstrator</h2>
          <p className="subtitle">Visualize how different traffic patterns flow through networks</p>
        </div>
        <button
          onClick={handleShowShortcuts}
          style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Show keyboard shortcuts"
        >
          ⌨️ Shortcuts
        </button>
      </div>
    </div>
  );
};
