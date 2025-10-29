import React from 'react';
import type { Component } from '../types';
import { ComponentCard } from '../components/layout/ComponentCard';
import { useAppStore } from '../store';

const components: Component[] = [
  // OSI Model (LO 1.0)
  {
    id: 'layer-builder',
    name: 'Layer Explanation Builder',
    path: '/osi/layer-builder',
    learningObjective: 'LO 1.0',
    description: 'Build comprehensive explanations of OSI model layers',
  },
  {
    id: 'packet-journey',
    name: 'Packet Journey Simulator',
    path: '/osi/packet-journey',
    learningObjective: 'LO 1.0',
    description: 'Visualize packet flow through OSI layers',
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting Scenarios',
    path: '/osi/troubleshooting',
    learningObjective: 'LO 1.0',
    description: 'Practice diagnosing layer-specific issues',
  },
  // Networking Appliances (LO 1.1)
  {
    id: 'comparison',
    name: 'Appliance Comparison Matrix',
    path: '/appliances/comparison',
    learningObjective: 'LO 1.1',
    description: 'Compare networking devices and their features',
  },
  {
    id: 'decision-tree',
    name: 'Device Decision Tree',
    path: '/appliances/decision-tree',
    learningObjective: 'LO 1.1',
    description: 'Interactive decision-making for device selection',
  },
  {
    id: 'simulator',
    name: 'Network Simulator',
    path: '/appliances/simulator',
    learningObjective: 'LO 1.1',
    description: 'Build and test network topologies',
  },
  // Cloud Concepts (LO 1.2)
  {
    id: 'summary-builder',
    name: 'Cloud Summary Builder',
    path: '/cloud/summary-builder',
    learningObjective: 'LO 1.2',
    description: 'Create structured cloud concept summaries',
  },
  {
    id: 'architecture',
    name: 'Cloud Architecture Designer',
    path: '/cloud/architecture',
    learningObjective: 'LO 1.2',
    description: 'Design cloud infrastructure solutions',
  },
  // Ports & Protocols (LO 1.3)
  {
    id: 'trainer',
    name: 'Port/Protocol Trainer',
    path: '/ports/trainer',
    learningObjective: 'LO 1.3',
    description: 'Master common ports and protocols',
  },
  {
    id: 'traffic-demo',
    name: 'Traffic Type Demonstration',
    path: '/ports/traffic-demo',
    learningObjective: 'LO 1.3',
    description: 'Understand different network traffic types',
  },
  {
    id: 'scanner',
    name: 'Port Scanner Simulation',
    path: '/ports/scanner',
    learningObjective: 'LO 1.3',
    description: 'Practice port scanning techniques',
  },
  // Transmission Media (LO 1.4)
  {
    id: 'media-selection',
    name: 'Media Selection Matrix',
    path: '/transmission/media-selection',
    learningObjective: 'LO 1.4',
    description: 'Choose appropriate transmission media',
  },
  {
    id: 'connector-lab',
    name: 'Connector Lab',
    path: '/transmission/connector-lab',
    learningObjective: 'LO 1.4',
    description: 'Identify and work with cable connectors',
  },
  {
    id: 'transceiver',
    name: 'Transceiver Matching',
    path: '/transmission/transceiver',
    learningObjective: 'LO 1.4',
    description: 'Match transceivers to network requirements',
  },
  // Network Topologies (LO 1.5)
  {
    id: 'analyzer',
    name: 'Topology Analyzer',
    path: '/topologies/analyzer',
    learningObjective: 'LO 1.5',
    description: 'Analyze network topology characteristics',
  },
  {
    id: 'transformer',
    name: 'Topology Transformer',
    path: '/topologies/transformer',
    learningObjective: 'LO 1.5',
    description: 'Transform between different topologies',
  },
  // IPv4 Addressing (LO 1.7)
  {
    id: 'subnet-designer',
    name: 'Subnet Designer',
    path: '/ipv4/subnet-designer',
    learningObjective: 'LO 1.7',
    description: 'Design and calculate subnet schemes',
  },
  {
    id: 'troubleshooter',
    name: 'IPv4 Troubleshooter',
    path: '/ipv4/troubleshooter',
    learningObjective: 'LO 1.7',
    description: 'Diagnose IPv4 addressing issues',
  },
  // Modern Networking (LO 1.8)
  {
    id: 'technology',
    name: 'Technology Summarizer',
    path: '/modern/technology',
    learningObjective: 'LO 1.8',
    description: 'Summarize modern networking technologies',
  },
  {
    id: 'ipv6',
    name: 'IPv6 Planner',
    path: '/modern/ipv6',
    learningObjective: 'LO 1.8',
    description: 'Plan IPv6 addressing schemes',
  },
  {
    id: 'iac',
    name: 'IaC Builder',
    path: '/modern/iac',
    learningObjective: 'LO 1.8',
    description: 'Build Infrastructure as Code templates',
  },
  // Assessment
  {
    id: 'simulator',
    name: 'Integrated Simulator',
    path: '/assessment/simulator',
    learningObjective: 'Assessment',
    description: 'Comprehensive network simulation',
  },
  {
    id: 'dashboard',
    name: 'Progress Dashboard',
    path: '/assessment/dashboard',
    learningObjective: 'Assessment',
    description: 'Track your learning progress',
  },
];

const HomePage: React.FC = () => {
  const { progress } = useAppStore();

  const componentsByLO = React.useMemo(() => {
    const grouped: Record<string, Component[]> = {};
    components.forEach((component) => {
      const lo = component.learningObjective;
      if (!grouped[lo]) {
        grouped[lo] = [];
      }
      grouped[lo].push(component);
    });
    return grouped;
  }, []);

  const stats = React.useMemo(() => {
    const completed = progress.completedComponents.length;
    const total = components.length;
    const percentage = Math.round((completed / total) * 100);

    return {
      completed,
      total,
      percentage,
      averageScore: Math.round(progress.totalScore) || 0,
    };
  }, [progress]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to CompTIA Network+ Interactive Learning
        </h1>
        <p className="text-blue-100 text-lg mb-6">
          Master networking concepts through 23 interactive components
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.completed}/{stats.total}</div>
            <div className="text-sm text-blue-100">Components Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.percentage}%</div>
            <div className="text-sm text-blue-100">Overall Progress</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <div className="text-sm text-blue-100">Average Score</div>
          </div>
        </div>
      </div>

      {/* Components by Learning Objective */}
      {Object.entries(componentsByLO).map(([lo, loComponents]) => {
        const completedCount = loComponents.filter((c) =>
          progress.completedComponents.includes(c.id)
        ).length;

        return (
          <section key={lo}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {lo}
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedCount} of {loComponents.length} completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loComponents.map((component) => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Quick Start Guide */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Start Guide
        </h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <div className="flex items-start">
            <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">1.</span>
            <span>Navigate through learning objectives using the sidebar</span>
          </div>
          <div className="flex items-start">
            <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">2.</span>
            <span>Complete interactive components to learn concepts</span>
          </div>
          <div className="flex items-start">
            <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">3.</span>
            <span>Track your progress in the Progress Dashboard</span>
          </div>
          <div className="flex items-start">
            <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">4.</span>
            <span>Test your knowledge with the Integrated Simulator</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
