/**
 * Constants for Port Scanner
 */

import { ScanExplanation } from './types';

export const COMMON_PORTS = [
  { port: 21, service: 'FTP', banner: 'vsftpd 3.0.3', risk: 'high' },
  { port: 22, service: 'SSH', banner: 'OpenSSH 8.2p1 Ubuntu', risk: 'low' },
  { port: 23, service: 'Telnet', banner: 'Linux telnetd', risk: 'critical' },
  { port: 25, service: 'SMTP', banner: 'Postfix smtpd', risk: 'medium' },
  { port: 53, service: 'DNS', banner: 'BIND 9.16.1', risk: 'medium' },
  { port: 80, service: 'HTTP', banner: 'nginx/1.18.0', risk: 'medium' },
  { port: 443, service: 'HTTPS', banner: 'nginx/1.18.0 (TLS 1.3)', risk: 'low' },
  { port: 445, service: 'SMB', banner: 'Samba smbd 4.11.6', risk: 'high' },
  { port: 3306, service: 'MySQL', banner: 'MySQL 8.0.23', risk: 'critical' },
  { port: 3389, service: 'RDP', banner: 'Microsoft Terminal Services', risk: 'critical' },
] as const;

export const SCAN_EXPLANATIONS: Record<string, ScanExplanation> = {
  'tcp-connect': {
    name: 'TCP Connect Scan',
    stealth: false,
    description: 'Completes full 3-way TCP handshake. Most reliable but easily detected.',
    steps: [
      'Scanner sends SYN packet',
      'Target responds with SYN-ACK (open) or RST (closed)',
      'Scanner sends ACK to complete handshake',
      'Scanner sends RST to close connection',
    ],
    detection: 'HIGH - Logs created, IDS alerts triggered',
    useCases: [
      'Reliable service detection',
      'When stealth is not required',
      'Troubleshooting connectivity',
    ],
    pros: ['Most accurate results', 'Works through most firewalls', 'Clear service identification'],
    cons: ['Easily logged', 'IDS detection', 'Slower than SYN scan'],
  },
  'syn-scan': {
    name: 'SYN Scan (Stealth/Half-Open)',
    stealth: true,
    description:
      'Sends SYN, receives SYN-ACK, but sends RST instead of ACK. Never completes handshake.',
    steps: [
      'Scanner sends SYN packet',
      'Target responds with SYN-ACK (open) or RST (closed)',
      'Scanner sends RST to abort (no connection logged)',
    ],
    detection: 'MEDIUM - May avoid application logs, but IDS can still detect',
    useCases: ['Default nmap scan', 'Stealth scanning', 'Fast network reconnaissance'],
    pros: [
      'Faster than TCP Connect',
      'Less likely to be logged',
      'Good stealth/reliability balance',
    ],
    cons: [
      'Requires raw socket access (root)',
      'Still detectable by IDS',
      'May be blocked by stateful firewalls',
    ],
  },
  'udp-scan': {
    name: 'UDP Scan',
    stealth: true,
    description:
      'Sends UDP packets. Response interpretation is tricky due to connectionless nature.',
    steps: [
      'Scanner sends UDP packet to port',
      'Closed port: ICMP Port Unreachable',
      'Open port: Usually no response (or service-specific response)',
      'Filtered: No response at all',
    ],
    detection: 'LOW - No connection state, harder to detect',
    useCases: ['DNS discovery', 'SNMP detection', 'DHCP server identification'],
    pros: ['Discovers UDP services', 'Very stealthy', 'Less commonly scanned'],
    cons: [
      'Very slow (timeout-based)',
      'Ambiguous results (open|filtered)',
      'Can trigger rate limiting',
    ],
  },
  'ack-scan': {
    name: 'ACK Scan (Firewall Detection)',
    stealth: true,
    description: 'Never finds open ports. Used to map firewall rules and detect filtering.',
    steps: [
      'Scanner sends ACK packet (unsolicited)',
      'Unfiltered port: RST response',
      'Filtered port: No response or ICMP unreachable',
    ],
    detection: 'LOW - Looks like normal traffic anomaly',
    useCases: [
      'Firewall rule mapping',
      'Detecting stateful firewalls',
      'Network security assessment',
    ],
    pros: ['Maps firewall rules', 'Very stealthy', 'Bypasses some IDS'],
    cons: ['Does not identify open ports', 'Limited practical use', 'Requires interpretation'],
  },
  'banner-grab': {
    name: 'Service Banner Grabbing',
    stealth: false,
    description:
      'Connects to service and retrieves version information for vulnerability assessment.',
    steps: [
      'Complete TCP connection to service',
      'Send protocol-specific request',
      'Capture service banner/version',
      'Analyze for vulnerabilities',
    ],
    detection: 'HIGH - Full connection logged',
    useCases: ['Version detection', 'Vulnerability scanning', 'OS fingerprinting'],
    pros: ['Accurate version info', 'Identifies vulnerabilities', 'OS detection possible'],
    cons: ['Highly detectable', 'Slow process', 'May trigger alarms'],
  },
};
