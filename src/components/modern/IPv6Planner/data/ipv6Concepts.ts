/**
 * IPv6 educational concepts and quiz data
 */

import type { IPv6Question } from '../types';

export const ipv6Questions: IPv6Question[] = [
  {
    id: 'q1',
    question: 'What is the standard length of an IPv6 address?',
    options: ['32 bits', '64 bits', '128 bits', '256 bits'],
    correct: 2,
    explanation:
      'IPv6 addresses are 128 bits long, expressed as 8 groups of 4 hexadecimal digits.',
    category: 'format',
  },
  {
    id: 'q2',
    question: 'Which of the following is a valid IPv6 address format?',
    options: [
      '2001.db8.0.0.0.0.0.1',
      '2001:db8::1',
      '2001-db8-0-0-0-0-0-1',
      '2001.db8.0000.0000.0000.0000.0000.0001',
    ],
    correct: 1,
    explanation: 'IPv6 addresses use colons (:) as separators and support zero compression (::).',
    category: 'format',
  },
  {
    id: 'q3',
    question: 'What does the :: notation represent in IPv6?',
    options: [
      'Physical port connection',
      'Consecutive groups of zeros',
      'Broadcast address',
      'Network mask boundary',
    ],
    correct: 1,
    explanation:
      'The :: notation (zero compression) represents one or more consecutive groups of zeros and can be used once per address.',
    category: 'format',
  },
  {
    id: 'q4',
    question: 'Which IPv6 address type is used for one-to-one communication?',
    options: ['Multicast', 'Anycast', 'Unicast', 'Broadcast'],
    correct: 2,
    explanation:
      'Unicast addresses identify a single interface. Multicast is one-to-many, Anycast is one-to-nearest, and IPv6 has no broadcast.',
    category: 'types',
  },
  {
    id: 'q5',
    question: 'What is the IPv6 multicast address prefix?',
    options: ['fe80::/10', 'ff00::/8', 'fc00::/7', '2000::/3'],
    correct: 1,
    explanation:
      'IPv6 multicast addresses begin with ff00::/8. fe80 is link-local, fc00 is unique local, 2000 is global unicast.',
    category: 'types',
  },
  {
    id: 'q6',
    question: 'Which address type is equivalent to IPv4 private addresses?',
    options: [
      'Link-Local (fe80::/10)',
      'Unique Local (fc00::/7)',
      'Global Unicast (2000::/3)',
      'Loopback (::1)',
    ],
    correct: 1,
    explanation:
      'Unique Local addresses (fc00::/7) are equivalent to IPv4 private addresses (RFC 1918). Link-local are only on-link.',
    category: 'types',
  },
  {
    id: 'q7',
    question: 'How many IPv6 subnets can a /48 prefix provide when creating /64 subnets?',
    options: ['256', '512', '65536', '16777216'],
    correct: 2,
    explanation:
      'A /48 to /64 gives you 16 additional bits (64-48=16), providing 2^16 = 65,536 subnets.',
    category: 'subnetting',
  },
  {
    id: 'q8',
    question: 'What is the purpose of the prefix length in IPv6 notation?',
    options: [
      'Identify the version number',
      'Specify network and host portions',
      'Enable address compression',
      'Mark the traffic class',
    ],
    correct: 1,
    explanation:
      'The prefix length (e.g., /64) specifies how many bits identify the network, with the remainder for hosts.',
    category: 'subnetting',
  },
  {
    id: 'q9',
    question: 'Which transition mechanism creates IPv6 tunnels over IPv4 networks?',
    options: ['Dual Stack', '6to4 Tunneling', 'NAT64', 'ISATAP'],
    correct: 1,
    explanation:
      '6to4, Teredo, and ISATAP are tunneling mechanisms. Dual Stack runs both simultaneously. NAT64 translates addresses.',
    category: 'transition',
  },
  {
    id: 'q10',
    question: 'What is the primary advantage of Dual Stack migration?',
    options: [
      'Reduces bandwidth usage',
      'Allows gradual transition with backward compatibility',
      'Eliminates IPv4 immediately',
      'Reduces address space needs',
    ],
    correct: 1,
    explanation:
      'Dual Stack enables running IPv4 and IPv6 simultaneously, allowing organizations to migrate at their own pace.',
    category: 'transition',
  },
];
