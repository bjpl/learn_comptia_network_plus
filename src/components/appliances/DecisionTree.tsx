import React, { useState, useCallback, useMemo } from 'react';
import { decisionTreeData, networkDevices } from './appliances-data';
import type { ComparisonDevice } from './appliances-types';

interface DecisionTreeProps {
  onRecommendation?: (deviceIds: string[]) => void;
}

interface ComparisonData {
  devices: ComparisonDevice[];
  comparison: string;
}

const DecisionTree: React.FC<DecisionTreeProps> = ({ onRecommendation }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>(['start']);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [showExamScenario, setShowExamScenario] = useState(false);
  const [examIndex, setExamIndex] = useState(0);

  const currentNode = decisionTreeData.get(currentNodeId);

  const examScenarios = [
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

  const handleAnswer = useCallback(
    (answer: 'yes' | 'no') => {
      if (!currentNode || currentNode.type === 'recommendation') {
        return;
      }

      const nextNodeId = answer === 'yes' ? currentNode.yesPath : currentNode.noPath;

      if (nextNodeId) {
        const nextNode = decisionTreeData.get(nextNodeId);

        setCurrentNodeId(nextNodeId);
        setHistory([...history, nextNodeId]);
        setShowComparison(false);

        if (nextNode?.type === 'recommendation' && onRecommendation && nextNode.devices) {
          onRecommendation(nextNode.devices);
        }
      }
    },
    [currentNode, history, onRecommendation]
  );

  const handleReset = () => {
    setCurrentNodeId('start');
    setHistory(['start']);
    setShowComparison(false);
    setShowExamScenario(false);
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousNodeId = newHistory[newHistory.length - 1];

      setCurrentNodeId(previousNodeId);
      setHistory(newHistory);
      setShowComparison(false);
    }
  };

  const getDeviceDetails = (deviceId: string): ComparisonDevice | undefined => {
    return networkDevices.find((d) => d.id === deviceId);
  };

  const handleCompareDevices = () => {
    if (currentNode?.type === 'recommendation' && currentNode.devices) {
      const devices = currentNode.devices
        .map(getDeviceDetails)
        .filter((d): d is ComparisonDevice => d !== undefined);

      if (devices.length > 0) {
        const comparison = generateComparison(devices);
        setComparisonData({ devices, comparison });
        setShowComparison(true);
      }
    }
  };

  const generateComparison = (devices: ComparisonDevice[]): string => {
    if (devices.length < 2) {
      return 'Need at least 2 devices to compare';
    }

    const costComparison = devices
      .sort((a, b) => a.pricing.totalCostYear1 - b.pricing.totalCostYear1)
      .map((d) => `${d.name}: $${d.pricing.totalCostYear1.toLocaleString()}/year`)
      .join(' | ');

    const performanceComparison = devices
      .sort((a, b) => {
        const aThroughput = parseInt(a.specs.throughput.split('-')[1] || '0');
        const bThroughput = parseInt(b.specs.throughput.split('-')[1] || '0');
        return bThroughput - aThroughput;
      })
      .map((d) => `${d.name}: ${d.specs.throughput}`)
      .join(' | ');

    return `Cost (per year): ${costComparison}\n\nThroughput: ${performanceComparison}`;
  };

  const recommendedDevices = useMemo(() => {
    if (currentNode?.type === 'recommendation' && currentNode.devices) {
      return currentNode.devices
        .map(getDeviceDetails)
        .filter((d): d is ComparisonDevice => d !== undefined);
    }
    return [];
  }, [currentNode]);

  if (!currentNode) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <p className="text-red-500">Error: Node not found</p>
        <button
          onClick={handleReset}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow-lg">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Network Device Decision Tree
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Answer targeted questions to get personalized device recommendations with cost analysis
          and exam scenarios.
        </p>
      </div>

      {/* Progress & Breadcrumb */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress:</span>
          <div className="h-2 flex-1 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(history.length / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {history.length} / ~5 steps
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto text-xs text-gray-500 dark:text-gray-400">
          {history.map((nodeId, index) => {
            const node = decisionTreeData.get(nodeId);
            return (
              <React.Fragment key={nodeId}>
                {index > 0 && <span>→</span>}
                <span
                  className={`whitespace-nowrap ${index === history.length - 1 ? 'font-semibold text-blue-600' : ''}`}
                >
                  {node?.text.slice(0, 25)}...
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      {showExamScenario ? (
        <ExamScenarioView
          scenario={examScenarios[examIndex]}
          onClose={() => setShowExamScenario(false)}
          onNext={() => setExamIndex((i) => (i + 1) % examScenarios.length)}
        />
      ) : showComparison && comparisonData ? (
        <ComparisonView data={comparisonData} onClose={() => setShowComparison(false)} />
      ) : currentNode.type === 'question' ? (
        <QuestionView currentNode={currentNode} onAnswer={handleAnswer} />
      ) : (
        <RecommendationView
          currentNode={currentNode}
          devices={recommendedDevices}
          onCompare={handleCompareDevices}
          onExamScenario={() => setShowExamScenario(true)}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleGoBack}
          disabled={history.length <= 1}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            history.length <= 1
              ? 'cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Back
        </button>

        <button
          onClick={handleReset}
          className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
        >
          Restart
        </button>
      </div>

      {/* Help */}
      <div className="rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
        <p className="font-semibold text-gray-700 dark:text-gray-300">How to use:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
          <li>Answer each question about your infrastructure needs</li>
          <li>Get personalized device recommendations with detailed specs</li>
          <li>Compare similar devices by cost, throughput, and features</li>
          <li>Review exam scenarios to test your knowledge</li>
        </ul>
      </div>
    </div>
  );
};

interface QuestionViewProps {
  currentNode: {
    text: string;
  };
  onAnswer: (answer: 'yes' | 'no') => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({ currentNode, onAnswer }) => (
  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900 dark:to-indigo-900">
    <div className="flex items-start space-x-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
        ?
      </div>
      <div className="flex-1">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
          {currentNode.text}
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => onAnswer('yes')}
            className="flex-1 rounded-lg bg-green-500 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-green-600 hover:shadow-lg"
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer('no')}
            className="flex-1 rounded-lg bg-red-500 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-red-600 hover:shadow-lg"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface RecommendationViewProps {
  currentNode: {
    text: string;
    rationale?: string;
  };
  devices: ComparisonDevice[];
  onCompare: () => void;
  onExamScenario: () => void;
}

const RecommendationView: React.FC<RecommendationViewProps> = ({
  currentNode,
  devices,
  onCompare,
  onExamScenario,
}) => (
  <div className="space-y-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-900 dark:to-emerald-900">
    <div className="flex items-start space-x-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
        ✓
      </div>
      <div className="flex-1">
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">
          Recommendation: {currentNode.text}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{currentNode.rationale}</p>
      </div>
    </div>

    {devices.length > 0 && (
      <div>
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recommended Devices:
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    )}

    {devices.length > 1 && (
      <button
        onClick={onCompare}
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
        Compare Devices
      </button>
    )}

    <button
      onClick={onExamScenario}
      className="w-full rounded-lg bg-purple-500 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-600"
    >
      View Exam Scenarios
    </button>
  </div>
);

interface DeviceCardProps {
  device: ComparisonDevice;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => (
  <div className="rounded-lg border-2 border-green-200 bg-white p-4 transition-colors hover:border-green-400 dark:border-green-700 dark:bg-gray-800">
    <div className="mb-2 flex items-start justify-between">
      <h5 className="font-bold text-gray-800 dark:text-gray-100">{device.name}</h5>
      <span
        className={`rounded px-2 py-1 text-xs font-medium ${
          device.category === 'physical'
            ? 'bg-blue-100 text-blue-800'
            : device.category === 'virtual'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
        }`}
      >
        {device.category}
      </span>
    </div>

    <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
      {device.manufacturer} - {device.model}
    </p>

    <div className="mb-3 space-y-2 text-xs text-gray-700 dark:text-gray-300">
      <div>
        <span className="font-medium">Throughput:</span> {device.specs.throughput}
      </div>
      <div>
        <span className="font-medium">Year 1 Cost:</span> $
        {device.pricing.totalCostYear1.toLocaleString()}
      </div>
      <div>
        <span className="font-medium">Connections:</span>{' '}
        {device.specs.maxConnections.toLocaleString()}
      </div>
    </div>

    <div className="text-xs text-gray-600 dark:text-gray-400">
      <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Best for:</p>
      <ul className="list-inside list-disc space-y-0.5">
        {device.useCase.slice(0, 2).map((use, idx) => (
          <li key={idx}>{use}</li>
        ))}
      </ul>
    </div>
  </div>
);

interface ComparisonViewProps {
  data: ComparisonData;
  onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ data, onClose }) => (
  <div className="space-y-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:from-yellow-900 dark:to-orange-900">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Device Comparison</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Close
      </button>
    </div>

    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-gray-300 dark:border-gray-600">
          <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
            Device
          </th>
          <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
            Category
          </th>
          <th className="px-2 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
            Year 1 Cost
          </th>
          <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
            Throughput
          </th>
        </tr>
      </thead>
      <tbody>
        {data.devices.map((device) => (
          <tr
            key={device.id}
            className="border-b border-gray-200 hover:bg-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <td className="px-2 py-2 font-medium text-gray-800 dark:text-gray-100">
              {device.name}
            </td>
            <td className="px-2 py-2 text-gray-600 dark:text-gray-400">{device.category}</td>
            <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-400">
              ${device.pricing.totalCostYear1.toLocaleString()}
            </td>
            <td className="px-2 py-2 text-gray-600 dark:text-gray-400">
              {device.specs.throughput}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
      <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
        {data.comparison}
      </p>
    </div>
  </div>
);

interface ExamScenarioViewProps {
  scenario: {
    title: string;
    description: string;
    answer: string;
    reasoning: string;
  };
  onClose: () => void;
  onNext: () => void;
}

const ExamScenarioView: React.FC<ExamScenarioViewProps> = ({ scenario, onClose, onNext }) => {
  const device = networkDevices.find((d) => d.id === scenario.answer);

  return (
    <div className="space-y-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-900 dark:to-pink-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Exam Scenario</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>

      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">{scenario.title}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.description}</p>
      </div>

      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <p className="mb-2 font-semibold text-gray-800 dark:text-gray-100">Correct Answer:</p>
        <p className="mb-2 font-medium text-green-700 dark:text-green-400">{device?.name}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.reasoning}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-600"
      >
        Next Scenario
      </button>
    </div>
  );
};

export default DecisionTree;
