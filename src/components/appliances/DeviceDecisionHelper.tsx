import React, { useState } from 'react';
import type { ComparisonDevice } from './appliances-types';

interface DecisionQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    nextQuestion?: string;
    deviceTypes?: string[];
  }[];
}

interface DeviceDecisionHelperProps {
  devices: ComparisonDevice[];
  onRecommendation: (deviceIds: string[]) => void;
}

const decisionQuestions: DecisionQuestion[] = [
  {
    id: 'start',
    question: 'What is the primary purpose of this device?',
    options: [
      {
        label: 'Physical connectivity / signal extension',
        value: 'physical',
        nextQuestion: 'physical-purpose',
      },
      {
        label: 'LAN switching / local network',
        value: 'switching',
        nextQuestion: 'switching-purpose',
      },
      {
        label: 'Routing / inter-network connectivity',
        value: 'routing',
        nextQuestion: 'routing-purpose',
      },
      {
        label: 'Security / threat protection',
        value: 'security',
        nextQuestion: 'security-purpose',
      },
      { label: 'Wireless connectivity', value: 'wireless', nextQuestion: 'wireless-purpose' },
      {
        label: 'Application delivery / optimization',
        value: 'app-delivery',
        nextQuestion: 'app-delivery-purpose',
      },
    ],
  },
  {
    id: 'physical-purpose',
    question: 'What physical connectivity need do you have?',
    options: [
      {
        label: 'Extend cable distance beyond 100m',
        value: 'extend',
        deviceTypes: ['repeater', 'media-converter'],
      },
      {
        label: 'Convert between fiber and copper',
        value: 'convert',
        deviceTypes: ['media-converter'],
      },
      { label: 'Connect multiple devices (legacy)', value: 'hub', deviceTypes: ['hub'] },
    ],
  },
  {
    id: 'switching-purpose',
    question: 'What are your switching requirements?',
    options: [
      { label: 'Basic LAN switching (no management)', value: 'basic', nextQuestion: 'switch-poe' },
      { label: 'Managed switching with VLANs', value: 'managed', nextQuestion: 'switch-poe' },
      { label: 'Inter-VLAN routing (Layer 3)', value: 'layer3', deviceTypes: ['layer3-switch'] },
    ],
  },
  {
    id: 'switch-poe',
    question: 'Do you need Power over Ethernet (PoE)?',
    options: [
      { label: 'Yes, for many devices (10+)', value: 'poe-switch', deviceTypes: ['poe-switch'] },
      { label: 'Yes, for 1-3 devices only', value: 'poe-injector', deviceTypes: ['poe-injector'] },
      { label: 'No PoE needed', value: 'no-poe', deviceTypes: ['switch'] },
    ],
  },
  {
    id: 'routing-purpose',
    question: 'What type of routing do you need?',
    options: [
      { label: 'WAN connectivity / internet gateway', value: 'wan', deviceTypes: ['router'] },
      {
        label: 'Inter-VLAN routing (LAN only)',
        value: 'inter-vlan',
        deviceTypes: ['layer3-switch'],
      },
      { label: 'Branch office with security', value: 'branch', deviceTypes: ['router', 'utm'] },
    ],
  },
  {
    id: 'security-purpose',
    question: 'What security function do you need?',
    options: [
      { label: 'Basic packet filtering', value: 'basic-fw', deviceTypes: ['firewall-stateless'] },
      { label: 'Session-aware firewall', value: 'stateful-fw', deviceTypes: ['firewall-stateful'] },
      { label: 'Advanced threats / IPS', value: 'ngfw', deviceTypes: ['firewall-ngfw', 'ips'] },
      { label: 'Monitoring only (no blocking)', value: 'ids', deviceTypes: ['ids'] },
      { label: 'All-in-one security (SMB)', value: 'utm', deviceTypes: ['utm'] },
      { label: 'Web filtering / proxy', value: 'proxy', deviceTypes: ['proxy', 'content-filter'] },
    ],
  },
  {
    id: 'wireless-purpose',
    question: 'How many access points will you deploy?',
    options: [
      {
        label: '1-5 APs (simple deployment)',
        value: 'few-aps',
        deviceTypes: ['wireless-ap-autonomous'],
      },
      {
        label: '10+ APs (enterprise)',
        value: 'many-aps',
        deviceTypes: ['wireless-ap-controller', 'wireless-controller'],
      },
    ],
  },
  {
    id: 'app-delivery-purpose',
    question: 'What application delivery function do you need?',
    options: [
      {
        label: 'Load balancing across servers',
        value: 'load-balance',
        deviceTypes: ['load-balancer'],
      },
      { label: 'VPN for remote users', value: 'vpn', deviceTypes: ['vpn-concentrator'] },
      { label: 'VoIP / telephony integration', value: 'voip', deviceTypes: ['voip-gateway'] },
    ],
  },
];

const DeviceDecisionHelper: React.FC<DeviceDecisionHelperProps> = ({
  devices,
  onRecommendation,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<DecisionQuestion>(decisionQuestions[0]);
  const [history, setHistory] = useState<DecisionQuestion[]>([]);
  const [recommendations, setRecommendations] = useState<ComparisonDevice[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (option: DecisionQuestion['options'][0]) => {
    if (option.deviceTypes) {
      // Final answer - show recommendations
      const matchedDevices = devices.filter((device) =>
        option.deviceTypes?.some((type) => device.type.includes(type as string))
      );
      setRecommendations(matchedDevices);
      setShowResults(true);
      if (matchedDevices.length > 0) {
        onRecommendation(matchedDevices.map((d) => d.id));
      }
    } else if (option.nextQuestion) {
      // Next question
      const nextQ = decisionQuestions.find((q) => q.id === option.nextQuestion);
      if (nextQ) {
        setHistory([...history, currentQuestion]);
        setCurrentQuestion(nextQ);
      }
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousQuestion = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentQuestion(previousQuestion);
      setShowResults(false);
      setRecommendations([]);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(decisionQuestions[0]);
    setHistory([]);
    setRecommendations([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-bold text-green-600 dark:text-green-400">
          Recommendations
        </h3>

        {recommendations.length === 0 ? (
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900">
            <p className="text-yellow-900 dark:text-yellow-200">
              No exact matches found. Try adjusting your criteria or browse all devices.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-200 dark:text-gray-300">
              Based on your requirements, we recommend the following devices:
            </p>

            {recommendations.map((device) => (
              <div
                key={device.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {device.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                      {device.manufacturer}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                    Layer {device.primaryOsiLayer}
                  </span>
                </div>

                <p className="mb-3 text-sm text-gray-700 dark:text-gray-200 dark:text-gray-300">
                  {device.osiLayerDescription}
                </p>

                {device.whenToUse && device.whenToUse.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-sm text-gray-700 dark:text-gray-200 dark:text-gray-300">
                      When to use:
                    </strong>
                    <ul className="mt-1 list-inside list-disc text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                      {device.whenToUse.slice(0, 3).map((use, idx) => (
                        <li key={idx}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                    ${device.pricing.initialCost.toLocaleString()} initial
                  </span>
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {device.specs.throughput}
                  </span>
                  {device.specs.portCount && (
                    <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                      {device.specs.portCount} ports
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleBack}
            className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Back
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          Which Device Should I Use?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
          Answer a few questions to get personalized device recommendations.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
            Progress:
          </div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${i < history.length ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Current question */}
      <div className="mb-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-600"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-200 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Back
          </button>
        )}
        <button
          onClick={handleReset}
          className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default DeviceDecisionHelper;
