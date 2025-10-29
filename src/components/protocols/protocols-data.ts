/**
 * Comprehensive protocol and port data for CompTIA Network+ certification
 */

import type { Protocol, IPProtocol, TrafficType, VirtualNetwork, FlashCard } from './protocols-types';

export const PROTOCOLS: Protocol[] = [
  {
    id: 'ftp',
    name: 'FTP',
    fullName: 'File Transfer Protocol',
    ports: [
      { number: 20, description: 'Data transfer' },
      { number: 21, description: 'Command/control' }
    ],
    type: 'TCP',
    security: 'insecure',
    description: 'Protocol for transferring files between systems using separate control and data channels.',
    useCase: 'Bulk file transfers, website updates, server-to-server file sharing',
    securityImplications: 'Transmits credentials and data in plaintext. Vulnerable to packet sniffing and man-in-the-middle attacks.',
    commonVulnerabilities: [
      'Plaintext authentication',
      'Unencrypted data transfer',
      'Anonymous FTP misconfigurations',
      'Bounce attacks',
      'Directory traversal'
    ],
    bestPractices: [
      'Use SFTP or FTPS instead',
      'Disable anonymous access',
      'Implement strong password policies',
      'Use firewall rules to restrict access',
      'Monitor and log all transfers'
    ],
    alternativeTo: 'SFTP'
  },
  {
    id: 'sftp',
    name: 'SFTP/SSH',
    fullName: 'Secure File Transfer Protocol / Secure Shell',
    ports: [{ number: 22, description: 'Encrypted file transfer and remote access' }],
    type: 'TCP',
    security: 'secure',
    description: 'Encrypted protocol for secure file transfers and remote system administration over SSH.',
    useCase: 'Secure file transfers, remote server management, automated secure backups',
    securityImplications: 'Provides strong encryption for both authentication and data transfer. Uses public key cryptography.',
    commonVulnerabilities: [
      'Weak passwords',
      'Outdated SSH versions',
      'Misconfigured key-based authentication',
      'Brute force attacks on default port'
    ],
    bestPractices: [
      'Use SSH keys instead of passwords',
      'Change default port',
      'Disable root login',
      'Implement fail2ban or similar',
      'Keep SSH version updated'
    ]
  },
  {
    id: 'telnet',
    name: 'Telnet',
    fullName: 'Telnet Protocol',
    ports: [{ number: 23, description: 'Remote terminal access' }],
    type: 'TCP',
    security: 'insecure',
    description: 'Legacy protocol for remote command-line access to devices and systems.',
    useCase: 'Legacy system access, basic network device configuration (deprecated)',
    securityImplications: 'Completely unencrypted. All keystrokes, including passwords, sent in plaintext.',
    commonVulnerabilities: [
      'Plaintext credentials',
      'Session hijacking',
      'Keystroke capture',
      'No authentication verification'
    ],
    bestPractices: [
      'Replace with SSH',
      'Only use on isolated networks',
      'Never use over internet',
      'Disable if not required',
      'Use VPN if legacy access needed'
    ],
    alternativeTo: 'SSH'
  },
  {
    id: 'smtp',
    name: 'SMTP',
    fullName: 'Simple Mail Transfer Protocol',
    ports: [{ number: 25, description: 'Mail server communication' }],
    type: 'TCP',
    security: 'insecure',
    description: 'Protocol for sending email between mail servers.',
    useCase: 'Server-to-server email delivery, outbound mail relay',
    securityImplications: 'Basic SMTP lacks encryption. Can be relayed for spam if misconfigured.',
    commonVulnerabilities: [
      'Open relay exploitation',
      'Email spoofing',
      'Spam relay abuse',
      'Header injection attacks'
    ],
    bestPractices: [
      'Configure anti-relay protection',
      'Use SPF, DKIM, and DMARC',
      'Implement TLS encryption',
      'Use SMTPS (port 587) for clients',
      'Rate limiting and authentication'
    ]
  },
  {
    id: 'smtps',
    name: 'SMTPS',
    fullName: 'Simple Mail Transfer Protocol Secure',
    ports: [{ number: 587, description: 'Encrypted mail submission' }],
    type: 'TCP',
    security: 'secure',
    description: 'SMTP with STARTTLS encryption for secure email submission.',
    useCase: 'Client email submission, authenticated outbound email',
    securityImplications: 'Provides encryption via STARTTLS. Requires authentication before sending.',
    commonVulnerabilities: [
      'STARTTLS stripping attacks',
      'Weak authentication',
      'Certificate validation issues'
    ],
    bestPractices: [
      'Enforce TLS encryption',
      'Require authentication',
      'Use strong passwords',
      'Monitor for abuse',
      'Implement rate limiting'
    ]
  },
  {
    id: 'dns',
    name: 'DNS',
    fullName: 'Domain Name System',
    ports: [{ number: 53, description: 'Name resolution (TCP for zone transfers, UDP for queries)' }],
    type: 'TCP/UDP',
    security: 'optional',
    description: 'Translates domain names to IP addresses. UDP for queries, TCP for zone transfers.',
    useCase: 'Domain name resolution, service discovery, load balancing',
    securityImplications: 'Vulnerable to cache poisoning and DDoS amplification attacks. DNSSEC adds security.',
    commonVulnerabilities: [
      'DNS cache poisoning',
      'DDoS amplification',
      'Zone transfer attacks',
      'DNS tunneling',
      'Subdomain enumeration'
    ],
    bestPractices: [
      'Implement DNSSEC',
      'Restrict zone transfers',
      'Use DNS filtering',
      'Enable query logging',
      'Rate limit queries'
    ]
  },
  {
    id: 'dhcp',
    name: 'DHCP',
    fullName: 'Dynamic Host Configuration Protocol',
    ports: [
      { number: 67, description: 'Server listening port' },
      { number: 68, description: 'Client listening port' }
    ],
    type: 'UDP',
    security: 'insecure',
    description: 'Automatically assigns IP addresses and network configuration to devices.',
    useCase: 'Automatic IP configuration, network bootstrapping, centralized management',
    securityImplications: 'No authentication by default. Vulnerable to rogue DHCP servers and starvation attacks.',
    commonVulnerabilities: [
      'Rogue DHCP servers',
      'DHCP starvation',
      'DHCP spoofing',
      'Man-in-the-middle attacks'
    ],
    bestPractices: [
      'Enable DHCP snooping',
      'Use DHCP reservations',
      'Implement port security',
      'Monitor for rogue servers',
      'Use VLANs for segmentation'
    ]
  },
  {
    id: 'tftp',
    name: 'TFTP',
    fullName: 'Trivial File Transfer Protocol',
    ports: [{ number: 69, description: 'Simple file transfer' }],
    type: 'UDP',
    security: 'insecure',
    description: 'Simplified file transfer protocol without authentication, used for network booting.',
    useCase: 'Network device firmware updates, PXE boot, configuration file transfers',
    securityImplications: 'No authentication or encryption. Should only be used on trusted networks.',
    commonVulnerabilities: [
      'No authentication',
      'No encryption',
      'Directory traversal',
      'Unauthorized file access'
    ],
    bestPractices: [
      'Restrict to isolated networks',
      'Use firewalls to limit access',
      'Read-only when possible',
      'Monitor file transfers',
      'Consider SFTP for alternatives'
    ]
  },
  {
    id: 'http',
    name: 'HTTP',
    fullName: 'Hypertext Transfer Protocol',
    ports: [{ number: 80, description: 'Web traffic' }],
    type: 'TCP',
    security: 'insecure',
    description: 'Protocol for transmitting web pages and data over the internet.',
    useCase: 'Web browsing, API communication, content delivery',
    securityImplications: 'Unencrypted traffic. Credentials and data visible to network sniffers.',
    commonVulnerabilities: [
      'Man-in-the-middle attacks',
      'Session hijacking',
      'Credential theft',
      'Data interception'
    ],
    bestPractices: [
      'Use HTTPS instead',
      'Redirect HTTP to HTTPS',
      'Implement HSTS',
      'Never send sensitive data',
      'Use secure cookies'
    ],
    alternativeTo: 'HTTPS'
  },
  {
    id: 'https',
    name: 'HTTPS',
    fullName: 'Hypertext Transfer Protocol Secure',
    ports: [{ number: 443, description: 'Encrypted web traffic' }],
    type: 'TCP',
    security: 'secure',
    description: 'HTTP over TLS/SSL providing encrypted web communication.',
    useCase: 'Secure web browsing, e-commerce, authenticated APIs, sensitive data transmission',
    securityImplications: 'Provides encryption, authentication, and data integrity via TLS certificates.',
    commonVulnerabilities: [
      'Certificate validation issues',
      'Weak cipher suites',
      'SSL/TLS downgrade attacks',
      'Certificate expiration'
    ],
    bestPractices: [
      'Use TLS 1.2 or higher',
      'Strong cipher suites only',
      'Valid certificates from trusted CAs',
      'Enable HSTS',
      'Monitor certificate expiration'
    ]
  },
  {
    id: 'ntp',
    name: 'NTP',
    fullName: 'Network Time Protocol',
    ports: [{ number: 123, description: 'Time synchronization' }],
    type: 'UDP',
    security: 'optional',
    description: 'Synchronizes system clocks across networks to ensure accurate timekeeping.',
    useCase: 'System clock synchronization, log correlation, security event timing',
    securityImplications: 'Can be used for DDoS amplification. Authentication prevents time manipulation.',
    commonVulnerabilities: [
      'DDoS amplification',
      'Time manipulation attacks',
      'Replay attacks',
      'Monlist command abuse'
    ],
    bestPractices: [
      'Use NTP authentication',
      'Restrict query access',
      'Disable monlist command',
      'Use internal NTP servers',
      'Monitor for anomalies'
    ]
  },
  {
    id: 'snmp',
    name: 'SNMP',
    fullName: 'Simple Network Management Protocol',
    ports: [
      { number: 161, description: 'Agent port for queries' },
      { number: 162, description: 'Manager port for traps' }
    ],
    type: 'UDP',
    security: 'optional',
    description: 'Protocol for monitoring and managing network devices.',
    useCase: 'Network monitoring, device management, performance metrics, alerting',
    securityImplications: 'SNMPv1/v2c use community strings (passwords). SNMPv3 adds encryption.',
    commonVulnerabilities: [
      'Default community strings',
      'Plaintext credentials (v1/v2c)',
      'Information disclosure',
      'Unauthorized configuration changes'
    ],
    bestPractices: [
      'Use SNMPv3 with encryption',
      'Change default community strings',
      'Read-only access when possible',
      'Restrict access via firewall',
      'Regular security audits'
    ]
  },
  {
    id: 'ldap',
    name: 'LDAP',
    fullName: 'Lightweight Directory Access Protocol',
    ports: [{ number: 389, description: 'Directory services' }],
    type: 'TCP',
    security: 'insecure',
    description: 'Protocol for accessing and maintaining directory information services.',
    useCase: 'User authentication, directory queries, organizational data access',
    securityImplications: 'Transmits credentials in plaintext unless using STARTTLS.',
    commonVulnerabilities: [
      'Plaintext credentials',
      'LDAP injection attacks',
      'Anonymous bind abuse',
      'Information disclosure'
    ],
    bestPractices: [
      'Use LDAPS (port 636)',
      'Disable anonymous bind',
      'Implement access controls',
      'Input validation',
      'Use STARTTLS encryption'
    ],
    alternativeTo: 'LDAPS'
  },
  {
    id: 'ldaps',
    name: 'LDAPS',
    fullName: 'Lightweight Directory Access Protocol Secure',
    ports: [{ number: 636, description: 'Encrypted directory services' }],
    type: 'TCP',
    security: 'secure',
    description: 'LDAP over TLS/SSL for encrypted directory access.',
    useCase: 'Secure authentication, encrypted directory queries, enterprise identity management',
    securityImplications: 'Provides encryption for credentials and directory data.',
    commonVulnerabilities: [
      'Certificate validation issues',
      'Weak TLS configurations',
      'LDAP injection (if inputs not validated)'
    ],
    bestPractices: [
      'Use valid certificates',
      'Strong TLS configuration',
      'Input validation',
      'Regular security updates',
      'Monitor access logs'
    ]
  },
  {
    id: 'smb',
    name: 'SMB',
    fullName: 'Server Message Block',
    ports: [{ number: 445, description: 'File and printer sharing' }],
    type: 'TCP',
    security: 'optional',
    description: 'Protocol for sharing files, printers, and other resources on networks.',
    useCase: 'Windows file sharing, network drives, printer sharing, inter-process communication',
    securityImplications: 'Vulnerable to ransomware attacks (e.g., WannaCry). SMBv1 should be disabled.',
    commonVulnerabilities: [
      'EternalBlue exploit (SMBv1)',
      'Ransomware propagation',
      'Credential relay attacks',
      'Unauthorized file access'
    ],
    bestPractices: [
      'Disable SMBv1',
      'Use SMBv3 with encryption',
      'Strong authentication',
      'Network segmentation',
      'Regular patching'
    ]
  },
  {
    id: 'syslog',
    name: 'Syslog',
    fullName: 'System Logging Protocol',
    ports: [{ number: 514, description: 'Log message transport' }],
    type: 'UDP',
    security: 'insecure',
    description: 'Protocol for transmitting log messages from network devices and systems.',
    useCase: 'Centralized logging, security monitoring, troubleshooting, compliance',
    securityImplications: 'UDP transmission is unreliable and unencrypted. No authentication.',
    commonVulnerabilities: [
      'Log spoofing',
      'Message tampering',
      'Data interception',
      'Denial of service'
    ],
    bestPractices: [
      'Use TLS encryption (RFC 5425)',
      'Implement authentication',
      'Use TCP for reliability',
      'Restrict source IPs',
      'Regular log review'
    ]
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    fullName: 'Microsoft SQL Server',
    ports: [{ number: 1433, description: 'Database communication' }],
    type: 'TCP',
    security: 'optional',
    description: 'Default port for Microsoft SQL Server database connections.',
    useCase: 'Database queries, application data storage, enterprise databases',
    securityImplications: 'Frequently targeted by attackers. Should not be exposed to internet.',
    commonVulnerabilities: [
      'SQL injection attacks',
      'Weak authentication',
      'Unpatched vulnerabilities',
      'Excessive permissions'
    ],
    bestPractices: [
      'Never expose to internet',
      'Use firewalls and VPNs',
      'Strong passwords',
      'Principle of least privilege',
      'Regular security updates'
    ]
  },
  {
    id: 'rdp',
    name: 'RDP',
    fullName: 'Remote Desktop Protocol',
    ports: [{ number: 3389, description: 'Remote desktop access' }],
    type: 'TCP',
    security: 'optional',
    description: 'Protocol for remote graphical access to Windows systems.',
    useCase: 'Remote administration, virtual desktops, remote work access',
    securityImplications: 'Common target for brute force attacks. BlueKeep vulnerability in older versions.',
    commonVulnerabilities: [
      'Brute force attacks',
      'BlueKeep exploit',
      'Man-in-the-middle attacks',
      'Session hijacking'
    ],
    bestPractices: [
      'Use VPN for remote access',
      'Network Level Authentication',
      'Strong passwords or certificates',
      'Change default port',
      'Limit user access'
    ]
  },
  {
    id: 'sip',
    name: 'SIP',
    fullName: 'Session Initiation Protocol',
    ports: [
      { number: 5060, description: 'VoIP signaling (unencrypted)' },
      { number: 5061, description: 'VoIP signaling (encrypted)' }
    ],
    type: 'TCP/UDP',
    security: 'optional',
    description: 'Protocol for initiating, maintaining, and terminating VoIP communications.',
    useCase: 'VoIP calls, video conferencing, instant messaging, presence information',
    securityImplications: 'Port 5060 is unencrypted. Port 5061 uses TLS for secure signaling.',
    commonVulnerabilities: [
      'Call hijacking',
      'Eavesdropping',
      'Registration hijacking',
      'Denial of service'
    ],
    bestPractices: [
      'Use port 5061 with TLS',
      'Implement authentication',
      'Network segmentation',
      'Monitor for anomalies',
      'Use SRTP for media encryption'
    ]
  }
];

export const IP_PROTOCOLS: IPProtocol[] = [
  {
    id: 'icmp',
    name: 'ICMP',
    number: 1,
    description: 'Internet Control Message Protocol - for error reporting and diagnostics',
    useCase: 'Ping, traceroute, network diagnostics, error messaging',
    characteristics: [
      'No port numbers',
      'Used by ping and traceroute',
      'Error reporting mechanism',
      'Part of IP layer',
      'Can be blocked by firewalls'
    ]
  },
  {
    id: 'tcp',
    name: 'TCP',
    number: 6,
    description: 'Transmission Control Protocol - reliable, connection-oriented communication',
    useCase: 'Web browsing, email, file transfers, any reliable data transfer',
    characteristics: [
      'Connection-oriented',
      'Three-way handshake',
      'Guaranteed delivery',
      'Ordered packets',
      'Flow control and congestion management'
    ]
  },
  {
    id: 'udp',
    name: 'UDP',
    number: 17,
    description: 'User Datagram Protocol - fast, connectionless communication',
    useCase: 'Streaming media, DNS queries, VoIP, online gaming',
    characteristics: [
      'Connectionless',
      'No guaranteed delivery',
      'No packet ordering',
      'Lower overhead than TCP',
      'Faster but less reliable'
    ]
  },
  {
    id: 'gre',
    name: 'GRE',
    number: 47,
    description: 'Generic Routing Encapsulation - tunneling protocol',
    useCase: 'VPN tunnels, network-to-network connections, routing protocol encapsulation',
    characteristics: [
      'Creates tunnels',
      'Encapsulates multiple protocols',
      'No encryption by default',
      'Used with IPSec for security',
      'Common in enterprise networks'
    ]
  },
  {
    id: 'ipsec-esp',
    name: 'IPSec ESP',
    number: 50,
    description: 'Encapsulating Security Payload - provides encryption and authentication',
    useCase: 'VPN security, encrypted tunnels, secure communication',
    characteristics: [
      'Encrypts packet payload',
      'Authentication',
      'Integrity checking',
      'Anti-replay protection',
      'Part of IPSec suite'
    ]
  },
  {
    id: 'ipsec-ah',
    name: 'IPSec AH',
    number: 51,
    description: 'Authentication Header - provides authentication and integrity',
    useCase: 'Packet authentication, integrity verification',
    characteristics: [
      'Authentication only',
      'No encryption',
      'Integrity checking',
      'Less common than ESP',
      'Part of IPSec suite'
    ]
  }
];

export const TRAFFIC_TYPES: TrafficType[] = [
  {
    id: 'unicast',
    name: 'Unicast',
    description: 'One-to-one communication between a single source and destination',
    characteristics: [
      'Most common traffic type',
      'Direct path between two devices',
      'Efficient for individual communications',
      'Used for most client-server applications'
    ],
    useCases: [
      'Web browsing',
      'Email',
      'File transfers',
      'SSH sessions',
      'Most TCP connections'
    ],
    example: 'Your computer requesting a web page from a server',
    visual: {
      sourceNodes: [0],
      destinationNodes: [5],
      pathStyle: 'single'
    }
  },
  {
    id: 'multicast',
    name: 'Multicast',
    description: 'One-to-many communication to a specific group of interested receivers',
    characteristics: [
      'Efficient for group communication',
      'Receivers must join multicast group',
      'Single stream serves multiple clients',
      'Reduces bandwidth usage',
      'Uses Class D IP addresses (224.0.0.0 to 239.255.255.255)'
    ],
    useCases: [
      'Video streaming to multiple viewers',
      'Stock market data feeds',
      'Online gaming',
      'Video conferencing',
      'IPTV broadcasts'
    ],
    example: 'Live video stream sent to subscribed viewers',
    visual: {
      sourceNodes: [0],
      destinationNodes: [2, 4, 6, 8],
      pathStyle: 'multiple'
    }
  },
  {
    id: 'anycast',
    name: 'Anycast',
    description: 'One-to-nearest communication where packet goes to closest available destination',
    characteristics: [
      'Multiple devices share same IP',
      'Routing determines nearest destination',
      'Provides redundancy and load balancing',
      'Common in DNS infrastructure',
      'Improves response time'
    ],
    useCases: [
      'DNS root servers',
      'Content delivery networks (CDN)',
      'DDoS mitigation',
      'Load balancing',
      'Service redundancy'
    ],
    example: 'DNS query routed to nearest DNS server',
    visual: {
      sourceNodes: [0],
      destinationNodes: [3, 7, 9],
      pathStyle: 'shortest'
    }
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    description: 'One-to-all communication where packet is sent to every device on the network',
    characteristics: [
      'Reaches all devices on local network',
      'Does not cross routers (Layer 2)',
      'Can cause network congestion',
      'Uses broadcast address (e.g., 192.168.1.255)',
      'Limited to local subnet'
    ],
    useCases: [
      'DHCP discovery',
      'ARP requests',
      'Network announcements',
      'Service discovery',
      'Legacy NetBIOS'
    ],
    example: 'DHCP client broadcasting to find DHCP server',
    visual: {
      sourceNodes: [0],
      destinationNodes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      pathStyle: 'all'
    }
  }
];

export const VIRTUAL_NETWORKS: VirtualNetwork[] = [
  {
    id: 'web-server',
    name: 'Web Server',
    description: 'Standard web server with common services',
    difficulty: 'easy',
    services: [
      {
        port: 22,
        state: 'open',
        service: 'SSH',
        version: 'OpenSSH 8.2p1',
        protocol: 'TCP',
        risk: 'low',
        recommendations: [
          'Disable password authentication',
          'Use SSH keys only',
          'Change default port',
          'Implement fail2ban'
        ]
      },
      {
        port: 80,
        state: 'open',
        service: 'HTTP',
        version: 'nginx 1.18.0',
        protocol: 'TCP',
        risk: 'medium',
        recommendations: [
          'Redirect to HTTPS',
          'Disable if not needed',
          'Implement HSTS'
        ]
      },
      {
        port: 443,
        state: 'open',
        service: 'HTTPS',
        version: 'nginx 1.18.0 (TLS 1.2/1.3)',
        protocol: 'TCP',
        risk: 'low',
        recommendations: [
          'Monitor certificate expiration',
          'Use strong cipher suites',
          'Enable HSTS'
        ]
      }
    ]
  },
  {
    id: 'corporate-server',
    name: 'Corporate Server',
    description: 'Enterprise server with multiple services',
    difficulty: 'medium',
    services: [
      {
        port: 22,
        state: 'open',
        service: 'SSH',
        version: 'OpenSSH 7.9p1',
        protocol: 'TCP',
        risk: 'medium',
        recommendations: [
          'Update SSH version',
          'Use key-based auth',
          'Restrict access by IP'
        ]
      },
      {
        port: 389,
        state: 'open',
        service: 'LDAP',
        version: 'OpenLDAP 2.4.48',
        protocol: 'TCP',
        risk: 'high',
        recommendations: [
          'Switch to LDAPS (636)',
          'Disable anonymous bind',
          'Encrypt all traffic'
        ]
      },
      {
        port: 445,
        state: 'open',
        service: 'SMB',
        version: 'Samba 4.11.6',
        protocol: 'TCP',
        risk: 'high',
        recommendations: [
          'Disable SMBv1',
          'Use SMBv3 encryption',
          'Restrict to internal network',
          'Patch regularly'
        ]
      },
      {
        port: 3389,
        state: 'open',
        service: 'RDP',
        version: 'Microsoft Terminal Services',
        protocol: 'TCP',
        risk: 'critical',
        recommendations: [
          'Use VPN for access',
          'Enable NLA',
          'Change default port',
          'Implement account lockout',
          'Remove from internet'
        ]
      }
    ]
  },
  {
    id: 'vulnerable-server',
    name: 'Vulnerable Server',
    description: 'Misconfigured server with security issues',
    difficulty: 'hard',
    services: [
      {
        port: 21,
        state: 'open',
        service: 'FTP',
        version: 'vsftpd 2.3.4',
        protocol: 'TCP',
        risk: 'critical',
        recommendations: [
          'Replace with SFTP immediately',
          'Known backdoor in this version',
          'Disable anonymous access',
          'Update or remove service'
        ]
      },
      {
        port: 23,
        state: 'open',
        service: 'Telnet',
        version: 'Linux telnetd',
        protocol: 'TCP',
        risk: 'critical',
        recommendations: [
          'Disable immediately',
          'Replace with SSH',
          'Never use on production',
          'All traffic is plaintext'
        ]
      },
      {
        port: 161,
        state: 'open',
        service: 'SNMP',
        version: 'SNMPv1 (public)',
        protocol: 'UDP',
        risk: 'critical',
        recommendations: [
          'Change default community string',
          'Upgrade to SNMPv3',
          'Enable encryption',
          'Restrict access'
        ]
      },
      {
        port: 1433,
        state: 'open',
        service: 'SQL Server',
        version: 'Microsoft SQL Server 2012',
        protocol: 'TCP',
        risk: 'critical',
        recommendations: [
          'Remove from internet immediately',
          'Use VPN or firewall',
          'Update to current version',
          'Enable encryption',
          'Strong authentication'
        ]
      }
    ]
  }
];

export const FLASH_CARDS: FlashCard[] = [
  {
    id: 'fc-ftp-ports',
    protocolId: 'ftp',
    question: 'Why does FTP use TWO different ports (20 and 21)?',
    answer: 'FTP uses port 21 for command/control channel (authentication, commands) and port 20 for the data transfer channel (actual file content). This separation allows for more flexible data transfers.',
    hints: [
      'Think about control vs data',
      'One port for commands, one for files',
      'Separation of concerns'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain in your own words why FTP needs separate ports for commands and data',
    minimumWords: 20
  },
  {
    id: 'fc-ftp-vs-sftp',
    protocolId: 'sftp',
    question: 'Explain the security difference between FTP (ports 20/21) and SFTP (port 22)',
    answer: 'FTP transmits everything in plaintext including passwords and files, making it vulnerable to interception. SFTP uses SSH encryption on port 22, encrypting all authentication and data transfer, preventing eavesdropping and credential theft.',
    hints: [
      'Think about encryption',
      'What can attackers see?',
      'SSH provides encryption'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Describe a scenario where using FTP instead of SFTP could lead to a security breach',
    minimumWords: 30
  },
  {
    id: 'fc-smtp-ports',
    protocolId: 'smtps',
    question: 'What is the difference between SMTP port 25 and port 587?',
    answer: 'Port 25 is used for server-to-server email relay (often unencrypted). Port 587 is used for client email submission with required authentication and STARTTLS encryption, preventing spam relay abuse.',
    hints: [
      'Server vs client usage',
      'Authentication requirements',
      'Encryption differences'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain why email clients should use port 587 instead of port 25',
    minimumWords: 25
  },
  {
    id: 'fc-dns-tcp-udp',
    protocolId: 'dns',
    question: 'Why does DNS use BOTH TCP and UDP on port 53?',
    answer: 'DNS primarily uses UDP for fast queries (most DNS lookups). TCP is used for zone transfers between DNS servers and for responses larger than 512 bytes. UDP is faster but has size limitations.',
    hints: [
      'Think about speed vs size',
      'Zone transfers are large',
      'Most queries are small'
    ],
    requiresExplanation: true,
    explanationPrompt: 'When would DNS automatically switch from UDP to TCP?',
    minimumWords: 20
  },
  {
    id: 'fc-dhcp-ports',
    protocolId: 'dhcp',
    question: 'Why does DHCP use TWO ports (67 and 68)?',
    answer: 'Port 67 is where the DHCP server listens for requests. Port 68 is where clients listen for responses. This allows clients to receive responses even before they have an IP address assigned.',
    hints: [
      'Server port vs client port',
      'Clients dont have IP yet',
      'How to receive without IP?'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain why a client without an IP address needs its own dedicated port',
    minimumWords: 25
  },
  {
    id: 'fc-http-https',
    protocolId: 'https',
    question: 'Why should you NEVER enter passwords on HTTP (port 80) sites?',
    answer: 'HTTP transmits all data in plaintext over port 80. Anyone monitoring the network can see your password. HTTPS (port 443) encrypts all data including passwords, protecting against eavesdropping and man-in-the-middle attacks.',
    hints: [
      'Encryption protection',
      'Network sniffing',
      'Plaintext vs encrypted'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Describe what an attacker could do if they intercept HTTP traffic containing a password',
    minimumWords: 30
  },
  {
    id: 'fc-snmp-ports',
    protocolId: 'snmp',
    question: 'Explain the difference between SNMP port 161 and port 162',
    answer: 'Port 161 is used by SNMP agents to receive queries from management systems. Port 162 is used by managers to receive traps (alerts/notifications) from agents. Different directions of communication.',
    hints: [
      'Queries vs alerts',
      'Manager vs agent',
      'Direction of communication'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Give an example of when a trap would be sent to port 162',
    minimumWords: 20
  },
  {
    id: 'fc-ldap-security',
    protocolId: 'ldaps',
    question: 'Why is LDAPS (port 636) more secure than LDAP (port 389)?',
    answer: 'LDAP on port 389 sends credentials and directory queries in plaintext. LDAPS on port 636 encrypts everything using TLS/SSL, protecting sensitive directory information and authentication credentials from interception.',
    hints: [
      'Encryption vs plaintext',
      'Credential protection',
      'TLS/SSL wrapping'
    ],
    requiresExplanation: true,
    explanationPrompt: 'What could an attacker learn by intercepting LDAP traffic on port 389?',
    minimumWords: 25
  },
  {
    id: 'fc-smb-vulnerability',
    protocolId: 'smb',
    question: 'Why is SMB port 445 considered high-risk and how was it exploited by WannaCry?',
    answer: 'SMB port 445 had a critical vulnerability (EternalBlue) in SMBv1 that allowed remote code execution. WannaCry ransomware exploited this to spread automatically across networks, encrypting files without user interaction.',
    hints: [
      'EternalBlue exploit',
      'SMBv1 vulnerability',
      'Remote code execution'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain what defensive measures prevent SMB-based attacks like WannaCry',
    minimumWords: 30
  },
  {
    id: 'fc-rdp-attacks',
    protocolId: 'rdp',
    question: 'Why should RDP port 3389 NEVER be exposed directly to the internet?',
    answer: 'RDP is a primary target for brute force attacks and contains vulnerabilities like BlueKeep. Exposing it allows attackers worldwide to attempt authentication, potentially gaining full system access. Always use VPN or other access controls.',
    hints: [
      'Brute force target',
      'Full system access',
      'Global attack surface'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Describe the proper way to allow remote RDP access for remote workers',
    minimumWords: 30
  },
  {
    id: 'fc-sip-encryption',
    protocolId: 'sip',
    question: 'What is the security difference between SIP port 5060 and 5061?',
    answer: 'Port 5060 uses unencrypted SIP signaling, exposing call setup information. Port 5061 uses TLS encryption to protect signaling, preventing eavesdropping on call metadata and authentication. Note: media still needs SRTP for full protection.',
    hints: [
      'Signaling encryption',
      'TLS protection',
      'Metadata exposure'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Even with port 5061, why do you still need SRTP for complete VoIP security?',
    minimumWords: 25
  },
  {
    id: 'fc-tcp-vs-udp',
    protocolId: 'dns',
    question: 'Why does streaming video use UDP instead of TCP?',
    answer: 'UDP is connectionless with no guaranteed delivery or retransmission. For real-time video, its better to drop occasional packets than to wait for retransmission (which would cause delays and buffering). TCP retransmission would create unacceptable latency.',
    hints: [
      'Real-time requirements',
      'Retransmission delays',
      'Live vs reliable'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain why TCP would be a poor choice for live video conferencing',
    minimumWords: 25
  },
  {
    id: 'fc-well-known-ports',
    protocolId: 'http',
    question: 'What are "well-known ports" and why are they standardized?',
    answer: 'Well-known ports (0-1023) are standardized port assignments for common services. Standardization ensures clients know where to find services (e.g., web servers on 80/443). This allows interoperability between different systems and vendors.',
    hints: [
      'Port ranges',
      'Service discovery',
      'Universal standards'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain what would happen if every web server used a random port instead of 80/443',
    minimumWords: 25
  },
  {
    id: 'fc-sql-exposure',
    protocolId: 'sqlserver',
    question: 'Why is exposing SQL Server port 1433 to the internet extremely dangerous?',
    answer: 'SQL Server contains sensitive business data and is frequently targeted by automated attacks. Exposure allows brute force attacks, exploitation of vulnerabilities, and potential data breaches. Database servers should only be accessible from application servers via firewall/VPN.',
    hints: [
      'Direct data access',
      'Automated scanning',
      'Data breach risk'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Describe the proper network architecture for database security',
    minimumWords: 30
  },
  {
    id: 'fc-telnet-obsolete',
    protocolId: 'telnet',
    question: 'Why is Telnet (port 23) considered obsolete and dangerous?',
    answer: 'Telnet sends everything in plaintext including passwords and commands. Every keystroke is visible to network sniffers. SSH (port 22) replaced Telnet by providing the same functionality with strong encryption, making Telnet use inexcusable on modern networks.',
    hints: [
      'No encryption',
      'Keystroke capture',
      'SSH replacement'
    ],
    requiresExplanation: true,
    explanationPrompt: 'Explain what an attacker monitoring the network could learn from a Telnet session',
    minimumWords: 25
  }
];
