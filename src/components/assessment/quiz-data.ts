/**
 * Quiz Question Bank
 * 50+ CompTIA Network+ practice questions across all 5 domains
 */

import type { Question } from './quiz-types';

export const quizQuestions: Question[] = [
  // Domain 1.0: Networking Concepts (12 questions)
  {
    id: 'q1-001',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'easy',
    question: 'Which OSI layer is responsible for logical addressing and routing?',
    options: [
      { id: 'a', text: 'Physical Layer', isCorrect: false },
      { id: 'b', text: 'Data Link Layer', isCorrect: false },
      { id: 'c', text: 'Network Layer', isCorrect: true },
      { id: 'd', text: 'Transport Layer', isCorrect: false },
    ],
    explanation:
      'The Network Layer (Layer 3) handles logical addressing using IP addresses and determines the best path for data through routing.',
    examTip: 'Remember: Layer 3 = Routing and IP addressing. Routers operate at this layer.',
    tags: ['OSI model', 'routing', 'IP addressing'],
  },
  {
    id: 'q1-002',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'medium',
    question: 'What is the maximum transmission distance for 10GBASE-SR using OM3 multimode fiber?',
    options: [
      { id: 'a', text: '100 meters', isCorrect: false },
      { id: 'b', text: '300 meters', isCorrect: true },
      { id: 'c', text: '550 meters', isCorrect: false },
      { id: 'd', text: '10 kilometers', isCorrect: false },
    ],
    explanation:
      '10GBASE-SR (Short Range) supports up to 300 meters on OM3 multimode fiber. With OM4 fiber, it can reach up to 400 meters.',
    examTip:
      'Know the distance limitations for different fiber types: OM3 (300m), OM4 (400m) for 10GBASE-SR.',
    tags: ['fiber optic', 'transmission media', 'Ethernet standards'],
  },
  {
    id: 'q1-003',
    type: 'multiple-select',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'hard',
    question: 'Which of the following are characteristics of TCP? (Select THREE)',
    options: [
      { id: 'a', text: 'Connection-oriented', isCorrect: true },
      { id: 'b', text: 'Connectionless', isCorrect: false },
      { id: 'c', text: 'Provides error checking', isCorrect: true },
      { id: 'd', text: 'Does not guarantee delivery', isCorrect: false },
      { id: 'e', text: 'Uses three-way handshake', isCorrect: true },
      { id: 'f', text: 'No flow control', isCorrect: false },
    ],
    explanation:
      'TCP is connection-oriented, uses a three-way handshake (SYN, SYN-ACK, ACK), provides error checking, guarantees delivery, and implements flow control.',
    examTip: 'TCP = Reliable. UDP = Fast but unreliable. Know the differences for exam scenarios.',
    tags: ['TCP', 'protocols', 'transport layer'],
  },
  {
    id: 'q1-004',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'easy',
    question: 'What does CSMA/CD stand for?',
    options: [
      { id: 'a', text: 'Carrier Sense Multiple Access with Collision Detection', isCorrect: true },
      { id: 'b', text: 'Central System Multiple Access with Cable Division', isCorrect: false },
      { id: 'c', text: 'Carrier Signal Modulation and Data Control', isCorrect: false },
      { id: 'd', text: 'Control System Media Access and Channel Detection', isCorrect: false },
    ],
    explanation:
      'CSMA/CD is used in traditional Ethernet to detect collisions. However, modern switched networks use full-duplex, eliminating collisions.',
    examTip:
      'CSMA/CD is mostly historical now with switches, but you need to know it for the exam.',
    tags: ['Ethernet', 'CSMA/CD', 'media access'],
  },
  {
    id: 'q1-005',
    type: 'true-false',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'easy',
    question: 'Half-duplex communication allows data to flow in both directions simultaneously.',
    options: [
      { id: 'a', text: 'True', isCorrect: false },
      { id: 'b', text: 'False', isCorrect: true },
    ],
    explanation:
      'False. Half-duplex allows bidirectional communication, but only one direction at a time. Full-duplex allows simultaneous bidirectional communication.',
    examTip:
      'Half = one at a time. Full = both directions simultaneously. Think walkie-talkie vs phone.',
    tags: ['duplex', 'communication modes'],
  },
  {
    id: 'q1-006',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'medium',
    question:
      'Which topology provides the highest fault tolerance but is most expensive to implement?',
    options: [
      { id: 'a', text: 'Bus', isCorrect: false },
      { id: 'b', text: 'Star', isCorrect: false },
      { id: 'c', text: 'Ring', isCorrect: false },
      { id: 'd', text: 'Mesh', isCorrect: true },
    ],
    explanation:
      'A mesh topology provides multiple paths between nodes, offering the highest fault tolerance. However, it requires the most cabling and is the most expensive.',
    examTip: 'Mesh = Maximum redundancy and fault tolerance, but expensive and complex.',
    tags: ['topology', 'fault tolerance', 'network design'],
  },
  {
    id: 'q1-007',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'hard',
    question:
      'A network administrator needs to support jumbo frames. What MTU size should be configured?',
    options: [
      { id: 'a', text: '1500 bytes', isCorrect: false },
      { id: 'b', text: '4096 bytes', isCorrect: false },
      { id: 'c', text: '9000 bytes', isCorrect: true },
      { id: 'd', text: '65535 bytes', isCorrect: false },
    ],
    explanation:
      "Jumbo frames typically use an MTU of 9000 bytes (compared to standard Ethernet's 1500 bytes), reducing overhead for large data transfers.",
    examTip:
      'Standard MTU = 1500 bytes. Jumbo frames = 9000 bytes. Know when to use jumbo frames (iSCSI, NAS).',
    tags: ['MTU', 'jumbo frames', 'performance'],
  },
  {
    id: 'q1-008',
    type: 'multiple-select',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'medium',
    question: 'Which protocols operate at the Application layer? (Select TWO)',
    options: [
      { id: 'a', text: 'HTTP', isCorrect: true },
      { id: 'b', text: 'TCP', isCorrect: false },
      { id: 'c', text: 'IP', isCorrect: false },
      { id: 'd', text: 'FTP', isCorrect: true },
      { id: 'e', text: 'ARP', isCorrect: false },
    ],
    explanation:
      'HTTP and FTP are Application layer (Layer 7) protocols. TCP is Transport layer, IP is Network layer, and ARP operates between Data Link and Network layers.',
    examTip:
      'Layer 7 protocols: HTTP, HTTPS, FTP, SMTP, DNS, DHCP, Telnet, SSH. Know their port numbers!',
    tags: ['OSI model', 'protocols', 'application layer'],
  },
  {
    id: 'q1-009',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'medium',
    question: 'What is the maximum cable length for 1000BASE-T over Cat 6 UTP?',
    options: [
      { id: 'a', text: '55 meters', isCorrect: false },
      { id: 'b', text: '100 meters', isCorrect: true },
      { id: 'c', text: '185 meters', isCorrect: false },
      { id: 'd', text: '500 meters', isCorrect: false },
    ],
    explanation:
      '1000BASE-T (Gigabit Ethernet) supports up to 100 meters over Cat 5e or better UTP cable, same as 100BASE-TX.',
    examTip:
      'For twisted pair Ethernet (10/100/1000BASE-T), the maximum distance is always 100 meters.',
    tags: ['Ethernet', 'cabling', 'distance limits'],
  },
  {
    id: 'q1-010',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'hard',
    question: 'Which IEEE standard defines Power over Ethernet (PoE+)?',
    options: [
      { id: 'a', text: '802.3af', isCorrect: false },
      { id: 'b', text: '802.3at', isCorrect: true },
      { id: 'c', text: '802.3az', isCorrect: false },
      { id: 'd', text: '802.3ad', isCorrect: false },
    ],
    explanation:
      '802.3at (PoE+) provides up to 25.5W of power. 802.3af (original PoE) provides 15.4W. 802.3bt (PoE++) provides up to 90W.',
    examTip:
      'PoE standards: 802.3af = 15.4W, 802.3at = 25.5W, 802.3bt = 90W. Know which devices need which.',
    tags: ['PoE', 'IEEE standards', 'power'],
  },
  {
    id: 'q1-011',
    type: 'true-false',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'easy',
    question: 'A crossover cable is required to connect a modern switch to a modern PC.',
    options: [
      { id: 'a', text: 'True', isCorrect: false },
      { id: 'b', text: 'False', isCorrect: true },
    ],
    explanation:
      'False. Modern devices support Auto-MDIX (automatic medium-dependent interface crossover), which automatically detects and configures the correct wiring.',
    examTip:
      'Auto-MDIX eliminates the need for crossover cables on modern equipment. Older equipment may still need them.',
    tags: ['cabling', 'Auto-MDIX', 'crossover'],
  },
  {
    id: 'q1-012',
    type: 'multiple-choice',
    domain: '1.0',
    domainName: 'Networking Concepts',
    difficulty: 'medium',
    question: 'What is the standard frame size for Ethernet (excluding preamble and FCS)?',
    options: [
      { id: 'a', text: '64 to 1518 bytes', isCorrect: true },
      { id: 'b', text: '128 to 2048 bytes', isCorrect: false },
      { id: 'c', text: '512 to 4096 bytes', isCorrect: false },
      { id: 'd', text: '1024 to 9000 bytes', isCorrect: false },
    ],
    explanation:
      'Standard Ethernet frames range from 64 bytes (minimum) to 1518 bytes (maximum), not including the 8-byte preamble or 4-byte FCS.',
    examTip:
      'Minimum frame = 64 bytes. Maximum standard frame = 1518 bytes. Jumbo frames = up to 9000 bytes.',
    tags: ['Ethernet', 'frame size', 'standards'],
  },

  // Domain 2.0: Network Implementation (12 questions)
  {
    id: 'q2-001',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'easy',
    question: 'Which device operates at Layer 2 and uses MAC addresses for forwarding decisions?',
    options: [
      { id: 'a', text: 'Router', isCorrect: false },
      { id: 'b', text: 'Switch', isCorrect: true },
      { id: 'c', text: 'Hub', isCorrect: false },
      { id: 'd', text: 'Firewall', isCorrect: false },
    ],
    explanation:
      'A switch operates at Layer 2 (Data Link) and forwards frames based on MAC addresses. Routers use IP addresses (Layer 3), hubs are Layer 1.',
    examTip:
      'Layer 1 = Hub (repeater). Layer 2 = Switch (MAC addresses). Layer 3 = Router (IP addresses).',
    tags: ['switches', 'MAC address', 'Layer 2'],
  },
  {
    id: 'q2-002',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'medium',
    question: 'What is the purpose of Spanning Tree Protocol (STP)?',
    options: [
      { id: 'a', text: 'Prevent routing loops', isCorrect: false },
      { id: 'b', text: 'Prevent switching loops', isCorrect: true },
      { id: 'c', text: 'Load balance traffic', isCorrect: false },
      { id: 'd', text: 'Encrypt data in transit', isCorrect: false },
    ],
    explanation:
      'STP prevents Layer 2 switching loops by blocking redundant paths. It elects a root bridge and determines which ports should be in forwarding or blocking state.',
    examTip:
      'STP = prevents loops in switched networks. Know port states: blocking, listening, learning, forwarding.',
    tags: ['STP', 'switching', 'loops'],
  },
  {
    id: 'q2-003',
    type: 'multiple-select',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'hard',
    question: 'Which of the following are benefits of VLANs? (Select THREE)',
    options: [
      { id: 'a', text: 'Improved security', isCorrect: true },
      { id: 'b', text: 'Reduced broadcast domains', isCorrect: true },
      { id: 'c', text: 'Increased bandwidth', isCorrect: false },
      { id: 'd', text: 'Logical segmentation', isCorrect: true },
      { id: 'e', text: 'Eliminated need for routing', isCorrect: false },
    ],
    explanation:
      'VLANs provide security by isolating traffic, reduce broadcast domains, and allow logical network segmentation regardless of physical location.',
    examTip:
      'VLANs = logical separation. You still need a router or Layer 3 switch for inter-VLAN routing.',
    tags: ['VLAN', 'network segmentation', 'broadcast domains'],
  },
  {
    id: 'q2-004',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'medium',
    question: 'What protocol is used to dynamically assign VLAN membership based on MAC addresses?',
    options: [
      { id: 'a', text: 'VTP', isCorrect: false },
      { id: 'b', text: 'VMPS', isCorrect: true },
      { id: 'c', text: 'DTP', isCorrect: false },
      { id: 'd', text: '802.1Q', isCorrect: false },
    ],
    explanation:
      'VLAN Membership Policy Server (VMPS) assigns VLANs dynamically based on MAC addresses. VTP manages VLAN databases, 802.1Q tags frames.',
    examTip:
      'VMPS is less common now but may appear on the exam. Most networks use static VLAN assignments.',
    tags: ['VLAN', 'VMPS', 'dynamic assignment'],
  },
  {
    id: 'q2-005',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'easy',
    question: 'Which routing protocol uses hop count as its metric and has a maximum of 15 hops?',
    options: [
      { id: 'a', text: 'OSPF', isCorrect: false },
      { id: 'b', text: 'EIGRP', isCorrect: false },
      { id: 'c', text: 'RIP', isCorrect: true },
      { id: 'd', text: 'BGP', isCorrect: false },
    ],
    explanation:
      'RIP (Routing Information Protocol) uses hop count and has a maximum of 15 hops (16 is considered unreachable), making it suitable only for small networks.',
    examTip:
      'RIP = simple, distance-vector, 15 hop limit. OSPF = complex, link-state, no hop limit. Know the differences!',
    tags: ['RIP', 'routing protocols', 'metrics'],
  },
  {
    id: 'q2-006',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'hard',
    question: 'What is the administrative distance of EIGRP internal routes?',
    options: [
      { id: 'a', text: '90', isCorrect: true },
      { id: 'b', text: '100', isCorrect: false },
      { id: 'c', text: '110', isCorrect: false },
      { id: 'd', text: '120', isCorrect: false },
    ],
    explanation:
      'EIGRP internal routes have an AD of 90. For reference: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120, External EIGRP=170.',
    examTip:
      'Lower AD = more trusted. Know common AD values: Static(1), EIGRP(90), OSPF(110), RIP(120).',
    tags: ['EIGRP', 'administrative distance', 'routing'],
  },
  {
    id: 'q2-007',
    type: 'true-false',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'easy',
    question: 'A default gateway is required for hosts to communicate within the same subnet.',
    options: [
      { id: 'a', text: 'True', isCorrect: false },
      { id: 'b', text: 'False', isCorrect: true },
    ],
    explanation:
      'False. Hosts on the same subnet communicate directly using ARP. A default gateway is only needed for communication with hosts on different subnets.',
    examTip:
      'Same subnet = direct communication. Different subnet = needs router (default gateway).',
    tags: ['default gateway', 'routing', 'subnetting'],
  },
  {
    id: 'q2-008',
    type: 'multiple-select',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'medium',
    question: 'Which statements about OSPF are correct? (Select TWO)',
    options: [
      { id: 'a', text: 'It is a link-state protocol', isCorrect: true },
      { id: 'b', text: 'It uses hop count as metric', isCorrect: false },
      { id: 'c', text: 'It supports VLSM', isCorrect: true },
      { id: 'd', text: 'It has a 15-hop limit', isCorrect: false },
      { id: 'e', text: 'It is a distance-vector protocol', isCorrect: false },
    ],
    explanation:
      'OSPF is a link-state protocol that uses cost (based on bandwidth) as its metric and fully supports Variable Length Subnet Masking (VLSM).',
    examTip:
      'OSPF = link-state, uses cost metric, no hop limit, supports VLSM. Great for large networks.',
    tags: ['OSPF', 'link-state', 'VLSM'],
  },
  {
    id: 'q2-009',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'medium',
    question:
      'Which protocol allows multiple physical links to be aggregated into a single logical link?',
    options: [
      { id: 'a', text: 'STP', isCorrect: false },
      { id: 'b', text: 'LACP', isCorrect: true },
      { id: 'c', text: 'VTP', isCorrect: false },
      { id: 'd', text: 'RSTP', isCorrect: false },
    ],
    explanation:
      'Link Aggregation Control Protocol (LACP) defined in 802.3ad allows bundling multiple links for increased bandwidth and redundancy.',
    examTip:
      'LACP (802.3ad) = link aggregation. Also called port channeling, bonding, or NIC teaming.',
    tags: ['LACP', 'link aggregation', 'redundancy'],
  },
  {
    id: 'q2-010',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'hard',
    question: 'What is the purpose of the HSRP protocol?',
    options: [
      { id: 'a', text: 'Load balancing', isCorrect: false },
      { id: 'b', text: 'Gateway redundancy', isCorrect: true },
      { id: 'c', text: 'Path determination', isCorrect: false },
      { id: 'd', text: 'Loop prevention', isCorrect: false },
    ],
    explanation:
      'Hot Standby Router Protocol (HSRP) provides gateway redundancy by allowing multiple routers to share a virtual IP address, ensuring continuous connectivity.',
    examTip:
      'HSRP (Cisco), VRRP (standard), and GLBP all provide gateway redundancy. Know the differences.',
    tags: ['HSRP', 'redundancy', 'FHRP'],
  },
  {
    id: 'q2-011',
    type: 'multiple-choice',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'medium',
    question: 'What is the native VLAN on a trunk port by default?',
    options: [
      { id: 'a', text: 'VLAN 0', isCorrect: false },
      { id: 'b', text: 'VLAN 1', isCorrect: true },
      { id: 'c', text: 'VLAN 999', isCorrect: false },
      { id: 'd', text: 'VLAN 4095', isCorrect: false },
    ],
    explanation:
      'VLAN 1 is the default native VLAN. Untagged frames on a trunk are assigned to the native VLAN. Best practice is to change it for security.',
    examTip:
      'Native VLAN = VLAN 1 by default. Change it to unused VLAN for security. Ensure it matches on both sides!',
    tags: ['VLAN', 'trunking', 'native VLAN'],
  },
  {
    id: 'q2-012',
    type: 'true-false',
    domain: '2.0',
    domainName: 'Network Implementation',
    difficulty: 'medium',
    question:
      'Dynamic routing protocols automatically update routing tables when network topology changes.',
    options: [
      { id: 'a', text: 'True', isCorrect: true },
      { id: 'b', text: 'False', isCorrect: false },
    ],
    explanation:
      'True. Dynamic routing protocols (RIP, OSPF, EIGRP, BGP) automatically discover routes and adapt to topology changes, unlike static routes.',
    examTip:
      'Dynamic = automatic updates, scales well, complex. Static = manual, simple, no overhead. Know when to use each.',
    tags: ['routing', 'dynamic routing', 'topology'],
  },

  // Domain 3.0: Network Operations (10 questions)
  {
    id: 'q3-001',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'easy',
    question: 'Which backup type only backs up files that have changed since the last full backup?',
    options: [
      { id: 'a', text: 'Full backup', isCorrect: false },
      { id: 'b', text: 'Differential backup', isCorrect: true },
      { id: 'c', text: 'Incremental backup', isCorrect: false },
      { id: 'd', text: 'Snapshot backup', isCorrect: false },
    ],
    explanation:
      'Differential backups copy all changes since the last full backup. Incremental backups only copy changes since the last backup of any type.',
    examTip:
      'Differential = since last FULL. Incremental = since last ANY backup. Recovery: Diff needs 2 tapes, Incremental needs all.',
    tags: ['backup', 'disaster recovery', 'data protection'],
  },
  {
    id: 'q3-002',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'medium',
    question: 'What protocol is used for network device configuration management and monitoring?',
    options: [
      { id: 'a', text: 'SMTP', isCorrect: false },
      { id: 'b', text: 'SNMP', isCorrect: true },
      { id: 'c', text: 'NTP', isCorrect: false },
      { id: 'd', text: 'TFTP', isCorrect: false },
    ],
    explanation:
      'Simple Network Management Protocol (SNMP) is used to monitor and manage network devices. It uses agents, managers, and MIBs (Management Information Bases).',
    examTip:
      'SNMP versions: v1 (old, insecure), v2c (community strings), v3 (encrypted, authentication). Use v3!',
    tags: ['SNMP', 'network management', 'monitoring'],
  },
  {
    id: 'q3-003',
    type: 'multiple-select',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'hard',
    question: 'Which metrics are commonly monitored for network performance? (Select THREE)',
    options: [
      { id: 'a', text: 'Latency', isCorrect: true },
      { id: 'b', text: 'CPU temperature', isCorrect: false },
      { id: 'c', text: 'Jitter', isCorrect: true },
      { id: 'd', text: 'Packet loss', isCorrect: true },
      { id: 'e', text: 'Hard drive space', isCorrect: false },
    ],
    explanation:
      'Network performance is measured by latency (delay), jitter (variation in latency), packet loss, throughput, and bandwidth utilization.',
    examTip:
      'For VoIP: low latency (<150ms), minimal jitter (<30ms), low packet loss (<1%) are critical.',
    tags: ['performance metrics', 'monitoring', 'QoS'],
  },
  {
    id: 'q3-004',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'easy',
    question: 'What does MTTR stand for in network operations?',
    options: [
      { id: 'a', text: 'Maximum Time To Repair', isCorrect: false },
      { id: 'b', text: 'Mean Time To Repair', isCorrect: true },
      { id: 'c', text: 'Minimum Time To Recovery', isCorrect: false },
      { id: 'd', text: 'Mean Time To Replace', isCorrect: false },
    ],
    explanation:
      'MTTR (Mean Time To Repair) measures the average time to restore a system after failure. Lower MTTR indicates better maintenance and response.',
    examTip:
      'MTTR = how fast you fix things. MTBF = how long between failures. Both are key SLA metrics.',
    tags: ['MTTR', 'metrics', 'uptime'],
  },
  {
    id: 'q3-005',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'medium',
    question: 'Which tool would be best for capturing and analyzing network traffic?',
    options: [
      { id: 'a', text: 'ping', isCorrect: false },
      { id: 'b', text: 'Wireshark', isCorrect: true },
      { id: 'c', text: 'nslookup', isCorrect: false },
      { id: 'd', text: 'netstat', isCorrect: false },
    ],
    explanation:
      'Wireshark is a protocol analyzer (packet sniffer) that captures and analyzes network traffic in detail. Essential for troubleshooting and security analysis.',
    examTip:
      'Know your tools: ping (connectivity), tracert (path), nslookup (DNS), netstat (connections), Wireshark (packets).',
    tags: ['Wireshark', 'packet capture', 'troubleshooting tools'],
  },
  {
    id: 'q3-006',
    type: 'true-false',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'easy',
    question: 'A change management process should always include a rollback plan.',
    options: [
      { id: 'a', text: 'True', isCorrect: true },
      { id: 'b', text: 'False', isCorrect: false },
    ],
    explanation:
      'True. Every change should have a documented rollback plan to quickly restore the previous configuration if issues arise.',
    examTip:
      'Change management: document everything, test in lab, have rollback plan, schedule during maintenance window.',
    tags: ['change management', 'best practices', 'rollback'],
  },
  {
    id: 'q3-007',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'medium',
    question: 'What is the purpose of a network baseline?',
    options: [
      { id: 'a', text: 'To set minimum security requirements', isCorrect: false },
      { id: 'b', text: 'To establish normal network performance', isCorrect: true },
      { id: 'c', text: 'To define backup schedules', isCorrect: false },
      { id: 'd', text: 'To create network diagrams', isCorrect: false },
    ],
    explanation:
      'A network baseline documents normal network performance and behavior, making it easier to identify anomalies and troubleshoot issues.',
    examTip:
      'Baseline = snapshot of normal operation. Compare current performance to baseline to spot problems.',
    tags: ['baseline', 'performance', 'monitoring'],
  },
  {
    id: 'q3-008',
    type: 'multiple-select',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'medium',
    question: 'Which are valid elements of network documentation? (Select THREE)',
    options: [
      { id: 'a', text: 'Physical and logical diagrams', isCorrect: true },
      { id: 'b', text: 'Employee personal information', isCorrect: false },
      { id: 'c', text: 'IP address management', isCorrect: true },
      { id: 'd', text: 'Configuration files', isCorrect: true },
      { id: 'e', text: 'Social media passwords', isCorrect: false },
    ],
    explanation:
      'Essential documentation includes network diagrams, IP addressing schemes, configuration backups, change logs, and asset inventories.',
    examTip:
      'Documentation should be accurate, current, and accessible to authorized personnel only. Update after every change!',
    tags: ['documentation', 'network management', 'best practices'],
  },
  {
    id: 'q3-009',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'hard',
    question: 'What is the recommended interval for testing disaster recovery procedures?',
    options: [
      { id: 'a', text: 'Daily', isCorrect: false },
      { id: 'b', text: 'Weekly', isCorrect: false },
      { id: 'c', text: 'Annually or semi-annually', isCorrect: true },
      { id: 'd', text: 'Every 5 years', isCorrect: false },
    ],
    explanation:
      'Disaster recovery plans should be tested at least annually, or semi-annually for critical systems. Regular testing identifies gaps and keeps staff trained.',
    examTip:
      'DR testing frequency depends on criticality. Test annually minimum, more often for critical systems.',
    tags: ['disaster recovery', 'testing', 'business continuity'],
  },
  {
    id: 'q3-010',
    type: 'multiple-choice',
    domain: '3.0',
    domainName: 'Network Operations',
    difficulty: 'medium',
    question: 'Which command-line tool displays active TCP connections and listening ports?',
    options: [
      { id: 'a', text: 'ipconfig', isCorrect: false },
      { id: 'b', text: 'netstat', isCorrect: true },
      { id: 'c', text: 'tracert', isCorrect: false },
      { id: 'd', text: 'nbtstat', isCorrect: false },
    ],
    explanation:
      'netstat displays network statistics, active connections, listening ports, and routing tables. Use netstat -an to see all connections numerically.',
    examTip:
      'netstat flags: -a (all), -n (numeric), -b (process name), -o (PID). Essential for troubleshooting!',
    tags: ['netstat', 'command-line tools', 'troubleshooting'],
  },

  // Domain 4.0: Network Security (8 questions)
  {
    id: 'q4-001',
    type: 'multiple-choice',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'easy',
    question: 'Which security device filters traffic based on Layer 3 and Layer 4 information?',
    options: [
      { id: 'a', text: 'Hub', isCorrect: false },
      { id: 'b', text: 'Switch', isCorrect: false },
      { id: 'c', text: 'Firewall', isCorrect: true },
      { id: 'd', text: 'Repeater', isCorrect: false },
    ],
    explanation:
      'A firewall filters traffic based on IP addresses (Layer 3) and port numbers (Layer 4). Next-generation firewalls can inspect up to Layer 7.',
    examTip:
      'Firewall types: Packet filtering (L3/L4), Stateful (tracks connections), Next-Gen (application aware).',
    tags: ['firewall', 'security', 'filtering'],
  },
  {
    id: 'q4-002',
    type: 'multiple-select',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'medium',
    question: 'Which authentication factors are considered "something you have"? (Select TWO)',
    options: [
      { id: 'a', text: 'Password', isCorrect: false },
      { id: 'b', text: 'Smart card', isCorrect: true },
      { id: 'c', text: 'Fingerprint', isCorrect: false },
      { id: 'd', text: 'Security token', isCorrect: true },
      { id: 'e', text: 'Retinal scan', isCorrect: false },
    ],
    explanation:
      'Something you have: smart cards, tokens, key fobs. Something you know: passwords, PINs. Something you are: biometrics.',
    examTip:
      'Three factor types: Knowledge (password), Possession (token), Inherence (biometric). MFA uses 2+.',
    tags: ['authentication', 'MFA', 'security factors'],
  },
  {
    id: 'q4-003',
    type: 'multiple-choice',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'hard',
    question:
      'What type of attack involves intercepting and altering communications between two parties?',
    options: [
      { id: 'a', text: 'DDoS attack', isCorrect: false },
      { id: 'b', text: 'Man-in-the-middle attack', isCorrect: true },
      { id: 'c', text: 'SQL injection', isCorrect: false },
      { id: 'd', text: 'Social engineering', isCorrect: false },
    ],
    explanation:
      'A man-in-the-middle (MITM) attack intercepts communication between two parties, allowing the attacker to eavesdrop or modify traffic.',
    examTip:
      'MITM prevention: Use encryption (TLS/SSL), verify certificates, implement mutual authentication.',
    tags: ['MITM', 'attacks', 'security threats'],
  },
  {
    id: 'q4-004',
    type: 'multiple-choice',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'easy',
    question: 'Which port does HTTPS use by default?',
    options: [
      { id: 'a', text: '80', isCorrect: false },
      { id: 'b', text: '443', isCorrect: true },
      { id: 'c', text: '8080', isCorrect: false },
      { id: 'd', text: '22', isCorrect: false },
    ],
    explanation:
      'HTTPS uses port 443 for encrypted web traffic. HTTP uses port 80 (unencrypted), SSH uses 22, and 8080 is an alternate HTTP port.',
    examTip:
      'Common secure ports: HTTPS-443, SSH-22, SFTP-22, FTPS-990, SMTPS-465. Know these cold!',
    tags: ['ports', 'HTTPS', 'encryption'],
  },
  {
    id: 'q4-005',
    type: 'true-false',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'medium',
    question: 'WPA3 uses 128-bit encryption for personal mode and 192-bit for enterprise mode.',
    options: [
      { id: 'a', text: 'True', isCorrect: true },
      { id: 'b', text: 'False', isCorrect: false },
    ],
    explanation:
      'True. WPA3-Personal uses 128-bit encryption, while WPA3-Enterprise uses 192-bit encryption for enhanced security.',
    examTip:
      'WiFi security evolution: WEP (broken) → WPA (weak) → WPA2 (good) → WPA3 (best). Always use WPA2/3.',
    tags: ['WPA3', 'wireless security', 'encryption'],
  },
  {
    id: 'q4-006',
    type: 'multiple-choice',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'medium',
    question: 'What does AAA stand for in network security?',
    options: [
      { id: 'a', text: 'Authentication, Authorization, Accounting', isCorrect: true },
      { id: 'b', text: 'Access, Administration, Auditing', isCorrect: false },
      { id: 'c', text: 'Authentication, Access, Auditing', isCorrect: false },
      { id: 'd', text: 'Authorization, Access, Accounting', isCorrect: false },
    ],
    explanation:
      'AAA framework: Authentication (who are you?), Authorization (what can you do?), Accounting (what did you do?).',
    examTip: 'AAA protocols: RADIUS (common, UDP), TACACS+ (Cisco, TCP). Know which uses what!',
    tags: ['AAA', 'RADIUS', 'security framework'],
  },
  {
    id: 'q4-007',
    type: 'multiple-select',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'hard',
    question: 'Which methods can mitigate VLAN hopping attacks? (Select TWO)',
    options: [
      { id: 'a', text: 'Disable DTP on trunk ports', isCorrect: true },
      { id: 'b', text: 'Enable DHCP snooping', isCorrect: false },
      { id: 'c', text: 'Change the native VLAN to unused VLAN', isCorrect: true },
      { id: 'd', text: 'Enable port security', isCorrect: false },
      { id: 'e', text: 'Implement 802.1X', isCorrect: false },
    ],
    explanation:
      'VLAN hopping mitigation: disable DTP (auto-trunking), change native VLAN to unused, explicitly configure trunk ports.',
    examTip:
      'VLAN security: Disable DTP, change native VLAN, use PVLAN, implement 802.1X for port-based auth.',
    tags: ['VLAN hopping', 'security', 'switch security'],
  },
  {
    id: 'q4-008',
    type: 'multiple-choice',
    domain: '4.0',
    domainName: 'Network Security',
    difficulty: 'medium',
    question: 'Which protocol provides secure remote access with encryption?',
    options: [
      { id: 'a', text: 'Telnet', isCorrect: false },
      { id: 'b', text: 'SSH', isCorrect: true },
      { id: 'c', text: 'FTP', isCorrect: false },
      { id: 'd', text: 'HTTP', isCorrect: false },
    ],
    explanation:
      'SSH (Secure Shell) provides encrypted remote access on port 22. Telnet (port 23) transmits in cleartext and should never be used.',
    examTip:
      'Secure vs Insecure: SSH vs Telnet, HTTPS vs HTTP, SFTP vs FTP, SNMP v3 vs v1/v2. Always choose secure!',
    tags: ['SSH', 'remote access', 'encryption'],
  },

  // Domain 5.0: Network Troubleshooting (8 questions)
  {
    id: 'q5-001',
    type: 'multiple-choice',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'easy',
    question: 'What is the first step in the troubleshooting methodology?',
    options: [
      { id: 'a', text: 'Establish a theory', isCorrect: false },
      { id: 'b', text: 'Identify the problem', isCorrect: true },
      { id: 'c', text: 'Test the theory', isCorrect: false },
      { id: 'd', text: 'Implement a solution', isCorrect: false },
    ],
    explanation:
      'The CompTIA troubleshooting methodology starts with: 1) Identify the problem, 2) Establish a theory, 3) Test the theory, 4) Establish a plan, 5) Implement, 6) Verify, 7) Document.',
    examTip:
      'Memorize the 7-step troubleshooting methodology. Questions often ask about proper order!',
    tags: ['troubleshooting methodology', 'CompTIA', 'problem solving'],
  },
  {
    id: 'q5-002',
    type: 'multiple-choice',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'medium',
    question:
      'A user cannot access a website. Ping to 8.8.8.8 works, but ping to www.google.com fails. What is the likely issue?',
    options: [
      { id: 'a', text: 'No internet connectivity', isCorrect: false },
      { id: 'b', text: 'DNS resolution failure', isCorrect: true },
      { id: 'c', text: 'Default gateway issue', isCorrect: false },
      { id: 'd', text: 'Firewall blocking traffic', isCorrect: false },
    ],
    explanation:
      'If ping to IP works but ping to domain name fails, the issue is DNS resolution. The host can reach the internet but cannot resolve names.',
    examTip:
      'Ping by IP = tests connectivity. Ping by name = tests connectivity + DNS. Isolate issues this way!',
    tags: ['DNS', 'troubleshooting', 'ping'],
  },
  {
    id: 'q5-003',
    type: 'multiple-select',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'hard',
    question: 'Which symptoms indicate a physical layer problem? (Select THREE)',
    options: [
      { id: 'a', text: 'Link light not illuminated', isCorrect: true },
      { id: 'b', text: 'Incorrect IP address', isCorrect: false },
      { id: 'c', text: 'Excessive collisions', isCorrect: true },
      { id: 'd', text: 'DNS resolution failure', isCorrect: false },
      { id: 'e', text: 'Cable continuity failure', isCorrect: true },
    ],
    explanation:
      'Physical layer issues: no link lights, cable faults, excessive noise/interference, wrong cable type, damaged connectors, EMI.',
    examTip:
      'Layer 1 = physical problems (cables, connectors, power). Use cable tester, check lights, verify connections.',
    tags: ['physical layer', 'troubleshooting', 'cable testing'],
  },
  {
    id: 'q5-004',
    type: 'multiple-choice',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'medium',
    question: 'What tool would you use to test for cable continuity and wiring faults?',
    options: [
      { id: 'a', text: 'Multimeter', isCorrect: false },
      { id: 'b', text: 'Cable tester', isCorrect: true },
      { id: 'c', text: 'Protocol analyzer', isCorrect: false },
      { id: 'd', text: 'Tone generator', isCorrect: false },
    ],
    explanation:
      'A cable tester checks for continuity, opens, shorts, crossed pairs, and split pairs. A certifier tests if cable meets spec (Cat 5e, Cat 6, etc.).',
    examTip:
      'Tools: Cable tester (continuity), Certifier (performance), Tone generator (trace cables), TDR (break location).',
    tags: ['cable testing', 'tools', 'physical layer'],
  },
  {
    id: 'q5-005',
    type: 'multiple-choice',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'easy',
    question: 'Which command tests connectivity to a remote host?',
    options: [
      { id: 'a', text: 'ipconfig', isCorrect: false },
      { id: 'b', text: 'ping', isCorrect: true },
      { id: 'c', text: 'nslookup', isCorrect: false },
      { id: 'd', text: 'route', isCorrect: false },
    ],
    explanation:
      'Ping uses ICMP Echo Request/Reply to test basic connectivity and measure round-trip time. Essential first troubleshooting step.',
    examTip:
      'ping: tests connectivity. tracert: shows path. pathping: combines both. Know when to use each!',
    tags: ['ping', 'troubleshooting', 'ICMP'],
  },
  {
    id: 'q5-006',
    type: 'true-false',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'medium',
    question: 'An APIPA address (169.254.x.x) indicates successful DHCP configuration.',
    options: [
      { id: 'a', text: 'True', isCorrect: false },
      { id: 'b', text: 'False', isCorrect: true },
    ],
    explanation:
      'False. APIPA (Automatic Private IP Addressing) is assigned when DHCP fails. It allows link-local communication but indicates a DHCP problem.',
    examTip:
      '169.254.x.x = DHCP failure. Check: DHCP server running? Cable connected? Correct VLAN? IP helper configured?',
    tags: ['APIPA', 'DHCP', 'IP addressing'],
  },
  {
    id: 'q5-007',
    type: 'multiple-choice',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'hard',
    question:
      'Users report intermittent connectivity that worsens when the elevator runs. What is the likely cause?',
    options: [
      { id: 'a', text: 'DNS issues', isCorrect: false },
      { id: 'b', text: 'EMI (Electromagnetic Interference)', isCorrect: true },
      { id: 'c', text: 'Bandwidth saturation', isCorrect: false },
      { id: 'd', text: 'Routing loops', isCorrect: false },
    ],
    explanation:
      'Intermittent issues correlating with electrical equipment indicate EMI. Solution: use shielded cable, increase distance from interference source, or use fiber.',
    examTip:
      'EMI sources: motors, fluorescent lights, elevators. Solutions: STP cable, fiber optic, increase separation.',
    tags: ['EMI', 'interference', 'environmental factors'],
  },
  {
    id: 'q5-008',
    type: 'multiple-select',
    domain: '5.0',
    domainName: 'Network Troubleshooting',
    difficulty: 'medium',
    question: 'Which information should be documented after resolving an issue? (Select THREE)',
    options: [
      { id: 'a', text: 'Problem description', isCorrect: true },
      { id: 'b', text: 'Personal opinions', isCorrect: false },
      { id: 'c', text: 'Solution implemented', isCorrect: true },
      { id: 'd', text: 'Lessons learned', isCorrect: true },
      { id: 'e', text: 'Unrelated observations', isCorrect: false },
    ],
    explanation:
      'Document: problem description, symptoms, solution, lessons learned, and preventive measures. This builds a knowledge base for future issues.',
    examTip:
      "Final troubleshooting step: DOCUMENT! Include what happened, what you did, what worked, what didn't.",
    tags: ['documentation', 'troubleshooting methodology', 'knowledge base'],
  },
];

// Helper function to get questions by domain
export const getQuestionsByDomain = (domain: string): Question[] => {
  return quizQuestions.filter((q) => q.domain === domain);
};

// Helper function to get questions by difficulty
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return quizQuestions.filter((q) => q.difficulty === difficulty);
};

// Helper function to get random questions
export const getRandomQuestions = (
  count: number,
  domains?: string[],
  difficulties?: string[]
): Question[] => {
  let filtered = [...quizQuestions];

  if (domains && domains.length > 0) {
    filtered = filtered.filter((q) => domains.includes(q.domain));
  }

  if (difficulties && difficulties.length > 0) {
    filtered = filtered.filter((q) => difficulties.includes(q.difficulty));
  }

  // Shuffle and take requested count
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Domain information
export const domainInfo = {
  '1.0': { name: 'Networking Concepts', weight: '23%' },
  '2.0': { name: 'Network Implementation', weight: '19%' },
  '3.0': { name: 'Network Operations', weight: '16%' },
  '4.0': { name: 'Network Security', weight: '19%' },
  '5.0': { name: 'Network Troubleshooting', weight: '23%' },
};
