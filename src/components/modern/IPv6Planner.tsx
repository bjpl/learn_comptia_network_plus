import React, { useState } from 'react';
import type {
  IPv6MigrationScenario,
  MigrationMethod,
  MigrationPlan,
  MigrationPhase,
  SuccessMetric,
} from './modern-types';
import { migrationScenarios } from './modern-data';

interface IPv6Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: 'format' | 'types' | 'subnetting' | 'transition';
}

interface SubnettingResult {
  network: string;
  prefix: string;
  hostBits: number;
  hostsPerSubnet: number;
  firstHost: string;
  lastHost: string;
  broadcast: string;
}

const IPv6Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'migration' | 'fundamentals' | 'subnetting' | 'practice'
  >('migration');
  const [selectedScenario, setSelectedScenario] = useState<IPv6MigrationScenario | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MigrationMethod>('dual-stack');
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan | null>(null);
  const [activePhase, setActivePhase] = useState<number>(0);
  const [subnettingInput, setSubnettingInput] = useState<string>('2001:db8::/32');
  const [subnettingResult, setSubnettingResult] = useState<SubnettingResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const methodInfo = {
    'dual-stack': {
      name: 'Dual Stack',
      description: 'Run IPv4 and IPv6 simultaneously on all network devices',
      pros: [
        'Maximum compatibility with legacy systems',
        'Gradual transition without disruption',
        'Native IPv6 performance where supported',
      ],
      cons: [
        'Doubled address management overhead',
        'Requires IPv6 support on all devices',
        'Indefinite IPv4 maintenance costs',
      ],
      complexity: 'medium',
    },
    tunneling: {
      name: 'Tunneling (6to4, Teredo, ISATAP)',
      description: 'Encapsulate IPv6 traffic within IPv4 packets',
      pros: [
        'Works across IPv4-only infrastructure',
        'Enables IPv6 without infrastructure upgrade',
        'Multiple tunnel types for different scenarios',
      ],
      cons: [
        'Performance overhead from encapsulation',
        'MTU issues and fragmentation',
        'Complex troubleshooting',
      ],
      complexity: 'high',
    },
    nat64: {
      name: 'NAT64 Translation',
      description: 'Translate between IPv6-only and IPv4-only networks',
      pros: [
        'Enable IPv6-only internal networks',
        'Simplified address management',
        'Reduced IPv4 dependency',
      ],
      cons: [
        'Application compatibility issues',
        'IPsec incompatibility',
        'Central gateway bottleneck',
      ],
      complexity: 'high',
    },
    hybrid: {
      name: 'Hybrid Approach',
      description: 'Combine multiple migration methods strategically',
      pros: [
        'Optimized for specific use cases',
        'Flexibility for complex environments',
        'Balanced trade-offs',
      ],
      cons: ['Increased complexity', 'Higher management overhead', 'Requires careful planning'],
      complexity: 'critical',
    },
  };

  const generateMigrationPlan = () => {
    if (!selectedScenario) {
      return;
    }

    const phases: MigrationPhase[] = [];
    const now = new Date();

    // Phase 1: Assessment and Planning
    phases.push({
      id: 'phase-1',
      name: 'Assessment and Planning',
      method: selectedMethod,
      duration: 30,
      cost: 25000,
      dependencies: [],
      tasks: [
        {
          id: 'task-1-1',
          description: 'Inventory all network devices and assess IPv6 capability',
          method: selectedMethod,
          duration: 7,
          resources: ['Network team', 'Asset management system'],
          validation: ['Complete device inventory', 'IPv6 capability matrix'],
          completed: false,
        },
        {
          id: 'task-1-2',
          description: 'Assess application IPv6 readiness',
          method: selectedMethod,
          duration: 14,
          resources: ['Application team', 'Testing environment'],
          validation: ['Application compatibility report', 'Upgrade requirements list'],
          completed: false,
        },
        {
          id: 'task-1-3',
          description: 'Develop migration strategy and timeline',
          method: selectedMethod,
          duration: 7,
          resources: ['Project manager', 'Architecture team'],
          validation: ['Approved migration plan', 'Budget allocation'],
          completed: false,
        },
        {
          id: 'task-1-4',
          description: 'Staff training on IPv6 concepts and operations',
          method: selectedMethod,
          duration: 14,
          resources: ['Training provider', 'Technical staff'],
          validation: ['Training completion certificates', 'Knowledge assessment'],
          completed: false,
        },
      ],
      risks: [
        {
          description: 'Incomplete inventory leads to missed devices',
          probability: 'medium',
          impact: 'high',
          mitigation: 'Use automated discovery tools and manual verification',
        },
        {
          description: 'Underestimated application compatibility issues',
          probability: 'high',
          impact: 'high',
          mitigation: 'Thorough testing in non-production environment',
        },
      ],
    });

    // Phase 2: Infrastructure Preparation
    if (selectedMethod === 'dual-stack' || selectedMethod === 'hybrid') {
      phases.push({
        id: 'phase-2',
        name: 'Infrastructure Preparation (Dual Stack)',
        method: 'dual-stack',
        duration: 60,
        cost: 150000,
        dependencies: ['phase-1'],
        tasks: [
          {
            id: 'task-2-1',
            description: 'Upgrade/replace non-IPv6-capable network devices',
            method: 'dual-stack',
            duration: 30,
            resources: ['Hardware budget', 'Installation team'],
            validation: ['All critical devices IPv6-capable', 'Configuration backups'],
            completed: false,
          },
          {
            id: 'task-2-2',
            description: 'Configure IPv6 addressing scheme and subnets',
            method: 'dual-stack',
            duration: 14,
            resources: ['Network architects', 'IP address management system'],
            validation: ['IPv6 addressing plan document', 'IPAM configuration'],
            completed: false,
          },
          {
            id: 'task-2-3',
            description: 'Enable IPv6 on core routing infrastructure',
            method: 'dual-stack',
            duration: 7,
            resources: ['Network engineers', 'Change control approval'],
            validation: ['IPv6 routing operational', 'Connectivity tests passed'],
            completed: false,
          },
          {
            id: 'task-2-4',
            description: 'Update DNS for dual-stack (A and AAAA records)',
            method: 'dual-stack',
            duration: 7,
            resources: ['DNS team', 'DNS management tools'],
            validation: ['AAAA records published', 'DNS resolution tests'],
            completed: false,
          },
        ],
        risks: [
          {
            description: 'Hardware procurement delays',
            probability: 'medium',
            impact: 'high',
            mitigation: 'Order long-lead items early, identify alternatives',
          },
          {
            description: 'Configuration errors cause outages',
            probability: 'medium',
            impact: 'high',
            mitigation: 'Test in lab, implement during maintenance windows',
          },
        ],
      });
    }

    // Phase 3: Pilot Deployment
    phases.push({
      id: 'phase-3',
      name: 'Pilot Deployment',
      method: selectedMethod,
      duration: 45,
      cost: 50000,
      dependencies: phases.length > 1 ? ['phase-2'] : ['phase-1'],
      tasks: [
        {
          id: 'task-3-1',
          description: 'Select pilot group (single location or department)',
          method: selectedMethod,
          duration: 3,
          resources: ['Project team', 'Business stakeholders'],
          validation: ['Pilot scope defined', 'Success criteria established'],
          completed: false,
        },
        {
          id: 'task-3-2',
          description: `Deploy ${methodInfo[selectedMethod].name} to pilot group`,
          method: selectedMethod,
          duration: 21,
          resources: ['Implementation team', 'Support staff'],
          validation: [
            'IPv6 connectivity operational',
            'All applications functional',
            'Performance metrics baseline',
          ],
          completed: false,
        },
        {
          id: 'task-3-3',
          description: 'Monitor and troubleshoot pilot deployment',
          method: selectedMethod,
          duration: 14,
          resources: ['NOC team', 'Monitoring tools'],
          validation: ['Issue log', 'Performance data', 'User feedback'],
          completed: false,
        },
        {
          id: 'task-3-4',
          description: 'Evaluate pilot results and adjust plan',
          method: selectedMethod,
          duration: 7,
          resources: ['Project team', 'Stakeholders'],
          validation: ['Pilot evaluation report', 'Updated migration plan'],
          completed: false,
        },
      ],
      risks: [
        {
          description: 'Pilot group experiences service disruption',
          probability: 'medium',
          impact: 'high',
          mitigation: 'Comprehensive testing, rapid rollback capability',
        },
        {
          description: 'Undiscovered application compatibility issues',
          probability: 'high',
          impact: 'medium',
          mitigation: 'Careful monitoring, quick issue resolution',
        },
      ],
    });

    // Phase 4: Full Deployment
    const fullDeploymentDuration =
      selectedScenario.complexity === 'high'
        ? 180
        : selectedScenario.complexity === 'medium'
          ? 120
          : 90;
    phases.push({
      id: 'phase-4',
      name: 'Full Network Deployment',
      method: selectedMethod,
      duration: fullDeploymentDuration,
      cost: 200000,
      dependencies: ['phase-3'],
      tasks: [
        {
          id: 'task-4-1',
          description: 'Deploy to remaining locations in phases',
          method: selectedMethod,
          duration: fullDeploymentDuration - 30,
          resources: ['Implementation team', 'Site coordinators'],
          validation: ['All sites migrated', 'Connectivity verified'],
          completed: false,
        },
        {
          id: 'task-4-2',
          description: 'Update security policies and firewall rules for IPv6',
          method: selectedMethod,
          duration: 14,
          resources: ['Security team', 'Firewall administrators'],
          validation: ['IPv6 security policies deployed', 'Security audit passed'],
          completed: false,
        },
        {
          id: 'task-4-3',
          description: 'Monitor traffic patterns and performance',
          method: selectedMethod,
          duration: 30,
          resources: ['Network operations', 'Analytics tools'],
          validation: ['Traffic analysis reports', 'Performance benchmarks'],
          completed: false,
        },
      ],
      risks: [
        {
          description: 'Scale introduces unforeseen issues',
          probability: 'medium',
          impact: 'high',
          mitigation: 'Gradual rollout with monitoring between phases',
        },
        {
          description: 'Resource constraints slow deployment',
          probability: 'high',
          impact: 'medium',
          mitigation: 'Prioritize critical locations, adjust timeline as needed',
        },
      ],
    });

    // Calculate timeline
    const totalDays = phases.reduce((sum, phase) => sum + phase.duration, 0);
    const startDate = new Date(now);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays);

    // Calculate budget
    const hardwareCost =
      selectedMethod === 'dual-stack' ? 200000 : selectedMethod === 'tunneling' ? 50000 : 100000;
    const softwareCost = 75000;
    const trainingCost = 50000;
    const consultingCost = 100000;

    // Success metrics
    const successMetrics: SuccessMetric[] = [
      {
        name: 'IPv6 Traffic Percentage',
        target: 80,
        unit: '%',
        measurement: 'Network monitoring',
        priority: 'high',
      },
      {
        name: 'Application Availability',
        target: 99.9,
        unit: '%',
        measurement: 'Application monitoring',
        priority: 'high',
      },
      {
        name: 'IPv4 Address Utilization Reduction',
        target: 50,
        unit: '%',
        measurement: 'IPAM reports',
        priority: 'medium',
      },
      {
        name: 'Network Latency',
        target: 0,
        unit: 'ms increase',
        measurement: 'Performance monitoring',
        priority: 'high',
      },
      {
        name: 'Security Incidents',
        target: 0,
        unit: 'incidents',
        measurement: 'Security monitoring',
        priority: 'high',
      },
    ];

    // Consolidated risks
    const allRisks = phases.flatMap((phase) => phase.risks);

    const plan: MigrationPlan = {
      scenarioId: selectedScenario.id,
      method: selectedMethod,
      phases,
      timeline: {
        start: startDate,
        end: endDate,
        totalDays,
      },
      budget: {
        hardware: hardwareCost,
        software: softwareCost,
        training: trainingCost,
        consulting: consultingCost,
        total: hardwareCost + softwareCost + trainingCost + consultingCost,
      },
      successMetrics,
      riskAssessment: allRisks,
    };

    setMigrationPlan(plan);
    setActivePhase(0);
  };

  const getRiskColor = (probability: string, impact: string): string => {
    const score =
      (probability === 'high' ? 3 : probability === 'medium' ? 2 : 1) +
      (impact === 'critical' ? 4 : impact === 'high' ? 3 : impact === 'medium' ? 2 : 1);
    if (score >= 6) {
      return 'bg-red-100 border-red-500';
    }
    if (score >= 4) {
      return 'bg-yellow-100 border-yellow-500';
    }
    return 'bg-green-100 border-green-500';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateIPv6Subnetting = (input: string) => {
    const [address, prefixStr] = input.split('/');
    const prefix = parseInt(prefixStr, 10);

    if (isNaN(prefix) || prefix < 0 || prefix > 128) {
      alert('Invalid prefix. Use 0-128 for IPv6.');
      return;
    }

    const hostBits = 128 - prefix;
    const hostsPerSubnet = Math.pow(2, hostBits) - 1;

    const result: SubnettingResult = {
      network: address,
      prefix: `/${prefix}`,
      hostBits,
      hostsPerSubnet: Math.floor(hostsPerSubnet),
      firstHost: `${address}::1`,
      lastHost: `${address}::ffff:ffff:ffff:ffff`,
      broadcast: `${address}::ffff:ffff:ffff:ffff`,
    };

    setSubnettingResult(result);
  };

  const ipv6Questions: IPv6Question[] = [
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

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < ipv6Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const calculateScore = (): number => {
    const correct = answers.filter((answer, idx) => answer === ipv6Questions[idx].correct).length;
    return Math.round((correct / ipv6Questions.length) * 100);
  };

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Component 19: IPv6 Planner - Complete Learning Tool
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Master IPv6 fundamentals, address types, subnetting, transition strategies, and exam
          practice.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('migration')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'migration'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          Migration Planner
        </button>
        <button
          onClick={() => setActiveTab('fundamentals')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'fundamentals'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          IPv6 Fundamentals
        </button>
        <button
          onClick={() => setActiveTab('subnetting')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'subnetting'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          Subnetting Calculator
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'practice'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          Exam Practice
        </button>
      </div>

      {/* Fundamentals Tab */}
      {activeTab === 'fundamentals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* IPv6 Format */}
            <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-blue-900 dark:text-blue-100">
                IPv6 Address Format
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <div className="font-semibold">Standard Notation</div>
                  <div className="font-mono text-blue-600">
                    2001:0db8:85a3:0000:0000:8a2e:0370:7334
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Compressed (Leading Zeros)</div>
                  <div className="font-mono text-blue-600">2001:db8:85a3:0:0:8a2e:370:7334</div>
                </div>
                <div>
                  <div className="font-semibold">Full Zero Compression (::)</div>
                  <div className="font-mono text-blue-600">2001:db8:85a3::8a2e:370:7334</div>
                </div>
                <div className="border-t border-blue-300 pt-3">
                  <div className="font-semibold text-blue-900 dark:text-blue-100">Key Points</div>
                  <ul className="mt-2 space-y-1">
                    <li>128 bits total (8 groups of 16 bits)</li>
                    <li>Hexadecimal notation (0-9, a-f)</li>
                    <li>:: used once to compress zeros</li>
                    <li>Case-insensitive</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Address Types */}
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-green-900 dark:text-green-100">
                IPv6 Address Types
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-green-700 dark:text-green-300">
                    Unicast (2000::/3)
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">One-to-one communication</div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-orange-700 dark:text-orange-300">
                    Multicast (ff00::/8)
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">One-to-many communication</div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-purple-700 dark:text-purple-300">
                    Anycast (within Global)
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    One-to-nearest communication
                  </div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-blue-700 dark:text-blue-300">
                    Link-Local (fe80::/10)
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Auto-configured, on-link only
                  </div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-red-700 dark:text-red-300">
                    Unique Local (fc00::/7)
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Private, equivalent to RFC 1918
                  </div>
                </div>
              </div>
            </div>

            {/* Subnetting Reference */}
            <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-purple-900 dark:text-purple-100">
                Subnetting Reference
              </h3>
              <div className="space-y-2 font-mono text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
                  <span>/32</span>
                  <span className="text-purple-600 dark:text-purple-300">
                    Typical ISP allocation
                  </span>
                </div>
                <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
                  <span>/48</span>
                  <span className="text-purple-600 dark:text-purple-300">
                    Organization allocation
                  </span>
                </div>
                <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
                  <span>/56</span>
                  <span className="text-purple-600 dark:text-purple-300">
                    Subnet allocation (256 /64s)
                  </span>
                </div>
                <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
                  <span>/64</span>
                  <span className="text-purple-600 dark:text-purple-300">Standard LAN/subnet</span>
                </div>
                <div className="mt-3 border-t border-purple-300 pt-3 text-xs text-purple-900 dark:text-purple-100">
                  <div className="font-semibold">
                    Formula: Subnets = 2^(new_prefix - old_prefix)
                  </div>
                </div>
              </div>
            </div>

            {/* Transition Methods */}
            <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-orange-900 dark:text-orange-100">
                Transition Methods
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-orange-700 dark:text-orange-300">
                    Dual Stack
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Run IPv4 and IPv6 simultaneously
                  </div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-orange-700 dark:text-orange-300">
                    6to4 Tunneling
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    IPv6 over IPv4, address-based
                  </div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-orange-700 dark:text-orange-300">Teredo</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    IPv6 through NAT and firewalls
                  </div>
                </div>
                <div className="rounded bg-white p-2 dark:bg-gray-700">
                  <div className="font-semibold text-orange-700 dark:text-orange-300">
                    NAT64/DNS64
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Address/protocol translation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subnetting Calculator Tab */}
      {activeTab === 'subnetting' && (
        <div className="space-y-6">
          <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
              IPv6 Subnetting Calculator
            </h3>
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                value={subnettingInput}
                onChange={(e) => setSubnettingInput(e.target.value)}
                placeholder="e.g., 2001:db8::/32"
                className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-mono text-sm focus:border-green-500 focus:outline-none"
              />
              <button
                onClick={() => calculateIPv6Subnetting(subnettingInput)}
                className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700"
              >
                Calculate
              </button>
            </div>

            {subnettingResult && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Network Address</div>
                  <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {subnettingResult.network}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Prefix Length</div>
                  <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {subnettingResult.prefix}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Host Bits</div>
                  <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {subnettingResult.hostBits}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Hosts</div>
                  <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    2^{subnettingResult.hostBits} - 1
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400">First Address</div>
                  <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {subnettingResult.firstHost}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Last Address</div>
                  <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {subnettingResult.lastHost}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Practice Questions Tab */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {!showResults ? (
            <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  IPv6 Exam Practice Questions
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Question {currentQuestion + 1} of {ipv6Questions.length}
                </div>
              </div>

              <div className="mb-6 w-full bg-gray-300">
                <div
                  className="h-2 bg-blue-600 transition-all"
                  style={{ width: `${((currentQuestion + 1) / ipv6Questions.length) * 100}%` }}
                />
              </div>

              <div className="mb-8">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {ipv6Questions[currentQuestion].question}
                </h4>
                <div className="space-y-3">
                  {ipv6Questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        answers[currentQuestion] === idx
                          ? 'border-blue-600 bg-blue-100 dark:bg-blue-900'
                          : 'border-gray-300 bg-white hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center text-gray-900 dark:text-gray-100">
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            answers[currentQuestion] === idx
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-400'
                          }`}
                        >
                          {answers[currentQuestion] === idx && <span className="text-xs">✓</span>}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:border-gray-400 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="ml-auto rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {currentQuestion === ipv6Questions.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
              <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Quiz Results
              </h3>
              <div className="mb-8 text-center">
                <div className="text-5xl font-bold text-green-600">{calculateScore()}%</div>
                <div className="mt-2 text-gray-700 dark:text-gray-300">
                  {answers.filter((answer, idx) => answer === ipv6Questions[idx].correct).length}{' '}
                  out of {ipv6Questions.length} correct
                </div>
              </div>

              <div className="mb-8 space-y-4">
                {ipv6Questions.map((q, idx) => {
                  const isCorrect = answers[idx] === q.correct;
                  return (
                    <div
                      key={q.id}
                      className={`rounded-lg border-l-4 p-4 ${
                        isCorrect
                          ? 'border-l-green-600 bg-white dark:bg-gray-800'
                          : 'border-l-red-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 dark:text-gray-100">
                            {q.question}
                          </div>
                          <div
                            className={`mt-2 text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </div>
                        </div>
                        <span
                          className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="mt-3 border-t border-gray-300 pt-3 text-sm text-gray-700 dark:text-gray-300">
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                          Explanation:
                        </div>
                        <div>{q.explanation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={resetQuiz}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Migration Planner Tab */}
      {activeTab === 'migration' && (
        <div className="space-y-6">
          {/* Scenario Selection */}
          <div className="mb-6">
            <h3 className="mb-3 text-xl font-semibold">Select Migration Scenario</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {migrationScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedScenario?.id === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="font-semibold text-gray-800">{scenario.name}</div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        scenario.complexity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : scenario.complexity === 'high'
                            ? 'bg-orange-100 text-orange-700'
                            : scenario.complexity === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {scenario.complexity}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">{scenario.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Devices:</span>{' '}
                      <span className="font-semibold">{scenario.currentState.devices}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Subnets:</span>{' '}
                      <span className="font-semibold">{scenario.currentState.subnets}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">IPv6 Ready:</span>{' '}
                      <span className="font-semibold">
                        {scenario.currentState.infrastructure.routers.ipv6Capable}/
                        {scenario.currentState.infrastructure.routers.total} routers
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Constraints:</span>{' '}
                      <span className="font-semibold">{scenario.constraints.length}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Migration Method Selection */}
          {selectedScenario && (
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold">Select Migration Method</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(methodInfo) as MigrationMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      selectedMethod === method
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="mb-2 font-semibold text-gray-800">
                      {methodInfo[method].name}
                    </div>
                    <p className="mb-3 text-sm text-gray-600">{methodInfo[method].description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="font-semibold text-green-700">Pros:</div>
                      {methodInfo[method].pros.slice(0, 2).map((pro, idx) => (
                        <div key={idx} className="text-gray-600">
                          • {pro}
                        </div>
                      ))}
                      <div className="mt-2 font-semibold text-red-700">Cons:</div>
                      {methodInfo[method].cons.slice(0, 2).map((con, idx) => (
                        <div key={idx} className="text-gray-600">
                          • {con}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={generateMigrationPlan}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Generate Migration Plan
                </button>
              </div>
            </div>
          )}

          {/* Migration Plan Display */}
          {migrationPlan && (
            <div className="space-y-6">
              {/* Plan Overview */}
              <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-green-50 p-6">
                <h3 className="mb-4 text-2xl font-bold">Migration Plan Overview</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-white p-4">
                    <div className="mb-1 text-sm text-gray-600">Duration</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {migrationPlan.timeline.totalDays} days
                    </div>
                    <div className="text-xs text-gray-500">
                      {(migrationPlan.timeline.totalDays / 30).toFixed(1)} months
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <div className="mb-1 text-sm text-gray-600">Total Budget</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(migrationPlan.budget.total)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <div className="mb-1 text-sm text-gray-600">Phases</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {migrationPlan.phases.length}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <div className="mb-1 text-sm text-gray-600">Risks</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {migrationPlan.riskAssessment.length}
                    </div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="mt-4 rounded-lg bg-white p-4">
                  <h4 className="mb-2 font-semibold">Budget Breakdown</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-600">Hardware:</span>{' '}
                      <span className="font-semibold">
                        {formatCurrency(migrationPlan.budget.hardware)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Software:</span>{' '}
                      <span className="font-semibold">
                        {formatCurrency(migrationPlan.budget.software)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Training:</span>{' '}
                      <span className="font-semibold">
                        {formatCurrency(migrationPlan.budget.training)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Consulting:</span>{' '}
                      <span className="font-semibold">
                        {formatCurrency(migrationPlan.budget.consulting)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {migrationPlan.phases.map((phase, idx) => (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(idx)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 transition-all ${
                      activePhase === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Phase {idx + 1}: {phase.name}
                  </button>
                ))}
              </div>

              {/* Active Phase Details */}
              {migrationPlan.phases[activePhase] && (
                <div className="rounded-lg border-2 border-gray-300 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        Phase {activePhase + 1}: {migrationPlan.phases[activePhase].name}
                      </h3>
                      <p className="text-gray-600">
                        Method: {methodInfo[migrationPlan.phases[activePhase].method].name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {migrationPlan.phases[activePhase].duration} days
                      </div>
                      <div className="text-lg text-green-600">
                        {formatCurrency(migrationPlan.phases[activePhase].cost)}
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="mb-6">
                    <h4 className="mb-3 font-semibold">
                      Tasks ({migrationPlan.phases[activePhase].tasks.length})
                    </h4>
                    <div className="space-y-3">
                      {migrationPlan.phases[activePhase].tasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-lg border-l-4 border-blue-500 bg-gray-50 p-4"
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div className="font-semibold">{task.description}</div>
                            <span className="text-sm text-gray-600">{task.duration} days</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                            <div>
                              <span className="text-gray-600">Resources:</span>{' '}
                              <span className="text-gray-800">{task.resources.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Validation:</span>{' '}
                              <span className="text-gray-800">{task.validation.length} checks</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  <div>
                    <h4 className="mb-3 font-semibold">
                      Phase Risks ({migrationPlan.phases[activePhase].risks.length})
                    </h4>
                    <div className="space-y-3">
                      {migrationPlan.phases[activePhase].risks.map((risk, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg border-2 p-4 ${getRiskColor(risk.probability, risk.impact)}`}
                        >
                          <div className="mb-1 font-semibold">{risk.description}</div>
                          <div className="mb-2 text-sm">
                            <span className="text-gray-700">Probability:</span>{' '}
                            <span className="font-semibold">{risk.probability}</span>
                            {' | '}
                            <span className="text-gray-700">Impact:</span>{' '}
                            <span className="font-semibold">{risk.impact}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-700">Mitigation:</span> {risk.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Success Metrics */}
              <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
                <h3 className="mb-4 text-xl font-bold">Success Metrics</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {migrationPlan.successMetrics.map((metric, idx) => (
                    <div key={idx} className="rounded-lg bg-white p-4">
                      <div className="mb-1 font-semibold text-gray-800">{metric.name}</div>
                      <div className="mb-1 text-2xl font-bold text-green-600">
                        {metric.target}
                        {metric.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        Measured via: {metric.measurement}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            metric.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : metric.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {metric.priority} priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!selectedScenario && (
            <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-semibold">How to Use This Planner:</h3>
              <ol className="list-inside list-decimal space-y-2 text-gray-700">
                <li>Select a migration scenario that matches your environment</li>
                <li>
                  Choose the most appropriate migration method (dual stack, tunneling, or NAT64)
                </li>
                <li>
                  Click &quot;Generate Migration Plan&quot; to create a detailed implementation plan
                </li>
                <li>Review each phase, including tasks, timeline, costs, and risks</li>
                <li>Use the success metrics to measure migration progress and success</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IPv6Planner;
