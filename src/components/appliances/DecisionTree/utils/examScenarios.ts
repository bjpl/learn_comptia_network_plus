import type { ExamScenario } from '../types';

export const examScenarios: ExamScenario[] = [
  {
    title: 'Branch Office Connectivity',
    description:
      'A small branch office needs to connect to headquarters with redundancy and VPN termination.',
    answer: 'cisco-isr-4331',
    reasoning: 'ISR routers are purpose-built for branch connectivity with built-in VPN support.',
  },
  {
    title: 'Cost-Conscious Firewall Deployment',
    description:
      'Budget is tight ($2K-5K) but you need advanced security features and existing virtualization.',
    answer: 'pfsense-virtual',
    reasoning:
      'Virtual appliances offer zero hardware cost and advanced features at a fraction of physical prices.',
  },
  {
    title: 'Enterprise Data Center',
    description: 'Deploy high-density PoE switches for campus network with 100+ devices.',
    answer: 'cisco-catalyst-9300',
    reasoning:
      'Catalyst 9300 provides 48+ PoE ports, high throughput, and enterprise-grade reliability.',
  },
];
