/**
 * Cloud cost calculator and exam question templates
 */

import type { CostCalculatorInputs, ExamQuestion } from '../types';

export const COST_CALCULATOR_INPUTS: CostCalculatorInputs = {
  'Small website': { compute: 50, storage: 5, bandwidth: 10, monthly: '65' },
  'Medium app': { compute: 300, storage: 100, bandwidth: 50, monthly: '450' },
  'Enterprise system': { compute: 2000, storage: 1000, bandwidth: 500, monthly: '3500' },
};

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    question:
      'A company needs to deploy applications but does not want to manage servers. Which service model is best?',
    options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],
    correct: 'PaaS',
    explanation:
      'PaaS provides a platform without server management - you deploy code and the platform handles infrastructure.',
  },
  {
    id: 'q2',
    question: 'What is the primary advantage of hybrid cloud for regulated industries?',
    options: [
      'Unlimited scalability',
      'Meeting data residency requirements',
      'Cost reduction',
      'Simplified management',
    ],
    correct: 'Meeting data residency requirements',
    explanation:
      'Hybrid clouds allow sensitive data to remain on-premises (meeting regulations) while using public cloud for other workloads.',
  },
  {
    id: 'q3',
    question: 'Which cloud concept allows automatic resource adjustment based on demand?',
    options: ['Scalability', 'Elasticity', 'Multitenancy', 'Virtualization'],
    correct: 'Elasticity',
    explanation:
      'Elasticity is automatic scaling based on real-time demand, while scalability is the capacity to handle increased load.',
  },
  {
    id: 'q4',
    question: 'In a multi-tenant cloud environment, how is customer data isolated?',
    options: [
      'Separate physical servers',
      'Separate cloud regions',
      'Logical separation through VPCs and security groups',
      'Only encryption',
    ],
    correct: 'Logical separation through VPCs and security groups',
    explanation:
      'Multi-tenant clouds use logical isolation (VPCs, network policies) to separate customer data in shared infrastructure.',
  },
];
