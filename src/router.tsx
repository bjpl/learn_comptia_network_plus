import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/shared/Layout';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import ErrorBoundaryCommon from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import './components/common/ErrorBoundary.css';

// Lazy load pages
const Dashboard = React.lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));
const HomePage = React.lazy(() => import(/* webpackChunkName: "homepage" */ './pages/HomePage'));
const NotFound = React.lazy(() => import(/* webpackChunkName: "notfound" */ './pages/NotFound'));

// OSI Model Components
const OSIEnhanced = React.lazy(() => import('./components/osi/OSIEnhanced'));
const LayerExplanationBuilder = React.lazy(
  () => import('./components/osi/LayerExplanationBuilder')
);
const PacketJourneySimulator = React.lazy(() => import('./components/osi/PacketJourneySimulator'));
const TroubleshootingScenarios = React.lazy(
  () => import('./components/osi/TroubleshootingScenarios')
);

// Networking Appliances Components
const EnhancedComparisonMatrix = React.lazy(
  () => import('./components/appliances/EnhancedComparisonMatrix')
);
const DecisionTree = React.lazy(() => import('./components/appliances/DecisionTree'));
const NetworkSimulator = React.lazy(() => import('./components/appliances/NetworkSimulator'));

// Cloud Concepts Components
const CloudSummaryBuilder = React.lazy(() => import('./components/cloud/CloudSummaryBuilder'));
const CloudArchitectureDesigner = React.lazy(
  () => import('./components/cloud/CloudArchitectureDesigner')
);
const CloudMigrationSimulator = React.lazy(
  () => import('./components/cloud/CloudMigrationSimulator')
);

// Ports & Protocols Components
const PortProtocolTrainer = React.lazy(() => import('./components/protocols/PortProtocolTrainer'));
const TrafficTypeDemo = React.lazy(() => import('./components/protocols/TrafficTypeDemo'));
const PortScanner = React.lazy(() => import('./components/protocols/PortScannerEnhanced'));

// Transmission Media Components
const MediaSelectionMatrix = React.lazy(() => import('./components/media/MediaSelectionMatrix'));
const ConnectorLab = React.lazy(() => import('./components/media/ConnectorLab'));
const TransceiverMatch = React.lazy(() => import('./components/media/TransceiverMatch'));
const SignalAnalyzer = React.lazy(() => import('./components/media/SignalAnalyzer'));

// Network Topologies Components
const TopologyAnalyzer = React.lazy(() => import('./components/topologies/TopologyAnalyzer'));
const TopologyTransformer = React.lazy(() => import('./components/topologies/TopologyTransformer'));
const TopologyBuilder = React.lazy(() => import('./components/topologies/TopologyBuilder'));

// IPv4 Addressing Components
const SubnetDesigner = React.lazy(() => import('./components/ipv4/SubnetDesigner'));
const IPv4Troubleshooter = React.lazy(() => import('./components/ipv4/IPv4Troubleshooter'));

// Modern Networking Components
const TechnologySummarizer = React.lazy(() => import('./components/modern/TechnologySummarizer'));
const IPv6Planner = React.lazy(() => import('./components/modern/IPv6Planner'));
const IaCBuilder = React.lazy(() => import('./components/modern/IaCBuilder'));

// Assessment Components
const ScenarioSimulator = React.lazy(() => import('./components/assessment/ScenarioSimulator'));
const ProgressDashboardPage = React.lazy(() => import('./pages/ProgressDashboardPage'));
const QuizEngine = React.lazy(() => import('./components/assessment/QuizEngine'));

// Optimized loading component
const LoadingFallback = () => <LoadingSpinner />;

// Wrapper for lazy loaded routes with Suspense
const LazyRoute: React.FC<{ component: React.LazyExoticComponent<React.ComponentType> }> = ({
  component: Component,
}) => (
  <React.Suspense fallback={<LoadingFallback />}>
    <Component />
  </React.Suspense>
);

// Wrapper for major components with ErrorBoundary
const ProtectedRoute: React.FC<{
  component: React.LazyExoticComponent<React.ComponentType>;
  componentName: string;
}> = ({ component: Component, componentName }) => (
  <ErrorBoundaryCommon componentName={componentName}>
    <React.Suspense fallback={<LoadingFallback />}>
      <Component />
    </React.Suspense>
  </ErrorBoundaryCommon>
);

// Breadcrumb navigation map
export const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  '/': { title: 'Home' },
  '/home': { title: 'Home' },
  // OSI Model
  '/osi/enhanced': { title: 'OSI Master Class', parent: '/' },
  '/osi/layer-builder': { title: 'Layer Explanation Builder', parent: '/' },
  '/osi/packet-journey': { title: 'Packet Journey Simulator', parent: '/' },
  '/osi/troubleshooting': { title: 'Troubleshooting Scenarios', parent: '/' },
  // Appliances
  '/appliances/comparison': { title: 'Appliance Comparison Matrix', parent: '/' },
  '/appliances/decision-tree': { title: 'Device Decision Tree', parent: '/' },
  '/appliances/simulator': { title: 'Network Simulator', parent: '/' },
  // Cloud
  '/cloud/summary-builder': { title: 'Cloud Summary Builder', parent: '/' },
  '/cloud/architecture': { title: 'Cloud Architecture Designer', parent: '/' },
  '/cloud/migration': { title: 'Cloud Migration Simulator', parent: '/' },
  // Ports & Protocols
  '/ports/trainer': { title: 'Port/Protocol Trainer', parent: '/' },
  '/ports/traffic-demo': { title: 'Traffic Type Demonstration', parent: '/' },
  '/ports/scanner': { title: 'Port Scanner Simulation', parent: '/' },
  // Transmission Media
  '/transmission/media-selection': { title: 'Media Selection Matrix', parent: '/' },
  '/transmission/connector-lab': { title: 'Connector Lab', parent: '/' },
  '/transmission/transceiver': { title: 'Transceiver Matching', parent: '/' },
  '/transmission/signal-analyzer': { title: 'Signal Analyzer', parent: '/' },
  // Topologies
  '/topologies/analyzer': { title: 'Topology Analyzer', parent: '/' },
  '/topologies/transformer': { title: 'Topology Transformer', parent: '/' },
  '/topologies/builder': { title: 'Topology Builder', parent: '/' },
  // IPv4
  '/ipv4/subnet-designer': { title: 'Subnet Designer', parent: '/' },
  '/ipv4/troubleshooter': { title: 'IPv4 Troubleshooter', parent: '/' },
  // Modern Networking
  '/modern/technology': { title: 'Technology Summarizer', parent: '/' },
  '/modern/ipv6': { title: 'IPv6 Planner', parent: '/' },
  '/modern/iac': { title: 'IaC Builder', parent: '/' },
  // Assessment
  '/assessment/simulator': { title: 'Integrated Simulator', parent: '/' },
  '/assessment/dashboard': { title: 'Progress Dashboard', parent: '/' },
  '/assessment/quiz': { title: 'Practice Quiz', parent: '/' },
};

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <Layout />
        </ErrorBoundary>
      ),
      children: [
        {
          index: true,
          element: <LazyRoute component={Dashboard} />,
        },
        {
          path: 'home',
          element: <LazyRoute component={HomePage} />,
        },
        // OSI Model Routes
        {
          path: 'osi/enhanced',
          element: <ProtectedRoute component={OSIEnhanced} componentName="OSI Master Class" />,
        },
        {
          path: 'osi/layer-builder',
          element: <LazyRoute component={LayerExplanationBuilder} />,
        },
        {
          path: 'osi/packet-journey',
          element: <LazyRoute component={PacketJourneySimulator} />,
        },
        {
          path: 'osi/troubleshooting',
          element: <LazyRoute component={TroubleshootingScenarios} />,
        },
        // Networking Appliances Routes
        {
          path: 'appliances/comparison',
          element: <LazyRoute component={EnhancedComparisonMatrix} />,
        },
        {
          path: 'appliances/decision-tree',
          element: <LazyRoute component={DecisionTree} />,
        },
        {
          path: 'appliances/simulator',
          element: (
            <ProtectedRoute component={NetworkSimulator} componentName="Network Simulator" />
          ),
        },
        // Cloud Concepts Routes
        {
          path: 'cloud/summary-builder',
          element: <LazyRoute component={CloudSummaryBuilder} />,
        },
        {
          path: 'cloud/architecture',
          element: (
            <ProtectedRoute
              component={CloudArchitectureDesigner}
              componentName="Cloud Architecture Designer"
            />
          ),
        },
        {
          path: 'cloud/migration',
          element: <LazyRoute component={CloudMigrationSimulator} />,
        },
        // Ports & Protocols Routes
        {
          path: 'ports/trainer',
          element: <LazyRoute component={PortProtocolTrainer} />,
        },
        {
          path: 'ports/traffic-demo',
          element: <LazyRoute component={TrafficTypeDemo} />,
        },
        {
          path: 'ports/scanner',
          element: <ProtectedRoute component={PortScanner} componentName="Port Scanner" />,
        },
        // Transmission Media Routes
        {
          path: 'transmission/media-selection',
          element: <LazyRoute component={MediaSelectionMatrix} />,
        },
        {
          path: 'transmission/connector-lab',
          element: <ProtectedRoute component={ConnectorLab} componentName="Connector Lab" />,
        },
        {
          path: 'transmission/transceiver',
          element: <LazyRoute component={TransceiverMatch} />,
        },
        {
          path: 'transmission/signal-analyzer',
          element: <LazyRoute component={SignalAnalyzer} />,
        },
        // Network Topologies Routes
        {
          path: 'topologies/analyzer',
          element: (
            <ProtectedRoute component={TopologyAnalyzer} componentName="Topology Analyzer" />
          ),
        },
        {
          path: 'topologies/transformer',
          element: <LazyRoute component={TopologyTransformer} />,
        },
        {
          path: 'topologies/builder',
          element: <LazyRoute component={TopologyBuilder} />,
        },
        // IPv4 Addressing Routes
        {
          path: 'ipv4/subnet-designer',
          element: <ProtectedRoute component={SubnetDesigner} componentName="Subnet Designer" />,
        },
        {
          path: 'ipv4/troubleshooter',
          element: (
            <ProtectedRoute component={IPv4Troubleshooter} componentName="IPv4 Troubleshooter" />
          ),
        },
        // Modern Networking Routes
        {
          path: 'modern/technology',
          element: <LazyRoute component={TechnologySummarizer} />,
        },
        {
          path: 'modern/ipv6',
          element: <LazyRoute component={IPv6Planner} />,
        },
        {
          path: 'modern/iac',
          element: <LazyRoute component={IaCBuilder} />,
        },
        // Assessment Routes
        {
          path: 'assessment/simulator',
          element: (
            <ProtectedRoute component={ScenarioSimulator} componentName="Scenario Simulator" />
          ),
        },
        {
          path: 'assessment/dashboard',
          element: (
            <ProtectedRoute component={ProgressDashboardPage} componentName="Progress Dashboard" />
          ),
        },
        {
          path: 'assessment/quiz',
          element: <ProtectedRoute component={QuizEngine} componentName="Practice Quiz" />,
        },
      ],
    },
    // 404 Not Found
    {
      path: '*',
      element: (
        <ErrorBoundary>
          <LazyRoute component={NotFound} />
        </ErrorBoundary>
      ),
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
