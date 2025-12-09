import type { OSILayerNumber } from '../../osi-types';
import type { Protocol } from '../types';

export const getHeaderDataForLayer = (
  layer: OSILayerNumber,
  protocol: Protocol
): Record<string, string | number> => {
  switch (layer) {
    case 7:
      return {
        Protocol: 'HTTP',
        Method: 'GET',
        URI: '/index.html',
        Version: 'HTTP/1.1',
      };
    case 6:
      return {
        Encoding: 'UTF-8',
        Compression: 'gzip',
        Encryption: 'TLS 1.3',
        Format: 'JSON',
      };
    case 5:
      return {
        'Session ID': '8a3f2c1b',
        State: 'Established',
        Dialog: 'Full-duplex',
        'Sync Point': '1024',
      };
    case 4:
      return protocol === 'TCP'
        ? {
            Protocol: 'TCP',
            'Source Port': 54321,
            'Dest Port': 80,
            Sequence: 1000,
            Ack: 2000,
            Window: 65535,
            Flags: 'PSH, ACK',
          }
        : {
            Protocol: 'UDP',
            'Source Port': 54321,
            'Dest Port': 53,
            Length: 512,
            Checksum: '0x3a4f',
          };
    case 3:
      return {
        Protocol: 'IPv4',
        'Source IP': '192.168.1.100',
        'Dest IP': '203.0.113.50',
        TTL: 64,
        'Protocol Number': protocol === 'TCP' ? 6 : 17,
        Checksum: '0x7f3a',
      };
    case 2:
      return {
        Protocol: 'Ethernet II',
        'Source MAC': '00:1A:2B:3C:4D:5E',
        'Dest MAC': 'AA:BB:CC:DD:EE:FF',
        EtherType: '0x0800',
        FCS: '0x9c4e3f2a',
        VLAN: 100,
      };
    case 1:
      return {
        Medium: 'Cat6 UTP',
        Signal: 'Electrical',
        Encoding: '8B/10B',
        'Bit Rate': '1 Gbps',
        Voltage: '±2.5V',
      };
    default:
      return {};
  }
};
