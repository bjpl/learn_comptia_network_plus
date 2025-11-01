import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Server,
  Database,
  Wifi,
  RefreshCw,
  Info,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { TRANSCEIVERS } from './media-data';
import type { Transceiver, TransceiverFormFactor, TransceiverProtocol } from './media-types';

interface UseCaseCard {
  id: string;
  description: string;
  requirements: {
    speed: number;
    distance: number;
    protocol: TransceiverProtocol;
    formFactor?: TransceiverFormFactor;
  };
}

interface TransceiverSpec {
  formFactor: string;
  fullName: string;
  speed: string;
  channels: number;
  size: string;
  introduced: number;
  useCase: string;
  keyFeature: string;
}

interface WDMType {
  name: string;
  fullName: string;
  channels: string;
  wavelengthRange: string;
  spacing: string;
  useCase: string;
  capacity: string;
}

interface TroubleshootingTip {
  symptom: string;
  causes: string[];
  solutions: string[];
}

const TRANSCEIVER_SPECS: TransceiverSpec[] = [
  {
    formFactor: 'GBIC',
    fullName: 'Gigabit Interface Converter',
    speed: '1G',
    channels: 1,
    size: 'Large',
    introduced: 1995,
    useCase: 'Legacy gigabit connections',
    keyFeature: 'First hot-swappable transceiver',
  },
  {
    formFactor: 'SFP',
    fullName: 'Small Form-Factor Pluggable',
    speed: '1G',
    channels: 1,
    size: 'Small (Mini-GBIC)',
    introduced: 2001,
    useCase: 'Standard gigabit, copper or fiber',
    keyFeature: 'Replaced GBIC, hot-swappable',
  },
  {
    formFactor: 'SFP+',
    fullName: 'Enhanced Small Form-Factor Pluggable',
    speed: '10G',
    channels: 1,
    size: 'Same as SFP',
    introduced: 2006,
    useCase: '10G datacenter, servers, storage',
    keyFeature: 'Same size as SFP but 10x speed',
  },
  {
    formFactor: 'SFP28',
    fullName: 'SFP 28Gbps',
    speed: '25G',
    channels: 1,
    size: 'Same as SFP',
    introduced: 2014,
    useCase: '25G datacenter, cloud infrastructure',
    keyFeature: '25G single lane',
  },
  {
    formFactor: 'QSFP',
    fullName: 'Quad Small Form-Factor Pluggable',
    speed: '4G',
    channels: 4,
    size: 'Slightly larger',
    introduced: 2006,
    useCase: '4x1G aggregation',
    keyFeature: '4 channels in one module',
  },
  {
    formFactor: 'QSFP+',
    fullName: 'Quad SFP Plus',
    speed: '40G',
    channels: 4,
    size: 'Same as QSFP',
    introduced: 2009,
    useCase: '40G spine-leaf datacenter',
    keyFeature: '4x10G = 40G total',
  },
  {
    formFactor: 'QSFP28',
    fullName: 'Quad SFP 28Gbps',
    speed: '100G',
    channels: 4,
    size: 'Same as QSFP',
    introduced: 2014,
    useCase: '100G modern datacenter, hyperscale',
    keyFeature: '4x25G = 100G total',
  },
  {
    formFactor: 'QSFP-DD',
    fullName: 'Quad SFP Double Density',
    speed: '400G',
    channels: 8,
    size: 'Double density',
    introduced: 2017,
    useCase: '400G cloud, AI/ML workloads',
    keyFeature: '8x50G = 400G total',
  },
  {
    formFactor: 'CFP',
    fullName: 'C Form-Factor Pluggable',
    speed: '100G+',
    channels: 1,
    size: 'Very large',
    introduced: 2009,
    useCase: '100G+ WAN, metro networks',
    keyFeature: 'High power, long reach',
  },
];

const WDM_TYPES: WDMType[] = [
  {
    name: 'BiDi',
    fullName: 'Bidirectional',
    channels: '2 (Tx/Rx)',
    wavelengthRange: '1270-1330nm / 1490-1550nm',
    spacing: '160-220nm',
    useCase: 'Single fiber cost savings',
    capacity: '2x capacity on 1 fiber',
  },
  {
    name: 'CWDM',
    fullName: 'Coarse Wavelength Division Multiplexing',
    channels: '8-18',
    wavelengthRange: '1270-1610nm',
    spacing: '20nm',
    useCase: 'Metro networks, campus backbone',
    capacity: '8-18 channels on 1 fiber',
  },
  {
    name: 'DWDM',
    fullName: 'Dense Wavelength Division Multiplexing',
    channels: '40-96+',
    wavelengthRange: '1530-1565nm (C-band)',
    spacing: '0.4-0.8nm',
    useCase: 'Long-haul, submarine cables',
    capacity: '40+ channels on 1 fiber',
  },
];

const TROUBLESHOOTING_TIPS: TroubleshootingTip[] = [
  {
    symptom: 'No link light / Link down',
    causes: [
      'Dirty fiber connector',
      'Wrong transceiver type',
      'Incompatible wavelength',
      'Fiber not connected',
      'Damaged cable',
    ],
    solutions: [
      'Clean fiber with approved cleaner',
      'Verify transceiver compatibility',
      'Check wavelength matches (850nm vs 1310nm)',
      'Reseat connections',
      'Test with different cable',
    ],
  },
  {
    symptom: 'Intermittent connectivity / Packet loss',
    causes: [
      'Low optical power (dBm)',
      'EMI interference',
      'Loose connection',
      'Temperature issues',
      'Fiber bend radius exceeded',
    ],
    solutions: [
      'Check dBm levels (should be -3 to -20 dBm)',
      'Shield cables properly',
      'Secure all connections',
      'Improve ventilation',
      'Ensure proper cable routing',
    ],
  },
  {
    symptom: 'Incompatible transceiver error',
    causes: [
      'Non-approved vendor module',
      'Wrong form factor',
      'Speed mismatch',
      'Firmware incompatibility',
    ],
    solutions: [
      'Use vendor-approved transceivers',
      'Verify SFP vs SFP+ vs QSFP',
      'Match speed requirements',
      'Update switch firmware',
    ],
  },
  {
    symptom: 'Distance limitation errors',
    causes: [
      'Wrong transceiver type (-SR vs -LR)',
      'Multimode vs single-mode mismatch',
      'Power budget exceeded',
      'Wrong fiber grade (OM3 vs OM4)',
    ],
    solutions: [
      'Use -LR for long distances',
      'Match fiber type to transceiver',
      'Calculate power budget',
      'Upgrade to OM4 for 10G',
    ],
  },
];

const generateUseCases = (): UseCaseCard[] => {
  return [
    {
      id: 'uc1',
      description: 'Connect servers within a rack to Top-of-Rack switch (400m, multimode fiber)',
      requirements: { speed: 10, distance: 400, protocol: 'Ethernet', formFactor: 'SFP+' },
    },
    {
      id: 'uc2',
      description: 'Campus building interconnect (500m, multimode fiber, 1Gbps)',
      requirements: { speed: 1, distance: 500, protocol: 'Ethernet', formFactor: 'SFP' },
    },
    {
      id: 'uc3',
      description: 'Long-range datacenter spine-leaf (10km, single-mode fiber, 10Gbps)',
      requirements: { speed: 10, distance: 10000, protocol: 'Ethernet' },
    },
    {
      id: 'uc4',
      description: 'High-performance SAN storage array (100m, multimode fiber, 16Gbps)',
      requirements: { speed: 16, distance: 100, protocol: 'Fibre Channel' },
    },
    {
      id: 'uc5',
      description: 'Modern datacenter spine switching (100m, 100Gbps, OM4 fiber)',
      requirements: { speed: 100, distance: 100, protocol: 'Ethernet', formFactor: 'QSFP28' },
    },
    {
      id: 'uc6',
      description: 'Rack-to-rack connection in same row (10m, 10Gbps, copper)',
      requirements: { speed: 10, distance: 10, protocol: 'Ethernet' },
    },
    {
      id: 'uc7',
      description: 'Fibre Channel SAN backbone (150m, 8Gbps, multimode)',
      requirements: { speed: 8, distance: 150, protocol: 'Fibre Channel' },
    },
    {
      id: 'uc8',
      description: 'High-density 40G spine-leaf (150m, multimode fiber)',
      requirements: { speed: 40, distance: 150, protocol: 'Ethernet', formFactor: 'QSFP+' },
    },
    {
      id: 'uc9',
      description: 'Long-range WAN link (10km, 100Gbps, single-mode fiber)',
      requirements: { speed: 100, distance: 10000, protocol: 'Ethernet' },
    },
    {
      id: 'uc10',
      description: 'Server uplink to copper switch (100m, 1Gbps)',
      requirements: { speed: 1, distance: 100, protocol: 'Ethernet', formFactor: 'SFP' },
    },
    {
      id: 'uc11',
      description: 'NVMe over Fibre Channel (100m, 32Gbps, multimode)',
      requirements: { speed: 32, distance: 100, protocol: 'Fibre Channel' },
    },
    {
      id: 'uc12',
      description: 'Metro network backbone (10km, 40Gbps, single-mode)',
      requirements: { speed: 40, distance: 10000, protocol: 'Ethernet' },
    },
  ];
};

export default function TransceiverMatch() {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedTransceiver, setDraggedTransceiver] = useState<Transceiver | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const useCases = useMemo(() => generateUseCases(), []);

  const correctMatches = useMemo(() => {
    const matches: Record<string, Transceiver> = {};

    useCases.forEach((useCase) => {
      const suitable = TRANSCEIVERS.filter((t) => {
        const speedMatch = t.speed >= useCase.requirements.speed;
        const distanceMatch = t.maxDistance >= useCase.requirements.distance;
        const protocolMatch = t.protocol === useCase.requirements.protocol;
        const formFactorMatch =
          !useCase.requirements.formFactor || t.formFactor === useCase.requirements.formFactor;

        return speedMatch && distanceMatch && protocolMatch && formFactorMatch;
      });

      if (suitable.length > 0) {
        const optimal = suitable.sort((a, b) => a.speed - b.speed)[0];
        matches[useCase.id] = optimal;
      }
    });

    return matches;
  }, [useCases]);

  const handleDragStart = (transceiver: Transceiver) => {
    setDraggedTransceiver(transceiver);
  };

  const handleDrop = (useCaseId: string) => {
    if (draggedTransceiver) {
      setMatches((prev) => ({
        ...prev,
        [useCaseId]: draggedTransceiver.id,
      }));
      setDraggedTransceiver(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveMatch = (useCaseId: string) => {
    setMatches((prev) => {
      const newMatches = { ...prev };
      delete newMatches[useCaseId];
      return newMatches;
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    Object.entries(matches).forEach(([useCaseId, transceiverId]) => {
      const correctTransceiver = correctMatches[useCaseId];
      if (correctTransceiver && correctTransceiver.id === transceiverId) {
        correctCount++;
      }
    });

    setScore(Math.round((correctCount / useCases.length) * 100));
    setSubmitted(true);
  };

  const handleReset = () => {
    setMatches({});
    setSubmitted(false);
    setScore(0);
  };

  const getFormFactorIcon = (formFactor: TransceiverFormFactor) => {
    switch (formFactor) {
      case 'QSFP':
      case 'QSFP+':
      case 'QSFP28':
        return <Server className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getProtocolIcon = (protocol: TransceiverProtocol) => {
    return protocol === 'Ethernet' ? (
      <Wifi className="h-4 w-4" />
    ) : (
      <Database className="h-4 w-4" />
    );
  };

  const groupedTransceivers = useMemo(() => {
    return {
      'SFP (1G)': TRANSCEIVERS.filter((t) => t.formFactor === 'SFP' && t.speed === 1),
      'SFP+ (10G)': TRANSCEIVERS.filter((t) => t.formFactor === 'SFP+'),
      'QSFP+ (40G)': TRANSCEIVERS.filter((t) => t.formFactor === 'QSFP+'),
      'QSFP28 (100G)': TRANSCEIVERS.filter((t) => t.formFactor === 'QSFP28'),
    };
  }, []);

  const completedMatches = Object.keys(matches).length;
  const progressPercentage = (completedMatches / useCases.length) * 100;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="encyclopedia" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="encyclopedia">Encyclopedia</TabsTrigger>
          <TabsTrigger value="bidi-wdm">BiDi & WDM</TabsTrigger>
          <TabsTrigger value="matching">Matching Game</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="exam-prep">Exam Prep</TabsTrigger>
        </TabsList>

        {/* Encyclopedia Tab */}
        <TabsContent value="encyclopedia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Transceiver Form Factor Encyclopedia
              </CardTitle>
              <CardDescription>
                Complete reference guide for CompTIA Network+ LO 1.4 transceiver types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TRANSCEIVER_SPECS.map((spec) => (
                  <div key={spec.formFactor} className="rounded-lg border p-4 hover:bg-gray-50">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge className="px-3 py-1 text-lg">{spec.formFactor}</Badge>
                          <span className="text-sm text-gray-500">({spec.introduced})</span>
                        </div>
                        <div className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {spec.fullName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Speed:</strong> {spec.speed} | <strong>Channels:</strong>{' '}
                          {spec.channels} | <strong>Size:</strong> {spec.size}
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-sm">
                          <strong className="text-blue-600">Use Case:</strong> {spec.useCase}
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {spec.keyFeature}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="text-sm">
                    <strong className="text-blue-900">Exam Tip:</strong> Remember the pattern - QSFP
                    = 4x speed of equivalent SFP (QSFP+ is 4x10G = 40G, QSFP28 is 4x25G = 100G).
                    SFP+ modules can fit in SFP ports but will run at reduced 1G speed.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BiDi & WDM Tab */}
        <TabsContent value="bidi-wdm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wavelength Division Multiplexing (WDM) Technologies</CardTitle>
              <CardDescription>
                Understanding BiDi, CWDM, and DWDM for capacity multiplication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {WDM_TYPES.map((wdm) => (
                <div key={wdm.name} className="rounded-lg border-2 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-lg">
                      {wdm.name}
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">{wdm.fullName}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                      <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                        Technical Specs
                      </div>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <div>
                          <strong>Channels:</strong> {wdm.channels}
                        </div>
                        <div>
                          <strong>Wavelength Range:</strong> {wdm.wavelengthRange}
                        </div>
                        <div>
                          <strong>Channel Spacing:</strong> {wdm.spacing}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                        Applications
                      </div>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <div>
                          <strong>Primary Use:</strong> {wdm.useCase}
                        </div>
                        <div>
                          <strong>Capacity Benefit:</strong> {wdm.capacity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div className="text-sm">
                    <strong className="text-green-900">BiDi Explained:</strong> Bidirectional
                    transceivers use different wavelengths for transmit (Tx) and receive (Rx) on a
                    SINGLE fiber strand. One end transmits at 1270nm / receives at 1330nm, while the
                    other end does the opposite. This cuts fiber usage in half and reduces
                    installation costs.
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  <div className="text-sm">
                    <strong className="text-purple-900">Cost Savings:</strong> WDM technologies
                    multiply fiber capacity without adding cables. DWDM can carry 80+ channels on a
                    single fiber pair, replacing what would otherwise require 80 separate fiber
                    pairs - massive cost savings for long-distance runs.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matching Game Tab */}
        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transceiver Matching Game</CardTitle>
                  <CardDescription>
                    Drag transceivers to match them with appropriate use cases
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {completedMatches} / {useCases.length}
                  </div>
                  <Progress value={progressPercentage} className="mt-2 w-32" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Transceiver Library */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Available Transceivers</CardTitle>
                  <CardDescription>Drag these to match with use cases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(groupedTransceivers).map(([category, transceivers]) => (
                    <div key={category}>
                      <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {category}
                      </div>
                      <div className="space-y-2">
                        {transceivers.map((transceiver) => (
                          <div
                            key={transceiver.id}
                            draggable
                            onDragStart={() => handleDragStart(transceiver)}
                            className="cursor-move rounded-lg border bg-white p-3 transition-colors hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {transceiver.name}
                                </div>
                                <div className="mt-1 flex gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {getFormFactorIcon(transceiver.formFactor)}
                                    <span className="ml-1">{transceiver.formFactor}</span>
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {getProtocolIcon(transceiver.protocol)}
                                    <span className="ml-1">{transceiver.protocol}</span>
                                  </Badge>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {transceiver.speed}G · {transceiver.maxDistance}m ·{' '}
                                  {transceiver.connectorType}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Use Cases */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Use Cases</CardTitle>
                    <div className="flex gap-2">
                      {!submitted ? (
                        <Button onClick={handleSubmit} disabled={completedMatches === 0}>
                          Submit Answers
                        </Button>
                      ) : (
                        <Button onClick={handleReset}>
                          <RefreshCw className="mr-1 h-4 w-4" />
                          Try Again
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {useCases.map((useCase) => {
                      const matchedTransceiverId = matches[useCase.id];
                      const matchedTransceiver = matchedTransceiverId
                        ? TRANSCEIVERS.find((t) => t.id === matchedTransceiverId)
                        : null;
                      const correctTransceiver = correctMatches[useCase.id];
                      const isCorrect =
                        submitted && matchedTransceiver?.id === correctTransceiver?.id;
                      const isIncorrect =
                        submitted &&
                        matchedTransceiver &&
                        matchedTransceiver.id !== correctTransceiver?.id;

                      return (
                        <div
                          key={useCase.id}
                          onDrop={() => handleDrop(useCase.id)}
                          onDragOver={handleDragOver}
                          className={`rounded-lg border-2 border-dashed p-4 transition-colors dark:text-gray-100 ${
                            matchedTransceiver
                              ? isCorrect
                                ? 'border-green-500 bg-green-50 dark:bg-green-900'
                                : isIncorrect
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900'
                                  : 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {useCase.description}
                                </p>
                                {submitted &&
                                  (isCorrect ? (
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                                  ) : isIncorrect ? (
                                    <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                  ) : null)}
                              </div>

                              <div className="mb-3 flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <Badge variant="outline" className="text-xs">
                                  {useCase.requirements.speed}G
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {useCase.requirements.distance}m
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {useCase.requirements.protocol}
                                </Badge>
                                {useCase.requirements.formFactor && (
                                  <Badge variant="outline" className="text-xs">
                                    {useCase.requirements.formFactor}
                                  </Badge>
                                )}
                              </div>

                              {matchedTransceiver ? (
                                <div className="flex items-center justify-between rounded border bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {matchedTransceiver.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {matchedTransceiver.formFactor} · {matchedTransceiver.speed}G
                                      · {matchedTransceiver.maxDistance}m
                                    </div>
                                  </div>
                                  {!submitted && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveMatch(useCase.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center p-4 text-sm text-gray-400 dark:text-gray-500">
                                  <ArrowRight className="mr-2 h-4 w-4" />
                                  Drop transceiver here
                                </div>
                              )}

                              {submitted && isIncorrect && correctTransceiver && (
                                <div className="mt-2 rounded border border-green-200 bg-green-50 p-2 dark:border-green-700 dark:bg-green-900">
                                  <div className="mb-1 text-xs font-medium text-green-800 dark:text-green-200">
                                    Correct Answer:
                                  </div>
                                  <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {correctTransceiver.name}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {correctTransceiver.formFactor} · {correctTransceiver.speed}G ·{' '}
                                    {correctTransceiver.maxDistance}m
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              {submitted && (
                <Card className="mt-6 border-2 border-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-gray-100">
                        {score}%
                      </div>
                      <div className="mb-4 text-gray-600 dark:text-gray-400">
                        {score >= 90
                          ? 'Excellent! You have a strong understanding of transceiver selection.'
                          : score >= 70
                            ? 'Good job! Review the incorrect matches to improve.'
                            : score >= 50
                              ? 'Not bad, but there is room for improvement.'
                              : 'Keep practicing! Review the transceiver specifications carefully.'}
                      </div>
                      <Progress value={score} className="h-4" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Transceiver Troubleshooting Guide
              </CardTitle>
              <CardDescription>
                Common issues, causes, and solutions for transceiver problems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {TROUBLESHOOTING_TIPS.map((tip, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <div className="text-lg font-semibold">{tip.symptom}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <div className="mb-2 text-sm font-semibold text-red-700">
                        Possible Causes:
                      </div>
                      <ul className="space-y-1 text-sm">
                        {tip.causes.map((cause, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-red-500">•</span>
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-2 text-sm font-semibold text-green-700">Solutions:</div>
                      <ul className="space-y-1 text-sm">
                        {tip.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                  <div className="text-sm">
                    <strong className="text-yellow-900">Optical Power Budget:</strong> Always check
                    dBm levels. Typical ranges: -3 to -10 dBm (good), -10 to -20 dBm (acceptable),
                    below -20 dBm (check for issues). Use an optical power meter for accurate
                    measurements.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exam Prep Tab */}
        <TabsContent value="exam-prep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                CompTIA Network+ Exam Preparation
              </CardTitle>
              <CardDescription>Critical knowledge points for exam success</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">Key Exam Topics - LO 1.4</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Form Factor Identification:</strong> Distinguish GBIC, SFP, SFP+,
                      QSFP, QSFP+, QSFP28, CFP by size, speed, and use case
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Speed Capabilities:</strong> SFP=1G, SFP+=10G, QSFP+=40G, QSFP28=100G
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Distance Limitations:</strong> -SR (short range, multimode, 100-550m),
                      -LR (long range, single-mode, 10km), -ER (extended range, 40km)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>Fiber Compatibility:</strong> Multimode (850nm, orange cable) vs
                      Single-mode (1310/1550nm, yellow cable)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>BiDi Operation:</strong> Single fiber, different Tx/Rx wavelengths,
                      cost savings
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      <strong>WDM Technologies:</strong> CWDM (20nm spacing, 8-18 channels), DWDM
                      (0.4-0.8nm spacing, 40+ channels)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-900">Common Exam Scenarios</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-green-800">
                      Q: Connect two buildings 8km apart at 10Gbps?
                    </strong>
                    <div className="mt-1 text-green-700">
                      A: 10GBASE-LR (SFP+) with single-mode fiber - long range capability
                    </div>
                  </div>
                  <div>
                    <strong className="text-green-800">
                      Q: Rack-to-rack connection, 5m, 10Gbps, cost-effective?
                    </strong>
                    <div className="mt-1 text-green-700">
                      A: SFP+ DAC (Direct Attach Copper) - lowest cost for short distances
                    </div>
                  </div>
                  <div>
                    <strong className="text-green-800">
                      Q: SFP+ module in SFP port - what happens?
                    </strong>
                    <div className="mt-1 text-green-700">
                      A: Physical incompatibility - SFP+ will NOT fit in SFP-only port. However, SFP
                      modules CAN work in SFP+ ports at reduced 1G speed
                    </div>
                  </div>
                  <div>
                    <strong className="text-green-800">
                      Q: 100G datacenter spine, 100m distance?
                    </strong>
                    <div className="mt-1 text-green-700">
                      A: QSFP28 100GBASE-SR4 with OM4 multimode fiber
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h3 className="mb-2 font-semibold text-purple-900">Memory Aids</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                    <span>
                      <strong>"QSFP = Quad = 4x"</strong> - QSFP transceivers always have 4 channels
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                    <span>
                      <strong>"SR = Short, LR = Long, ER = Extended"</strong> - Easy distance recall
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                    <span>
                      <strong>"850 = Multimode, 1310/1550 = Single-mode"</strong> - Wavelength to
                      fiber type
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                    <span>
                      <strong>"BiDi = Bi-directional = 1 fiber, 2 wavelengths"</strong> - Cost
                      savings
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
