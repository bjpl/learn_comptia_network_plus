/**
 * CompTIA Network+ - IPv4 Component Data
 * Scenarios, diagnostic outputs, and reference data
 */

import type { SubnetScenario, TroubleshootingScenario, AddressClassification } from './ipv4-types';

// ============================================================================
// Subnet Design Scenarios
// ============================================================================

export const subnetScenarios: SubnetScenario[] = [
  {
    id: 'scenario-1',
    title: 'Small Office Network',
    description: 'Design a network for a small office with multiple departments',
    baseNetwork: '192.168.10.0/24',
    difficulty: 'beginner',
    category: 'office',
    requirements: [
      { id: 'req-1', name: 'Sales Department', hostsNeeded: 50, description: 'Main sales floor' },
      { id: 'req-2', name: 'Engineering', hostsNeeded: 30, description: 'Engineering workstations' },
      { id: 'req-3', name: 'Management', hostsNeeded: 10, description: 'Management offices' },
      { id: 'req-4', name: 'Guest WiFi', hostsNeeded: 20, description: 'Visitor network' },
    ],
    hints: [
      'Start with the largest subnet requirement',
      'Remember to account for network and broadcast addresses',
      'VLSM allows you to minimize wasted addresses',
    ],
  },
  {
    id: 'scenario-2',
    title: 'Company XYZ Headquarters',
    description: 'Enterprise network with multiple branches and DMZ',
    baseNetwork: '172.16.0.0/16',
    difficulty: 'intermediate',
    category: 'enterprise',
    requirements: [
      { id: 'req-1', name: 'HQ Campus', hostsNeeded: 500, description: 'Main headquarters' },
      { id: 'req-2', name: 'Branch Office 1', hostsNeeded: 50, description: 'Regional office' },
      { id: 'req-3', name: 'Branch Office 2', hostsNeeded: 25, description: 'Small branch' },
      { id: 'req-4', name: 'DMZ', hostsNeeded: 14, description: 'Public-facing servers' },
      { id: 'req-5', name: 'P2P Link 1', hostsNeeded: 2, description: 'Router interconnect' },
      { id: 'req-6', name: 'P2P Link 2', hostsNeeded: 2, description: 'Router interconnect' },
      { id: 'req-7', name: 'P2P Link 3', hostsNeeded: 2, description: 'Router interconnect' },
    ],
    hints: [
      'Use /30 subnets for point-to-point links (2 usable hosts)',
      'DMZ typically needs fewer hosts than internal networks',
      'Consider growth: allocate slightly more than current needs',
    ],
  },
  {
    id: 'scenario-3',
    title: 'ISP Customer Allocation',
    description: 'ISP allocating address space to enterprise customers',
    baseNetwork: '203.0.113.0/24',
    difficulty: 'advanced',
    category: 'isp',
    requirements: [
      { id: 'req-1', name: 'Customer A', hostsNeeded: 100, description: 'Large enterprise' },
      { id: 'req-2', name: 'Customer B', hostsNeeded: 50, description: 'Medium business' },
      { id: 'req-3', name: 'Customer C', hostsNeeded: 25, description: 'Small business' },
      { id: 'req-4', name: 'Customer D', hostsNeeded: 10, description: 'Small business' },
      { id: 'req-5', name: 'Customer E', hostsNeeded: 10, description: 'Small business' },
    ],
    hints: [
      'Public IP addresses are valuable - minimize waste',
      'Consider using CIDR for efficient allocation',
      'Document which addresses are allocated vs available',
    ],
  },
  {
    id: 'scenario-4',
    title: 'Data Center Segmentation',
    description: 'Segment data center into secure zones',
    baseNetwork: '10.0.0.0/8',
    difficulty: 'advanced',
    category: 'datacenter',
    requirements: [
      { id: 'req-1', name: 'Web Tier', hostsNeeded: 1000, description: 'Front-end web servers' },
      { id: 'req-2', name: 'App Tier', hostsNeeded: 500, description: 'Application servers' },
      { id: 'req-3', name: 'Database Tier', hostsNeeded: 100, description: 'Database servers' },
      { id: 'req-4', name: 'Management', hostsNeeded: 50, description: 'Infrastructure management' },
      { id: 'req-5', name: 'Storage', hostsNeeded: 30, description: 'Storage network' },
      { id: 'req-6', name: 'Backup', hostsNeeded: 20, description: 'Backup network' },
    ],
    hints: [
      'Use summarization to simplify routing',
      'Keep related tiers in contiguous address space',
      'Reserve space for future growth',
    ],
  },
];

// ============================================================================
// Troubleshooting Scenarios
// ============================================================================

export const troubleshootingScenarios: TroubleshootingScenario[] = [
  {
    id: 'trouble-1',
    title: 'APIPA Address Assignment',
    description: 'Workstation receiving 169.254.x.x address instead of DHCP',
    problemType: 'apipa',
    difficulty: 'beginner',
    symptoms: [
      'No network connectivity',
      'IP address starts with 169.254',
      'Unable to reach gateway',
      'DHCP server is online',
    ],
    expectedBehavior: 'Workstation should receive IP from DHCP server (192.168.1.x)',
    actualBehavior: 'Workstation auto-configured with 169.254.15.87',
    devices: [
      {
        id: 'pc1',
        name: 'Workstation-01',
        type: 'host',
        ipAddress: '169.254.15.87',
        subnetMask: '255.255.0.0',
        status: 'error',
        x: 100,
        y: 200,
      },
      {
        id: 'sw1',
        name: 'Switch-01',
        type: 'switch',
        ipAddress: '192.168.1.2',
        subnetMask: '255.255.255.0',
        status: 'online',
        x: 300,
        y: 200,
      },
      {
        id: 'dhcp1',
        name: 'DHCP Server',
        type: 'server',
        ipAddress: '192.168.1.10',
        subnetMask: '255.255.255.0',
        status: 'online',
        x: 500,
        y: 200,
      },
    ],
    connections: [
      { from: 'pc1', to: 'sw1', status: 'degraded' },
      { from: 'sw1', to: 'dhcp1', status: 'ok' },
    ],
    diagnosticOutputs: [
      {
        command: 'ipconfig /all',
        output: `Windows IP Configuration

   Host Name . . . . . . . . . . . . : Workstation-01
   Primary Dns Suffix  . . . . . . . :
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No
   WINS Proxy Enabled. . . . . . . . : No

Ethernet adapter Local Area Connection:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Intel(R) Ethernet Connection
   Physical Address. . . . . . . . . : 00-1B-21-3A-4F-2C
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Autoconfiguration IPv4 Address. . : 169.254.15.87(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :
   NetBIOS over Tcpip. . . . . . . . : Enabled`,
        timestamp: '2025-10-28T10:15:23Z',
      },
      {
        command: 'ping 192.168.1.10',
        output: `Ping request could not find host 192.168.1.10. Please check the name and try again.`,
        timestamp: '2025-10-28T10:16:05Z',
      },
    ],
    hints: [
      'APIPA (169.254.0.0/16) is assigned when DHCP fails',
      'Check physical connectivity first',
      'Verify DHCP server is reachable',
      'Check for DHCP scope exhaustion',
    ],
    solution: [
      {
        id: 'step-1',
        stepNumber: 1,
        description: 'Identify the problem',
        action: 'Check IP configuration',
        expectedResult: 'Should see valid DHCP address',
        explanation: 'APIPA address (169.254.15.87) indicates DHCP failure. This is RFC 3927 link-local addressing.',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        description: 'Verify physical connectivity',
        action: 'Check cable and link lights',
        expectedResult: 'Link light should be solid green',
        explanation: 'Physical layer must be operational before DHCP can work',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        description: 'Test DHCP server reachability',
        action: 'Manually configure IP and ping DHCP server',
        expectedResult: 'Ping successful',
        explanation: 'Verify DHCP server is accessible on the network',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        description: 'Renew DHCP lease',
        action: 'Run ipconfig /release then ipconfig /renew',
        expectedResult: 'Receive valid IP address from DHCP',
        explanation: 'Force DHCP negotiation to obtain valid address',
      },
    ],
  },
  {
    id: 'trouble-2',
    title: 'Private Address Routing Failure',
    description: 'RFC1918 private addresses not routing to internet',
    problemType: 'private_routing',
    difficulty: 'intermediate',
    symptoms: [
      'Internal network works fine',
      'Cannot reach internet destinations',
      'NAT not configured on router',
      'Using private IP space',
    ],
    expectedBehavior: 'Router should NAT private addresses to public IP',
    actualBehavior: 'Private addresses being routed without translation',
    devices: [
      {
        id: 'pc1',
        name: 'Desktop-PC',
        type: 'host',
        ipAddress: '192.168.1.100',
        subnetMask: '255.255.255.0',
        gateway: '192.168.1.1',
        status: 'error',
        x: 100,
        y: 200,
      },
      {
        id: 'router1',
        name: 'Gateway Router',
        type: 'router',
        ipAddress: '192.168.1.1',
        subnetMask: '255.255.255.0',
        status: 'error',
        x: 300,
        y: 200,
      },
      {
        id: 'internet',
        name: 'Internet',
        type: 'router',
        ipAddress: '8.8.8.8',
        subnetMask: '255.255.255.0',
        status: 'online',
        x: 500,
        y: 200,
      },
    ],
    connections: [
      { from: 'pc1', to: 'router1', status: 'ok' },
      { from: 'router1', to: 'internet', status: 'degraded', label: 'No NAT' },
    ],
    diagnosticOutputs: [
      {
        command: 'ipconfig',
        output: `Ethernet adapter Local Area Connection:

   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`,
        timestamp: '2025-10-28T10:20:00Z',
      },
      {
        command: 'ping 8.8.8.8',
        output: `Pinging 8.8.8.8 with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)`,
        timestamp: '2025-10-28T10:20:15Z',
      },
      {
        command: 'tracert 8.8.8.8',
        output: `Tracing route to 8.8.8.8 over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     *        *        *     Request timed out.
  3     *        *        *     Request timed out.`,
        timestamp: '2025-10-28T10:20:45Z',
      },
    ],
    hints: [
      'RFC 1918 defines private address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)',
      'Private addresses are not routable on the public internet',
      'NAT (Network Address Translation) is required',
      'Check router configuration for NAT/PAT settings',
    ],
    solution: [
      {
        id: 'step-1',
        stepNumber: 1,
        description: 'Identify private addressing',
        action: 'Verify network uses RFC 1918 private addresses',
        expectedResult: 'Confirm 192.168.1.0/24 is private',
        explanation: '192.168.0.0/16 is defined in RFC 1918 as private address space',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        description: 'Check NAT configuration',
        action: 'Review router NAT settings',
        expectedResult: 'NAT should be enabled',
        explanation: 'Private addresses require NAT to communicate with internet',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        description: 'Configure NAT',
        action: 'Enable NAT/PAT on router WAN interface',
        expectedResult: 'NAT translates private to public addresses',
        explanation: 'NAT allows multiple private addresses to share one public IP',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        description: 'Verify connectivity',
        action: 'Test internet access after NAT configuration',
        expectedResult: 'Successful ping to 8.8.8.8',
        explanation: 'Traffic now properly translated and routable',
      },
    ],
  },
  {
    id: 'trouble-3',
    title: 'Multicast Address on Host',
    description: 'Class D multicast address incorrectly assigned to host interface',
    problemType: 'multicast_host',
    difficulty: 'intermediate',
    symptoms: [
      'Host has 224.0.0.15 assigned',
      'No network connectivity',
      'Unusual IP configuration',
    ],
    expectedBehavior: 'Host should have unicast address (Class A/B/C)',
    actualBehavior: 'Host configured with multicast address',
    devices: [
      {
        id: 'server1',
        name: 'File Server',
        type: 'server',
        ipAddress: '224.0.0.15',
        subnetMask: '255.255.255.0',
        status: 'error',
        x: 200,
        y: 200,
      },
    ],
    connections: [],
    diagnosticOutputs: [
      {
        command: 'ip addr show',
        output: `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP
    link/ether 00:0c:29:3f:1a:2b brd ff:ff:ff:ff:ff:ff
    inet 224.0.0.15/24 brd 224.0.0.255 scope global eth0
       valid_lft forever preferred_lft forever`,
        timestamp: '2025-10-28T10:25:00Z',
      },
    ],
    hints: [
      'Class D addresses (224.0.0.0 - 239.255.255.255) are reserved for multicast',
      'Multicast addresses are used for one-to-many communication',
      'Host interfaces need unicast addresses',
      'Check DHCP scope configuration',
    ],
    solution: [
      {
        id: 'step-1',
        stepNumber: 1,
        description: 'Identify address class',
        action: 'Determine that 224.0.0.15 is Class D',
        expectedResult: 'Recognize multicast address',
        explanation: 'First octet 224-239 indicates Class D multicast addressing',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        description: 'Understand the problem',
        action: 'Recognize multicast cannot be used for host addressing',
        expectedResult: 'Understand addressing rules',
        explanation: 'Multicast is for group communication, not host identification',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        description: 'Assign proper unicast address',
        action: 'Configure valid Class A, B, or C address',
        expectedResult: 'Host receives appropriate unicast address',
        explanation: 'Use addresses from valid host ranges (e.g., 192.168.1.x)',
      },
    ],
  },
  {
    id: 'trouble-4',
    title: 'Loopback Address on Interface',
    description: '127.0.0.x address assigned to network interface',
    problemType: 'loopback_interface',
    difficulty: 'beginner',
    symptoms: [
      'No external connectivity',
      'Address shows 127.0.0.x',
      'Can only ping self',
    ],
    expectedBehavior: 'Interface should have network-specific address',
    actualBehavior: 'Interface configured with loopback address',
    devices: [
      {
        id: 'pc1',
        name: 'Workstation',
        type: 'host',
        ipAddress: '127.0.0.5',
        subnetMask: '255.0.0.0',
        status: 'error',
        x: 200,
        y: 200,
      },
    ],
    connections: [],
    diagnosticOutputs: [
      {
        command: 'ifconfig eth0',
        output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 127.0.0.5  netmask 255.0.0.0  broadcast 127.255.255.255
        ether 08:00:27:4a:bc:1f  txqueuelen 1000  (Ethernet)`,
        timestamp: '2025-10-28T10:30:00Z',
      },
      {
        command: 'ping 192.168.1.1',
        output: `PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.
From 127.0.0.5 icmp_seq=1 Destination Host Unreachable`,
        timestamp: '2025-10-28T10:30:30Z',
      },
    ],
    hints: [
      '127.0.0.0/8 is reserved for loopback testing',
      'Loopback addresses only work locally',
      '127.0.0.1 is the standard localhost address',
      'Network interfaces need routable addresses',
    ],
    solution: [
      {
        id: 'step-1',
        stepNumber: 1,
        description: 'Identify loopback range',
        action: 'Recognize 127.0.0.0/8 is loopback',
        expectedResult: 'Understand address is local-only',
        explanation: 'Entire 127.0.0.0/8 range reserved for loopback (RFC 1122)',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        description: 'Understand loopback purpose',
        action: 'Learn loopback is for local testing only',
        expectedResult: 'Packets never leave the host',
        explanation: 'Loopback allows software to communicate with itself',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        description: 'Assign proper network address',
        action: 'Configure valid network address for the interface',
        expectedResult: 'Interface can communicate on network',
        explanation: 'Use address from network subnet (e.g., 192.168.1.100/24)',
      },
    ],
  },
  {
    id: 'trouble-5',
    title: 'Subnet Mask Mismatch',
    description: 'Host and gateway have different subnet masks',
    problemType: 'subnet_mismatch',
    difficulty: 'intermediate',
    symptoms: [
      'Intermittent connectivity',
      'Can reach some hosts but not others',
      'ARP issues',
    ],
    expectedBehavior: 'All devices on subnet should have matching masks',
    actualBehavior: 'Host has /24, gateway has /25',
    devices: [
      {
        id: 'pc1',
        name: 'Desktop-01',
        type: 'host',
        ipAddress: '192.168.1.100',
        subnetMask: '255.255.255.0',
        gateway: '192.168.1.1',
        status: 'error',
        x: 100,
        y: 200,
      },
      {
        id: 'router1',
        name: 'Gateway',
        type: 'router',
        ipAddress: '192.168.1.1',
        subnetMask: '255.255.255.128',
        status: 'error',
        x: 300,
        y: 200,
      },
    ],
    connections: [
      { from: 'pc1', to: 'router1', status: 'degraded' },
    ],
    diagnosticOutputs: [
      {
        command: 'ipconfig (PC)',
        output: `Ethernet adapter Local Area Connection:

   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0 (/24)
   Default Gateway . . . . . . . . . : 192.168.1.1`,
        timestamp: '2025-10-28T10:35:00Z',
      },
      {
        command: 'show ip interface brief (Router)',
        output: `Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
  Subnet mask: 255.255.255.128 (/25)`,
        timestamp: '2025-10-28T10:35:15Z',
      },
      {
        command: 'arp -a',
        output: `Interface: 192.168.1.100 --- 0xb
  Internet Address      Physical Address      Type
  192.168.1.1           00-1b-d4-3f-2a-1c     dynamic
  192.168.1.130         Incomplete            incomplete`,
        timestamp: '2025-10-28T10:35:45Z',
      },
    ],
    hints: [
      'All devices on the same subnet must use the same mask',
      '/24 = 255.255.255.0 (256 addresses)',
      '/25 = 255.255.255.128 (128 addresses)',
      'Mask determines which addresses are local vs remote',
    ],
    solution: [
      {
        id: 'step-1',
        stepNumber: 1,
        description: 'Identify the mismatch',
        action: 'Compare subnet masks on all devices',
        expectedResult: 'Find PC has /24, router has /25',
        explanation: 'Inconsistent masks cause routing and ARP problems',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        description: 'Understand the impact',
        action: 'Calculate different subnet boundaries',
        expectedResult: 'PC thinks 192.168.1.0-255 is local; router thinks only .0-127',
        explanation: 'Different masks mean different local/remote decisions',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        description: 'Standardize subnet mask',
        action: 'Configure all devices with same mask',
        expectedResult: 'All devices agree on subnet boundaries',
        explanation: 'Consistent masks required for proper L2/L3 operation',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        description: 'Clear ARP cache',
        action: 'Run arp -d * to clear old entries',
        expectedResult: 'Fresh ARP resolution with correct mask',
        explanation: 'Old ARP entries may cause lingering issues',
      },
    ],
  },
];

// ============================================================================
// Address Classifications Reference
// ============================================================================

export const addressClassifications: AddressClassification[] = [
  {
    address: '10.0.0.0/8',
    class: 'A',
    type: 'private',
    rfc: 'RFC 1918',
    description: 'Private Class A network - 16,777,216 addresses',
    usability: 'non-routable',
  },
  {
    address: '172.16.0.0/12',
    class: 'B',
    type: 'private',
    rfc: 'RFC 1918',
    description: 'Private Class B networks - 1,048,576 addresses',
    usability: 'non-routable',
  },
  {
    address: '192.168.0.0/16',
    class: 'C',
    type: 'private',
    rfc: 'RFC 1918',
    description: 'Private Class C networks - 65,536 addresses',
    usability: 'non-routable',
  },
  {
    address: '169.254.0.0/16',
    class: 'B',
    type: 'apipa',
    rfc: 'RFC 3927',
    description: 'Automatic Private IP Addressing (APIPA) - Link-local',
    usability: 'non-routable',
  },
  {
    address: '127.0.0.0/8',
    class: 'A',
    type: 'loopback',
    rfc: 'RFC 1122',
    description: 'Loopback addresses - Local host testing',
    usability: 'special-use',
  },
  {
    address: '224.0.0.0/4',
    class: 'D',
    type: 'multicast',
    rfc: 'RFC 5771',
    description: 'Multicast addresses - One-to-many communication',
    usability: 'special-use',
  },
  {
    address: '240.0.0.0/4',
    class: 'E',
    type: 'reserved',
    rfc: 'RFC 1112',
    description: 'Reserved for future use and experimental',
    usability: 'special-use',
  },
  {
    address: '0.0.0.0/8',
    class: 'A',
    type: 'reserved',
    rfc: 'RFC 1122',
    description: '"This" network - Used in routing tables',
    usability: 'special-use',
  },
  {
    address: '255.255.255.255/32',
    class: 'Unknown',
    type: 'reserved',
    rfc: 'RFC 919',
    description: 'Limited broadcast address',
    usability: 'special-use',
  },
];

// ============================================================================
// Diagnostic Command Templates
// ============================================================================

export const diagnosticCommands = {
  windows: [
    'ipconfig',
    'ipconfig /all',
    'ipconfig /release',
    'ipconfig /renew',
    'ping <address>',
    'tracert <address>',
    'arp -a',
    'route print',
    'netstat -rn',
  ],
  linux: [
    'ip addr show',
    'ip route show',
    'ifconfig',
    'ping <address>',
    'traceroute <address>',
    'arp -n',
    'netstat -rn',
    'ss -tuln',
  ],
  cisco: [
    'show ip interface brief',
    'show ip route',
    'show arp',
    'ping <address>',
    'traceroute <address>',
    'show running-config',
  ],
};
