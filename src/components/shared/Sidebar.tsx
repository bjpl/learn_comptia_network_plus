import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { useProgressStore } from '../../stores/progressStore';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  category?: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: '🏠' },

  // OSI Model (LO 1.0)
  {
    id: 'osi-enhanced',
    label: 'OSI Master Class ⭐',
    path: '/osi/enhanced',
    icon: '🎓',
    category: 'OSI Model (LO 1.0)',
  },
  {
    id: 'layer-builder',
    label: 'Layer Explanation Builder',
    path: '/osi/layer-builder',
    icon: '📚',
    category: 'OSI Model (LO 1.0)',
  },
  {
    id: 'packet-journey',
    label: 'Packet Journey Simulator',
    path: '/osi/packet-journey',
    icon: '🔄',
    category: 'OSI Model (LO 1.0)',
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting Scenarios',
    path: '/osi/troubleshooting',
    icon: '🔧',
    category: 'OSI Model (LO 1.0)',
  },

  // Networking Appliances (LO 1.1)
  {
    id: 'comparison',
    label: 'Appliance Comparison',
    path: '/appliances/comparison',
    icon: '⚖️',
    category: 'Networking Appliances (LO 1.1)',
  },
  {
    id: 'decision-tree',
    label: 'Device Decision Tree',
    path: '/appliances/decision-tree',
    icon: '🌳',
    category: 'Networking Appliances (LO 1.1)',
  },
  {
    id: 'simulator',
    label: 'Network Simulator',
    path: '/appliances/simulator',
    icon: '🖥️',
    category: 'Networking Appliances (LO 1.1)',
  },

  // Cloud Concepts (LO 1.2)
  {
    id: 'summary-builder',
    label: 'Cloud Summary Builder',
    path: '/cloud/summary-builder',
    icon: '☁️',
    category: 'Cloud Concepts (LO 1.2)',
  },
  {
    id: 'architecture',
    label: 'Cloud Architecture Designer',
    path: '/cloud/architecture',
    icon: '🏗️',
    category: 'Cloud Concepts (LO 1.2)',
  },

  // Ports & Protocols (LO 1.3)
  {
    id: 'trainer',
    label: 'Port/Protocol Trainer',
    path: '/ports/trainer',
    icon: '🔌',
    category: 'Ports & Protocols (LO 1.3)',
  },
  {
    id: 'traffic-demo',
    label: 'Traffic Type Demo',
    path: '/ports/traffic-demo',
    icon: '📡',
    category: 'Ports & Protocols (LO 1.3)',
  },
  {
    id: 'scanner',
    label: 'Port Scanner',
    path: '/ports/scanner',
    icon: '🔍',
    category: 'Ports & Protocols (LO 1.3)',
  },

  // Transmission Media (LO 1.4)
  {
    id: 'media-selection',
    label: 'Media Selection Matrix',
    path: '/transmission/media-selection',
    icon: '📊',
    category: 'Transmission Media (LO 1.4)',
  },
  {
    id: 'connector-lab',
    label: 'Connector Lab',
    path: '/transmission/connector-lab',
    icon: '🔗',
    category: 'Transmission Media (LO 1.4)',
  },
  {
    id: 'transceiver',
    label: 'Transceiver Matching',
    path: '/transmission/transceiver',
    icon: '📟',
    category: 'Transmission Media (LO 1.4)',
  },

  // Network Topologies (LO 1.5)
  {
    id: 'analyzer',
    label: 'Topology Analyzer',
    path: '/topologies/analyzer',
    icon: '🕸️',
    category: 'Network Topologies (LO 1.5)',
  },
  {
    id: 'transformer',
    label: 'Topology Transformer',
    path: '/topologies/transformer',
    icon: '🔄',
    category: 'Network Topologies (LO 1.5)',
  },

  // IPv4 Addressing (LO 1.7)
  {
    id: 'subnet-designer',
    label: 'Subnet Designer',
    path: '/ipv4/subnet-designer',
    icon: '🌐',
    category: 'IPv4 Addressing (LO 1.7)',
  },
  {
    id: 'troubleshooter',
    label: 'IPv4 Troubleshooter',
    path: '/ipv4/troubleshooter',
    icon: '🛠️',
    category: 'IPv4 Addressing (LO 1.7)',
  },

  // Modern Networking (LO 1.8)
  {
    id: 'technology',
    label: 'Technology Summarizer',
    path: '/modern/technology',
    icon: '🚀',
    category: 'Modern Networking (LO 1.8)',
  },
  {
    id: 'ipv6',
    label: 'IPv6 Planner',
    path: '/modern/ipv6',
    icon: '🌍',
    category: 'Modern Networking (LO 1.8)',
  },
  {
    id: 'iac',
    label: 'IaC Builder',
    path: '/modern/iac',
    icon: '⚙️',
    category: 'Modern Networking (LO 1.8)',
  },

  // Assessment
  {
    id: 'simulator-assess',
    label: 'Integrated Simulator',
    path: '/assessment/simulator',
    icon: '🎮',
    category: 'Assessment',
  },
  {
    id: 'dashboard-progress',
    label: 'Progress Dashboard',
    path: '/assessment/dashboard',
    icon: '📊',
    category: 'Assessment',
  },
];

export const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const getComponentProgress = useProgressStore((state) => state.getComponentProgress);

  const groupedItems = navigationItems.reduce(
    (acc, item) => {
      if (!item.category) {
        acc['General'] = acc['General'] || [];
        acc['General'].push(item);
      } else {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
      }
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Sidebar navigation"
      >
        <nav className="space-y-6 p-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => {
                  const progress = getComponentProgress(item.id);
                  const isCompleted = progress?.completed || false;

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                            isActive
                              ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`
                        }
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                      >
                        <span className="text-xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="flex-1 text-sm">{item.label}</span>
                        {isCompleted && (
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label="Completed"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
