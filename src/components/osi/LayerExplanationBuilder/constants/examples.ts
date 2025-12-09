import type { RealWorldExample } from '../types';

export const REAL_WORLD_EXAMPLES: RealWorldExample[] = [
  {
    title: 'Web Browsing',
    layer: 7,
    scenario: 'User accesses HTTPS website. Browser uses HTTP/HTTPS to request web pages.',
    protocols: ['HTTP', 'HTTPS', 'DNS'],
  },
  {
    title: 'Email Transfer',
    layer: 7,
    scenario: 'Sending email through mail client. Uses SMTP for sending, POP3/IMAP for receiving.',
    protocols: ['SMTP', 'POP3', 'IMAP', 'DNS'],
  },
  {
    title: 'Data Encryption',
    layer: 6,
    scenario: 'Banking transaction. Data encrypted with TLS/SSL. Character encoding to UTF-8.',
    protocols: ['TLS/SSL', 'SSH'],
  },
  {
    title: 'Video Call',
    layer: 5,
    scenario: 'SIP establishes session. Maintains connection. Coordinates media negotiation.',
    protocols: ['SIP', 'H.323'],
  },
  {
    title: 'File Download',
    layer: 4,
    scenario: 'TCP 3-way handshake. Segments large files. Reassembles at destination.',
    protocols: ['TCP', 'UDP'],
  },
  {
    title: 'Routing',
    layer: 3,
    scenario:
      'Router receives packet. Examines IP header. Forwards to next hop based on routing table.',
    protocols: ['IP', 'ICMP', 'OSPF', 'BGP'],
  },
  {
    title: 'Switch Operation',
    layer: 2,
    scenario:
      'Switch learns MAC addresses. Forwards frames based on MAC table. Prevents loops via STP.',
    protocols: ['Ethernet', 'VLAN', 'STP'],
  },
  {
    title: 'Cable Transmission',
    layer: 1,
    scenario:
      'Data converted to electrical signals. Transmitted over twisted pair or fiber. Received and decoded.',
    protocols: ['Ethernet', '10BaseT', 'Fiber Optic'],
  },
];
