/**
 * Symptom-Layer Mapping Reference Table
 * Quick reference showing common network symptoms and their likely OSI layers
 */

import React, { useState, useMemo } from 'react';
import type { OSILayerNumber } from '../osi-types';
import { LAYER_COLORS, LAYER_NAMES } from '../osi-data';

export interface SymptomMapping {
  symptom: string;
  likelyLayers: OSILayerNumber[];
  certainty: 'high' | 'medium' | 'low';
  diagnosticTools: string[];
  explanation: string;
}

const SYMPTOM_LAYER_MAP: SymptomMapping[] = [
  // Physical Layer (Layer 1)
  {
    symptom: 'No link lights on interface',
    likelyLayers: [1],
    certainty: 'high',
    diagnosticTools: ['Visual inspection', 'Cable tester'],
    explanation: 'Link lights indicate Layer 1 connectivity. No lights = physical problem.',
  },
  {
    symptom: 'Intermittent signal degradation',
    likelyLayers: [1],
    certainty: 'high',
    diagnosticTools: ['Cable tester', 'Optical power meter'],
    explanation: 'Signal quality issues occur at the physical transmission level.',
  },
  {
    symptom: 'Cable length exceeds specification',
    likelyLayers: [1],
    certainty: 'high',
    diagnosticTools: ['Cable tester', 'Visual inspection'],
    explanation: 'Physical cable length limitations are Layer 1 constraints.',
  },
  {
    symptom: 'Crosstalk interference between cables',
    likelyLayers: [1],
    certainty: 'high',
    diagnosticTools: ['Cable tester', 'Spectrum analyzer'],
    explanation: 'Electromagnetic interference is a physical layer phenomenon.',
  },

  // Data Link Layer (Layer 2)
  {
    symptom: 'CRC errors incrementing',
    likelyLayers: [2],
    certainty: 'high',
    diagnosticTools: ['show interface', 'Wireshark'],
    explanation: 'Frame Check Sequence (CRC) is Layer 2 error detection.',
  },
  {
    symptom: 'Broadcast storm consuming bandwidth',
    likelyLayers: [2],
    certainty: 'high',
    diagnosticTools: ['show mac address-table', 'Wireshark'],
    explanation: 'Broadcasts propagate at Layer 2 within a broadcast domain.',
  },
  {
    symptom: 'ARP requests timing out',
    likelyLayers: [2, 3],
    certainty: 'medium',
    diagnosticTools: ['arp -a', 'Wireshark', 'ping'],
    explanation: 'ARP operates between Layer 2 and 3, mapping IP to MAC addresses.',
  },
  {
    symptom: 'MAC address table overflow',
    likelyLayers: [2],
    certainty: 'high',
    diagnosticTools: ['show mac address-table'],
    explanation: 'MAC address tables are maintained by switches at Layer 2.',
  },
  {
    symptom: 'Duplex mismatch errors',
    likelyLayers: [2],
    certainty: 'high',
    diagnosticTools: ['show interface'],
    explanation: 'Duplex settings affect frame transmission at Layer 2.',
  },
  {
    symptom: 'VLAN configuration issues',
    likelyLayers: [2],
    certainty: 'high',
    diagnosticTools: ['show vlan', 'show interfaces trunk'],
    explanation: 'VLANs segment traffic at the Data Link Layer.',
  },

  // Network Layer (Layer 3)
  {
    symptom: 'Ping by IP works, ping by name fails',
    likelyLayers: [7],
    certainty: 'high',
    diagnosticTools: ['nslookup', 'dig', 'ipconfig /all'],
    explanation: 'Name resolution is DNS (Layer 7). IP connectivity is Layer 3.',
  },
  {
    symptom: 'TTL expired in transit',
    likelyLayers: [3],
    certainty: 'high',
    diagnosticTools: ['tracert', 'show ip route', 'ping'],
    explanation: 'TTL is an IP header field. Expiration indicates routing loop or excessive hops.',
  },
  {
    symptom: 'ICMP unreachable messages',
    likelyLayers: [3],
    certainty: 'high',
    diagnosticTools: ['ping', 'tracert', 'show ip route'],
    explanation: 'ICMP operates at Layer 3 for network-layer diagnostics.',
  },
  {
    symptom: 'Routing loops detected',
    likelyLayers: [3],
    certainty: 'high',
    diagnosticTools: ['tracert', 'show ip route'],
    explanation: 'Routing and path determination occur at the Network Layer.',
  },
  {
    symptom: 'Subnet mask misconfiguration',
    likelyLayers: [3],
    certainty: 'high',
    diagnosticTools: ['ipconfig', 'show ip interface'],
    explanation: 'Subnet masks are part of IP addressing at Layer 3.',
  },
  {
    symptom: 'Default gateway unreachable',
    likelyLayers: [3],
    certainty: 'high',
    diagnosticTools: ['ping', 'tracert', 'ipconfig'],
    explanation: 'Gateway routing is a Layer 3 function.',
  },

  // Transport Layer (Layer 4)
  {
    symptom: 'Connection refused on port',
    likelyLayers: [4, 7],
    certainty: 'medium',
    diagnosticTools: ['netstat', 'telnet', 'nmap'],
    explanation: 'Port-level blocking could be firewall (Layer 4) or service down (Layer 7).',
  },
  {
    symptom: 'Excessive TCP retransmissions',
    likelyLayers: [4],
    certainty: 'high',
    diagnosticTools: ['Wireshark', 'netstat -s'],
    explanation: 'TCP retransmissions are Layer 4 reliability mechanisms.',
  },
  {
    symptom: 'Port blocked by firewall',
    likelyLayers: [4],
    certainty: 'high',
    diagnosticTools: ['netstat', 'telnet'],
    explanation: 'Port numbers are a Transport Layer concept.',
  },
  {
    symptom: 'UDP packet loss with no retransmission',
    likelyLayers: [4],
    certainty: 'high',
    diagnosticTools: ['Wireshark', 'netstat'],
    explanation: 'UDP is connectionless at Layer 4 and provides no reliability.',
  },

  // Session Layer (Layer 5)
  {
    symptom: 'Session timeouts',
    likelyLayers: [5],
    certainty: 'high',
    diagnosticTools: ['Application logs', 'Wireshark'],
    explanation: 'Session management occurs at the Session Layer.',
  },
  {
    symptom: 'VoIP calls disconnect after fixed time',
    likelyLayers: [5],
    certainty: 'high',
    diagnosticTools: ['SIP logs', 'Wireshark'],
    explanation: 'SIP session management is a Layer 5 function.',
  },

  // Presentation Layer (Layer 6)
  {
    symptom: 'SSL/TLS certificate errors',
    likelyLayers: [6],
    certainty: 'high',
    diagnosticTools: ['Browser tools', 'openssl'],
    explanation: 'Encryption and certificates operate at the Presentation Layer.',
  },
  {
    symptom: 'Character encoding issues',
    likelyLayers: [6],
    certainty: 'high',
    diagnosticTools: ['Browser developer tools'],
    explanation: 'Data format translation occurs at Layer 6.',
  },

  // Application Layer (Layer 7)
  {
    symptom: 'HTTP 404 errors',
    likelyLayers: [7],
    certainty: 'high',
    diagnosticTools: ['Browser', 'curl', 'wget'],
    explanation: 'HTTP status codes are application-layer responses.',
  },
  {
    symptom: 'DNS resolution failures',
    likelyLayers: [7],
    certainty: 'high',
    diagnosticTools: ['nslookup', 'dig'],
    explanation: 'DNS is an Application Layer protocol.',
  },
  {
    symptom: 'SMTP authentication failures',
    likelyLayers: [7],
    certainty: 'high',
    diagnosticTools: ['telnet', 'Mail logs'],
    explanation: 'Application-level authentication in SMTP protocol.',
  },
  {
    symptom: 'DHCP IP address exhaustion',
    likelyLayers: [7],
    certainty: 'high',
    diagnosticTools: ['DHCP server logs', 'ipconfig'],
    explanation: 'DHCP is an Application Layer service.',
  },
  {
    symptom: 'FTP transfer mode issues',
    likelyLayers: [7],
    certainty: 'high',
    diagnosticTools: ['FTP logs', 'Wireshark'],
    explanation: 'FTP protocol operations are Layer 7 functions.',
  },
];

interface SymptomLayerMappingProps {
  onSymptomSelect?: (symptom: SymptomMapping) => void;
}

export const SymptomLayerMapping: React.FC<SymptomLayerMappingProps> = ({ onSymptomSelect }) => {
  const [filterLayer, setFilterLayer] = useState<OSILayerNumber | 'all'>('all');
  const [filterCertainty, setFilterCertainty] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSymptoms = useMemo(() => {
    return SYMPTOM_LAYER_MAP.filter((symptom) => {
      const layerMatch = filterLayer === 'all' || symptom.likelyLayers.includes(filterLayer);
      const certaintyMatch = filterCertainty === 'all' || symptom.certainty === filterCertainty;
      const searchMatch =
        searchTerm === '' ||
        symptom.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symptom.explanation.toLowerCase().includes(searchTerm.toLowerCase());

      return layerMatch && certaintyMatch && searchMatch;
    });
  }, [filterLayer, filterCertainty, searchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginTop: 0 }}>Common Network Symptoms → OSI Layers</h2>

      <p style={{ fontSize: '15px', lineHeight: '1.6' }} className="text-gray-600 dark:text-gray-400">
        Use this quick reference to identify which OSI layer is likely causing specific network
        symptoms. This helps you choose the right troubleshooting approach and diagnostic tools.
      </p>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div>
          <label htmlFor="layer-filter" style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Filter by Layer:
          </label>
          <select
            id="layer-filter"
            value={filterLayer}
            onChange={(e) =>
              setFilterLayer(
                e.target.value === 'all' ? 'all' : (Number(e.target.value) as OSILayerNumber)
              )
            }
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          >
            <option value="all">All Layers</option>
            {[7, 6, 5, 4, 3, 2, 1].map((layer) => (
              <option key={layer} value={layer}>
                Layer {layer} - {LAYER_NAMES[layer as OSILayerNumber]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="certainty-filter" style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Certainty:
          </label>
          <select
            id="certainty-filter"
            value={filterCertainty}
            onChange={(e) => setFilterCertainty(e.target.value as typeof filterCertainty)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <input
            type="text"
            placeholder="Search symptoms or explanations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {/* Results count */}
      <div
        style={{
          marginBottom: '16px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        Showing {filteredSymptoms.length} of {SYMPTOM_LAYER_MAP.length} symptoms
      </div>

      {/* Symptom Table */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th style={tableHeaderStyle}>Symptom</th>
              <th style={tableHeaderStyle}>Likely Layer(s)</th>
              <th style={tableHeaderStyle}>Certainty</th>
              <th style={tableHeaderStyle}>Diagnostic Tools</th>
              <th style={tableHeaderStyle}>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {filteredSymptoms.map((symptom, index) => (
              <tr
                key={index}
                onClick={() => onSymptomSelect?.(symptom)}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  cursor: onSymptomSelect ? 'pointer' : 'default',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (onSymptomSelect) {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={tableCellStyle}>
                  <strong>{symptom.symptom}</strong>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {symptom.likelyLayers.map((layer) => (
                      <span
                        key={layer}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: LAYER_COLORS[layer],
                          color: '#fff',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        L{layer}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <CertaintyBadge certainty={symptom.certainty} />
                </td>
                <td style={tableCellStyle}>
                  <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {symptom.diagnosticTools.join(', ')}
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }} className="text-gray-700 dark:text-gray-300">
                    {symptom.explanation}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSymptoms.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#888',
              fontSize: '15px',
            }}
          >
            No symptoms match your search criteria. Try adjusting the filters.
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: '8px',
        }}
        className="bg-gray-100 dark:bg-gray-800"
      >
        <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
          💡 How to Use This Reference:
        </div>
        <div style={{ fontSize: '13px', lineHeight: '1.8' }} className="text-gray-700 dark:text-gray-300">
          1. Identify the symptom you're experiencing
          <br />
          2. Check which layer(s) are likely involved
          <br />
          3. Use the suggested diagnostic tools to confirm
          <br />
          4. Read the explanation to understand why it's that layer
          <br />
          5. Apply the CompTIA troubleshooting methodology
        </div>
      </div>
    </div>
  );
};

function CertaintyBadge({ certainty }: { certainty: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: { bg: '#4CAF50', text: '#fff' },
    medium: { bg: '#FF9800', text: '#fff' },
    low: { bg: '#f44336', text: '#fff' },
  };

  const color = colors[certainty];

  return (
    <span
      style={{
        padding: '4px 10px',
        backgroundColor: color.bg,
        color: color.text,
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    >
      {certainty}
    </span>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#555',
  borderBottom: '2px solid #ddd',
};

const tableCellStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: '14px',
  verticalAlign: 'top',
};

export default SymptomLayerMapping;
