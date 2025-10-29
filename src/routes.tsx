import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load all component pages
const HomePage = React.lazy(() => import('./pages/HomePage'));

// OSI Model (LO 1.0)
const LayerExplanationBuilder = React.lazy(() => import('./components/osi/LayerExplanationBuilder'));
const PacketJourneySimulator = React.lazy(() => import('./components/osi/PacketJourneySimulator'));
const TroubleshootingScenarios = React.lazy(() => import('./components/osi/TroubleshootingScenarios'));

// Networking Appliances (LO 1.1)
const ComparisonMatrix = React.lazy(() => import('./components/appliances/ComparisonMatrix'));
const DecisionTree = React.lazy(() => import('./components/appliances/DecisionTree'));
const NetworkSimulator = React.lazy(() => import('./components/appliances/NetworkSimulator'));

// Cloud Concepts (LO 1.2)
const CloudSummaryBuilder = React.lazy(() => import('./components/cloud/CloudSummaryBuilder'));
const CloudArchitectureDesigner = React.lazy(() => import('./components/cloud/CloudArchitectureDesigner'));

// Ports & Protocols (LO 1.3)
const PortProtocolTrainer = React.lazy(() => import('./components/ports/PortProtocolTrainer'));
const TrafficTypeDemo = React.lazy(() => import('./components/ports/TrafficTypeDemo'));
const PortScanner = React.lazy(() => import('./components/ports/PortScanner'));

// Transmission Media (LO 1.4)
const MediaSelectionMatrix = React.lazy(() => import('./components/transmission/MediaSelectionMatrix'));
const ConnectorLab = React.lazy(() => import('./components/transmission/ConnectorLab'));
const TransceiverMatching = React.lazy(() => import('./components/transmission/TransceiverMatching'));

// Network Topologies (LO 1.5)
const TopologyAnalyzer = React.lazy(() => import('./components/topologies/TopologyAnalyzer'));
const TopologyTransformer = React.lazy(() => import('./components/topologies/TopologyTransformer'));

// IPv4 Addressing (LO 1.7)
const SubnetDesigner = React.lazy(() => import('./components/ipv4/SubnetDesigner'));
const IPv4Troubleshooter = React.lazy(() => import('./components/ipv4/IPv4Troubleshooter'));

// Modern Networking (LO 1.8)
const TechnologySummarizer = React.lazy(() => import('./components/modern/TechnologySummarizer'));
const IPv6Planner = React.lazy(() => import('./components/modern/IPv6Planner'));
const IaCBuilder = React.lazy(() => import('./components/modern/IaCBuilder'));

// Assessment
const IntegratedSimulator = React.lazy(() => import('./components/assessment/IntegratedSimulator'));
const ProgressDashboard = React.lazy(() => import('./components/assessment/ProgressDashboard'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </React.Suspense>
        ),
      },
      // OSI Model Routes
      {
        path: 'osi/layer-builder',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <LayerExplanationBuilder />
          </React.Suspense>
        ),
      },
      {
        path: 'osi/packet-journey',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <PacketJourneySimulator />
          </React.Suspense>
        ),
      },
      {
        path: 'osi/troubleshooting',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TroubleshootingScenarios />
          </React.Suspense>
        ),
      },
      // Networking Appliances Routes
      {
        path: 'appliances/comparison',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <ComparisonMatrix />
          </React.Suspense>
        ),
      },
      {
        path: 'appliances/decision-tree',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <DecisionTree />
          </React.Suspense>
        ),
      },
      {
        path: 'appliances/simulator',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <NetworkSimulator />
          </React.Suspense>
        ),
      },
      // Cloud Concepts Routes
      {
        path: 'cloud/summary-builder',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <CloudSummaryBuilder />
          </React.Suspense>
        ),
      },
      {
        path: 'cloud/architecture',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <CloudArchitectureDesigner />
          </React.Suspense>
        ),
      },
      // Ports & Protocols Routes
      {
        path: 'ports/trainer',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <PortProtocolTrainer />
          </React.Suspense>
        ),
      },
      {
        path: 'ports/traffic-demo',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TrafficTypeDemo />
          </React.Suspense>
        ),
      },
      {
        path: 'ports/scanner',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <PortScanner />
          </React.Suspense>
        ),
      },
      // Transmission Media Routes
      {
        path: 'transmission/media-selection',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <MediaSelectionMatrix />
          </React.Suspense>
        ),
      },
      {
        path: 'transmission/connector-lab',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <ConnectorLab />
          </React.Suspense>
        ),
      },
      {
        path: 'transmission/transceiver',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TransceiverMatching />
          </React.Suspense>
        ),
      },
      // Network Topologies Routes
      {
        path: 'topologies/analyzer',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TopologyAnalyzer />
          </React.Suspense>
        ),
      },
      {
        path: 'topologies/transformer',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TopologyTransformer />
          </React.Suspense>
        ),
      },
      // IPv4 Addressing Routes
      {
        path: 'ipv4/subnet-designer',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <SubnetDesigner />
          </React.Suspense>
        ),
      },
      {
        path: 'ipv4/troubleshooter',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <IPv4Troubleshooter />
          </React.Suspense>
        ),
      },
      // Modern Networking Routes
      {
        path: 'modern/technology',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TechnologySummarizer />
          </React.Suspense>
        ),
      },
      {
        path: 'modern/ipv6',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <IPv6Planner />
          </React.Suspense>
        ),
      },
      {
        path: 'modern/iac',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <IaCBuilder />
          </React.Suspense>
        ),
      },
      // Assessment Routes
      {
        path: 'assessment/simulator',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <IntegratedSimulator />
          </React.Suspense>
        ),
      },
      {
        path: 'assessment/dashboard',
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <ProgressDashboard />
          </React.Suspense>
        ),
      },
    ],
  },
]);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
