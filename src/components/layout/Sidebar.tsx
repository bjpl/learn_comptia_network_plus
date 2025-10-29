import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../../types';
import { useAppStore } from '../../store';

const navigationStructure: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
  },
  {
    id: 'osi-model',
    label: 'OSI Model',
    learningObjective: 'LO 1.0',
    children: [
      { id: 'layer-builder', label: 'Layer Explanation Builder', path: '/osi/layer-builder' },
      { id: 'packet-journey', label: 'Packet Journey Simulator', path: '/osi/packet-journey' },
      { id: 'troubleshooting', label: 'Troubleshooting Scenarios', path: '/osi/troubleshooting' },
    ],
  },
  {
    id: 'appliances',
    label: 'Networking Appliances',
    learningObjective: 'LO 1.1',
    children: [
      { id: 'comparison', label: 'Comparison Matrix', path: '/appliances/comparison' },
      { id: 'decision-tree', label: 'Decision Tree', path: '/appliances/decision-tree' },
      { id: 'simulator', label: 'Network Simulator', path: '/appliances/simulator' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud Concepts',
    learningObjective: 'LO 1.2',
    children: [
      { id: 'summary-builder', label: 'Summary Builder', path: '/cloud/summary-builder' },
      { id: 'architecture', label: 'Architecture Designer', path: '/cloud/architecture' },
    ],
  },
  {
    id: 'ports-protocols',
    label: 'Ports & Protocols',
    learningObjective: 'LO 1.3',
    children: [
      { id: 'trainer', label: 'Port/Protocol Trainer', path: '/ports/trainer' },
      { id: 'traffic-demo', label: 'Traffic Type Demo', path: '/ports/traffic-demo' },
      { id: 'scanner', label: 'Port Scanner', path: '/ports/scanner' },
    ],
  },
  {
    id: 'transmission',
    label: 'Transmission Media',
    learningObjective: 'LO 1.4',
    children: [
      { id: 'media-selection', label: 'Media Selection Matrix', path: '/transmission/media-selection' },
      { id: 'connector-lab', label: 'Connector Lab', path: '/transmission/connector-lab' },
      { id: 'transceiver', label: 'Transceiver Matching', path: '/transmission/transceiver' },
    ],
  },
  {
    id: 'topologies',
    label: 'Network Topologies',
    learningObjective: 'LO 1.5',
    children: [
      { id: 'analyzer', label: 'Topology Analyzer', path: '/topologies/analyzer' },
      { id: 'transformer', label: 'Topology Transformer', path: '/topologies/transformer' },
    ],
  },
  {
    id: 'ipv4',
    label: 'IPv4 Addressing',
    learningObjective: 'LO 1.7',
    children: [
      { id: 'subnet-designer', label: 'Subnet Designer', path: '/ipv4/subnet-designer' },
      { id: 'troubleshooter', label: 'IPv4 Troubleshooter', path: '/ipv4/troubleshooter' },
    ],
  },
  {
    id: 'modern',
    label: 'Modern Networking',
    learningObjective: 'LO 1.8',
    children: [
      { id: 'technology', label: 'Technology Summarizer', path: '/modern/technology' },
      { id: 'ipv6', label: 'IPv6 Planner', path: '/modern/ipv6' },
      { id: 'iac', label: 'IaC Builder', path: '/modern/iac' },
    ],
  },
  {
    id: 'assessment',
    label: 'Assessment',
    children: [
      { id: 'simulator', label: 'Integrated Simulator', path: '/assessment/simulator' },
      { id: 'dashboard', label: 'Progress Dashboard', path: '/assessment/dashboard' },
    ],
  },
];

interface SidebarItemProps {
  item: NavigationItem;
  depth?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, depth = 0 }) => {
  const location = useLocation();
  const { progress } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;
  const isParentActive = item.children?.some((child) => child.path === location.pathname);

  const completedChildren = item.children?.filter((child) =>
    progress.completedComponents.includes(child.id)
  ).length || 0;
  const totalChildren = item.children?.length || 0;

  const ItemContent = () => (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
          : isParentActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      style={{ paddingLeft: `${depth * 12 + 12}px` }}
    >
      <div className="flex items-center space-x-2 flex-1">
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
          {item.label}
        </span>
      </div>

      {item.learningObjective && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {item.learningObjective}
        </span>
      )}

      {hasChildren && totalChildren > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {completedChildren}/{totalChildren}
        </span>
      )}
    </div>
  );

  return (
    <div>
      {item.path ? (
        <Link to={item.path}>
          <ItemContent />
        </Link>
      ) : (
        <ItemContent />
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 bg-black/50 z-20" />

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Toggle */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        {!isCollapsed && (
          <nav className="p-4 space-y-2">
            {navigationStructure.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </nav>
        )}
      </aside>
    </>
  );
};
