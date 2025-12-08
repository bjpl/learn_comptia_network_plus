/**
 * Port definitions and service information
 */

import type { PortInfo } from '../types';

export const COMMON_PORTS: PortInfo[] = [
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
];
