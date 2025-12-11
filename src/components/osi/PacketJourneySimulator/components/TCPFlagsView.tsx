import React from 'react';
import type { TCPFlagState, TCPScenario } from '../types';
import { TCP_FLAGS, TCP_HANDSHAKE } from '../../osi-data';

interface TCPFlagsViewProps {
  tcpFlags: TCPFlagState;
  tcpScenario: TCPScenario;
  toggleTCPFlag: (flag: keyof TCPFlagState) => void;
  loadTCPScenario: (scenario: 'handshake' | 'termination') => void;
  setTcpScenario: (scenario: TCPScenario) => void;
}

export const TCPFlagsView: React.FC<TCPFlagsViewProps> = ({
  tcpFlags,
  tcpScenario,
  toggleTCPFlag,
  loadTCPScenario,
  setTcpScenario,
}) => {
  return (
    <div className="tcp-flags-view" style={{ marginTop: '30px' }}>
      <div
        className="bg-white dark:bg-gray-800"
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3 className="text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}>TCP Flag Visualizer</h3>

        {/* Scenario Selector */}
        <div style={{ marginBottom: '20px' }}>
          <h4 className="text-gray-900 dark:text-gray-100">Common Scenarios:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => loadTCPScenario('handshake')}
              className={tcpScenario !== 'handshake' ? 'text-gray-900 dark:text-gray-100' : ''}
              style={{
                padding: '8px 16px',
                backgroundColor: tcpScenario === 'handshake' ? '#4CAF50' : undefined,
                color: tcpScenario === 'handshake' ? 'white' : undefined,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              3-Way Handshake
            </button>
            <button
              onClick={() => loadTCPScenario('termination')}
              className={tcpScenario !== 'termination' ? 'text-gray-900 dark:text-gray-100' : ''}
              style={{
                padding: '8px 16px',
                backgroundColor: tcpScenario === 'termination' ? '#4CAF50' : undefined,
                color: tcpScenario === 'termination' ? 'white' : undefined,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Connection Termination
            </button>
            <button
              onClick={() => setTcpScenario('custom')}
              className={tcpScenario !== 'custom' ? 'text-gray-900 dark:text-gray-100' : ''}
              style={{
                padding: '8px 16px',
                backgroundColor: tcpScenario === 'custom' ? '#4CAF50' : undefined,
                color: tcpScenario === 'custom' ? 'white' : undefined,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Custom Flags
            </button>
          </div>
        </div>

        {/* Flag Toggles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginTop: '20px',
          }}
        >
          {TCP_FLAGS.map((flag) => (
            <div
              key={flag.abbreviation}
              onClick={() => toggleTCPFlag(flag.abbreviation as keyof TCPFlagState)}
              className={!tcpFlags[flag.abbreviation as keyof TCPFlagState] ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600' : ''}
              style={{
                padding: '15px',
                backgroundColor: tcpFlags[flag.abbreviation as keyof TCPFlagState]
                  ? '#4CAF50'
                  : undefined,
                color: tcpFlags[flag.abbreviation as keyof TCPFlagState] ? 'white' : undefined,
                borderRadius: '8px',
                border: '2px solid',
                borderColor: tcpFlags[flag.abbreviation as keyof TCPFlagState]
                  ? '#388E3C'
                  : undefined,
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'center',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Toggle ${flag.name} flag`}
              title={flag.description}
            >
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                {flag.abbreviation}
              </div>
              <div style={{ fontSize: '12px', marginBottom: '5px' }}>{flag.name}</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                {tcpFlags[flag.abbreviation as keyof TCPFlagState] ? '✓ Set' : '○ Clear'}
              </div>
            </div>
          ))}
        </div>

        {/* TCP Handshake Visualization */}
        {tcpScenario === 'handshake' && (
          <div
            className="bg-gray-100 dark:bg-gray-700"
            style={{
              marginTop: '30px',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <h4 className="text-gray-900 dark:text-gray-100">TCP 3-Way Handshake Sequence</h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '15px',
              }}
            >
              {TCP_HANDSHAKE.establishment.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800"
                  style={{
                    padding: '15px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <strong>Step {step.step}:</strong>
                    <div
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {step.flags.join(' + ')}
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    {step.from} → {step.to}
                  </div>
                  <div
                    className="text-gray-600 dark:text-gray-400"
                    style={{ marginTop: '5px', fontSize: '12px' }}
                  >
                    {step.description}
                  </div>
                  {step.seqNum && (
                    <div
                      className="text-gray-500 dark:text-gray-500"
                      style={{
                        marginTop: '5px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    >
                      Seq: {step.seqNum}
                      {step.ackNum && `, Ack: ${step.ackNum}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flag Descriptions */}
        <div
          className="bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100"
          style={{
            marginTop: '30px',
            padding: '15px',
            borderRadius: '8px',
          }}
        >
          <h4>Exam Tips:</h4>
          <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
            {TCP_FLAGS.map((flag) => (
              <li key={flag.abbreviation}>
                <strong>{flag.abbreviation}:</strong> {flag.examScenario}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
