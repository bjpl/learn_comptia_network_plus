/**
 * Hook for port scanning analysis logic
 */

import { useCallback } from 'react';
import type { ScanType, PacketExchange, PortState } from '../port-scanner/types';

export const usePortAnalysis = () => {
  const simulatePacketExchange = useCallback(
    (scanType: ScanType, _port: number, isFiltered: boolean): PacketExchange[] => {
      const isOpen = Math.random() > 0.5;

      switch (scanType) {
        case 'tcp-connect':
          if (isFiltered) {
            return [
              {
                step: 1,
                source: 'scanner',
                flags: ['SYN'],
                type: 'SYN',
                description: 'Scanner initiates connection',
                detected: true,
              },
              {
                step: 2,
                source: 'target',
                type: 'TIMEOUT',
                description: 'No response (filtered by firewall)',
                detected: true,
              },
            ];
          }
          return isOpen
            ? [
                {
                  step: 1,
                  source: 'scanner',
                  flags: ['SYN'],
                  type: 'SYN',
                  description: 'Scanner initiates connection',
                  detected: true,
                },
                {
                  step: 2,
                  source: 'target',
                  flags: ['SYN', 'ACK'],
                  type: 'SYN-ACK',
                  description: 'Target accepts connection',
                  detected: true,
                },
                {
                  step: 3,
                  source: 'scanner',
                  flags: ['ACK'],
                  type: 'ACK',
                  description: 'Handshake complete',
                  detected: true,
                },
                {
                  step: 4,
                  source: 'scanner',
                  flags: ['RST'],
                  type: 'RST',
                  description: 'Scanner terminates',
                  detected: true,
                },
              ]
            : [
                {
                  step: 1,
                  source: 'scanner',
                  flags: ['SYN'],
                  type: 'SYN',
                  description: 'Scanner initiates connection',
                  detected: true,
                },
                {
                  step: 2,
                  source: 'target',
                  flags: ['RST', 'ACK'],
                  type: 'RST-ACK',
                  description: 'Port closed, connection refused',
                  detected: true,
                },
              ];

        case 'syn-scan':
          if (isFiltered) {
            return [
              {
                step: 1,
                source: 'scanner',
                flags: ['SYN'],
                type: 'SYN',
                description: 'Scanner sends stealth probe',
                detected: false,
              },
              {
                step: 2,
                source: 'target',
                type: 'TIMEOUT',
                description: 'No response (filtered)',
                detected: false,
              },
            ];
          }
          return isOpen
            ? [
                {
                  step: 1,
                  source: 'scanner',
                  flags: ['SYN'],
                  type: 'SYN',
                  description: 'Scanner sends stealth probe',
                  detected: false,
                },
                {
                  step: 2,
                  source: 'target',
                  flags: ['SYN', 'ACK'],
                  type: 'SYN-ACK',
                  description: 'Port open, but...',
                  detected: true,
                },
                {
                  step: 3,
                  source: 'scanner',
                  flags: ['RST'],
                  type: 'RST',
                  description: 'Scanner aborts (no connection log!)',
                  detected: true,
                },
              ]
            : [
                {
                  step: 1,
                  source: 'scanner',
                  flags: ['SYN'],
                  type: 'SYN',
                  description: 'Scanner sends stealth probe',
                  detected: false,
                },
                {
                  step: 2,
                  source: 'target',
                  flags: ['RST', 'ACK'],
                  type: 'RST-ACK',
                  description: 'Port closed',
                  detected: true,
                },
              ];

        case 'udp-scan':
          if (isFiltered) {
            return [
              {
                step: 1,
                source: 'scanner',
                type: 'UDP',
                description: 'Send UDP packet',
                detected: false,
              },
              {
                step: 2,
                source: 'target',
                type: 'TIMEOUT',
                description: 'No response (open|filtered)',
                detected: false,
              },
            ];
          }
          return isOpen
            ? [
                {
                  step: 1,
                  source: 'scanner',
                  type: 'UDP',
                  description: 'Send UDP packet',
                  detected: false,
                },
                {
                  step: 2,
                  source: 'target',
                  type: 'TIMEOUT',
                  description: 'No response (likely open)',
                  detected: false,
                },
              ]
            : [
                {
                  step: 1,
                  source: 'scanner',
                  type: 'UDP',
                  description: 'Send UDP packet',
                  detected: false,
                },
                {
                  step: 2,
                  source: 'target',
                  type: 'ICMP',
                  description: 'ICMP Port Unreachable (closed)',
                  detected: true,
                },
              ];

        case 'ack-scan':
          if (isFiltered) {
            return [
              {
                step: 1,
                source: 'scanner',
                flags: ['ACK'],
                type: 'ACK',
                description: 'Send unsolicited ACK',
                detected: false,
              },
              {
                step: 2,
                source: 'target',
                type: 'TIMEOUT',
                description: 'No response (filtered)',
                detected: false,
              },
            ];
          }
          return [
            {
              step: 1,
              source: 'scanner',
              flags: ['ACK'],
              type: 'ACK',
              description: 'Send unsolicited ACK',
              detected: false,
            },
            {
              step: 2,
              source: 'target',
              flags: ['RST'],
              type: 'RST',
              description: 'Port unfiltered',
              detected: true,
            },
          ];

        case 'banner-grab':
          if (isFiltered || !isOpen) {
            return [
              {
                step: 1,
                source: 'scanner',
                type: 'CONNECT',
                description: 'Attempt connection',
                detected: true,
              },
              {
                step: 2,
                source: 'target',
                type: 'REFUSE',
                description: 'Connection failed',
                detected: true,
              },
            ];
          }
          return [
            {
              step: 1,
              source: 'scanner',
              type: 'CONNECT',
              description: 'Establish full connection',
              detected: true,
            },
            {
              step: 2,
              source: 'target',
              type: 'BANNER',
              description: 'Service sends banner',
              detected: true,
            },
            {
              step: 3,
              source: 'scanner',
              type: 'ANALYZE',
              description: 'Analyze version info',
              detected: true,
            },
            {
              step: 4,
              source: 'scanner',
              type: 'CLOSE',
              description: 'Close connection',
              detected: true,
            },
          ];

        default:
          return [];
      }
    },
    []
  );

  const determinePortState = useCallback(
    (scanType: ScanType, exchanges: PacketExchange[], isFiltered: boolean): PortState => {
      if (isFiltered) {
        return scanType === 'udp-scan' ? 'open|filtered' : 'filtered';
      }

      const lastExchange = exchanges[exchanges.length - 1];

      if (scanType === 'ack-scan') {
        return lastExchange.type === 'TIMEOUT' ? 'filtered' : 'unfiltered';
      }

      if (scanType === 'udp-scan') {
        return lastExchange.type === 'ICMP' ? 'closed' : 'open|filtered';
      }

      const hasOpenIndicator = exchanges.some(
        (e) => e.type.includes('SYN-ACK') || e.type === 'BANNER'
      );
      const hasClosedIndicator = exchanges.some(
        (e) => e.type.includes('RST') && !e.type.includes('SYN-ACK')
      );

      if (hasOpenIndicator) return 'open';
      if (hasClosedIndicator) return 'closed';

      return 'filtered';
    },
    []
  );

  return {
    simulatePacketExchange,
    determinePortState,
  };
};
