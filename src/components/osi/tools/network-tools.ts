/**
 * Network troubleshooting tool simulations for CompTIA Network+ training
 * Simulates output from common diagnostic tools based on scenario conditions
 */

import type { TroubleshootingScenario } from '../osi-types';

export interface NetworkTool {
  name: string;
  command: string;
  syntax: string;
  description: string;
  examRelevance: 'critical' | 'high' | 'medium' | 'low';
  layer: number;
  examples: string[];
}

export interface CommandOutput {
  command: string;
  args: string[];
  output: string;
  exitCode: number;
  timestamp: Date;
  hints: string[];
  layerIndication: number | null;
  interpretation: string;
}

export const NETWORK_TOOLS: NetworkTool[] = [
  {
    name: 'Ping',
    command: 'ping',
    syntax: 'ping [hostname|ip] [-t] [-n count] [-l size]',
    description: 'Test IP connectivity with ICMP echo requests',
    examRelevance: 'critical',
    layer: 3,
    examples: [
      'ping 192.168.1.1',
      'ping www.google.com',
      'ping -n 10 8.8.8.8',
      'ping -l 1500 192.168.1.1',
    ],
  },
  {
    name: 'Traceroute',
    command: 'tracert',
    syntax: 'tracert [hostname|ip] [-h max_hops]',
    description: 'Trace packet route hop-by-hop using TTL',
    examRelevance: 'critical',
    layer: 3,
    examples: ['tracert www.google.com', 'tracert 10.0.0.1', 'tracert -h 15 192.168.1.1'],
  },
  {
    name: 'NSLookup',
    command: 'nslookup',
    syntax: 'nslookup [hostname] [dns-server]',
    description: 'Query DNS server for name resolution',
    examRelevance: 'critical',
    layer: 7,
    examples: [
      'nslookup www.example.com',
      'nslookup www.example.com 8.8.8.8',
      'nslookup -type=MX example.com',
    ],
  },
  {
    name: 'IP Configuration',
    command: 'ipconfig',
    syntax: 'ipconfig [/all] [/release] [/renew] [/flushdns]',
    description: 'Display IP configuration details',
    examRelevance: 'critical',
    layer: 3,
    examples: ['ipconfig', 'ipconfig /all', 'ipconfig /flushdns', 'ipconfig /renew'],
  },
  {
    name: 'ARP',
    command: 'arp',
    syntax: 'arp -a [ip-address]',
    description: 'View and manage ARP cache (IP to MAC mapping)',
    examRelevance: 'critical',
    layer: 2,
    examples: ['arp -a', 'arp -a 192.168.1.1', 'arp -d *'],
  },
  {
    name: 'Netstat',
    command: 'netstat',
    syntax: 'netstat [-a] [-n] [-o] [-p protocol] [-r]',
    description: 'Display active connections, ports, and routing table',
    examRelevance: 'critical',
    layer: 4,
    examples: ['netstat -ano', 'netstat -r', 'netstat -p tcp', 'netstat -a'],
  },
  {
    name: 'Route Print',
    command: 'route',
    syntax: 'route print [-4] [-6]',
    description: 'Display routing table',
    examRelevance: 'high',
    layer: 3,
    examples: [
      'route print',
      'route print -4',
      'route add 192.168.2.0 mask 255.255.255.0 192.168.1.1',
    ],
  },
  {
    name: 'PathPing',
    command: 'pathping',
    syntax: 'pathping [hostname|ip]',
    description: 'Combines ping and traceroute with packet loss statistics',
    examRelevance: 'medium',
    layer: 3,
    examples: ['pathping www.google.com', 'pathping -n 192.168.1.1'],
  },
];

/**
 * Generate simulated command output based on scenario conditions
 */
export function executeCommand(
  command: string,
  args: string[],
  scenario: TroubleshootingScenario
): CommandOutput {
  const toolName = command.toLowerCase();
  const timestamp = new Date();

  switch (toolName) {
    case 'ping':
      return executePing(args, scenario, timestamp);
    case 'tracert':
    case 'traceroute':
      return executeTraceroute(args, scenario, timestamp);
    case 'nslookup':
      return executeNslookup(args, scenario, timestamp);
    case 'ipconfig':
      return executeIpconfig(args, scenario, timestamp);
    case 'arp':
      return executeArp(args, scenario, timestamp);
    case 'netstat':
      return executeNetstat(args, scenario, timestamp);
    case 'route':
      return executeRoute(args, scenario, timestamp);
    default:
      return {
        command,
        args,
        output: `'${command}' is not recognized as an internal or external command.`,
        exitCode: 1,
        timestamp,
        hints: [],
        layerIndication: null,
        interpretation: 'Invalid command. Try: ping, tracert, nslookup, ipconfig, arp, netstat',
      };
  }
}

function executePing(
  args: string[],
  scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  const target = args[0] || 'localhost';
  const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target);

  // DNS failure scenarios (Layer 7)
  if (scenario.id === 'ts-01' || scenario.id === 'ts-23' || scenario.correctLayer === 7) {
    if (!isIP && target !== 'localhost') {
      return {
        command: 'ping',
        args,
        output: `Ping request could not find host ${target}. Please check the name and try again.`,
        exitCode: 1,
        timestamp,
        hints: [
          'DNS name resolution is failing',
          'Try ping with IP address instead',
          'This suggests a Layer 7 (Application) DNS issue',
        ],
        layerIndication: 7,
        interpretation: 'DNS resolution failure - Layer 7 issue. IP connectivity likely works.',
      };
    }
  }

  // Routing loop scenarios (Layer 3)
  if (scenario.id === 'ts-05' || scenario.id === 'ts-37') {
    return {
      command: 'ping',
      args,
      output: `Pinging ${target} with 32 bytes of data:
Reply from 10.0.0.1: TTL expired in transit.
Reply from 10.0.0.1: TTL expired in transit.
Reply from 10.0.0.1: TTL expired in transit.
Reply from 10.0.0.1: TTL expired in transit.

Ping statistics for ${target}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
      exitCode: 1,
      timestamp,
      hints: [
        'TTL expiring indicates packets circulating',
        'Check routing table with "tracert"',
        'This is a Layer 3 routing issue',
      ],
      layerIndication: 3,
      interpretation: 'TTL expired - routing loop or excessive hops (Layer 3 issue).',
    };
  }

  // Physical/Layer 1 failures
  if (scenario.correctLayer === 1) {
    return {
      command: 'ping',
      args,
      output: `Pinging ${target} with 32 bytes of data:
Request timed out.
Request timed out.
Request timed out.
Request timed out.

Ping statistics for ${target}:
    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),`,
      exitCode: 1,
      timestamp,
      hints: [
        'Complete packet loss - check physical connection',
        'Verify cable, link lights, and power',
        'This could be a Layer 1 (Physical) issue',
      ],
      layerIndication: 1,
      interpretation: '100% packet loss - likely physical layer connectivity issue.',
    };
  }

  // Success case (most scenarios with working Layer 3)
  return {
    command: 'ping',
    args,
    output: `Pinging ${isIP ? target : target + ' [192.168.1.50]'} with 32 bytes of data:
Reply from ${isIP ? target : '192.168.1.50'}: bytes=32 time=14ms TTL=64
Reply from ${isIP ? target : '192.168.1.50'}: bytes=32 time=12ms TTL=64
Reply from ${isIP ? target : '192.168.1.50'}: bytes=32 time=13ms TTL=64
Reply from ${isIP ? target : '192.168.1.50'}: bytes=32 time=15ms TTL=64

Ping statistics for ${target}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 12ms, Maximum = 15ms, Average = 13ms`,
    exitCode: 0,
    timestamp,
    hints: [
      'Ping successful - Layer 3 connectivity working',
      'IP addressing and routing are functional',
      'Problem is at a higher layer if connectivity works',
    ],
    layerIndication: 3,
    interpretation: 'Successful ping - Layers 1-3 are operational. Issue is at higher layers.',
  };
}

function executeTraceroute(
  args: string[],
  scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  const target = args[0] || '8.8.8.8';

  // Routing loop scenario
  if (scenario.id === 'ts-05' || scenario.id === 'ts-37') {
    return {
      command: 'tracert',
      args,
      output: `Tracing route to ${target} over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     2 ms     1 ms     2 ms  10.0.0.1
  3     3 ms     4 ms     3 ms  10.0.0.5
  4     5 ms     4 ms     5 ms  10.0.0.1  [LOOP DETECTED]
  5     6 ms     7 ms     6 ms  10.0.0.5  [LOOP DETECTED]
  6     8 ms     8 ms     8 ms  10.0.0.1  [LOOP DETECTED]
  7     *        *        *     Request timed out.

Trace complete.`,
      exitCode: 1,
      timestamp,
      hints: [
        'Notice packets cycling between same routers',
        'Routing loop at Layer 3',
        'Check routing table configuration',
      ],
      layerIndication: 3,
      interpretation: 'Routing loop detected - packets cycling between routers (Layer 3 issue).',
    };
  }

  // Normal traceroute
  return {
    command: 'tracert',
    args,
    output: `Tracing route to ${target} over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     5 ms     4 ms     5 ms  10.0.0.1
  3    12 ms    11 ms    13 ms  172.16.0.1
  4    18 ms    19 ms    17 ms  ${target}

Trace complete.`,
    exitCode: 0,
    timestamp,
    hints: [
      'Traceroute shows hop-by-hop path',
      'All hops responding - routing works',
      'Layer 3 connectivity is functional',
    ],
    layerIndication: 3,
    interpretation: 'Clean traceroute - routing is working correctly. No Layer 3 issues.',
  };
}

function executeNslookup(
  args: string[],
  scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  const target = args[0] || 'www.example.com';
  const dnsServer = args[1];

  // DNS failure scenarios
  if (scenario.id === 'ts-01' || scenario.id === 'ts-23' || scenario.id === 'ts-32') {
    if (!dnsServer || dnsServer === '192.168.1.10') {
      return {
        command: 'nslookup',
        args,
        output: `DNS request timed out.
    timeout was 2 seconds.
Server:  UnKnown
Address:  192.168.1.10

*** Request to UnKnown timed-out`,
        exitCode: 1,
        timestamp,
        hints: [
          'DNS server not responding',
          'Try alternate DNS: nslookup www.example.com 8.8.8.8',
          'This is a Layer 7 DNS service failure',
        ],
        layerIndication: 7,
        interpretation: 'DNS server timeout - Layer 7 application service failure.',
      };
    }
  }

  // Successful DNS query
  return {
    command: 'nslookup',
    args,
    output: `Server:  google-public-dns-a.google.com
Address:  8.8.8.8

Non-authoritative answer:
Name:    ${target}
Address:  93.184.216.34`,
    exitCode: 0,
    timestamp,
    hints: [
      'DNS resolution successful',
      'Alternate DNS server working',
      'Original DNS server likely has issues',
    ],
    layerIndication: 7,
    interpretation: 'DNS working with alternate server - original DNS server failure.',
  };
}

function executeIpconfig(
  args: string[],
  _scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  const showAll = args.includes('/all');

  if (showAll) {
    return {
      command: 'ipconfig',
      args,
      output: `Windows IP Configuration

Ethernet adapter Local Area Connection:

   Connection-specific DNS Suffix  . : example.com
   Description . . . . . . . . . . . : Intel(R) Ethernet Connection
   Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.100(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.10
                                       8.8.8.8
   Lease Obtained. . . . . . . . . . : Sunday, November 1, 2025 10:00:00 AM
   Lease Expires . . . . . . . . . . : Monday, November 2, 2025 10:00:00 AM`,
      exitCode: 0,
      timestamp,
      hints: [
        'IP configuration shows network settings',
        'Note DNS server: 192.168.1.10',
        'Check if DNS server is reachable',
      ],
      layerIndication: 3,
      interpretation: 'IP configuration is valid - Layer 3 addressing is correct.',
    };
  }

  return {
    command: 'ipconfig',
    args,
    output: `Windows IP Configuration

Ethernet adapter Local Area Connection:

   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`,
    exitCode: 0,
    timestamp,
    hints: [
      'Basic IP configuration shown',
      'Use "ipconfig /all" for detailed info',
      'IP addressing appears correct',
    ],
    layerIndication: 3,
    interpretation: 'IP addressing configured correctly - Layer 3 configuration is valid.',
  };
}

function executeArp(
  args: string[],
  scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  // ARP poisoning scenario
  if (scenario.id === 'ts-12') {
    return {
      command: 'arp',
      args,
      output: `Interface: 192.168.1.100 --- 0x2
  Internet Address      Physical Address      Type
  192.168.1.1           aa-bb-cc-dd-ee-ff     dynamic
  192.168.1.1           11-22-33-44-55-66     dynamic  [DUPLICATE!]
  192.168.1.50          00-1a-2b-3c-4d-5e     dynamic
  224.0.0.22            01-00-5e-00-00-16     static`,
      exitCode: 0,
      timestamp,
      hints: [
        'Duplicate MAC addresses for same IP!',
        'This indicates ARP poisoning attack',
        'Layer 2 security issue',
      ],
      layerIndication: 2,
      interpretation: 'ARP cache poisoning detected - Layer 2 security attack.',
    };
  }

  // Normal ARP table
  return {
    command: 'arp',
    args,
    output: `Interface: 192.168.1.100 --- 0x2
  Internet Address      Physical Address      Type
  192.168.1.1           aa-bb-cc-dd-ee-ff     dynamic
  192.168.1.10          00-11-22-33-44-55     dynamic
  192.168.1.50          00-1a-2b-3c-4d-5e     dynamic
  224.0.0.22            01-00-5e-00-00-16     static`,
    exitCode: 0,
    timestamp,
    hints: [
      'ARP cache shows IP to MAC mappings',
      'No duplicate entries - ARP is healthy',
      'Layer 2 address resolution working',
    ],
    layerIndication: 2,
    interpretation: 'ARP table is normal - Layer 2 address resolution working correctly.',
  };
}

function executeNetstat(
  args: string[],
  scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  // Port blocking scenario
  if (scenario.id === 'ts-10' || scenario.correctLayer === 4) {
    return {
      command: 'netstat',
      args,
      output: `Active Connections

  Proto  Local Address          Foreign Address        State           PID
  TCP    192.168.1.100:49152    93.184.216.34:80       ESTABLISHED     1234
  TCP    192.168.1.100:49153    93.184.216.34:443      TIME_WAIT       0
  TCP    192.168.1.100:49154    93.184.216.34:443      SYN_SENT        5678

Note: Port 443 connections timing out`,
      exitCode: 0,
      timestamp,
      hints: [
        'Port 80 (HTTP) works, Port 443 (HTTPS) stuck in SYN_SENT',
        'This is a Layer 4 port blocking issue',
        'Firewall likely blocking port 443',
      ],
      layerIndication: 4,
      interpretation: 'Port 443 blocked - Layer 4 transport layer filtering (firewall).',
    };
  }

  // Normal netstat
  return {
    command: 'netstat',
    args,
    output: `Active Connections

  Proto  Local Address          Foreign Address        State           PID
  TCP    192.168.1.100:49152    93.184.216.34:80       ESTABLISHED     1234
  TCP    192.168.1.100:49153    93.184.216.34:443      ESTABLISHED     5678
  TCP    192.168.1.100:49154    8.8.8.8:53             TIME_WAIT       0
  TCP    [::]:445               [::]:0                 LISTENING       4`,
    exitCode: 0,
    timestamp,
    hints: [
      'Active connections shown',
      'Ports and states visible',
      'Layer 4 transport connections active',
    ],
    layerIndication: 4,
    interpretation: 'Connections active - Layer 4 transport layer functioning normally.',
  };
}

function executeRoute(
  args: string[],
  scenario: TroubleshootingScenario,
  timestamp: Date
): CommandOutput {
  // Routing issue scenario
  if (scenario.id === 'ts-05' || scenario.id === 'ts-44') {
    return {
      command: 'route',
      args,
      output: `===========================================================================
Interface List
  2...00 1a 2b 3c 4d 5e ......Intel(R) Ethernet
===========================================================================

IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      192.168.1.1   192.168.1.100     25
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
      192.168.1.0    255.255.255.0         On-link    192.168.1.100    281
===========================================================================
Note: Default gateway route may be missing or incorrect`,
      exitCode: 0,
      timestamp,
      hints: [
        'Check default gateway (0.0.0.0) route',
        'Missing routes can cause connectivity issues',
        'Layer 3 routing configuration problem',
      ],
      layerIndication: 3,
      interpretation: 'Routing table shows configuration - check for missing routes (Layer 3).',
    };
  }

  // Normal routing table
  return {
    command: 'route',
    args,
    output: `===========================================================================
IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      192.168.1.1   192.168.1.100     25
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
      192.168.1.0    255.255.255.0         On-link    192.168.1.100    281
===========================================================================
Persistent Routes:
  None`,
    exitCode: 0,
    timestamp,
    hints: [
      'Routing table looks normal',
      'Default gateway configured correctly',
      'Layer 3 routing should be working',
    ],
    layerIndication: 3,
    interpretation: 'Routing table is properly configured - Layer 3 routing functional.',
  };
}

export function parseCommand(input: string): { command: string; args: string[] } {
  const parts = input.trim().split(/\s+/);
  const command = parts[0] || '';
  const args = parts.slice(1);
  return { command, args };
}
