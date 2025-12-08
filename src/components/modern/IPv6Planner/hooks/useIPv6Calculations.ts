/**
 * Business logic hook for IPv6 calculations and migration planning
 */

import type {
  IPv6MigrationScenario,
  MigrationMethod,
  MigrationPlan,
  MigrationPhase,
  SuccessMetric,
} from '../../modern-types';
import { METHOD_INFO } from '../constants';

export const useIPv6Calculations = () => {
  /**
   * Generate a comprehensive migration plan based on scenario and method
   */
  const generateMigrationPlan = (
    selectedScenario: IPv6MigrationScenario | null,
    selectedMethod: MigrationMethod
  ): MigrationPlan | null => {
    if (!selectedScenario) {
      return null;
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

    // Phase 2: Infrastructure Preparation (for dual-stack or hybrid)
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
          description: `Deploy ${METHOD_INFO[selectedMethod].name} to pilot group`,
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

    return plan;
  };

  return { generateMigrationPlan };
};
