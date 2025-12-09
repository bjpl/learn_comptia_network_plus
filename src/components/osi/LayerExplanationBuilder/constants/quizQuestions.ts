import type { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    layer: 7,
    question: 'Which of these is an application layer protocol?',
    correctAnswer: 'HTTP',
    options: ['HTTP', 'IP', 'Ethernet', 'TCP'],
  },
  {
    id: 'q2',
    layer: 4,
    question: 'Which transport protocol provides reliable delivery?',
    correctAnswer: 'TCP',
    options: ['TCP', 'IP', 'ICMP', 'ARP'],
  },
  {
    id: 'q3',
    layer: 3,
    question: 'Which protocol is used for IP address resolution?',
    correctAnswer: 'ARP',
    options: ['ARP', 'DNS', 'DHCP', 'IGMP'],
  },
  {
    id: 'q4',
    layer: 2,
    question: 'What is the PDU at the Data Link layer called?',
    correctAnswer: 'Frame',
    options: ['Frame', 'Packet', 'Segment', 'Bit'],
  },
  {
    id: 'q5',
    layer: 1,
    question: 'Layer 1 deals with what type of signals?',
    correctAnswer: 'Electrical/Optical',
    options: ['Electrical/Optical', 'IP Addresses', 'MAC Addresses', 'Applications'],
  },
  {
    id: 'q6',
    layer: 6,
    question: 'Which is a function of the Presentation layer?',
    correctAnswer: 'Data encryption',
    options: ['Data encryption', 'IP addressing', 'Routing', 'Frame creation'],
  },
];
