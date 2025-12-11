import React from 'react';
import type { FragmentationInfo } from '../types';
import { MTU_VALUES } from '../../osi-data';

interface MTUViewProps {
  selectedMTU: number;
  setSelectedMTU: (mtu: number) => void;
  fragmentationInfo: FragmentationInfo;
}

export const MTUView: React.FC<MTUViewProps> = ({
  selectedMTU,
  setSelectedMTU,
  fragmentationInfo,
}) => {
  return (
    <div className="mtu-view" style={{ marginTop: '30px' }}>
      <div
        className="bg-white dark:bg-gray-800"
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3 className="text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}>MTU and Fragmentation Scenarios</h3>

        {/* MTU Selector */}
        <div style={{ marginBottom: '20px' }}>
          <h4 className="text-gray-900 dark:text-gray-100">Select MTU Size:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {Object.entries(MTU_VALUES).map(([key, { size, description }]) => (
              <button
                key={key}
                onClick={() => setSelectedMTU(size)}
                className={selectedMTU !== size ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedMTU === size ? '#FF9800' : undefined,
                  color: selectedMTU === size ? 'white' : undefined,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                title={description}
              >
                {size} bytes
              </button>
            ))}
          </div>

          {/* Custom MTU Slider */}
          <div style={{ marginTop: '15px' }}>
            <label
              htmlFor="mtu-slider"
              className="text-gray-900 dark:text-gray-100"
              style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
            >
              Custom MTU:
            </label>
            <input
              id="mtu-slider"
              type="range"
              min="576"
              max="9000"
              step="8"
              value={selectedMTU}
              onChange={(e) => setSelectedMTU(Number(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Custom MTU size"
            />
            <div
              style={{
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {selectedMTU} bytes
            </div>
          </div>
        </div>

        {/* Fragmentation Analysis */}
        <div
          className={fragmentationInfo.needsFragmentation ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'}
          style={{
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid',
            borderColor: fragmentationInfo.needsFragmentation ? '#FF9800' : '#4CAF50',
          }}
        >
          <h4 className="text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}>Fragmentation Analysis</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            <div>
              <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                MTU Limit
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {fragmentationInfo.mtu} bytes
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                Packet Size
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {fragmentationInfo.totalPacketSize} bytes
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                Frame Size
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {fragmentationInfo.totalFrameSize} bytes
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                Fragmentation
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: fragmentationInfo.needsFragmentation ? '#FF9800' : '#4CAF50',
                }}
              >
                {fragmentationInfo.needsFragmentation
                  ? `Yes (${fragmentationInfo.fragmentCount} fragments)`
                  : 'No'}
              </div>
            </div>
          </div>

          {fragmentationInfo.needsFragmentation && (
            <div
              className="bg-white dark:bg-gray-800"
              style={{
                marginTop: '20px',
                padding: '15px',
                borderRadius: '4px',
              }}
            >
              <strong>⚠ Fragmentation Required!</strong>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                The packet size ({fragmentationInfo.totalPacketSize} bytes) exceeds the MTU (
                {fragmentationInfo.mtu} bytes).
                <br />
                This will require fragmentation into {fragmentationInfo.fragmentCount} fragments.
                <br />
                <br />
                <strong>Exam Note:</strong> If the DF (Don&apos;t Fragment) bit is set, the packet
                will be dropped and an ICMP Type 3 Code 4 (Fragmentation Needed and DF Set) message
                will be sent back to the source.
              </p>
            </div>
          )}
        </div>

        {/* MTU Common Values */}
        <div
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          <h4>Common MTU Values (Exam Knowledge)</h4>
          <ul style={{ fontSize: '14px', lineHeight: '1.8' }}>
            {Object.entries(MTU_VALUES).map(([key, { size, description }]) => (
              <li key={key}>
                <strong>{size} bytes:</strong> {description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
