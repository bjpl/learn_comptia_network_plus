import type { OSILayerNumber, ProtocolType, TCPFlagState } from '../types';

export const getHeaderDataForLayer = (
  layer: OSILayerNumber,
  protocol: 'TCP' | 'UDP',
  selectedProtocol: ProtocolType,
  tcpFlags: TCPFlagState,
  selectedMTU: number
): Record<string, string | number> => {
  switch (layer) {
    case 7:
      switch (selectedProtocol) {
        case 'HTTP':
          return {
            Protocol: 'HTTP',
            Method: 'GET',
            URI: '/index.html',
            Version: 'HTTP/1.1',
            Host: 'www.example.com',
            Port: 80,
          };
        case 'HTTPS':
          return {
            Protocol: 'HTTPS',
            Method: 'GET',
            URI: '/secure/data',
            Version: 'HTTP/1.1',
            'TLS Version': 'TLS 1.3',
            Port: 443,
          };
        case 'DNS':
          return {
            Protocol: 'DNS',
            'Transaction ID': '0x4a2f',
            Type: 'Standard Query',
            Question: 'www.example.com',
            'Query Type': 'A (IPv4)',
            Port: 53,
          };
        case 'DHCP':
          return {
            Protocol: 'DHCP',
            'Message Type': 'DHCPDISCOVER',
            'Transaction ID': '0x3903f326',
            'Client MAC': '00:1A:2B:3C:4D:5E',
            Broadcast: 'Yes',
            Port: '67/68',
          };
        case 'FTP':
          return {
            Protocol: 'FTP',
            Command: 'USER',
            'Control Port': 21,
            'Data Port': 20,
            Mode: 'Passive',
          };
        case 'SMTP':
          return {
            Protocol: 'SMTP',
            Command: 'MAIL FROM',
            From: 'sender@example.com',
            Port: 25,
          };
        case 'SSH':
          return {
            Protocol: 'SSH',
            Version: 'SSH-2.0',
            Port: 22,
            Encryption: 'AES-256-GCM',
          };
        default:
          return {
            Protocol: 'Application Data',
            Type: 'User Data',
          };
      }
    case 6:
      return selectedProtocol === 'HTTPS'
        ? {
            'TLS Record': 'Handshake',
            'Cipher Suite': 'TLS_AES_256_GCM_SHA384',
            Encryption: 'Enabled',
            Compression: 'None',
          }
        : {
            Encoding: 'UTF-8',
            Compression: 'gzip',
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
      if (protocol === 'TCP') {
        const flags = Object.entries(tcpFlags)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(', ');
        return {
          Protocol: 'TCP',
          'Source Port': 54321,
          'Dest Port':
            selectedProtocol === 'HTTP'
              ? 80
              : selectedProtocol === 'HTTPS'
                ? 443
                : selectedProtocol === 'SSH'
                  ? 22
                  : 80,
          Sequence: 1000,
          Ack: tcpFlags.ACK ? 2000 : 0,
          Window: 65535,
          Flags: flags || 'None',
        };
      } else {
        return {
          Protocol: 'UDP',
          'Source Port': 54321,
          'Dest Port': selectedProtocol === 'DNS' ? 53 : selectedProtocol === 'DHCP' ? 67 : 53,
          Length: 512,
          Checksum: '0x3a4f',
        };
      }
    case 3:
      return {
        Protocol: 'IPv4',
        'Source IP': '192.168.1.100',
        'Dest IP': '203.0.113.50',
        TTL: 64,
        'Protocol Number': protocol === 'TCP' ? 6 : 17,
        'Total Length': 1500,
        Flags: `DF=${selectedMTU < 1500 ? 1 : 0}`,
        Checksum: '0x7f3a',
      };
    case 2:
      return {
        Protocol: 'Ethernet II',
        'Source MAC': '00:1A:2B:3C:4D:5E',
        'Dest MAC': 'AA:BB:CC:DD:EE:FF',
        EtherType: '0x0800',
        FCS: '0x9c4e3f2a',
        'Frame Size': '64-1518 bytes',
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
