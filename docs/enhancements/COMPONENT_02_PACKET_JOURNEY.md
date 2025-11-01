# Component #2: Packet Journey Simulator - Enhancement Specification

## Executive Summary

This document outlines comprehensive enhancements for the Packet Journey Simulator component to achieve parity with Component #1 (OSI Master Class) and meet CompTIA Network+ N10-008 exam requirements. The current implementation provides basic encapsulation/decapsulation visualization but lacks the depth, protocol coverage, and interactive features needed for effective exam preparation.

**Current State:** Basic TCP/UDP packet flow with limited protocol headers
**Target State:** Comprehensive packet analysis tool with 20+ protocols, Wireshark-style inspection, exam scenarios, and interactive troubleshooting

---

## Table of Contents

1. [Research Findings](#research-findings)
2. [Gap Analysis](#gap-analysis)
3. [Enhancement Specifications](#enhancement-specifications)
4. [Protocol Data Library](#protocol-data-library)
5. [Interactive Features](#interactive-features)
6. [Exam Scenario Coverage](#exam-scenario-coverage)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Success Metrics](#success-metrics)

---

## 1. Research Findings

### CompTIA Network+ N10-008 Requirements

**Exam Objective 1.1:** Compare and contrast the Open Systems Interconnection (OSI) model layers and encapsulation concepts.

Key topics requiring coverage:

- **Data encapsulation and decapsulation** within OSI context
- **Ethernet header** structure and fields
- **Internet Protocol (IP) header** - IPv4 and IPv6
- **TCP/UDP headers** with detailed field analysis
- **TCP flags** (SYN, ACK, FIN, RST, PSH, URG) and their scenarios
- **Payload** visualization
- **Maximum Transmission Unit (MTU)** and fragmentation

### Industry Best Practices (from research)

**Teaching Methodologies:**

1. **Visual Analogies:** Nested boxes, production line metaphors
2. **Wireshark Integration:** Real packet capture examples
3. **Layer-by-Layer Processing:** Step-through animations
4. **Practical Scenarios:** Web browsing, file transfer, email
5. **Memory Aids:** Mnemonics and visual cues

**Professor Messer's Approach:**

- Illustrated views showing encapsulation at each layer
- Wireshark packet captures for real-world examples
- Breaking down protocol decodes into OSI layers
- Using common applications (Gmail, web browsing) as examples

### Protocol Header Requirements (RFC Standards)

**IPv4 (RFC 791):**

- Version, IHL, DSCP, ECN, Total Length
- Identification, Flags (DF, MF), Fragment Offset
- TTL, Protocol, Header Checksum
- Source/Destination IP addresses

**TCP (RFC 793):**

- Source/Destination Ports
- Sequence Number, Acknowledgment Number
- Data Offset, Reserved, Flags (9 flags total)
- Window Size, Checksum, Urgent Pointer

**UDP (RFC 768):**

- Source/Destination Ports
- Length, Checksum

**Ethernet (IEEE 802.3):**

- Preamble, SFD, Destination MAC, Source MAC
- EtherType, Payload, FCS
- VLAN tagging (802.1Q)

---

## 2. Gap Analysis

### Current Implementation Strengths

✅ Basic encapsulation/decapsulation animation
✅ Layer-by-layer visualization
✅ TCP/UDP protocol switching
✅ Header inspection with clickable layers
✅ Color-coded layer representation
✅ Clean, intuitive UI

### Critical Gaps

#### Protocol Coverage

❌ Only 2 protocols (TCP/UDP) vs. Component #1's 60+ protocols
❌ HTTP only - missing HTTPS, DNS, DHCP, FTP, SMTP, etc.
❌ No ICMP, ARP, or other Network Layer protocols
❌ Missing IPv6 support
❌ No VPN/tunneling protocols

#### Header Detail Depth

❌ Generic header fields - not accurate to RFCs
❌ TCP flags shown as string ("PSH, ACK") instead of individual bits
❌ Missing QoS/DSCP fields in IP header
❌ No fragmentation flag visualization
❌ Missing VLAN tagging option
❌ No MTU/fragmentation scenarios

#### Interactive Features

❌ No error injection scenarios (malformed packets, wrong protocols)
❌ No packet corruption/error detection visualization
❌ No Wireshark-style packet dissection
❌ Missing step-by-step "inspect at each hop" feature
❌ No comparison mode (normal vs. error packets)
❌ No interactive troubleshooting challenges

#### Educational Features

❌ No explanatory tooltips or help text
❌ Missing real-world scenario context
❌ No quiz/challenge mode
❌ No progress tracking
❌ Missing exam tips and common pitfalls

#### Exam Preparation

❌ No MTU/fragmentation scenarios (high exam importance)
❌ Missing TCP flag scenarios (SYN flood, FIN scan, etc.)
❌ No QoS/DSCP visualization (VoIP prioritization)
❌ Missing NAT translation visualization
❌ No encapsulation order verification quiz

---

## 3. Enhancement Specifications

### 3.1 Multi-Protocol Support (20+ Protocols)

Implement comprehensive protocol library covering all exam-critical scenarios:

#### Application Layer (Layer 7)

```typescript
const ENHANCED_PROTOCOLS = {
  HTTP: {
    port: 80,
    headers: {
      Method: ['GET', 'POST', 'PUT', 'DELETE'],
      URI: '/resource/path',
      Version: 'HTTP/1.1',
      Host: 'www.example.com',
      UserAgent: 'Mozilla/5.0...',
      Accept: 'text/html,application/json',
      ContentLength: number,
    },
    scenarios: ['Web browsing', 'REST API calls'],
  },

  HTTPS: {
    port: 443,
    headers: {
      // Same as HTTP but with TLS wrapper
      TLSVersion: 'TLS 1.3',
      CipherSuite: 'TLS_AES_256_GCM_SHA384',
      Certificate: 'X.509 Certificate Chain',
    },
    scenarios: ['Secure banking', 'E-commerce', 'Certificate validation'],
  },

  DNS: {
    ports: [53],
    transport: ['TCP', 'UDP'],
    headers: {
      TransactionID: '0x4a2f',
      Flags: 'Standard Query',
      Questions: 1,
      AnswerRRs: 0,
      AuthorityRRs: 0,
      AdditionalRRs: 0,
      QueryName: 'www.example.com',
      QueryType: 'A (IPv4 address)',
      QueryClass: 'IN (Internet)',
    },
    scenarios: ['Name resolution', 'DNS caching', 'TTL expiration'],
  },

  DHCP: {
    ports: { server: 67, client: 68 },
    headers: {
      MessageType: 'DHCPDISCOVER/OFFER/REQUEST/ACK',
      TransactionID: '0x3903f326',
      ClientMAC: '00:1A:2B:3C:4D:5E',
      YourIP: '192.168.1.100',
      ServerIP: '192.168.1.1',
      LeaseTime: '86400 seconds (24 hours)',
      SubnetMask: '255.255.255.0',
      Router: '192.168.1.1',
      DNSServers: '8.8.8.8, 8.8.4.4',
    },
    scenarios: ['IP address acquisition', 'DHCP DORA process', 'Lease renewal'],
  },

  FTP: {
    ports: { control: 21, data: 20 },
    headers: {
      Command: 'USER/PASS/LIST/RETR/STOR',
      ResponseCode: '220/230/331/425/550',
      Mode: 'Active/Passive',
      TransferType: 'Binary/ASCII',
    },
    scenarios: ['File upload/download', 'Active vs Passive mode', 'Firewall issues'],
  },

  SMTP: {
    port: 25,
    headers: {
      Command: 'HELO/MAIL FROM/RCPT TO/DATA/QUIT',
      From: 'sender@example.com',
      To: 'recipient@example.com',
      Subject: 'Email Subject',
      ResponseCode: '220/250/354/550',
    },
    scenarios: ['Email sending', 'Relay configuration', 'SPF/DKIM validation'],
  },

  // Additional protocols...
  SSH: { port: 22, scenarios: ['Remote admin', 'Key authentication'] },
  Telnet: { port: 23, scenarios: ['Legacy remote access', 'Security risks'] },
  POP3: { port: 110, scenarios: ['Email retrieval'] },
  IMAP: { port: 143, scenarios: ['Email access', 'Folder sync'] },
  SNMP: { port: 161, scenarios: ['Network monitoring', 'MIB queries'] },
  NTP: { port: 123, scenarios: ['Time sync', 'Stratum levels'] },
  LDAP: { port: 389, scenarios: ['Directory services', 'Authentication'] },
  RDP: { port: 3389, scenarios: ['Remote desktop', 'Session management'] },
  SIP: { port: 5060, scenarios: ['VoIP signaling', 'Call setup'] },
};
```

#### Network Layer (Layer 3)

```typescript
const NETWORK_PROTOCOLS = {
  IPv4: {
    headers: {
      Version: 4,
      IHL: '5 (20 bytes)',
      DSCP: '0x00 (Best Effort) / 0x2E (EF - VoIP) / 0x1C (AF21)',
      ECN: '0b00 (Not ECN-Capable)',
      TotalLength: 'Calculated',
      Identification: '0x1c46',
      Flags: {
        Reserved: 0,
        DF: "Don't Fragment (0/1)",
        MF: 'More Fragments (0/1)',
      },
      FragmentOffset: 0,
      TTL: '64 (Linux) / 128 (Windows) / 255 (Cisco)',
      Protocol: '6 (TCP) / 17 (UDP) / 1 (ICMP)',
      HeaderChecksum: '0x0000 (calculated)',
      SourceIP: '192.168.1.100',
      DestinationIP: '8.8.8.8',
    },
    scenarios: [
      'Normal routing',
      'Fragmentation required (MTU mismatch)',
      'DF bit set - ICMP fragmentation needed',
      'TTL expiration',
      'QoS/DSCP marking for VoIP',
      'ICMP redirect',
    ],
  },

  IPv6: {
    headers: {
      Version: 6,
      TrafficClass: '0x00',
      FlowLabel: '0x00000',
      PayloadLength: 'Calculated',
      NextHeader: '6 (TCP) / 17 (UDP) / 58 (ICMPv6)',
      HopLimit: 64,
      SourceIP: '2001:0db8:85a3::8a2e:0370:7334',
      DestinationIP: '2001:4860:4860::8888',
    },
    scenarios: ['IPv6 routing', 'No fragmentation (path MTU discovery)'],
  },

  ICMP: {
    types: {
      0: 'Echo Reply (ping response)',
      3: 'Destination Unreachable',
      5: 'Redirect',
      8: 'Echo Request (ping)',
      11: 'Time Exceeded (traceroute)',
    },
    headers: {
      Type: 8,
      Code: 0,
      Checksum: '0x0000',
      Identifier: '0x0001',
      SequenceNumber: '0x0001',
      Data: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    },
    scenarios: ['Ping test', 'Traceroute', 'MTU path discovery', 'Network unreachable'],
  },

  ARP: {
    headers: {
      HardwareType: '1 (Ethernet)',
      ProtocolType: '0x0800 (IPv4)',
      HardwareSize: 6,
      ProtocolSize: 4,
      Opcode: '1 (Request) / 2 (Reply)',
      SenderMAC: '00:1A:2B:3C:4D:5E',
      SenderIP: '192.168.1.100',
      TargetMAC: '00:00:00:00:00:00',
      TargetIP: '192.168.1.1',
    },
    scenarios: ['MAC resolution', 'ARP cache poisoning attack', 'Gratuitous ARP'],
  },
};
```

#### Data Link Layer (Layer 2)

```typescript
const DATALINK_PROTOCOLS = {
  EthernetII: {
    headers: {
      Preamble: '7 bytes (10101010...)',
      SFD: '1 byte (10101011)',
      DestinationMAC: 'AA:BB:CC:DD:EE:FF',
      SourceMAC: '00:1A:2B:3C:4D:5E',
      EtherType: '0x0800 (IPv4) / 0x86DD (IPv6) / 0x0806 (ARP)',
      Payload: '46-1500 bytes',
      FCS: '4 bytes CRC-32',
      FrameSize: '64-1518 bytes (standard) / up to 9018 (jumbo)',
    },
    scenarios: ['Normal frame', 'Runt frame (<64 bytes)', 'Giant frame (>1518)', 'CRC error'],
  },

  VLAN_802_1Q: {
    headers: {
      DestinationMAC: 'AA:BB:CC:DD:EE:FF',
      SourceMAC: '00:1A:2B:3C:4D:5E',
      VLANTag: {
        TPID: '0x8100 (802.1Q)',
        PCP: '0-7 (Priority Code Point)',
        DEI: '0/1 (Drop Eligible Indicator)',
        VID: '1-4094 (VLAN ID)',
      },
      EtherType: '0x0800',
      Payload: '42-1496 bytes',
      FCS: '4 bytes',
      FrameSize: '68-1522 bytes',
    },
    scenarios: ['VLAN tagged traffic', 'QoS prioritization (PCP)', 'Trunk port', 'Native VLAN'],
  },
};
```

### 3.2 Advanced Header Visualization

#### Wireshark-Style Packet Dissection

```typescript
interface PacketDissection {
  hexView: string[]; // Hexadecimal representation
  binaryView: string[]; // Binary representation
  fieldMap: Map<
    string,
    {
      offset: number; // Byte offset
      length: number; // Length in bytes
      value: any;
      description: string;
      rfc: string; // RFC reference
      examNote?: string; // Exam tip
    }
  >;
  expandable: boolean; // Click to expand/collapse
}

// Example implementation
const TCPHeaderDissection = {
  hexView: [
    'D4 31 00 50 00 00 03 E8', // Source Port, Dest Port
    '00 00 07 D0 50 18 FF FF', // Seq, Ack, Flags
    '72 4C 00 00', // Checksum, Urgent
  ],
  binaryView: [
    '1101010000110001 0000000001010000', // Ports
    '00000000000000000000001111101000', // Sequence
    '00000000000000000000011111010000', // Acknowledgment
    '0101 000 000011000 1111111111111111', // Offset, Reserved, Flags, Window
    '0111001001001100 0000000000000000', // Checksum, Urgent
  ],
  fields: [
    {
      name: 'Source Port',
      offset: 0,
      length: 2,
      value: 54321,
      description: 'Port number of sending application',
      rfc: 'RFC 793',
      examNote: 'Ephemeral ports: 49152-65535 (modern), 1024-65535 (legacy)',
    },
    {
      name: 'Destination Port',
      offset: 2,
      length: 2,
      value: 80,
      description: 'HTTP service port',
      rfc: 'RFC 793',
      examNote: 'Well-known ports: 0-1023 (HTTP=80, HTTPS=443, SSH=22)',
    },
    {
      name: 'Sequence Number',
      offset: 4,
      length: 4,
      value: 1000,
      description: 'Position in byte stream',
      rfc: 'RFC 793',
      examNote: 'Randomized initial sequence number (ISN) for security',
    },
    {
      name: 'Acknowledgment Number',
      offset: 8,
      length: 4,
      value: 2000,
      description: 'Next expected byte',
      rfc: 'RFC 793',
      examNote: 'Only valid when ACK flag is set',
    },
    {
      name: 'Data Offset',
      offset: 12,
      length: 4, // bits
      value: 5,
      description: 'Header length in 32-bit words (5 = 20 bytes minimum)',
      rfc: 'RFC 793',
      examNote: 'Minimum: 5 (20 bytes), Maximum: 15 (60 bytes with options)',
    },
    {
      name: 'Flags',
      offset: 13,
      length: 9, // bits
      value: {
        NS: 0,
        CWR: 0,
        ECE: 0,
        URG: 0,
        ACK: 1,
        PSH: 1,
        RST: 0,
        SYN: 0,
        FIN: 0,
      },
      description: 'Control bits',
      rfc: 'RFC 793',
      examNote:
        'CRITICAL: SYN (handshake), ACK (ack), FIN (close), RST (abort), PSH (push), URG (urgent)',
    },
  ],
};
```

#### TCP Flag Visualizer

```typescript
interface TCPFlagScenario {
  name: string;
  flags: {
    SYN: 0 | 1;
    ACK: 0 | 1;
    FIN: 0 | 1;
    RST: 0 | 1;
    PSH: 0 | 1;
    URG: 0 | 1;
    ECE: 0 | 1;
    CWR: 0 | 1;
    NS: 0 | 1;
  };
  description: string;
  examScenario: string;
  visual: string; // ASCII art or emoji
}

const TCP_FLAG_SCENARIOS: TCPFlagScenario[] = [
  {
    name: '3-Way Handshake - Step 1',
    flags: { SYN: 1, ACK: 0, FIN: 0, RST: 0, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Client initiates connection',
    examScenario: 'SYN flood attack: attacker sends many SYNs without completing handshake',
    visual: 'Client --[SYN]→ Server',
  },
  {
    name: '3-Way Handshake - Step 2',
    flags: { SYN: 1, ACK: 1, FIN: 0, RST: 0, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Server acknowledges and synchronizes',
    examScenario: 'If SYN+ACK not received, client retransmits SYN',
    visual: 'Client ←[SYN+ACK]-- Server',
  },
  {
    name: '3-Way Handshake - Step 3',
    flags: { SYN: 0, ACK: 1, FIN: 0, RST: 0, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Client acknowledges, connection established',
    examScenario: 'Connection now open for data transfer',
    visual: 'Client --[ACK]→ Server (ESTABLISHED)',
  },
  {
    name: 'Data Transfer',
    flags: { SYN: 0, ACK: 1, FIN: 0, RST: 0, PSH: 1, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Normal data transmission with push',
    examScenario: 'PSH flag tells receiver to immediately pass data to application',
    visual: 'Client --[PSH+ACK]→ Server',
  },
  {
    name: 'Connection Reset',
    flags: { SYN: 0, ACK: 0, FIN: 0, RST: 1, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Abrupt connection termination',
    examScenario: 'Port scanning: RST response means port closed, no response means filtered',
    visual: 'Client ←[RST]-- Server (CONNECTION ABORTED)',
  },
  {
    name: 'FIN Scan (Stealth)',
    flags: { SYN: 0, ACK: 0, FIN: 1, RST: 0, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Port scanning technique',
    examScenario: 'Closed port responds with RST, open port ignores (bypasses some firewalls)',
    visual: 'Attacker --[FIN]→ Target (Port Scan)',
  },
  {
    name: 'XMAS Scan',
    flags: { SYN: 0, ACK: 0, FIN: 1, RST: 0, PSH: 1, URG: 1, ECE: 0, CWR: 0, NS: 0 },
    description: 'FIN+PSH+URG flags set ("lit up like Christmas tree")',
    examScenario: 'Firewall evasion technique, detected by IDS/IPS',
    visual: 'Attacker --[FIN+PSH+URG]→ Target',
  },
  {
    name: 'NULL Scan',
    flags: { SYN: 0, ACK: 0, FIN: 0, RST: 0, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'No flags set',
    examScenario: 'Another stealth scan technique',
    visual: 'Attacker --[No Flags]→ Target',
  },
  {
    name: 'Graceful Close - Step 1',
    flags: { SYN: 0, ACK: 1, FIN: 1, RST: 0, PSH: 0, URG: 0, ECE: 0, CWR: 0, NS: 0 },
    description: 'Client initiates connection close',
    examScenario: '4-way teardown process begins',
    visual: 'Client --[FIN+ACK]→ Server',
  },
];
```

### 3.3 MTU and Fragmentation Scenarios

```typescript
interface MTUScenario {
  name: string;
  packetSize: number;
  mtuLimit: number;
  dfBit: boolean;
  behavior: string;
  fragments: FragmentInfo[];
  examRelevance: string;
}

const MTU_SCENARIOS: MTUScenario[] = [
  {
    name: 'Standard Ethernet - No Fragmentation',
    packetSize: 1400,
    mtuLimit: 1500,
    dfBit: false,
    behavior: 'Packet passes through without fragmentation',
    fragments: [
      {id: 0x1c46, offset: 0, mf: false, size: 1400}
    ],
    examRelevance: 'Normal operation - packet smaller than MTU'
  },
  {
    name: 'PPPoE Connection - Must Fragment',
    packetSize: 1500,
    mtuLimit: 1492,  // PPPoE has 8-byte overhead
    dfBit: false,
    behavior: 'Packet fragmented into 2 pieces',
    fragments: [
      {id: 0x1c46, offset: 0, mf: true, size: 1472, data: 'First 1472 bytes'},
      {id: 0x1c46, offset: 184, mf: false, size: 48, data: 'Remaining 28 bytes + 20 byte IP header'}
    ],
    examRelevance: 'CRITICAL: PPPoE reduces MTU by 8 bytes (1500 → 1492)'
  },
  {
    name: 'DF Bit Set - ICMP Required',
    packetSize: 1500,
    mtuLimit: 1400,
    dfBit: true,
    behavior: 'Packet dropped, ICMP Type 3 Code 4 sent back',
    fragments: [],
    icmpResponse: {
      type: 3,
      code: 4,
      message: 'Fragmentation Needed and DF Set',
      nextHopMTU: 1400,
      examNote: 'Path MTU Discovery (PMTUD) mechanism'
    },
    examRelevance: 'HIGH EXAM IMPORTANCE: DF bit prevents fragmentation, enables PMTUD'
  },
  {
    name: 'VPN Tunnel Overhead',
    packetSize: 1500,
    mtuLimit: 1400,  // IPsec adds ~50-60 bytes overhead
    dfBit: false,
    behavior: 'Fragmented or MSS clamping used',
    fragments: [
      {id: 0x1c46, offset: 0, mf: true, size: 1380},
      {id: 0x1c46, offset: 172, mf: false, size: 140}
    ],
    examRelevance: 'VPN overhead causes MTU issues, often solved with MSS clamping to 1360'
  },
  {
    name: 'IPv6 - No Fragmentation',
    packetSize: 1600,
    mtuLimit: 1500,
    dfBit: true,  // IPv6 doesn't allow router fragmentation
    behavior: 'Packet dropped, ICMPv6 Packet Too Big sent',
    fragments: [],
    icmpv6Response: {
      type: 2,
      code: 0,
      message: 'Packet Too Big',
      mtu: 1500,
      examNote: 'IPv6 requires source to handle fragmentation, not routers'
    },
    examRelevance: 'CRITICAL: IPv6 does NOT allow router fragmentation (unlike IPv4)'
  },
  {
    name: 'Jumbo Frames - Data Center',
    packetSize: 9000,
    mtuLimit: 9000,
    dfBit: false,
    behavior: 'Packet transmitted as single jumbo frame',
    fragments: [
      {id: 0x1c46, offset: 0, mf: false, size: 9000}
    ],
    examRelevance: 'Jumbo frames (>1518 bytes) used in high-performance networks, require end-to-end support'
  }
];

// Fragment visualization component
interface FragmentInfo {
  id: number;  // Identification field (same for all fragments)
  offset: number;  // Fragment offset (in 8-byte units)
  mf: boolean;  // More Fragments flag
  size: number;  // Fragment size in bytes
  data?: string;  // Description of data
}

// Visual representation
const FragmentVisualizer = () => {
  return (
    <div className="fragment-timeline">
      {fragments.map((frag, idx) => (
        <div key={idx} className="fragment-block">
          <div className="fragment-header">
            <span>ID: 0x{frag.id.toString(16)}</span>
            <span>Offset: {frag.offset} ({frag.offset * 8} bytes)</span>
            <span>MF: {frag.mf ? '1 (More)' : '0 (Last)'}</span>
            <span>Size: {frag.size} bytes</span>
          </div>
          <div className="fragment-data">{frag.data}</div>
        </div>
      ))}
    </div>
  );
};
```

### 3.4 Error Injection and Troubleshooting Scenarios

```typescript
interface ErrorScenario {
  id: string;
  title: string;
  category: 'corruption' | 'configuration' | 'attack' | 'protocol-violation';
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  normalPacket: PacketState;
  errorPacket: PacketState;
  symptom: string;
  diagnosis: string[];
  solution: string;
  examRelevance: string;
}

const ERROR_SCENARIOS: ErrorScenario[] = [
  {
    id: 'err-01',
    title: 'FCS/CRC Checksum Mismatch',
    category: 'corruption',
    difficulty: 'medium',
    description: 'Ethernet frame checksum validation fails',
    symptom: 'CRC errors incrementing on interface, frames discarded',
    diagnosis: [
      'Check physical layer - bad cable, connector, or NIC',
      'Electrical interference or EMI',
      'Duplex mismatch causing collisions',
      'Faulty switch port',
    ],
    solution: 'Replace cable, check for interference sources, verify duplex settings',
    examRelevance: 'HIGH: FCS errors indicate Layer 1 or Layer 2 issues',
    normalPacket: {
      headers: [{ layer: 2, data: { FCS: '0x9c4e3f2a (Valid ✓)' } }],
    },
    errorPacket: {
      headers: [
        {
          layer: 2,
          data: { FCS: '0xDEADBEEF (INVALID ✗)', error: 'CRC mismatch - frame dropped' },
        },
      ],
    },
  },

  {
    id: 'err-02',
    title: 'TTL Expiration',
    category: 'protocol-violation',
    difficulty: 'easy',
    description: 'Packet TTL reaches 0 before destination',
    symptom: 'ICMP Time Exceeded messages, traceroute shows path',
    diagnosis: [
      'Routing loop detected',
      'TTL set too low for network distance',
      'Normal traceroute behavior (intentional TTL decrease)',
    ],
    solution: 'Check routing tables for loops, increase initial TTL if needed',
    examRelevance: 'CRITICAL: TTL prevents infinite loops, traceroute relies on this',
    normalPacket: {
      headers: [{ layer: 3, data: { TTL: 64 } }],
    },
    errorPacket: {
      headers: [{ layer: 3, data: { TTL: 0, error: 'Packet dropped, ICMP Type 11 sent' } }],
    },
  },

  {
    id: 'err-03',
    title: 'SYN Flood Attack',
    category: 'attack',
    difficulty: 'hard',
    description: 'Massive SYN packets without completing handshake',
    symptom: 'Server connection queue full, legitimate clients cannot connect',
    diagnosis: [
      'Thousands of half-open connections in SYN_RECEIVED state',
      'Connection backlog exhausted',
      'Source IPs spoofed or from botnet',
    ],
    solution: 'Enable SYN cookies, rate limiting, firewall rules',
    examRelevance: 'HIGH EXAM IMPORTANCE: DDoS attack exploiting TCP 3-way handshake',
    attackPattern: [
      { from: 'Attacker1', flags: ['SYN'], response: 'none' },
      { from: 'Attacker2', flags: ['SYN'], response: 'none' },
      { from: 'Attacker3', flags: ['SYN'], response: 'none' },
      // ... thousands more
    ],
  },

  {
    id: 'err-04',
    title: 'Malformed TCP Header',
    category: 'protocol-violation',
    difficulty: 'medium',
    description: 'TCP header has invalid field values',
    symptom: 'Connection fails, RST sent, or packet dropped',
    diagnosis: [
      'Data offset < 5 (header too small)',
      'Reserved bits not zero',
      'Invalid flag combinations (SYN+FIN simultaneously)',
      'Checksum validation failure',
    ],
    solution: 'Packet crafting error or attack - block source',
    examRelevance: 'Protocol violation detection, IDS signatures',
    errorConditions: [
      'Data Offset = 4 (minimum is 5)',
      'SYN+FIN flags both set (illegal)',
      'ACK flag set with ack number = 0',
      'Window size = 0 but PSH flag set',
    ],
  },

  {
    id: 'err-05',
    title: 'IP Checksum Failure',
    category: 'corruption',
    difficulty: 'medium',
    description: 'IP header checksum validation fails',
    symptom: 'Packet silently dropped by router/host',
    diagnosis: [
      'Bit flip during transmission',
      'Memory corruption on router',
      'Malicious packet crafting',
    ],
    solution: 'Physical layer issue or hardware problem',
    examRelevance: 'Header checksum only validates IP header, not payload',
    normalPacket: {
      headers: [{ layer: 3, data: { HeaderChecksum: '0x7f3a (Valid)' } }],
    },
    errorPacket: {
      headers: [
        { layer: 3, data: { HeaderChecksum: '0x1234 (INVALID - recalculated should be 0x7f3a)' } },
      ],
    },
  },

  {
    id: 'err-06',
    title: 'VLAN Mismatch',
    category: 'configuration',
    difficulty: 'easy',
    description: 'Packet tagged with wrong VLAN ID',
    symptom: 'Traffic not reaching destination, dropped by switch',
    diagnosis: [
      'Port configured for different VLAN',
      'Trunk port not allowing VLAN',
      'Native VLAN mismatch',
    ],
    solution: 'Configure correct VLAN on port or trunk',
    examRelevance: 'VLAN tagging (802.1Q), trunk configuration',
    normalPacket: {
      headers: [{ layer: 2, data: { VLAN: 100, Port: 'Allowed on trunk' } }],
    },
    errorPacket: {
      headers: [
        {
          layer: 2,
          data: {
            VLAN: 200,
            Port: 'BLOCKED - VLAN 200 not in allowed list',
            error: 'Frame dropped',
          },
        },
      ],
    },
  },

  {
    id: 'err-07',
    title: 'UDP Checksum Optional (IPv4)',
    category: 'protocol-violation',
    difficulty: 'hard',
    description: 'UDP checksum set to 0x0000 in IPv4',
    symptom: 'Checksum disabled - corruption not detected',
    diagnosis: [
      'Legal in IPv4 (checksum optional)',
      'ILLEGAL in IPv6 (checksum mandatory)',
      'Performance optimization vs reliability trade-off',
    ],
    solution: 'Enable checksum for reliability, disable for performance',
    examRelevance: 'EXAM TRICK: UDP checksum optional in IPv4, mandatory in IPv6',
    normalPacket: {
      headers: [{ layer: 4, data: { Protocol: 'UDP', Checksum: '0x3a4f (Enabled)' } }],
    },
    errorPacket: {
      headers: [
        {
          layer: 4,
          data: {
            Protocol: 'UDP',
            Checksum: '0x0000 (Disabled - legal in IPv4)',
            note: 'Mandatory in IPv6',
          },
        },
      ],
    },
  },

  {
    id: 'err-08',
    title: 'ARP Spoofing / Cache Poisoning',
    category: 'attack',
    difficulty: 'hard',
    description: 'Malicious ARP reply maps gateway IP to attacker MAC',
    symptom: 'Man-in-the-middle attack, traffic intercepted',
    diagnosis: [
      'Unsolicited ARP replies received',
      'Multiple MAC addresses claim same IP',
      'ARP cache contains incorrect mappings',
    ],
    solution: 'Dynamic ARP Inspection (DAI), port security, static ARP entries',
    examRelevance: 'HIGH: Common Layer 2 attack, mitigation techniques',
    normalARP: {
      SenderIP: '192.168.1.1',
      SenderMAC: 'AA:BB:CC:DD:EE:FF (legitimate gateway)',
    },
    spoofedARP: {
      SenderIP: '192.168.1.1',
      SenderMAC: '11:22:33:44:55:66 (attacker MAC!)',
      impact: 'Traffic sent to attacker instead of gateway',
    },
  },

  {
    id: 'err-09',
    title: 'QoS/DSCP Misconfiguration',
    category: 'configuration',
    difficulty: 'medium',
    description: 'VoIP packets marked with wrong DSCP value',
    symptom: 'Poor call quality, jitter, packet loss during congestion',
    diagnosis: [
      'DSCP not set correctly for VoIP (should be EF or AF41)',
      'Router not honoring DSCP markings',
      'QoS policy not applied',
    ],
    solution: 'Set DSCP to EF (0x2E) for VoIP, configure QoS queues',
    examRelevance: 'CRITICAL: VoIP requires proper QoS markings for quality',
    normalPacket: {
      headers: [
        {
          layer: 3,
          data: {
            DSCP: '0x2E (EF - Expedited Forwarding)',
            QoS: 'Voice traffic - highest priority',
          },
        },
      ],
    },
    errorPacket: {
      headers: [
        {
          layer: 3,
          data: {
            DSCP: '0x00 (Best Effort)',
            QoS: 'No priority - VoIP will suffer during congestion!',
          },
        },
      ],
    },
  },

  {
    id: 'err-10',
    title: 'Broadcast Storm',
    category: 'protocol-violation',
    difficulty: 'medium',
    description: 'Layer 2 loop causes broadcast multiplication',
    symptom: 'Network saturated, all devices unreachable',
    diagnosis: [
      'STP disabled or misconfigured',
      'Layer 2 loop exists',
      'Broadcast frames circulating infinitely',
    ],
    solution: 'Enable STP (802.1D/802.1w), remove physical loop',
    examRelevance: 'Spanning Tree Protocol prevents this, high exam importance',
    normalBehavior: 'STP blocks redundant port',
    errorBehavior: 'Loop active, broadcasts multiply exponentially',
  },
];
```

### 3.5 Interactive Quiz and Challenge Modes

```typescript
interface PacketChallenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  scenario: string;
  objectives: string[];
  initialState: PacketState;
  targetState: PacketState;
  hints: string[];
  solution: PacketState;
  examTopics: string[];
  timeLimit?: number; // seconds
  points: number;
}

const PACKET_CHALLENGES: PacketChallenge[] = [
  {
    id: 'challenge-01',
    title: 'Build a DNS Query Packet',
    difficulty: 'easy',
    scenario: 'User types www.example.com - construct the DNS query packet from scratch',
    objectives: [
      'Select correct protocol (DNS over UDP)',
      'Set correct port (53)',
      'Add DNS query headers',
      'Ensure encapsulation order is correct',
    ],
    hints: [
      'DNS typically uses UDP (faster than TCP)',
      'DNS server listens on port 53',
      'Encapsulation order: DNS → UDP → IP → Ethernet',
    ],
    examTopics: ['DNS', 'UDP', 'Port numbers', 'Encapsulation'],
    points: 10,
  },

  {
    id: 'challenge-02',
    title: 'Fix the Fragmented Packet',
    difficulty: 'medium',
    scenario: '1500-byte packet must traverse PPPoE link (MTU 1492)',
    objectives: [
      'Calculate correct fragment sizes',
      'Set fragment offset correctly',
      'Set MF flag on first fragment',
      'Clear MF flag on last fragment',
      'Use same identification field',
    ],
    hints: [
      'Fragment offset in 8-byte units',
      'First fragment: offset=0, MF=1',
      'Last fragment: MF=0',
      'All fragments have same ID field',
    ],
    examTopics: ['Fragmentation', 'MTU', 'IP header flags'],
    points: 25,
  },

  {
    id: 'challenge-03',
    title: 'Identify the Attack',
    difficulty: 'hard',
    scenario: 'Analyze suspicious traffic and identify the attack type',
    objectives: [
      'Examine TCP flags',
      'Check packet patterns',
      'Identify attack signature',
      'Recommend mitigation',
    ],
    hints: [
      'Look for unusual flag combinations',
      'Check source IP patterns',
      'Consider connection state',
    ],
    examTopics: ['TCP flags', 'Security', 'Attack types'],
    points: 50,
  },

  {
    id: 'challenge-04',
    title: 'Troubleshoot QoS Issue',
    difficulty: 'medium',
    scenario: 'VoIP calls have poor quality during business hours',
    objectives: [
      'Check DSCP markings on VoIP packets',
      'Verify correct QoS values (EF or AF41)',
      'Ensure Layer 2 CoS also set (if 802.1Q)',
      'Verify queue configuration',
    ],
    hints: [
      'VoIP should use DSCP EF (0x2E) or AF41 (0x22)',
      'Layer 2 CoS should be 5 (Voice)',
      'Check if markings preserved across hops',
    ],
    examTopics: ['QoS', 'DSCP', 'VoIP', '802.1Q'],
    points: 30,
  },

  {
    id: 'challenge-05',
    title: 'Complete the 3-Way Handshake',
    difficulty: 'easy',
    scenario: 'Client wants to establish TCP connection to web server',
    objectives: [
      'Send SYN with random sequence number',
      'Receive SYN+ACK with server sequence',
      'Send final ACK to complete handshake',
      'Verify sequence/acknowledgment numbers',
    ],
    hints: [
      'Step 1: Client sends SYN, seq=X',
      'Step 2: Server sends SYN+ACK, seq=Y, ack=X+1',
      'Step 3: Client sends ACK, seq=X+1, ack=Y+1',
    ],
    examTopics: ['TCP', '3-way handshake', 'Sequence numbers'],
    points: 15,
  },
];
```

---

## 4. Protocol Data Library

### 4.1 Complete Protocol Header Templates

```typescript
// File: src/data/protocol-headers.ts

export const PROTOCOL_HEADER_TEMPLATES = {
  // Application Layer
  HTTP: {
    request: {
      'Request Line': 'GET /index.html HTTP/1.1',
      Host: 'www.example.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
    },
    response: {
      'Status Line': 'HTTP/1.1 200 OK',
      Date: 'Mon, 01 Nov 2025 12:00:00 GMT',
      Server: 'Apache/2.4.41 (Ubuntu)',
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Length': '1234',
      Connection: 'keep-alive',
      'Cache-Control': 'max-age=3600',
      ETag: '"abc123"',
    },
    examNotes: [
      'HTTP uses TCP port 80',
      'Stateless protocol - each request independent',
      'Methods: GET (retrieve), POST (submit), PUT (update), DELETE (remove)',
      'Status codes: 200 OK, 301 Redirect, 404 Not Found, 500 Server Error',
    ],
  },

  HTTPS: {
    tlsHandshake: {
      'TLS Version': 'TLS 1.3',
      'Cipher Suite': 'TLS_AES_256_GCM_SHA384',
      Certificate: 'X.509 v3 Certificate Chain',
      'Session ID': '8a3f2c1b4d5e6f7g',
      'Server Name': 'www.example.com',
      ALPN: 'http/1.1, h2',
    },
    examNotes: [
      'HTTPS uses TCP port 443',
      'TLS encryption at Presentation Layer (Layer 6)',
      'Certificate validates server identity',
      'Modern standard: TLS 1.3 (TLS 1.0/1.1 deprecated)',
      'Perfect Forward Secrecy (PFS) with ephemeral keys',
    ],
  },

  DNS: {
    query: {
      'Transaction ID': '0x4a2f',
      Flags: '0x0100 (Standard query)',
      Questions: '1',
      'Answer RRs': '0',
      'Authority RRs': '0',
      'Additional RRs': '0',
      'Query Name': 'www.example.com',
      'Query Type': 'A (1) - IPv4 address',
      'Query Class': 'IN (1) - Internet',
    },
    response: {
      'Transaction ID': '0x4a2f',
      Flags: '0x8180 (Standard query response, No error)',
      Questions: '1',
      'Answer RRs': '1',
      'Authority RRs': '0',
      'Additional RRs': '0',
      'Query Name': 'www.example.com',
      'Query Type': 'A',
      'Query Class': 'IN',
      'Answer Name': 'www.example.com',
      'Answer Type': 'A',
      'Answer Class': 'IN',
      'Time to Live': '300 seconds (5 minutes)',
      'Data Length': '4',
      Address: '93.184.216.34',
    },
    examNotes: [
      'DNS uses UDP port 53 (queries) or TCP port 53 (zone transfers)',
      'Recursive query: DNS server does full lookup',
      'Iterative query: Server returns referral',
      'TTL determines cache duration',
      'Record types: A (IPv4), AAAA (IPv6), MX (mail), CNAME (alias), NS (nameserver)',
    ],
  },

  DHCP: {
    discover: {
      'Message Type': 'DHCPDISCOVER (1)',
      'Hardware Type': '1 (Ethernet)',
      'Hardware Address Length': '6',
      Hops: '0',
      'Transaction ID': '0x3903f326',
      'Seconds Elapsed': '0',
      'Bootp Flags': '0x0000 (Unicast)',
      'Client IP': '0.0.0.0',
      'Your IP': '0.0.0.0',
      'Server IP': '0.0.0.0',
      'Gateway IP': '0.0.0.0',
      'Client MAC': '00:1A:2B:3C:4D:5E',
      'Option 53': 'DHCP Message Type = DHCPDISCOVER',
    },
    offer: {
      'Message Type': 'DHCPOFFER (2)',
      'Transaction ID': '0x3903f326',
      'Your IP': '192.168.1.100 (offered address)',
      'Server IP': '192.168.1.1',
      'Client MAC': '00:1A:2B:3C:4D:5E',
      'Option 1': 'Subnet Mask = 255.255.255.0',
      'Option 3': 'Router = 192.168.1.1',
      'Option 6': 'DNS Servers = 8.8.8.8, 8.8.4.4',
      'Option 51': 'Lease Time = 86400 seconds (24 hours)',
      'Option 53': 'DHCP Message Type = DHCPOFFER',
      'Option 54': 'DHCP Server = 192.168.1.1',
    },
    examNotes: [
      'DHCP DORA process: Discover, Offer, Request, Acknowledge',
      'Client port 68, Server port 67',
      'Uses broadcast initially (255.255.255.255)',
      'Lease can be renewed at 50% (T1) and 87.5% (T2) of lease time',
      'DHCP Relay forwards requests across subnets',
    ],
  },

  // Transport Layer
  TCP: {
    header: {
      'Source Port': '54321 (Ephemeral)',
      'Destination Port': '80 (HTTP)',
      'Sequence Number': '1000',
      'Acknowledgment Number': '2000',
      'Header Length': '20 bytes (5 words)',
      Reserved: '000',
      Flags: 'PSH, ACK',
      'Window Size': '65535 bytes',
      Checksum: '0x724C',
      'Urgent Pointer': '0',
      Options: '(none)',
      Padding: '(none if options absent)',
    },
    flagDetails: {
      NS: '0 (ECN-nonce concealment protection)',
      CWR: '0 (Congestion Window Reduced)',
      ECE: '0 (ECN-Echo)',
      URG: '0 (Urgent pointer valid)',
      ACK: '1 (Acknowledgment valid)',
      PSH: '1 (Push data to application)',
      RST: '0 (Reset connection)',
      SYN: '0 (Synchronize sequence numbers)',
      FIN: '0 (Finish sending data)',
    },
    examNotes: [
      'Connection-oriented, reliable delivery',
      'Flow control via window size',
      'Congestion control (slow start, congestion avoidance)',
      'Full duplex communication',
      'Retransmission on timeout',
      'Well-known ports: 0-1023, Registered: 1024-49151, Dynamic: 49152-65535',
    ],
  },

  UDP: {
    header: {
      'Source Port': '54321',
      'Destination Port': '53 (DNS)',
      Length: '512 bytes (header + data)',
      Checksum: '0x3a4f (optional in IPv4, mandatory in IPv6)',
    },
    examNotes: [
      'Connectionless, unreliable (no ACKs)',
      'Lower overhead than TCP (8-byte header vs 20+ bytes)',
      'No flow control or congestion control',
      'Used for: DNS, DHCP, SNMP, VoIP, streaming',
      'Faster but less reliable than TCP',
      'Checksum: optional IPv4, required IPv6',
    ],
  },

  // Network Layer
  IPv4: {
    header: {
      Version: '4',
      IHL: '5 (20 bytes)',
      DSCP: '0x00 (Best Effort) [or 0x2E for VoIP EF]',
      ECN: '0b00 (Not ECN-Capable)',
      'Total Length': '1500 bytes',
      Identification: '0x1c46',
      Flags: {
        Reserved: '0',
        DF: "1 (Don't Fragment)",
        MF: '0 (Last Fragment)',
      },
      'Fragment Offset': '0',
      TTL: '64 (typical for Linux/Unix)',
      Protocol: '6 (TCP) [or 17 UDP, 1 ICMP]',
      'Header Checksum': '0x7f3a',
      'Source IP': '192.168.1.100',
      'Destination IP': '8.8.8.8',
      Options: '(rarely used)',
      Padding: '(if options present)',
    },
    dscpValues: {
      '0x00': 'Best Effort (default)',
      '0x08': 'CS1 (Class Selector 1)',
      '0x10': 'CS2',
      '0x18': 'CS3',
      '0x20': 'CS4',
      '0x28': 'CS5 (video)',
      '0x30': 'CS6',
      '0x38': 'CS7',
      '0x2E': 'EF (Expedited Forwarding - VoIP)',
      '0x22': 'AF41 (Assured Forwarding - video)',
      '0x1C': 'AF21',
      '0x14': 'AF11',
    },
    examNotes: [
      '32-bit addressing (4.3 billion addresses)',
      'Classful (legacy): A /8, B /16, C /24, D multicast, E reserved',
      'CIDR notation: 192.168.1.0/24',
      'Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16',
      'Loopback: 127.0.0.0/8',
      'APIPA: 169.254.0.0/16',
      'Fragmentation allowed (unlike IPv6)',
      'TTL typical values: 64 (Linux), 128 (Windows), 255 (Cisco)',
    ],
  },

  ICMP: {
    echoRequest: {
      Type: '8 (Echo Request - Ping)',
      Code: '0',
      Checksum: '0x0000 (calculated)',
      Identifier: '0x0001',
      'Sequence Number': '0x0001',
      Data: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ (32 bytes typical)',
    },
    echoReply: {
      Type: '0 (Echo Reply)',
      Code: '0',
      Checksum: '0x0000',
      Identifier: '0x0001',
      'Sequence Number': '0x0001',
      Data: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ (echo of request)',
    },
    destUnreachable: {
      Type: '3 (Destination Unreachable)',
      Code: '0 (Net Unreachable) / 1 (Host) / 3 (Port) / 4 (Frag Needed)',
      Checksum: '0x0000',
      Unused: '0x00000000',
      'Next-Hop MTU': '1492 (if Code=4)',
      'Original IP Header': '+ first 8 bytes of data',
    },
    timeExceeded: {
      Type: '11 (Time Exceeded)',
      Code: '0 (TTL=0 during transit) / 1 (Fragment reassembly)',
      Checksum: '0x0000',
      Unused: '0x00000000',
      'Original IP Header': '+ first 8 bytes of data',
    },
    examNotes: [
      'ICMP is Layer 3 protocol (not Layer 4)',
      'Used for diagnostics and error reporting',
      'Ping: Type 8 (request), Type 0 (reply)',
      'Traceroute: Intentionally increment TTL, receive Type 11',
      'Path MTU Discovery: Type 3 Code 4',
      'Not blocked by stateless firewalls for related traffic',
    ],
  },

  // Data Link Layer
  EthernetII: {
    frame: {
      Preamble: '7 bytes (10101010 repeated)',
      SFD: '1 byte (10101011)',
      'Destination MAC': 'AA:BB:CC:DD:EE:FF',
      'Source MAC': '00:1A:2B:3C:4D:5E',
      EtherType: '0x0800 (IPv4)',
      Payload: '46-1500 bytes',
      FCS: '4 bytes (CRC-32)',
      'Frame Size': '64-1518 bytes (without VLAN)',
      'Interframe Gap': '12 bytes (96 bit-times)',
    },
    etherTypes: {
      '0x0800': 'IPv4',
      '0x0806': 'ARP',
      '0x86DD': 'IPv6',
      '0x8100': '802.1Q VLAN tagging',
      '0x88A8': '802.1ad (QinQ)',
      '0x8847': 'MPLS unicast',
      '0x8848': 'MPLS multicast',
    },
    examNotes: [
      'Minimum frame size: 64 bytes (18 overhead + 46 data)',
      'Maximum frame size: 1518 bytes (standard), 1522 (with VLAN)',
      'Jumbo frames: up to 9216 bytes (not standard)',
      'FCS uses CRC-32 for error detection',
      'Preamble/SFD for synchronization (not counted in frame size)',
      'MAC address: 48 bits, first 24 bits = OUI (vendor)',
    ],
  },

  VLAN_802_1Q: {
    taggedFrame: {
      'Destination MAC': 'AA:BB:CC:DD:EE:FF',
      'Source MAC': '00:1A:2B:3C:4D:5E',
      TPID: '0x8100 (Tag Protocol Identifier)',
      'TCI (Tag Control Information)': {
        PCP: '5 (Priority Code Point - Voice)',
        DEI: '0 (Drop Eligible Indicator)',
        VID: '100 (VLAN ID)',
      },
      EtherType: '0x0800 (IPv4)',
      Payload: '42-1496 bytes',
      FCS: '4 bytes',
      'Frame Size': '68-1522 bytes',
    },
    pcpValues: {
      '0': 'Background (lowest)',
      '1': 'Best Effort (default)',
      '2': 'Excellent Effort',
      '3': 'Critical Applications',
      '4': 'Video (<100ms latency)',
      '5': 'Voice (<10ms latency)',
      '6': 'Internetwork Control',
      '7': 'Network Control (highest)',
    },
    examNotes: [
      'VLAN tagging adds 4 bytes to frame',
      'VID range: 1-4094 (0 and 4095 reserved)',
      'Native VLAN: untagged traffic on trunk (default VLAN 1)',
      'PCP provides Layer 2 QoS (Class of Service)',
      'Trunk ports carry multiple VLANs',
      'Access ports belong to single VLAN',
    ],
  },

  ARP: {
    request: {
      'Hardware Type': '1 (Ethernet)',
      'Protocol Type': '0x0800 (IPv4)',
      'Hardware Size': '6 bytes',
      'Protocol Size': '4 bytes',
      Opcode: '1 (Request)',
      'Sender MAC': '00:1A:2B:3C:4D:5E',
      'Sender IP': '192.168.1.100',
      'Target MAC': '00:00:00:00:00:00 (unknown)',
      'Target IP': '192.168.1.1',
    },
    reply: {
      'Hardware Type': '1 (Ethernet)',
      'Protocol Type': '0x0800 (IPv4)',
      'Hardware Size': '6 bytes',
      'Protocol Size': '4 bytes',
      Opcode: '2 (Reply)',
      'Sender MAC': 'AA:BB:CC:DD:EE:FF (gateway MAC)',
      'Sender IP': '192.168.1.1',
      'Target MAC': '00:1A:2B:3C:4D:5E',
      'Target IP': '192.168.1.100',
    },
    examNotes: [
      'ARP maps IP (Layer 3) to MAC (Layer 2)',
      "Operates within broadcast domain (doesn't cross routers)",
      'ARP cache stores mappings (timeout typically 2-5 minutes)',
      'Gratuitous ARP: host announces own IP/MAC mapping',
      'ARP spoofing: attacker sends false ARP replies',
      'Mitigation: Dynamic ARP Inspection (DAI), static ARP entries',
    ],
  },
};
```

---

## 5. Interactive Features

### 5.1 Step-by-Step Inspector

```typescript
interface InspectionPoint {
  location: 'source' | 'router1' | 'router2' | 'destination';
  action: string;
  packetState: PacketState;
  explanation: string;
}

const PACKET_JOURNEY_INSPECTION = [
  {
    location: 'source',
    action: 'Packet created by application',
    packetState: {
      currentLayer: 7,
      headers: [{ layer: 7, data: { HTTP: 'GET /index.html' } }],
    },
    explanation: 'Application layer creates HTTP request',
  },
  {
    location: 'source',
    action: 'TCP header added',
    packetState: {
      currentLayer: 4,
      headers: [
        { layer: 7, data: { HTTP: 'GET /index.html' } },
        { layer: 4, data: { TCP: 'Src:54321 Dst:80 SYN' } },
      ],
    },
    explanation: 'Transport layer adds TCP header with port numbers and flags',
  },
  {
    location: 'source',
    action: 'IP header added',
    packetState: {
      currentLayer: 3,
      headers: [
        { layer: 7, data: { HTTP: 'GET /index.html' } },
        { layer: 4, data: { TCP: 'Src:54321 Dst:80 SYN' } },
        { layer: 3, data: { IP: 'Src:192.168.1.100 Dst:8.8.8.8 TTL:64' } },
      ],
    },
    explanation: 'Network layer adds IP header with source/dest addresses, TTL=64',
  },
  {
    location: 'source',
    action: 'Ethernet frame created',
    packetState: {
      currentLayer: 2,
      headers: [
        { layer: 7, data: { HTTP: 'GET /index.html' } },
        { layer: 4, data: { TCP: 'Src:54321 Dst:80 SYN' } },
        { layer: 3, data: { IP: 'Src:192.168.1.100 Dst:8.8.8.8 TTL:64' } },
        { layer: 2, data: { Eth: 'Src:00:1A:2B:3C:4D:5E Dst:AA:BB:CC:DD:EE:FF (gateway)' } },
      ],
    },
    explanation: 'Data Link layer adds Ethernet header. Dest MAC is gateway (found via ARP)',
  },
  {
    location: 'source',
    action: 'Bits transmitted on wire',
    packetState: {
      currentLayer: 1,
      headers: [
        /* all headers */
      ],
      physical: '10101010... (electrical signals)',
    },
    explanation: 'Physical layer converts frame to electrical signals on Cat6 cable',
  },
  {
    location: 'router1',
    action: 'Frame received, FCS checked',
    packetState: { currentLayer: 2 },
    explanation: 'Router receives frame, validates CRC checksum (FCS)',
  },
  {
    location: 'router1',
    action: 'Frame decapsulated, IP packet examined',
    packetState: { currentLayer: 3 },
    explanation: 'Ethernet header removed, router examines IP dest address',
  },
  {
    location: 'router1',
    action: 'Routing table lookup',
    packetState: {
      currentLayer: 3,
      routingDecision: {
        destIP: '8.8.8.8',
        matchedRoute: '8.8.8.0/24 via 203.0.113.1',
        nextHop: '203.0.113.1',
        outInterface: 'GigabitEthernet0/1',
      },
    },
    explanation: 'Router consults routing table to determine next hop',
  },
  {
    location: 'router1',
    action: 'TTL decremented',
    packetState: {
      currentLayer: 3,
      headers: [{ layer: 3, data: { IP: 'TTL changed from 64 → 63' } }],
    },
    explanation:
      'Router decrements TTL by 1 (if TTL=0, packet dropped and ICMP Time Exceeded sent)',
  },
  {
    location: 'router1',
    action: 'New Ethernet frame created',
    packetState: {
      currentLayer: 2,
      headers: [
        { layer: 3, data: { IP: 'Src:192.168.1.100 Dst:8.8.8.8 TTL:63' } },
        { layer: 2, data: { Eth: 'NEW Src MAC (router interface), NEW Dst MAC (next hop)' } },
      ],
    },
    explanation: 'Layer 2 header rewritten with new MAC addresses for next segment',
  },
  {
    location: 'router1',
    action: 'Packet forwarded',
    packetState: { currentLayer: 1 },
    explanation: 'Packet transmitted on outbound interface toward next hop',
  },
  // ... similar steps for router2 ...
  {
    location: 'destination',
    action: 'Decapsulation begins',
    packetState: { currentLayer: 2 },
    explanation: 'Destination receives frame, validates FCS',
  },
  {
    location: 'destination',
    action: 'IP header examined',
    packetState: { currentLayer: 3 },
    explanation: 'Verifies destination IP matches (8.8.8.8 = this host)',
  },
  {
    location: 'destination',
    action: 'TCP segment processed',
    packetState: { currentLayer: 4 },
    explanation: 'Port 80 identifies HTTP server application',
  },
  {
    location: 'destination',
    action: 'Data delivered to application',
    packetState: { currentLayer: 7 },
    explanation: 'HTTP request passed to web server application',
  },
];
```

### 5.2 Comparison Mode (Normal vs. Error)

```typescript
interface ComparisonView {
  title: string;
  normalPacket: PacketState;
  errorPacket: PacketState;
  differences: DifferenceHighlight[];
  explanation: string;
}

const COMPARISON_SCENARIOS: ComparisonView[] = [
  {
    title: 'Normal Frame vs. CRC Error',
    normalPacket: {
      headers: [
        {
          layer: 2,
          data: {
            DestMAC: 'AA:BB:CC:DD:EE:FF',
            SrcMAC: '00:1A:2B:3C:4D:5E',
            EtherType: '0x0800',
            Payload: '1500 bytes',
            FCS: '0x9c4e3f2a ✓ VALID',
          },
        },
      ],
    },
    errorPacket: {
      headers: [
        {
          layer: 2,
          data: {
            DestMAC: 'AA:BB:CC:DD:EE:FF',
            SrcMAC: '00:1A:2B:3C:4D:5E',
            EtherType: '0x0800',
            Payload: '1500 bytes (CORRUPTED)',
            FCS: '0xDEADBEEF ✗ INVALID - CRC mismatch!',
          },
          error: true,
        },
      ],
    },
    differences: [
      { field: 'Payload', issue: 'Bit flip during transmission' },
      { field: 'FCS', issue: 'Checksum validation failed' },
    ],
    explanation:
      'Physical layer issue (bad cable, EMI) caused bit corruption. Frame discarded at Layer 2.',
  },

  {
    title: 'Correct Fragmentation vs. DF Bit Set',
    normalPacket: {
      headers: [
        {
          layer: 3,
          data: {
            TotalLength: 1500,
            Flags: 'DF=0 MF=0',
            Result: 'Packet can be fragmented if needed',
          },
        },
      ],
    },
    errorPacket: {
      headers: [
        {
          layer: 3,
          data: {
            TotalLength: 1500,
            Flags: 'DF=1 MF=0',
            MTU: 1400,
            Result: 'Packet DROPPED! ICMP Type 3 Code 4 sent back',
            ICMPMessage: 'Fragmentation Needed and DF Set, Next-Hop MTU=1400',
          },
          error: true,
        },
      ],
    },
    differences: [
      { field: 'DF Flag', issue: 'Set to 1, preventing fragmentation' },
      { field: 'Behavior', issue: 'Path MTU Discovery mechanism triggered' },
    ],
    explanation: 'Sender must reduce packet size or MSS. Used for PMTUD (Path MTU Discovery).',
  },
];
```

### 5.3 Real-Time Metrics Display

```typescript
interface PacketMetrics {
  encapsulationOverhead: {
    layer: OSILayerNumber;
    headerSize: number;
    percentage: number;
  }[];
  totalSize: {
    payload: number;
    headers: number;
    total: number;
    efficiency: number;
  };
  performance: {
    mtu: number;
    fragmentation: boolean;
    fragments: number;
    overhead: string;
  };
}

const calculateMetrics = (packet: PacketState): PacketMetrics => {
  const payloadSize = packet.payload.length;
  const headerSizes = {
    7: 0, // Application layer data
    6: 0, // Presentation (SSL/TLS adds ~5-40 bytes)
    5: 0, // Session
    4: packet.protocol === 'TCP' ? 20 : 8, // TCP 20 bytes, UDP 8 bytes
    3: 20, // IPv4 header (min 20, max 60 with options)
    2: 18, // Ethernet: 14 header + 4 FCS
    1: 26, // Preamble (8) + IFG (12) + overhead
  };

  const totalHeaders = Object.values(headerSizes).reduce((a, b) => a + b, 0);
  const totalSize = payloadSize + totalHeaders;
  const efficiency = (payloadSize / totalSize) * 100;

  return {
    encapsulationOverhead: [
      { layer: 4, headerSize: headerSizes[4], percentage: (headerSizes[4] / totalSize) * 100 },
      { layer: 3, headerSize: headerSizes[3], percentage: (headerSizes[3] / totalSize) * 100 },
      { layer: 2, headerSize: headerSizes[2], percentage: (headerSizes[2] / totalSize) * 100 },
      { layer: 1, headerSize: headerSizes[1], percentage: (headerSizes[1] / totalSize) * 100 },
    ],
    totalSize: {
      payload: payloadSize,
      headers: totalHeaders,
      total: totalSize,
      efficiency: efficiency,
    },
    performance: {
      mtu: 1500,
      fragmentation: totalSize > 1500,
      fragments: Math.ceil(totalSize / 1500),
      overhead: `${((totalHeaders / totalSize) * 100).toFixed(1)}%`,
    },
  };
};
```

---

## 6. Exam Scenario Coverage

### 6.1 High-Priority Exam Topics

Based on research, these scenarios appear frequently on Network+ exams:

1. **TCP 3-Way Handshake** (CRITICAL)
   - SYN, SYN+ACK, ACK sequence
   - Sequence/acknowledgment number math
   - Half-open connections (SYN flood)

2. **Fragmentation and MTU** (HIGH)
   - Standard Ethernet MTU (1500 bytes)
   - PPPoE MTU (1492 bytes)
   - DF bit and Path MTU Discovery
   - Fragment offset calculation

3. **QoS/DSCP Marking** (HIGH)
   - VoIP traffic (EF - 0x2E)
   - Video (AF41 - 0x22)
   - Best Effort (0x00)
   - Layer 2 CoS (802.1p PCP values)

4. **VLAN Tagging** (HIGH)
   - 802.1Q tag structure
   - Trunk vs access ports
   - Native VLAN
   - PCP priority values

5. **DNS Resolution** (MEDIUM)
   - Query/response process
   - Record types (A, AAAA, MX, CNAME)
   - TTL and caching
   - UDP vs TCP (port 53)

6. **DHCP DORA** (MEDIUM)
   - Discover, Offer, Request, Acknowledge
   - Lease times
   - Options (subnet, gateway, DNS)

7. **ARP Process** (MEDIUM)
   - IP-to-MAC resolution
   - ARP cache
   - ARP spoofing/poisoning

8. **ICMP Messages** (MEDIUM)
   - Ping (Type 8/0)
   - Destination Unreachable (Type 3)
   - Time Exceeded (Type 11)
   - Redirect (Type 5)

### 6.2 Exam-Style Questions

```typescript
interface ExamQuestion {
  id: string;
  question: string;
  scenario: string;
  answers: { text: string; correct: boolean; explanation: string }[];
  examTip: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q-01',
    question: 'A packet with total size 1500 bytes must cross a PPPoE link. What happens?',
    scenario: 'Router interface configured for PPPoE (MTU 1492)',
    answers: [
      {
        text: 'Packet passes through unchanged',
        correct: false,
        explanation: 'PPPoE MTU is 1492, packet is 1500 bytes - too large',
      },
      {
        text: 'Packet fragmented into 2 pieces (if DF=0)',
        correct: true,
        explanation: 'CORRECT: 1492 MTU requires fragmentation for 1500-byte packet',
      },
      {
        text: 'Packet dropped, ICMP sent (if DF=1)',
        correct: true,
        explanation: 'CORRECT: If DF bit set, packet dropped and ICMP Type 3 Code 4 sent',
      },
      {
        text: 'Packet compressed to fit MTU',
        correct: false,
        explanation: 'Compression is a different process, not automatic',
      },
    ],
    examTip: 'Remember: PPPoE adds 8-byte overhead, reducing MTU from 1500 to 1492',
  },

  {
    id: 'q-02',
    question: 'Which TCP flags are set during the second step of the 3-way handshake?',
    scenario: 'Client connecting to web server',
    answers: [
      { text: 'SYN', correct: false, explanation: 'SYN alone is step 1' },
      { text: 'SYN, ACK', correct: true, explanation: 'CORRECT: Server responds with SYN+ACK' },
      { text: 'ACK', correct: false, explanation: 'ACK alone is step 3' },
      { text: 'SYN, PSH, ACK', correct: false, explanation: 'PSH not used in handshake' },
    ],
    examTip: 'Remember: SYN → SYN+ACK → ACK (steps 1, 2, 3)',
  },

  {
    id: 'q-03',
    question: 'What DSCP value should be used for VoIP traffic?',
    scenario: 'Configuring QoS for IP phones',
    answers: [
      { text: '0x00 (Best Effort)', correct: false, explanation: 'No QoS priority' },
      {
        text: '0x2E (EF - Expedited Forwarding)',
        correct: true,
        explanation: 'CORRECT: EF is standard for VoIP',
      },
      { text: '0x22 (AF41)', correct: false, explanation: 'AF41 typically for video' },
      { text: '0x08 (CS1)', correct: false, explanation: 'CS1 is low priority' },
    ],
    examTip: 'VoIP = EF (0x2E), Video = AF41 (0x22), Best Effort = 0x00',
  },

  {
    id: 'q-04',
    question: 'A host receives ICMP Type 3 Code 4. What does this indicate?',
    scenario: 'Troubleshooting connectivity issue',
    answers: [
      { text: 'Destination host unreachable', correct: false, explanation: 'Code 1' },
      { text: 'Destination port unreachable', correct: false, explanation: 'Code 3' },
      {
        text: 'Fragmentation needed and DF set',
        correct: true,
        explanation: 'CORRECT: Path MTU Discovery message',
      },
      { text: 'TTL expired', correct: false, explanation: 'Type 11, not Type 3' },
    ],
    examTip: 'Type 3 Code 4 = MTU issue. Router tells sender to reduce packet size.',
  },

  {
    id: 'q-05',
    question: 'What is the correct order of DHCP messages?',
    scenario: 'Client obtaining IP address',
    answers: [
      { text: 'Request, Discover, Offer, Acknowledge', correct: false, explanation: 'Wrong order' },
      {
        text: 'Discover, Offer, Request, Acknowledge',
        correct: true,
        explanation: 'CORRECT: DORA process',
      },
      { text: 'Offer, Discover, Acknowledge, Request', correct: false, explanation: 'Wrong order' },
      {
        text: 'Discover, Request, Offer, Acknowledge',
        correct: false,
        explanation: 'Offer comes before Request',
      },
    ],
    examTip: 'Remember: DORA = Discover, Offer, Request, Acknowledge',
  },
];
```

---

## 7. Implementation Roadmap

### Phase 1: Protocol Library Expansion (Week 1-2)

**Priority: CRITICAL**

1. **Create Protocol Data Files**
   - `/src/data/protocol-headers.ts` - Complete header templates
   - `/src/data/tcp-flags.ts` - TCP flag scenarios
   - `/src/data/mtu-scenarios.ts` - Fragmentation cases
   - `/src/data/error-scenarios.ts` - Error injection library

2. **Implement Protocol Selector**
   - Dropdown/tabs for 20+ protocols
   - Dynamic header generation based on selection
   - Protocol-specific scenarios

3. **Header Detail Enhancement**
   - Wireshark-style dissection view
   - Hex/binary representation
   - Field-level tooltips with RFC references

**Deliverable:** Component supports 20+ protocols with accurate headers

### Phase 2: Visualization Upgrades (Week 3)

**Priority: HIGH**

1. **TCP Flag Visualizer**
   - Individual flag checkboxes
   - Visual representation (colored blocks)
   - Scenario selector (handshake, close, attacks)
   - Real-time flag combination validation

2. **MTU/Fragmentation Simulator**
   - MTU slider (576 - 9000 bytes)
   - DF bit toggle
   - Fragment timeline visualization
   - ICMP response generation

3. **Multi-Hop Journey**
   - Add intermediate routers
   - Show TTL decrement at each hop
   - MAC address rewriting
   - Routing decision display

**Deliverable:** Enhanced visualizations matching Component #1 quality

### Phase 3: Interactive Features (Week 4)

**Priority: HIGH**

1. **Error Injection System**
   - 10+ error scenarios
   - Normal vs error comparison view
   - Symptom/diagnosis/solution flow
   - Exam relevance tags

2. **Step-by-Step Inspector**
   - Pause at each layer/hop
   - Detailed explanation tooltips
   - "What happens next?" quiz mode

3. **Challenge Mode**
   - 5 initial challenges
   - Scoring system
   - Hints and solutions
   - Progress tracking

**Deliverable:** Interactive troubleshooting and learning features

### Phase 4: Exam Preparation (Week 5)

**Priority: MEDIUM**

1. **Exam Scenario Library**
   - 15+ common exam scenarios
   - Multiple choice questions
   - Performance-based simulations
   - Explanation for each answer

2. **Educational Overlays**
   - Tooltips on hover
   - "Exam Tip" callouts
   - RFC references
   - Common pitfalls warnings

3. **Progress Tracking**
   - Scenarios completed
   - Quiz scores
   - Time spent per topic
   - Weak areas identification

**Deliverable:** Comprehensive exam preparation tool

### Phase 5: Polish and Testing (Week 6)

**Priority: MEDIUM**

1. **UI/UX Refinement**
   - Responsive design testing
   - Accessibility improvements
   - Performance optimization
   - Visual consistency with Component #1

2. **Content Validation**
   - Verify all header values against RFCs
   - Cross-check exam objectives
   - Peer review by Network+ certified engineers

3. **Documentation**
   - User guide
   - Keyboard shortcuts
   - Tips and tricks
   - Known limitations

**Deliverable:** Production-ready component

---

## 8. Success Metrics

### Quantitative Metrics

1. **Protocol Coverage**
   - ✅ Target: 20+ protocols (currently 2)
   - ✅ All exam-critical protocols included

2. **Header Accuracy**
   - ✅ 100% RFC-compliant header structures
   - ✅ All mandatory fields present
   - ✅ Field sizes match specifications

3. **Scenario Coverage**
   - ✅ 50+ scenarios (currently ~3)
   - ✅ All N10-008 exam topics covered
   - ✅ Error scenarios included

4. **Interactive Elements**
   - ✅ 10+ error injection scenarios
   - ✅ 5+ packet building challenges
   - ✅ Step-by-step inspection mode
   - ✅ Comparison view implemented

### Qualitative Metrics

1. **Educational Value**
   - Users can identify packet components in Wireshark
   - Users understand encapsulation order
   - Users can troubleshoot common issues

2. **Exam Readiness**
   - Users confident with TCP flags
   - Users understand MTU/fragmentation
   - Users can answer exam-style questions

3. **User Engagement**
   - Average session time >10 minutes
   - Challenge completion rate >60%
   - Return user rate >40%

---

## 9. Technical Implementation Notes

### 9.1 File Structure

```
src/
├── components/
│   └── osi/
│       ├── PacketJourneySimulator.tsx (main component)
│       ├── PacketVisualizer.tsx (packet display)
│       ├── TCPFlagVisualizer.tsx (flag display)
│       ├── FragmentationView.tsx (MTU scenarios)
│       ├── HeaderInspector.tsx (Wireshark-style)
│       ├── ComparisonView.tsx (normal vs error)
│       ├── ChallengeMode.tsx (interactive quiz)
│       └── ExamScenarios.tsx (exam questions)
├── data/
│   ├── protocol-headers.ts (all header templates)
│   ├── tcp-flags.ts (flag scenarios)
│   ├── mtu-scenarios.ts (fragmentation)
│   ├── error-scenarios.ts (troubleshooting)
│   ├── exam-questions.ts (quiz bank)
│   └── packet-journeys.ts (multi-hop paths)
├── hooks/
│   ├── usePacketAnimation.ts
│   ├── useHeaderDissection.ts
│   └── useFragmentation.ts
└── utils/
    ├── packetCalculations.ts (checksums, sizes)
    ├── headerValidation.ts (RFC compliance)
    └── examScoring.ts (progress tracking)
```

### 9.2 TypeScript Interfaces

See existing `osi-types.ts` file, plus additions:

```typescript
// New interfaces needed
interface ProtocolHeader {
  name: string;
  layer: OSILayerNumber;
  fields: HeaderField[];
  size: number;
  rfc: string;
}

interface HeaderField {
  name: string;
  offset: number;
  length: number;
  value: any;
  description: string;
  examNote?: string;
}

interface FragmentInfo {
  id: number;
  offset: number;
  mf: boolean;
  size: number;
}

interface ErrorInjection {
  type: string;
  affectedLayer: OSILayerNumber;
  normalValue: any;
  errorValue: any;
  symptom: string;
  diagnosis: string[];
}

interface ChallengeQuestion {
  id: string;
  type: 'multiple-choice' | 'build-packet' | 'troubleshoot';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number;
}
```

### 9.3 Performance Considerations

- Lazy load protocol data (only load selected protocol)
- Virtualize long lists (fragment timelines)
- Memoize expensive calculations (checksum, fragmentation)
- Debounce real-time input (MTU slider)
- Use Web Workers for packet analysis (if needed)

---

## 10. Future Enhancements (Post-MVP)

1. **Advanced Protocols**
   - IPv6 extension headers
   - MPLS labels
   - GRE tunneling
   - IPsec ESP/AH

2. **Network Scenarios**
   - NAT translation visualization
   - Load balancer distribution
   - Firewall rule processing
   - IDS/IPS inspection

3. **Wireshark Integration**
   - Import .pcap files
   - Export created packets
   - Wireshark filter syntax

4. **Collaboration Features**
   - Share scenarios via URL
   - Community-contributed challenges
   - Leaderboards

5. **Mobile Optimization**
   - Touch-friendly controls
   - Simplified view for small screens
   - Offline mode with service workers

---

## Conclusion

This enhancement specification provides a comprehensive roadmap to elevate the Packet Journey Simulator to the same level of excellence as Component #1 (OSI Master Class). By implementing:

- **20+ protocols** with RFC-accurate headers
- **Wireshark-style** packet dissection
- **TCP flag scenarios** including attacks
- **MTU/fragmentation** visualization
- **Error injection** and troubleshooting
- **Interactive challenges** and exam questions

...the component will become an indispensable tool for CompTIA Network+ N10-008 exam preparation, providing students with hands-on experience in packet analysis, protocol behavior, and real-world troubleshooting scenarios.

**Estimated Implementation Time:** 6 weeks (1 developer)
**Lines of Code Added:** ~8,000-10,000 (TypeScript + JSX)
**Exam Coverage Improvement:** 40% → 95%

---

**Document Version:** 1.0
**Author:** Research & Analysis Agent
**Date:** November 1, 2025
**Next Review:** After Phase 1 completion
