/**
 * Data definitions for OSI Model components
 */

import type {
  Protocol,
  PDU,
  TroubleshootingScenario,
  LayerFunction,
  OSILayerNumber,
} from './osi-types';

export const LAYER_FUNCTIONS: Record<OSILayerNumber, LayerFunction[]> = {
  7: [
    { id: 'app-1', label: 'User interface and application services', correct: true },
    { id: 'app-2', label: 'Physical addressing', correct: false },
    { id: 'app-3', label: 'File transfer and email services', correct: true },
    { id: 'app-4', label: 'Network routing', correct: false },
    { id: 'app-5', label: 'HTTP, FTP, SMTP protocols', correct: true },
    { id: 'app-6', label: 'Session management', correct: false },
    { id: 'app-7', label: 'Data presentation to users', correct: true },
  ],
  6: [
    { id: 'pres-1', label: 'Data encryption and compression', correct: true },
    { id: 'pres-2', label: 'Reliable delivery and error recovery', correct: false },
    { id: 'pres-3', label: 'Format conversion and translation', correct: true },
    { id: 'pres-4', label: 'Routing and logical addressing', correct: false },
    { id: 'pres-5', label: 'Character encoding (ASCII, EBCDIC)', correct: true },
    { id: 'pres-6', label: 'Physical signal transmission', correct: false },
    { id: 'pres-7', label: 'Data serialization (JSON, XML)', correct: true },
  ],
  5: [
    { id: 'sess-1', label: 'Session establishment and termination', correct: true },
    { id: 'sess-2', label: 'Data Link layer framing', correct: false },
    { id: 'sess-3', label: 'Dialog control (half/full duplex)', correct: true },
    { id: 'sess-4', label: 'IP addressing', correct: false },
    { id: 'sess-5', label: 'Session synchronization', correct: true },
    { id: 'sess-6', label: 'MAC address resolution', correct: false },
    { id: 'sess-7', label: 'Connection coordination', correct: true },
  ],
  4: [
    { id: 'trans-1', label: 'Reliable delivery and error recovery', correct: true },
    { id: 'trans-2', label: 'Physical addressing', correct: false },
    { id: 'trans-3', label: 'Port-based communication', correct: true },
    { id: 'trans-4', label: 'Routing and logical addressing', correct: false },
    { id: 'trans-5', label: 'Segmentation and reassembly', correct: true },
    { id: 'trans-6', label: 'Data formatting', correct: false },
    { id: 'trans-7', label: 'Flow control and windowing', correct: true },
  ],
  3: [
    { id: 'net-1', label: 'Logical addressing (IP)', correct: true },
    { id: 'net-2', label: 'Physical addressing (MAC)', correct: false },
    { id: 'net-3', label: 'Routing and path determination', correct: true },
    { id: 'net-4', label: 'Port number assignment', correct: false },
    { id: 'net-5', label: 'Packet forwarding', correct: true },
    { id: 'net-6', label: 'Data encryption', correct: false },
    { id: 'net-7', label: 'Inter-network communication', correct: true },
  ],
  2: [
    { id: 'data-1', label: 'Physical addressing (MAC)', correct: true },
    { id: 'data-2', label: 'Logical addressing (IP)', correct: false },
    { id: 'data-3', label: 'Frame creation and error detection', correct: true },
    { id: 'data-4', label: 'Routing between networks', correct: false },
    { id: 'data-5', label: 'Media access control', correct: true },
    { id: 'data-6', label: 'Session establishment', correct: false },
    { id: 'data-7', label: 'Switch operation and VLANs', correct: true },
  ],
  1: [
    { id: 'phys-1', label: 'Physical signal transmission', correct: true },
    { id: 'phys-2', label: 'Logical addressing', correct: false },
    { id: 'phys-3', label: 'Bit-level encoding', correct: true },
    { id: 'phys-4', label: 'Packet routing', correct: false },
    { id: 'phys-5', label: 'Cable and connector specifications', correct: true },
    { id: 'phys-6', label: 'Error correction', correct: false },
    { id: 'phys-7', label: 'Voltage levels and timing', correct: true },
  ],
};

export const PROTOCOLS: Protocol[] = [
  // Layer 7 - Application Layer (WITH PORT NUMBERS FOR EXAM)
  {
    name: 'HTTP',
    layer: 7,
    port: 80,
    transport: 'TCP',
    description: 'Hypertext Transfer Protocol for web traffic',
    examImportance: 'critical',
  },
  {
    name: 'HTTPS',
    layer: 7,
    port: 443,
    transport: 'TCP',
    description: 'Secure HTTP with TLS/SSL encryption',
    examImportance: 'critical',
  },
  {
    name: 'FTP Data',
    layer: 7,
    port: 20,
    transport: 'TCP',
    description: 'File Transfer Protocol - Data Channel',
    examImportance: 'high',
  },
  {
    name: 'FTP Control',
    layer: 7,
    port: 21,
    transport: 'TCP',
    description: 'File Transfer Protocol - Control Channel',
    examImportance: 'high',
  },
  {
    name: 'SSH',
    layer: 7,
    port: 22,
    transport: 'TCP',
    description: 'Secure Shell - encrypted remote access',
    examImportance: 'critical',
  },
  {
    name: 'Telnet',
    layer: 7,
    port: 23,
    transport: 'TCP',
    description: 'Unencrypted remote terminal access',
    examImportance: 'high',
  },
  {
    name: 'SMTP',
    layer: 7,
    port: 25,
    transport: 'TCP',
    description: 'Simple Mail Transfer Protocol - email sending',
    examImportance: 'critical',
  },
  {
    name: 'DNS',
    layer: 7,
    port: 53,
    transport: 'Both',
    description: 'Domain Name System - name resolution',
    examImportance: 'critical',
  },
  {
    name: 'DHCP Server',
    layer: 7,
    port: 67,
    transport: 'UDP',
    description: 'Dynamic Host Configuration Protocol - Server',
    examImportance: 'critical',
  },
  {
    name: 'DHCP Client',
    layer: 7,
    port: 68,
    transport: 'UDP',
    description: 'Dynamic Host Configuration Protocol - Client',
    examImportance: 'critical',
  },
  {
    name: 'TFTP',
    layer: 7,
    port: 69,
    transport: 'UDP',
    description: 'Trivial File Transfer Protocol',
    examImportance: 'medium',
  },
  {
    name: 'HTTP Alt',
    layer: 7,
    port: 8080,
    transport: 'TCP',
    description: 'Alternative HTTP port',
    examImportance: 'medium',
  },
  {
    name: 'POP3',
    layer: 7,
    port: 110,
    transport: 'TCP',
    description: 'Post Office Protocol v3 - email retrieval',
    examImportance: 'high',
  },
  {
    name: 'NTP',
    layer: 7,
    port: 123,
    transport: 'UDP',
    description: 'Network Time Protocol - time synchronization',
    examImportance: 'high',
  },
  {
    name: 'NetBIOS Name',
    layer: 7,
    port: 137,
    transport: 'UDP',
    description: 'NetBIOS Name Service',
    examImportance: 'medium',
  },
  {
    name: 'NetBIOS Datagram',
    layer: 7,
    port: 138,
    transport: 'UDP',
    description: 'NetBIOS Datagram Service',
    examImportance: 'medium',
  },
  {
    name: 'NetBIOS Session',
    layer: 7,
    port: 139,
    transport: 'TCP',
    description: 'NetBIOS Session Service',
    examImportance: 'medium',
  },
  {
    name: 'IMAP',
    layer: 7,
    port: 143,
    transport: 'TCP',
    description: 'Internet Message Access Protocol',
    examImportance: 'high',
  },
  {
    name: 'SNMP',
    layer: 7,
    port: 161,
    transport: 'UDP',
    description: 'Simple Network Management Protocol',
    examImportance: 'critical',
  },
  {
    name: 'SNMP Trap',
    layer: 7,
    port: 162,
    transport: 'UDP',
    description: 'SNMP Trap messages',
    examImportance: 'high',
  },
  {
    name: 'LDAP',
    layer: 7,
    port: 389,
    transport: 'Both',
    description: 'Lightweight Directory Access Protocol',
    examImportance: 'high',
  },
  {
    name: 'HTTPS Alt',
    layer: 7,
    port: 8443,
    transport: 'TCP',
    description: 'Alternative HTTPS port',
    examImportance: 'low',
  },
  {
    name: 'SMB/CIFS',
    layer: 7,
    port: 445,
    transport: 'TCP',
    description: 'Server Message Block / Common Internet File System',
    examImportance: 'high',
  },
  {
    name: 'SMTPS',
    layer: 7,
    port: 465,
    transport: 'TCP',
    description: 'SMTP over SSL/TLS (legacy)',
    examImportance: 'medium',
  },
  {
    name: 'Syslog',
    layer: 7,
    port: 514,
    transport: 'UDP',
    description: 'System logging protocol',
    examImportance: 'medium',
  },
  {
    name: 'SMTP Submission',
    layer: 7,
    port: 587,
    transport: 'TCP',
    description: 'Email submission with STARTTLS',
    examImportance: 'medium',
  },
  {
    name: 'LDAPS',
    layer: 7,
    port: 636,
    transport: 'TCP',
    description: 'LDAP over SSL/TLS',
    examImportance: 'medium',
  },
  {
    name: 'IMAPS',
    layer: 7,
    port: 993,
    transport: 'TCP',
    description: 'IMAP over SSL/TLS',
    examImportance: 'medium',
  },
  {
    name: 'POP3S',
    layer: 7,
    port: 995,
    transport: 'TCP',
    description: 'POP3 over SSL/TLS',
    examImportance: 'medium',
  },
  {
    name: 'RDP',
    layer: 7,
    port: 3389,
    transport: 'TCP',
    description: 'Remote Desktop Protocol',
    examImportance: 'critical',
  },
  {
    name: 'SIP',
    layer: 7,
    port: 5060,
    transport: 'Both',
    description: 'Session Initiation Protocol - VoIP signaling',
    examImportance: 'high',
  },
  {
    name: 'SIP TLS',
    layer: 7,
    port: 5061,
    transport: 'TCP',
    description: 'SIP over TLS',
    examImportance: 'medium',
  },

  // Layer 6 - Presentation Layer
  {
    name: 'SSL/TLS',
    layer: 6,
    description: 'Secure Sockets Layer/Transport Layer Security - encryption',
    examImportance: 'critical',
  },
  {
    name: 'JPEG',
    layer: 6,
    description: 'Image format and compression standard',
    examImportance: 'low',
  },
  { name: 'MPEG', layer: 6, description: 'Video compression standard', examImportance: 'low' },
  { name: 'GIF', layer: 6, description: 'Graphics Interchange Format', examImportance: 'low' },
  {
    name: 'ASCII',
    layer: 6,
    description: 'American Standard Code for Information Interchange',
    examImportance: 'medium',
  },
  {
    name: 'EBCDIC',
    layer: 6,
    description: 'Extended Binary Coded Decimal Interchange Code',
    examImportance: 'low',
  },
  {
    name: 'Unicode',
    layer: 6,
    description: 'Universal character encoding standard',
    examImportance: 'medium',
  },
  {
    name: 'MIME',
    layer: 6,
    description: 'Multipurpose Internet Mail Extensions',
    examImportance: 'medium',
  },

  // Layer 5 - Session Layer
  {
    name: 'NetBIOS',
    layer: 5,
    description: 'Network Basic Input/Output System',
    examImportance: 'medium',
  },
  { name: 'RPC', layer: 5, description: 'Remote Procedure Call', examImportance: 'medium' },
  {
    name: 'PPTP',
    layer: 5,
    port: 1723,
    transport: 'TCP',
    description: 'Point-to-Point Tunneling Protocol',
    examImportance: 'medium',
  },
  {
    name: 'L2TP',
    layer: 5,
    port: 1701,
    transport: 'UDP',
    description: 'Layer 2 Tunneling Protocol',
    examImportance: 'medium',
  },
  {
    name: 'SIP',
    layer: 5,
    description: 'Session Initiation Protocol - session management',
    examImportance: 'high',
  },
  {
    name: 'SOCKS',
    layer: 5,
    port: 1080,
    transport: 'TCP',
    description: 'SOCKet Secure - proxy protocol',
    examImportance: 'low',
  },

  // Layer 4 - Transport Layer
  {
    name: 'TCP',
    layer: 4,
    description: 'Transmission Control Protocol - reliable, connection-oriented',
    examImportance: 'critical',
  },
  {
    name: 'UDP',
    layer: 4,
    description: 'User Datagram Protocol - unreliable, connectionless',
    examImportance: 'critical',
  },
  {
    name: 'SCTP',
    layer: 4,
    description: 'Stream Control Transmission Protocol',
    examImportance: 'low',
  },
  {
    name: 'DCCP',
    layer: 4,
    description: 'Datagram Congestion Control Protocol',
    examImportance: 'low',
  },

  // Layer 3 - Network Layer
  {
    name: 'IPv4',
    layer: 3,
    description: 'Internet Protocol version 4 - 32-bit addressing',
    examImportance: 'critical',
  },
  {
    name: 'IPv6',
    layer: 3,
    description: 'Internet Protocol version 6 - 128-bit addressing',
    examImportance: 'critical',
  },
  {
    name: 'ICMP',
    layer: 3,
    description: 'Internet Control Message Protocol - ping, traceroute',
    examImportance: 'critical',
  },
  { name: 'ICMPv6', layer: 3, description: 'ICMP for IPv6', examImportance: 'high' },
  {
    name: 'IGMP',
    layer: 3,
    description: 'Internet Group Management Protocol - multicast',
    examImportance: 'high',
  },
  {
    name: 'IPsec',
    layer: 3,
    description: 'IP Security protocol suite - VPN encryption',
    examImportance: 'high',
  },
  {
    name: 'OSPF',
    layer: 3,
    description: 'Open Shortest Path First - link-state routing',
    examImportance: 'high',
  },
  {
    name: 'EIGRP',
    layer: 3,
    description: 'Enhanced Interior Gateway Routing Protocol',
    examImportance: 'medium',
  },
  {
    name: 'BGP',
    layer: 3,
    description: 'Border Gateway Protocol - internet routing',
    examImportance: 'high',
  },
  {
    name: 'RIP',
    layer: 3,
    description: 'Routing Information Protocol - distance-vector',
    examImportance: 'medium',
  },
  {
    name: 'GRE',
    layer: 3,
    description: 'Generic Routing Encapsulation - tunneling',
    examImportance: 'medium',
  },

  // Layer 2 - Data Link Layer
  {
    name: 'Ethernet',
    layer: 2,
    description: 'IEEE 802.3 LAN standard - most common wired',
    examImportance: 'critical',
  },
  {
    name: 'Wi-Fi (802.11)',
    layer: 2,
    description: 'Wireless LAN standard',
    examImportance: 'critical',
  },
  {
    name: 'PPP',
    layer: 2,
    description: 'Point-to-Point Protocol - dial-up, serial',
    examImportance: 'high',
  },
  {
    name: 'PPPoE',
    layer: 2,
    description: 'PPP over Ethernet - DSL connections',
    examImportance: 'high',
  },
  {
    name: 'ARP',
    layer: 2,
    description: 'Address Resolution Protocol - IP to MAC mapping',
    examImportance: 'critical',
  },
  {
    name: 'RARP',
    layer: 2,
    description: 'Reverse ARP - MAC to IP (legacy)',
    examImportance: 'low',
  },
  {
    name: 'VLAN (802.1Q)',
    layer: 2,
    description: 'Virtual LAN tagging',
    examImportance: 'critical',
  },
  {
    name: 'STP (802.1D)',
    layer: 2,
    description: 'Spanning Tree Protocol - loop prevention',
    examImportance: 'high',
  },
  {
    name: 'RSTP (802.1w)',
    layer: 2,
    description: 'Rapid Spanning Tree Protocol',
    examImportance: 'medium',
  },
  {
    name: 'LLDP',
    layer: 2,
    description: 'Link Layer Discovery Protocol',
    examImportance: 'medium',
  },
  { name: 'CDP', layer: 2, description: 'Cisco Discovery Protocol', examImportance: 'medium' },
  { name: 'HDLC', layer: 2, description: 'High-Level Data Link Control', examImportance: 'low' },
  {
    name: 'Frame Relay',
    layer: 2,
    description: 'Packet-switched WAN protocol (legacy)',
    examImportance: 'low',
  },
  { name: 'ATM', layer: 2, description: 'Asynchronous Transfer Mode', examImportance: 'low' },

  // Layer 1 - Physical Layer
  {
    name: 'IEEE 802.3',
    layer: 1,
    description: 'Ethernet physical specifications',
    examImportance: 'high',
  },
  {
    name: 'DSL',
    layer: 1,
    description: 'Digital Subscriber Line - phone line broadband',
    examImportance: 'high',
  },
  {
    name: 'SONET/SDH',
    layer: 1,
    description: 'Synchronous Optical Network',
    examImportance: 'medium',
  },
  { name: 'USB', layer: 1, description: 'Universal Serial Bus', examImportance: 'low' },
  {
    name: 'Bluetooth',
    layer: 1,
    description: 'Short-range wireless standard',
    examImportance: 'low',
  },
  { name: 'RS-232', layer: 1, description: 'Serial communication standard', examImportance: 'low' },
  { name: 'T1/E1', layer: 1, description: 'Digital transmission standards', examImportance: 'low' },
  { name: 'OC-3/OC-12', layer: 1, description: 'Optical Carrier standards', examImportance: 'low' },
];

export const PDUS: PDU[] = [
  { layer: 7, name: 'Data', description: 'Application layer data' },
  { layer: 6, name: 'Data', description: 'Formatted/encrypted data' },
  { layer: 5, name: 'Data', description: 'Session data' },
  { layer: 4, name: 'Segment', description: 'TCP segment or UDP datagram' },
  { layer: 3, name: 'Packet', description: 'IP packet with source/destination addresses' },
  { layer: 2, name: 'Frame', description: 'Ethernet frame with MAC addresses' },
  { layer: 1, name: 'Bits', description: 'Binary bits transmitted as electrical/optical signals' },
];

export const TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = [
  {
    id: 'ts-01',
    title: "Users can't resolve website names",
    description:
      'Multiple users report that they cannot access websites by typing domain names (www.example.com), but can access sites when typing IP addresses directly (e.g., 192.168.1.100).',
    correctLayer: 7,
    explanation:
      'DNS (Domain Name System) operates at the Application Layer (Layer 7). The ability to access sites via IP but not domain names indicates a DNS resolution issue, which is an application-level service.',
    hints: [
      'Consider which service translates domain names to IP addresses',
      'This is not a connectivity issue since IP access works',
      'Think about application-level services',
    ],
    difficulty: 'medium',
    category: 'DNS',
  },
  {
    id: 'ts-02',
    title: 'Intermittent packet loss on fiber connection',
    description:
      'A fiber optic connection is experiencing random packet drops. Cable testing shows intermittent signal degradation and high BER (Bit Error Rate). The issue persists across different network equipment.',
    correctLayer: 1,
    explanation:
      'Signal quality, bit error rates, and physical transmission issues are Physical Layer (Layer 1) problems. This involves the actual fiber cable, connectors, or optical transmission issues.',
    hints: [
      'The problem affects the actual signal transmission',
      'BER relates to bit-level errors',
      'Consider the physical medium',
    ],
    difficulty: 'easy',
    category: 'Physical Media',
  },
  {
    id: 'ts-03',
    title: 'TCP retransmissions occurring',
    description:
      'Network monitoring shows excessive TCP retransmissions between a client and server. The network path is stable, but segments are being sent multiple times before acknowledgment.',
    correctLayer: 4,
    explanation:
      "TCP retransmissions are a Transport Layer (Layer 4) mechanism. TCP is responsible for reliable delivery, and retransmissions occur when acknowledgments aren't received within the timeout period.",
    hints: [
      'TCP operates at a specific layer',
      'Consider which layer ensures reliable delivery',
      'Retransmissions are part of error recovery',
    ],
    difficulty: 'medium',
    category: 'Transport',
  },
  {
    id: 'ts-04',
    title: 'MAC address table overflow',
    description:
      "A network switch's MAC address table is filling up rapidly with thousands of entries, causing legitimate traffic to be flooded to all ports. The switch is experiencing a potential CAM table attack.",
    correctLayer: 2,
    explanation:
      'MAC address tables are maintained by switches at the Data Link Layer (Layer 2). MAC addresses and switch forwarding decisions are Layer 2 operations.',
    hints: [
      'MAC addresses belong to which layer?',
      'Switches operate primarily at which layer?',
      'Consider the layer that handles physical addressing',
    ],
    difficulty: 'medium',
    category: 'Switching',
  },
  {
    id: 'ts-05',
    title: 'Routing loops detected',
    description:
      "Network diagnostics reveal that packets are circulating between three routers indefinitely. TTL values are decrementing to zero, and ICMP 'Time Exceeded' messages are being generated.",
    correctLayer: 3,
    explanation:
      'Routing and routing loops occur at the Network Layer (Layer 3). Routers, IP addresses, TTL, and path determination are all Layer 3 functions.',
    hints: [
      'Routers operate at which layer?',
      'TTL is a feature of which protocol?',
      'Path determination happens at which layer?',
    ],
    difficulty: 'medium',
    category: 'Routing',
  },
  {
    id: 'ts-06',
    title: 'HTTPS certificate errors',
    description:
      'Users accessing a secure website receive warnings about invalid SSL/TLS certificates. The certificate has expired and browsers are showing security warnings before allowing connections.',
    correctLayer: 6,
    explanation:
      'SSL/TLS certificates and encryption operate at the Presentation Layer (Layer 6). This layer handles data encryption, decryption, and certificate validation.',
    hints: [
      'Encryption occurs at which layer?',
      'SSL/TLS is associated with which layer?',
      'Data format and security transformations happen where?',
    ],
    difficulty: 'hard',
    category: 'Security',
  },
  {
    id: 'ts-07',
    title: 'Database session timeouts',
    description:
      "A web application's database connections are timing out prematurely. The sessions are being terminated unexpectedly, requiring users to log in again. The issue is related to session keepalive parameters.",
    correctLayer: 5,
    explanation:
      'Session management, establishment, and maintenance occur at the Session Layer (Layer 5). This layer controls dialog and manages connections between applications.',
    hints: [
      'Session management is a key function of which layer?',
      'Connection coordination happens where?',
      'Dialog control is associated with which layer?',
    ],
    difficulty: 'hard',
    category: 'Sessions',
  },
  {
    id: 'ts-08',
    title: 'Ethernet collision detection failures',
    description:
      "A hub-based network segment is experiencing frame collisions that aren't being properly detected. Multiple devices transmit simultaneously, corrupting frames, and the collision detection mechanism isn't working correctly.",
    correctLayer: 2,
    explanation:
      'CSMA/CD (Carrier Sense Multiple Access with Collision Detection) is a Data Link Layer (Layer 2) protocol. Frame transmission and collision handling occur at Layer 2.',
    hints: [
      "Collision detection is part of which layer's protocols?",
      'Frames are the PDU of which layer?',
      'Media access control happens at which layer?',
    ],
    difficulty: 'medium',
    category: 'Media Access',
  },
  {
    id: 'ts-09',
    title: 'ICMP unreachable messages',
    description:
      "When attempting to reach a remote server, users receive 'Destination Host Unreachable' ICMP messages. The router cannot find a path to the destination network.",
    correctLayer: 3,
    explanation:
      'ICMP (Internet Control Message Protocol) operates at the Network Layer (Layer 3). These messages are used for network-layer diagnostics and error reporting.',
    hints: [
      'ICMP is associated with which protocol?',
      'Network reachability is determined at which layer?',
      'Routers generate these messages',
    ],
    difficulty: 'easy',
    category: 'Network Diagnostics',
  },
  {
    id: 'ts-10',
    title: 'Port 443 blocked by firewall',
    description:
      'Users cannot access HTTPS websites because the firewall is blocking port 443. HTTP (port 80) traffic works fine, but secure connections fail.',
    correctLayer: 4,
    explanation:
      'Port numbers are a Transport Layer (Layer 4) concept. While HTTPS is an application protocol, the blocking is occurring at the port level, which is a Layer 4 function.',
    hints: [
      'Port numbers are associated with which layer?',
      'TCP/UDP ports belong to which layer?',
      'Transport protocols use port numbers',
    ],
    difficulty: 'medium',
    category: 'Firewall',
  },
  {
    id: 'ts-11',
    title: 'Wi-Fi signal interference',
    description:
      'Wireless clients are experiencing disconnections due to interference from a microwave oven in the break room. The 2.4 GHz signal is being disrupted by electromagnetic interference.',
    correctLayer: 1,
    explanation:
      'Radio frequency transmission and electromagnetic interference are Physical Layer (Layer 1) issues. The problem affects the actual wireless signal transmission.',
    hints: [
      'RF transmission occurs at which layer?',
      'Physical wireless signals belong to which layer?',
      'Electromagnetic interference affects the medium',
    ],
    difficulty: 'easy',
    category: 'Wireless',
  },
  {
    id: 'ts-12',
    title: 'ARP cache poisoning attack',
    description:
      "A malicious actor is sending false ARP replies, associating their MAC address with the gateway's IP address. Clients are sending traffic to the attacker instead of the legitimate gateway.",
    correctLayer: 2,
    explanation:
      'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses at the Data Link Layer (Layer 2). ARP operates between Layer 2 and Layer 3 but is fundamentally a Layer 2 protocol.',
    hints: [
      'ARP resolves addresses between which two layers?',
      'MAC addresses are Layer 2',
      'This attack targets the address resolution process',
    ],
    difficulty: 'hard',
    category: 'Security',
  },
  {
    id: 'ts-13',
    title: 'MTU size mismatch',
    description:
      "Large packets are being fragmented excessively or dropped entirely due to mismatched Maximum Transmission Unit (MTU) sizes across the network path. Some packets with the 'Don't Fragment' bit set are being dropped.",
    correctLayer: 3,
    explanation:
      "MTU and packet fragmentation are Network Layer (Layer 3) functions. IP handles packet fragmentation and the Don't Fragment flag is an IP header field.",
    hints: [
      'Packet fragmentation occurs at which layer?',
      'MTU affects which PDU?',
      'IP header fields are part of which layer?',
    ],
    difficulty: 'hard',
    category: 'IP Configuration',
  },
  {
    id: 'ts-14',
    title: 'STP convergence delays',
    description:
      'After a link failure, the network takes 30-50 seconds to reconverge because Spanning Tree Protocol (STP) is transitioning ports through listening and learning states before forwarding traffic.',
    correctLayer: 2,
    explanation:
      'Spanning Tree Protocol (STP) prevents Layer 2 loops and operates at the Data Link Layer (Layer 2). It manages switch port states and network topology.',
    hints: [
      'STP prevents loops at which layer?',
      'Switches use this protocol',
      'Layer 2 topology management',
    ],
    difficulty: 'medium',
    category: 'Switching',
  },
  {
    id: 'ts-15',
    title: 'Email delivery failures (SMTP)',
    description:
      'An email server cannot send outbound emails. SMTP connections to remote mail servers are failing with connection timeout errors. Port 25 connectivity tests fail.',
    correctLayer: 7,
    explanation:
      'SMTP (Simple Mail Transfer Protocol) is an Application Layer (Layer 7) protocol. Email services and their operation are application-level functions.',
    hints: [
      'SMTP is an application protocol',
      'Email services operate at which layer?',
      'Application services use specific protocols',
    ],
    difficulty: 'easy',
    category: 'Email',
  },
  {
    id: 'ts-16',
    title: 'Damaged RJ45 connector',
    description:
      "A workstation cannot connect to the network due to a physically damaged RJ45 connector on the Ethernet cable. The clip is broken and the connector won't stay seated in the jack.",
    correctLayer: 1,
    explanation:
      'Physical connectors, cables, and mechanical connections are Physical Layer (Layer 1) components. This is a purely physical problem with the connector hardware.',
    hints: [
      'Connectors and cables are at which layer?',
      'Physical damage affects which layer?',
      'The problem is with the physical medium',
    ],
    difficulty: 'easy',
    category: 'Physical Media',
  },
  {
    id: 'ts-17',
    title: 'TCP window size issues',
    description:
      "File transfers are slow due to inefficient TCP window sizing. The window scale is too small, preventing the connection from utilizing available bandwidth. Flow control isn't optimizing throughput.",
    correctLayer: 4,
    explanation:
      'TCP window size and flow control are Transport Layer (Layer 4) mechanisms. TCP manages window sizing to control the rate of data transmission.',
    hints: [
      'TCP operates at which layer?',
      'Flow control is a transport function',
      'Window size is a TCP parameter',
    ],
    difficulty: 'hard',
    category: 'Transport',
  },
  {
    id: 'ts-18',
    title: 'VLAN misconfiguration',
    description:
      "Devices in different VLANs cannot communicate even though they're on the same physical switch. VLAN tagging is incorrect, and trunk ports aren't configured to pass traffic for all required VLANs.",
    correctLayer: 2,
    explanation:
      'VLANs (Virtual Local Area Networks) are Data Link Layer (Layer 2) constructs. VLAN tagging and switch port configuration are Layer 2 functions.',
    hints: [
      'VLANs segment traffic at which layer?',
      'Virtual LANs are a switching concept',
      'Layer 2 logical segmentation',
    ],
    difficulty: 'medium',
    category: 'VLANs',
  },
  {
    id: 'ts-19',
    title: 'Subnet mask errors',
    description:
      'A host is configured with an incorrect subnet mask, causing it to misidentify which addresses are on the local network versus remote networks. Local communication fails while some remote communication works.',
    correctLayer: 3,
    explanation:
      'Subnet masks are part of IP addressing at the Network Layer (Layer 3). They determine network boundaries and are used for routing decisions.',
    hints: [
      'IP addressing occurs at which layer?',
      'Subnet masks help determine network boundaries',
      'Routing decisions use this information',
    ],
    difficulty: 'medium',
    category: 'IP Configuration',
  },
  {
    id: 'ts-20',
    title: 'FTP active mode firewall blocks',
    description:
      'FTP transfers fail in active mode because the firewall blocks the server-initiated data connection on port 20. Passive mode works fine, but active mode connections time out.',
    correctLayer: 7,
    explanation:
      'FTP modes (active vs passive) are Application Layer (Layer 7) behaviors. While port numbers are Layer 4, the FTP protocol operation and mode selection are Layer 7 concerns.',
    hints: [
      'FTP is an application protocol',
      'Protocol mode selection happens at which layer?',
      'Application-level behavior and operation',
    ],
    difficulty: 'hard',
    category: 'File Transfer',
  },
  {
    id: 'ts-21',
    title: 'Half-duplex mismatch',
    description:
      'A connection between a switch and router is experiencing excessive collisions and errors due to a duplex mismatch. One side is configured for full-duplex while the other is set to half-duplex.',
    correctLayer: 2,
    explanation:
      'Duplex settings (half vs full) are Data Link Layer (Layer 2) configurations. This affects how frames are transmitted and received on the physical link.',
    hints: [
      'Duplex settings affect frame transmission',
      'This is a switching/interface configuration',
      'Layer 2 media access control',
    ],
    difficulty: 'medium',
    category: 'Configuration',
  },
  {
    id: 'ts-22',
    title: 'QoS prioritization failure',
    description:
      "Voice over IP (VoIP) calls have poor quality despite QoS being configured. The router isn't properly prioritizing voice traffic, causing packet loss and jitter during network congestion.",
    correctLayer: 3,
    explanation:
      'QoS (Quality of Service) marking and prioritization typically occur at the Network Layer (Layer 3) using DSCP values in IP headers, though QoS can span multiple layers.',
    hints: [
      'QoS markings are in IP headers',
      'Prioritization uses Layer 3 fields',
      'Traffic classification at the network layer',
    ],
    difficulty: 'hard',
    category: 'QoS',
  },
  {
    id: 'ts-23',
    title: 'DNS TTL caching issues',
    description:
      "After changing a server's IP address, clients continue accessing the old IP for hours due to DNS caching. The DNS TTL (Time To Live) value is set too high, causing stale records to persist.",
    correctLayer: 7,
    explanation:
      'DNS and its caching mechanisms are Application Layer (Layer 7) functions. DNS TTL is an application-level parameter that controls cache duration.',
    hints: [
      'DNS operates at the application layer',
      'Caching is a DNS application feature',
      'TTL in DNS is different from IP TTL',
    ],
    difficulty: 'medium',
    category: 'DNS',
  },
  {
    id: 'ts-24',
    title: 'CSMA/CA inefficiency',
    description:
      'A wireless network is experiencing poor performance in a crowded office due to excessive RTS/CTS overhead. The CSMA/CA (Collision Avoidance) mechanism is causing more overhead than necessary.',
    correctLayer: 2,
    explanation:
      "CSMA/CA is the media access control method for wireless networks at the Data Link Layer (Layer 2). It's part of the 802.11 MAC sublayer.",
    hints: [
      'Media access control for wireless',
      'Part of the 802.11 standard',
      'MAC sublayer function',
    ],
    difficulty: 'hard',
    category: 'Wireless',
  },
  {
    id: 'ts-25',
    title: 'UDP packet loss',
    description:
      "A video streaming application experiences packet loss, but no retransmissions occur. The application uses UDP, which doesn't provide reliability mechanisms, resulting in dropped frames.",
    correctLayer: 4,
    explanation:
      "UDP characteristics (connectionless, no reliability) are Transport Layer (Layer 4) properties. The lack of retransmission is inherent to UDP's design.",
    hints: [
      'UDP operates at the transport layer',
      'Connectionless protocol behavior',
      'Transport protocol choice affects reliability',
    ],
    difficulty: 'easy',
    category: 'Transport',
  },
  {
    id: 'ts-26',
    title: 'Broadcast storm',
    description:
      "A network is experiencing a broadcast storm where broadcast frames are circulating endlessly, consuming all available bandwidth. The Layer 2 loop isn't being prevented by STP.",
    correctLayer: 2,
    explanation:
      'Broadcast storms and broadcast frames are Data Link Layer (Layer 2) issues. Broadcasts propagate at Layer 2 within a broadcast domain.',
    hints: [
      'Broadcasts occur at which layer?',
      'Frames are the Layer 2 PDU',
      'STP prevents Layer 2 loops',
    ],
    difficulty: 'medium',
    category: 'Switching',
  },
  {
    id: 'ts-27',
    title: 'HTTP 404 errors',
    description:
      "Users receive HTTP 404 Not Found errors when trying to access a specific web page. The web server is functioning, but the requested resource doesn't exist at the specified URL.",
    correctLayer: 7,
    explanation:
      'HTTP status codes are part of the Application Layer (Layer 7) protocol. The 404 error is an application-level response indicating a missing resource.',
    hints: [
      'HTTP is an application protocol',
      'Status codes are part of HTTP',
      'Application-level error responses',
    ],
    difficulty: 'easy',
    category: 'Web Services',
  },
  {
    id: 'ts-28',
    title: 'Fiber attenuation',
    description:
      'A long fiber optic run is experiencing signal loss (attenuation) beyond acceptable limits. The light signal weakens over distance, requiring repeaters or amplifiers.',
    correctLayer: 1,
    explanation:
      'Signal attenuation and optical power loss are Physical Layer (Layer 1) phenomena. This involves the physical properties of light transmission through fiber.',
    hints: [
      'Signal strength is a physical property',
      'Optical transmission characteristics',
      'Physical medium limitations',
    ],
    difficulty: 'medium',
    category: 'Physical Media',
  },
  {
    id: 'ts-29',
    title: 'NAT translation errors',
    description:
      'Network Address Translation (NAT) is failing to properly translate internal private IP addresses to the public IP address. Return traffic cannot be matched to the correct internal host.',
    correctLayer: 3,
    explanation:
      "NAT operates at the Network Layer (Layer 3), modifying IP addresses in packet headers. It's a Layer 3 function that translates between address spaces.",
    hints: [
      'NAT modifies IP addresses',
      'IP address translation',
      'Network layer address manipulation',
    ],
    difficulty: 'medium',
    category: 'NAT',
  },
  {
    id: 'ts-30',
    title: 'Port security violation',
    description:
      'A switch port has shut down due to a port security violation. The switch detected more MAC addresses than allowed on the port and disabled it according to the violation action.',
    correctLayer: 2,
    explanation:
      'Port security, which restricts MAC addresses on switch ports, is a Data Link Layer (Layer 2) security feature. It operates on MAC addresses.',
    hints: ['MAC address restriction', 'Switch port feature', 'Layer 2 security mechanism'],
    difficulty: 'medium',
    category: 'Security',
  },
  {
    id: 'ts-31',
    title: 'Incorrect character encoding',
    description:
      'A web application displays garbled text because of character encoding mismatch. The server sends UTF-8 data but the client interprets it as ISO-8859-1, causing display errors.',
    correctLayer: 6,
    explanation:
      'Character encoding and data format translation occur at the Presentation Layer (Layer 6). This layer handles data representation and format conversion.',
    hints: [
      'Data format and encoding',
      'Character set translation',
      'Presentation of data to applications',
    ],
    difficulty: 'hard',
    category: 'Data Format',
  },
  {
    id: 'ts-32',
    title: 'DHCP IP address exhaustion',
    description:
      'New devices cannot obtain IP addresses because the DHCP pool is exhausted. All available addresses in the scope have been assigned, and no addresses are being released.',
    correctLayer: 7,
    explanation:
      'DHCP is an Application Layer (Layer 7) protocol that dynamically assigns IP addresses. The DHCP service and its address management are application-level functions.',
    hints: [
      'DHCP is an application service',
      'Dynamic address assignment protocol',
      'Application layer network service',
    ],
    difficulty: 'easy',
    category: 'DHCP',
  },
  {
    id: 'ts-33',
    title: 'Load balancer session persistence',
    description:
      "A load balancer isn't maintaining session persistence (sticky sessions), causing users to be directed to different backend servers and losing their session state.",
    correctLayer: 5,
    explanation:
      'Session persistence and session management are Session Layer (Layer 5) concerns. Maintaining session state across connections is a Layer 5 function.',
    hints: [
      'Session management and tracking',
      'Maintaining connection state',
      'Session layer coordination',
    ],
    difficulty: 'hard',
    category: 'Load Balancing',
  },
  {
    id: 'ts-34',
    title: 'PoE power budget exceeded',
    description:
      "Power over Ethernet (PoE) devices are not receiving power because the switch's PoE power budget has been exceeded. Not enough power is available for all connected devices.",
    correctLayer: 1,
    explanation:
      'PoE delivers electrical power over Ethernet cables at the Physical Layer (Layer 1). Power delivery and electrical specifications are physical layer concerns.',
    hints: [
      'Electrical power delivery',
      'Physical layer power specifications',
      'Cable power transmission',
    ],
    difficulty: 'medium',
    category: 'PoE',
  },
  {
    id: 'ts-35',
    title: 'TCP SYN flood attack',
    description:
      'A server is under a TCP SYN flood attack where attackers send numerous SYN packets without completing the three-way handshake, exhausting server connection resources.',
    correctLayer: 4,
    explanation:
      'The TCP three-way handshake (SYN, SYN-ACK, ACK) is a Transport Layer (Layer 4) process. This attack exploits the TCP connection establishment mechanism.',
    hints: [
      'TCP connection establishment',
      'Three-way handshake is Layer 4',
      'Transport protocol vulnerability',
    ],
    difficulty: 'hard',
    category: 'Security',
  },
  {
    id: 'ts-36',
    title: 'Jumbo frames not supported',
    description:
      "A network path doesn't support jumbo frames (frames larger than 1518 bytes). When jumbo frames are sent, they're either fragmented or dropped, causing performance issues.",
    correctLayer: 2,
    explanation:
      'Frame size and jumbo frame support are Data Link Layer (Layer 2) characteristics. Frames are the Layer 2 PDU, and frame size is a Layer 2 parameter.',
    hints: [
      'Frames are Layer 2 PDUs',
      'Frame size is a Layer 2 characteristic',
      'Data Link layer maximum transmission unit',
    ],
    difficulty: 'hard',
    category: 'Configuration',
  },
  {
    id: 'ts-37',
    title: 'BGP route flapping',
    description:
      'Border Gateway Protocol (BGP) routes are flapping, rapidly appearing and disappearing from the routing table. This instability affects routing decisions and network reachability.',
    correctLayer: 3,
    explanation:
      'BGP is a routing protocol that operates at the Network Layer (Layer 3). Routing table updates and path selection are Layer 3 functions.',
    hints: [
      'BGP is a routing protocol',
      'Routing occurs at Layer 3',
      'Path selection and routing tables',
    ],
    difficulty: 'hard',
    category: 'Routing',
  },
  {
    id: 'ts-38',
    title: 'SSH authentication failures',
    description:
      'Users cannot authenticate to SSH servers due to incorrect key pairs or failed password authentication. The SSH protocol negotiation completes, but user authentication fails.',
    correctLayer: 7,
    explanation:
      'SSH is an Application Layer (Layer 7) protocol. User authentication within SSH is an application-level function, even though encryption occurs at Layer 6.',
    hints: [
      'SSH is an application protocol',
      'User authentication is application-level',
      'Protocol operation at Layer 7',
    ],
    difficulty: 'medium',
    category: 'Security',
  },
  {
    id: 'ts-39',
    title: 'CRC errors on interface',
    description:
      'A network interface is reporting CRC (Cyclic Redundancy Check) errors, indicating corrupted frames. The Frame Check Sequence (FCS) validation is failing on received frames.',
    correctLayer: 2,
    explanation:
      'CRC and FCS are error detection mechanisms at the Data Link Layer (Layer 2). Frame integrity checking is a Layer 2 function.',
    hints: ['Frame error detection', 'FCS is part of the frame', 'Layer 2 error checking'],
    difficulty: 'medium',
    category: 'Error Detection',
  },
  {
    id: 'ts-40',
    title: 'Multicast routing not working',
    description:
      "Multicast traffic isn't being routed correctly through the network. Multicast groups aren't being joined properly, and IGMP messages aren't being processed correctly by routers.",
    correctLayer: 3,
    explanation:
      'Multicast routing and IGMP (Internet Group Management Protocol) operate at the Network Layer (Layer 3). Multicast IP addressing and routing are Layer 3 functions.',
    hints: [
      'Multicast uses special IP addresses',
      'IGMP operates at Layer 3',
      'Routing multicast traffic',
    ],
    difficulty: 'hard',
    category: 'Multicast',
  },
  {
    id: 'ts-41',
    title: 'SSL/TLS version mismatch',
    description:
      'A client and server cannot establish a secure connection due to SSL/TLS version incompatibility. The client only supports TLS 1.2, but the server requires TLS 1.3.',
    correctLayer: 6,
    explanation:
      'SSL/TLS protocol negotiation and encryption setup occur at the Presentation Layer (Layer 6). This layer handles security protocol selection and cipher negotiation.',
    hints: [
      'Encryption protocol negotiation',
      'Security and data transformation',
      'Presentation layer security',
    ],
    difficulty: 'hard',
    category: 'Security',
  },
  {
    id: 'ts-42',
    title: 'Crosstalk interference',
    description:
      'Adjacent copper cables are experiencing crosstalk, where signals from one cable induce electromagnetic interference in another. Data corruption occurs due to this physical interference.',
    correctLayer: 1,
    explanation:
      'Electromagnetic interference and crosstalk are Physical Layer (Layer 1) phenomena. This involves the physical properties of signal transmission in copper cables.',
    hints: [
      'Electromagnetic interference',
      'Physical signal properties',
      'Cable-level interference',
    ],
    difficulty: 'medium',
    category: 'Physical Media',
  },
  {
    id: 'ts-43',
    title: 'NetBIOS name resolution failing',
    description:
      'Windows computers cannot resolve NetBIOS names on the local network. The NetBIOS Name Service (NBNS) is not functioning, preventing SMB file sharing by computer name.',
    correctLayer: 5,
    explanation:
      'NetBIOS operates at the Session Layer (Layer 5), providing naming, session establishment, and datagram services for Windows networking.',
    hints: [
      'NetBIOS provides session services',
      'Name service for session establishment',
      'Layer 5 Windows networking',
    ],
    difficulty: 'hard',
    category: 'Name Resolution',
  },
  {
    id: 'ts-44',
    title: 'Incorrect gateway configuration',
    description:
      'A host cannot reach remote networks because the default gateway is incorrectly configured or the gateway device is offline. Local network communication works fine.',
    correctLayer: 3,
    explanation:
      'Default gateway configuration and routing to remote networks are Network Layer (Layer 3) functions. The gateway routes packets between networks.',
    hints: [
      'Gateway performs routing',
      'Routing is a Layer 3 function',
      'Inter-network communication',
    ],
    difficulty: 'easy',
    category: 'Routing',
  },
  {
    id: 'ts-45',
    title: 'NTP synchronization failures',
    description:
      'Network devices cannot synchronize their clocks with NTP (Network Time Protocol) servers. Time synchronization is failing, causing authentication and logging issues.',
    correctLayer: 7,
    explanation:
      'NTP is an Application Layer (Layer 7) protocol that provides time synchronization. Clock synchronization is an application-level service.',
    hints: [
      'NTP is an application protocol',
      'Time synchronization service',
      'Application-level service',
    ],
    difficulty: 'easy',
    category: 'Time Synchronization',
  },
  {
    id: 'ts-46',
    title: '802.1X authentication failures',
    description:
      "Devices cannot authenticate to the network using 802.1X port-based authentication. The RADIUS server isn't receiving authentication requests, or credentials are incorrect.",
    correctLayer: 2,
    explanation:
      '802.1X is a port-based network access control protocol at the Data Link Layer (Layer 2). It controls access at the switch port level before higher layer protocols are allowed.',
    hints: [
      'Port-based access control',
      'Switch port authentication',
      'Layer 2 security mechanism',
    ],
    difficulty: 'hard',
    category: 'Security',
  },
  {
    id: 'ts-47',
    title: 'IPsec tunnel establishment failure',
    description:
      'An IPsec VPN tunnel cannot be established between two sites. Phase 1 IKE negotiation is failing due to mismatched encryption algorithms or pre-shared key problems.',
    correctLayer: 3,
    explanation:
      'IPsec operates at the Network Layer (Layer 3), encrypting and authenticating IP packets. While encryption is a Presentation Layer concept, IPsec specifically operates on Layer 3 packets.',
    hints: [
      'IPsec protects IP packets',
      'Network layer security protocol',
      'IP packet encryption and authentication',
    ],
    difficulty: 'hard',
    category: 'VPN',
  },
  {
    id: 'ts-48',
    title: 'SIP call setup failures',
    description:
      "VoIP calls using SIP (Session Initiation Protocol) fail during call setup. The INVITE messages aren't reaching the destination, or the signaling path is blocked by a firewall.",
    correctLayer: 5,
    explanation:
      'SIP operates at the Session Layer (Layer 5), establishing, modifying, and terminating multimedia sessions. Call setup and session negotiation are Layer 5 functions.',
    hints: ['SIP establishes sessions', 'Call setup and negotiation', 'Session layer protocol'],
    difficulty: 'hard',
    category: 'VoIP',
  },
  {
    id: 'ts-49',
    title: 'Cable length exceeds maximum',
    description:
      'An Ethernet cable run exceeds the 100-meter maximum length for Cat6 copper cable. Devices at the end of the long cable cannot establish a link or experience frequent disconnections.',
    correctLayer: 1,
    explanation:
      'Cable length limitations and signal propagation are Physical Layer (Layer 1) constraints. Maximum cable length is defined by physical specifications.',
    hints: [
      'Physical cable specifications',
      'Signal propagation limits',
      'Physical medium constraints',
    ],
    difficulty: 'easy',
    category: 'Physical Media',
  },
  {
    id: 'ts-50',
    title: 'Socket connection limit reached',
    description:
      "A server application cannot accept new connections because it has reached the maximum number of open sockets. The operating system's connection limit is preventing new TCP connections.",
    correctLayer: 4,
    explanation:
      'Sockets are Transport Layer (Layer 4) endpoints that combine IP addresses and port numbers. Socket management and connection limits are Layer 4 concerns.',
    hints: [
      'Sockets combine IP and port',
      'TCP connection endpoints',
      'Transport layer connections',
    ],
    difficulty: 'medium',
    category: 'Transport',
  },
];

export const LAYER_COLORS: Record<OSILayerNumber, string> = {
  7: '#FF6B6B',
  6: '#4ECDC4',
  5: '#45B7D1',
  4: '#96CEB4',
  3: '#FFEAA7',
  2: '#DFE6E9',
  1: '#A29BFE',
};

export const LAYER_NAMES: Record<OSILayerNumber, string> = {
  7: 'Application',
  6: 'Presentation',
  5: 'Session',
  4: 'Transport',
  3: 'Network',
  2: 'Data Link',
  1: 'Physical',
};

// TCP FLAGS - CRITICAL FOR COMPTIA NETWORK+ EXAM
export interface TCPFlag {
  name: string;
  abbreviation: string;
  bitPosition: number;
  description: string;
  commonUse: string;
  examScenario: string;
}

export const TCP_FLAGS: TCPFlag[] = [
  {
    name: 'Synchronize',
    abbreviation: 'SYN',
    bitPosition: 1,
    description: 'Initiates a TCP connection',
    commonUse: 'First packet in 3-way handshake (SYN)',
    examScenario: 'SYN flood DDoS attack - half-open connections exhaust server resources',
  },
  {
    name: 'Acknowledgment',
    abbreviation: 'ACK',
    bitPosition: 4,
    description: 'Acknowledges received data',
    commonUse: 'Confirms packet receipt (every packet after SYN)',
    examScenario: 'Missing ACKs trigger retransmissions, causing performance issues',
  },
  {
    name: 'Finish',
    abbreviation: 'FIN',
    bitPosition: 0,
    description: 'Gracefully closes connection',
    commonUse: 'Normal connection termination (4-way close)',
    examScenario: 'FIN+ACK indicates polite connection shutdown',
  },
  {
    name: 'Reset',
    abbreviation: 'RST',
    bitPosition: 2,
    description: 'Abruptly terminates connection',
    commonUse: 'Error handling or refused connections',
    examScenario: 'Port scanning - RST means port closed, no RST means filtered/open',
  },
  {
    name: 'Push',
    abbreviation: 'PSH',
    bitPosition: 3,
    description: 'Sends data immediately without buffering',
    commonUse: 'Interactive applications (SSH, Telnet, real-time chat)',
    examScenario: 'Forces immediate delivery for time-sensitive data',
  },
  {
    name: 'Urgent',
    abbreviation: 'URG',
    bitPosition: 5,
    description: 'Marks urgent data in stream',
    commonUse: 'Priority data transmission (rarely used)',
    examScenario: 'Ctrl+C interrupt signals in Telnet sessions',
  },
];

export const TCP_HANDSHAKE = {
  establishment: [
    {
      step: 1,
      from: 'Client',
      to: 'Server',
      flags: ['SYN'],
      description: 'Client initiates connection with SYN',
      seqNum: 'x',
    },
    {
      step: 2,
      from: 'Server',
      to: 'Client',
      flags: ['SYN', 'ACK'],
      description: 'Server responds with SYN+ACK',
      seqNum: 'y',
      ackNum: 'x+1',
    },
    {
      step: 3,
      from: 'Client',
      to: 'Server',
      flags: ['ACK'],
      description: 'Client acknowledges with ACK',
      seqNum: 'x+1',
      ackNum: 'y+1',
    },
  ],
  termination: [
    {
      step: 1,
      from: 'Client',
      to: 'Server',
      flags: ['FIN', 'ACK'],
      description: 'Client initiates close with FIN+ACK',
    },
    {
      step: 2,
      from: 'Server',
      to: 'Client',
      flags: ['ACK'],
      description: 'Server acknowledges with ACK',
    },
    {
      step: 3,
      from: 'Server',
      to: 'Client',
      flags: ['FIN', 'ACK'],
      description: 'Server sends FIN+ACK',
    },
    {
      step: 4,
      from: 'Client',
      to: 'Server',
      flags: ['ACK'],
      description: 'Client final ACK - connection closed',
    },
  ],
};

// MNEMONIC DEVICES - HELP STUDENTS REMEMBER
export const MNEMONICS = {
  bottomToTop: {
    phrase: 'Please Do Not Throw Sausage Pizza Away',
    layers: [
      'Physical',
      'Data Link',
      'Network',
      'Transport',
      'Session',
      'Presentation',
      'Application',
    ],
    type: 'Bottom to Top (Layer 1-7)',
  },
  topToBottom: {
    phrase: 'All People Seem To Need Data Processing',
    layers: [
      'Application',
      'Presentation',
      'Session',
      'Transport',
      'Network',
      'Data Link',
      'Physical',
    ],
    type: 'Top to Bottom (Layer 7-1)',
  },
  alternative1: {
    phrase: 'Please Do Not Touch Steves Pet Alligator',
    layers: [
      'Physical',
      'Data Link',
      'Network',
      'Transport',
      'Session',
      'Presentation',
      'Application',
    ],
    type: 'Bottom to Top',
  },
  alternative2: {
    phrase: 'Programmers Do Not Throw Software Pizza Away',
    layers: [
      'Physical',
      'Data Link',
      'Network',
      'Transport',
      'Session',
      'Presentation',
      'Application',
    ],
    type: 'Bottom to Top',
  },
  pduMnemonic: {
    phrase: 'Big Fat Packets Sit Down Data',
    items: ['Bits', 'Frame', 'Packet', 'Segment', 'Data', 'Data', 'Data'],
    description: 'Remember PDU names from Layer 1-7',
  },
};

// MTU COMMON VALUES - EXAM KNOWLEDGE
export const MTU_VALUES = {
  ethernet: { size: 1500, description: 'Standard Ethernet MTU' },
  pppoe: { size: 1492, description: 'PPPoE (8 bytes PPPoE header overhead)' },
  jumboFrames: { size: 9000, description: 'Jumbo frames for high-performance networks' },
  vpnTypical: { size: 1400, description: 'Typical VPN tunnel (overhead varies)' },
  loopback: { size: 65535, description: 'Loopback interface MTU' },
  minIPv4: { size: 68, description: 'Minimum IPv4 MTU' },
  minIPv6: { size: 1280, description: 'Minimum IPv6 MTU' },
};

// HEADER STRUCTURES - DATA ENCAPSULATION (CRITICAL FOR EXAM)
export interface EthernetHeader {
  preamble: { bytes: 7; value: '10101010...'; description: 'Synchronization pattern' };
  sfd: { bytes: 1; value: '10101011'; description: 'Start Frame Delimiter' };
  destMAC: { bytes: 6; value: string; description: 'Destination MAC address' };
  srcMAC: { bytes: 6; value: string; description: 'Source MAC address' };
  type: {
    bytes: 2;
    value: string;
    description: 'EtherType (0x0800=IPv4, 0x86DD=IPv6, 0x0806=ARP)';
  };
  fcs: { bytes: 4; value: string; description: 'Frame Check Sequence (CRC-32)' };
  minSize: 64;
  maxSize: 1518; // Without VLAN tag
  maxSizeVLAN: 1522; // With 802.1Q tag
}

export interface IPv4Header {
  version: { bits: 4; value: 4; description: 'IP version (always 4 for IPv4)' };
  ihl: { bits: 4; value: number; description: 'Internet Header Length (5-15, typically 5)' };
  dscp: { bits: 6; value: number; description: 'Differentiated Services Code Point (QoS)' };
  ecn: { bits: 2; value: number; description: 'Explicit Congestion Notification' };
  totalLength: { bits: 16; value: number; description: 'Total packet size including header' };
  identification: { bits: 16; value: number; description: 'Fragment identification' };
  flags: {
    reserved: { bits: 1; value: 0 };
    df: { bits: 1; value: boolean; description: "Don't Fragment flag" };
    mf: { bits: 1; value: boolean; description: 'More Fragments flag' };
  };
  fragmentOffset: { bits: 13; value: number; description: 'Fragment position' };
  ttl: { bits: 8; value: number; description: 'Time To Live (max hops, typically 64 or 128)' };
  protocol: { bits: 8; value: number; description: 'Next protocol (6=TCP, 17=UDP, 1=ICMP)' };
  headerChecksum: { bits: 16; value: number; description: 'Header integrity check' };
  sourceIP: { bits: 32; value: string; description: 'Source IPv4 address' };
  destIP: { bits: 32; value: string; description: 'Destination IPv4 address' };
  minHeaderSize: 20; // bytes
  maxHeaderSize: 60; // bytes with options
}

export interface TCPHeader {
  sourcePort: { bits: 16; value: number; description: 'Source port number (0-65535)' };
  destPort: { bits: 16; value: number; description: 'Destination port number' };
  sequenceNumber: { bits: 32; value: number; description: 'Byte stream position' };
  acknowledgmentNumber: { bits: 32; value: number; description: 'Next expected byte' };
  dataOffset: { bits: 4; value: number; description: 'Header length in 32-bit words' };
  reserved: { bits: 3; value: 0 };
  flags: {
    ns: { bits: 1; name: 'NS'; description: 'ECN-nonce' };
    cwr: { bits: 1; name: 'CWR'; description: 'Congestion Window Reduced' };
    ece: { bits: 1; name: 'ECE'; description: 'ECN-Echo' };
    urg: { bits: 1; name: 'URG'; description: 'Urgent pointer field valid' };
    ack: { bits: 1; name: 'ACK'; description: 'Acknowledgment field valid' };
    psh: { bits: 1; name: 'PSH'; description: 'Push function' };
    rst: { bits: 1; name: 'RST'; description: 'Reset connection' };
    syn: { bits: 1; name: 'SYN'; description: 'Synchronize sequence numbers' };
    fin: { bits: 1; name: 'FIN'; description: 'No more data from sender' };
  };
  windowSize: { bits: 16; value: number; description: 'Receive window size (flow control)' };
  checksum: { bits: 16; value: number; description: 'Header and data integrity' };
  urgentPointer: { bits: 16; value: number; description: 'Offset to urgent data' };
  minHeaderSize: 20; // bytes
  maxHeaderSize: 60; // bytes with options
}

export interface UDPHeader {
  sourcePort: { bits: 16; value: number; description: 'Source port number' };
  destPort: { bits: 16; value: number; description: 'Destination port number' };
  length: { bits: 16; value: number; description: 'Header + data length' };
  checksum: { bits: 16; value: number; description: 'Optional in IPv4, mandatory in IPv6' };
  headerSize: 8; // bytes (fixed)
}

// ENCAPSULATION PROCESS DATA
export const ENCAPSULATION_EXAMPLE = {
  originalData: 'GET /index.html HTTP/1.1',
  steps: [
    {
      layer: 7,
      layerName: 'Application',
      action: 'Data created',
      pdu: 'Data',
      header: null,
      content: 'GET /index.html HTTP/1.1',
      size: 24,
      description: 'HTTP request generated by browser',
    },
    {
      layer: 4,
      layerName: 'Transport',
      action: 'TCP header added',
      pdu: 'Segment',
      header: {
        srcPort: 54321,
        dstPort: 80,
        seqNum: 1000,
        ackNum: 0,
        flags: ['SYN'],
        windowSize: 65535,
      },
      content: '[TCP:20 bytes][Data:24 bytes]',
      size: 44,
      description: 'TCP segment created with SYN flag for HTTP connection',
    },
    {
      layer: 3,
      layerName: 'Network',
      action: 'IP header added',
      pdu: 'Packet',
      header: {
        srcIP: '192.168.1.100',
        dstIP: '8.8.8.8',
        protocol: 6,
        ttl: 64,
        totalLength: 64,
      },
      content: '[IP:20 bytes][TCP:20 bytes][Data:24 bytes]',
      size: 64,
      description: 'IP packet created with routing information',
    },
    {
      layer: 2,
      layerName: 'Data Link',
      action: 'Ethernet frame created',
      pdu: 'Frame',
      header: {
        destMAC: 'AA:BB:CC:DD:EE:FF',
        srcMAC: '11:22:33:44:55:66',
        type: '0x0800',
      },
      trailer: {
        fcs: 'CRC-32 checksum',
      },
      content: '[Preamble:8][Eth:14][IP:20][TCP:20][Data:24][FCS:4]',
      size: 90,
      description: 'Ethernet frame with MAC addresses and error checking',
    },
    {
      layer: 1,
      layerName: 'Physical',
      action: 'Converted to bits',
      pdu: 'Bits',
      content: '10101010... (720 bits)',
      size: 720,
      description: 'Frame converted to electrical/optical signals on the wire',
    },
  ],
};

// REAL-WORLD SCENARIOS
export const REAL_WORLD_SCENARIOS = {
  7: {
    title: 'Web Browsing',
    icon: '🌐',
    steps: [
      '1. User types www.example.com in browser',
      '2. Browser sends HTTP GET request',
      '3. DNS resolves domain to IP (if not cached)',
      '4. Server returns HTML page',
      '5. Browser renders content',
    ],
    protocols: ['HTTP/HTTPS', 'DNS'],
    examTip: 'Layer 7 provides network services directly to user applications',
  },
  6: {
    title: 'Online Banking Security',
    icon: '🔒',
    steps: [
      '1. Browser negotiates TLS 1.3 cipher suite',
      '2. Server certificate validated',
      '3. Session key generated',
      '4. All data encrypted with AES-256',
      '5. Data formatted for secure transmission',
    ],
    protocols: ['SSL/TLS'],
    examTip: 'Layer 6 handles encryption, compression, and data formatting',
  },
  5: {
    title: 'Video Conference Call',
    icon: '📹',
    steps: [
      '1. SIP establishes session between participants',
      '2. Media parameters negotiated (codecs, bandwidth)',
      '3. Keep-alive packets maintain active session',
      '4. Dialog control manages turn-taking',
      '5. Graceful session termination when call ends',
    ],
    protocols: ['SIP', 'RTP'],
    examTip: 'Layer 5 manages sessions between applications',
  },
  4: {
    title: 'Large File Download',
    icon: '📥',
    steps: [
      '1. TCP 3-way handshake (SYN, SYN-ACK, ACK)',
      '2. File segmented into manageable chunks',
      '3. Each segment numbered sequentially',
      '4. Receiver acknowledges each segment',
      '5. Lost segments automatically retransmitted',
      '6. Connection closed with FIN packets',
    ],
    protocols: ['TCP'],
    examTip: 'Layer 4 ensures reliable, ordered delivery with error recovery',
  },
  3: {
    title: 'Internet Routing',
    icon: '🗺️',
    steps: [
      '1. Packet arrives at router interface',
      '2. Router examines destination IP address',
      '3. Routing table consulted for best path',
      '4. TTL decremented by 1',
      '5. Packet forwarded to next hop',
      '6. Process repeats until destination reached',
    ],
    protocols: ['IP', 'ICMP', 'OSPF'],
    examTip: 'Layer 3 provides logical addressing and routing between networks',
  },
  2: {
    title: 'Local Network Switching',
    icon: '🔀',
    steps: [
      '1. Frame arrives at switch port',
      '2. Source MAC address learned and added to table',
      '3. Destination MAC looked up in CAM table',
      '4. FCS checked for errors',
      '5. Frame forwarded to correct port (or flooded if unknown)',
      '6. VLAN tagging applied if configured',
    ],
    protocols: ['Ethernet', 'ARP', 'STP'],
    examTip: 'Layer 2 provides MAC addressing and local network delivery',
  },
  1: {
    title: 'Fiber Optic Transmission',
    icon: '💡',
    steps: [
      '1. Electrical signal from network card',
      '2. Converted to light pulses by laser/LED',
      '3. Light transmitted through fiber core',
      '4. Reflects internally via total internal reflection',
      '5. Received by photodetector at other end',
      '6. Converted back to electrical signal',
    ],
    protocols: ['Fiber optic standards', '1000BASE-LX'],
    examTip: 'Layer 1 handles physical transmission of raw bits',
  },
};
