import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Server,
  Database,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { TRANSCEIVERS } from './media-data';
import type { Transceiver, TransceiverFormFactor, TransceiverProtocol } from './media-types';

interface MatchPair {
  transceiver: Transceiver;
  correctUseCase: string;
  position: 'left' | 'right';
}

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

// Generate use cases from transceivers
const generateUseCases = (): UseCaseCard[] => {
  return [
    {
      id: 'uc1',
      description: 'Connect servers within a rack to Top-of-Rack switch (400m, multimode fiber)',
      requirements: { speed: 10, distance: 400, protocol: 'Ethernet', formFactor: 'SFP+' }
    },
    {
      id: 'uc2',
      description: 'Campus building interconnect (500m, multimode fiber, 1Gbps)',
      requirements: { speed: 1, distance: 500, protocol: 'Ethernet', formFactor: 'SFP' }
    },
    {
      id: 'uc3',
      description: 'Long-range datacenter spine-leaf (10km, single-mode fiber, 10Gbps)',
      requirements: { speed: 10, distance: 10000, protocol: 'Ethernet' }
    },
    {
      id: 'uc4',
      description: 'High-performance SAN storage array (100m, multimode fiber, 16Gbps)',
      requirements: { speed: 16, distance: 100, protocol: 'Fibre Channel' }
    },
    {
      id: 'uc5',
      description: 'Modern datacenter spine switching (100m, 100Gbps, OM4 fiber)',
      requirements: { speed: 100, distance: 100, protocol: 'Ethernet', formFactor: 'QSFP28' }
    },
    {
      id: 'uc6',
      description: 'Rack-to-rack connection in same row (10m, 10Gbps, copper)',
      requirements: { speed: 10, distance: 10, protocol: 'Ethernet' }
    },
    {
      id: 'uc7',
      description: 'Fibre Channel SAN backbone (150m, 8Gbps, multimode)',
      requirements: { speed: 8, distance: 150, protocol: 'Fibre Channel' }
    },
    {
      id: 'uc8',
      description: 'High-density 40G spine-leaf (150m, multimode fiber)',
      requirements: { speed: 40, distance: 150, protocol: 'Ethernet', formFactor: 'QSFP+' }
    },
    {
      id: 'uc9',
      description: 'Long-range WAN link (10km, 100Gbps, single-mode fiber)',
      requirements: { speed: 100, distance: 10000, protocol: 'Ethernet' }
    },
    {
      id: 'uc10',
      description: 'Server uplink to copper switch (100m, 1Gbps)',
      requirements: { speed: 1, distance: 100, protocol: 'Ethernet', formFactor: 'SFP' }
    },
    {
      id: 'uc11',
      description: 'NVMe over Fibre Channel (100m, 32Gbps, multimode)',
      requirements: { speed: 32, distance: 100, protocol: 'Fibre Channel' }
    },
    {
      id: 'uc12',
      description: 'Metro network backbone (10km, 40Gbps, single-mode)',
      requirements: { speed: 40, distance: 10000, protocol: 'Ethernet' }
    }
  ];
};

export default function TransceiverMatch() {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedTransceiver, setDraggedTransceiver] = useState<Transceiver | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const useCases = useMemo(() => generateUseCases(), []);

  // Find correct transceiver for each use case
  const correctMatches = useMemo(() => {
    const matches: Record<string, Transceiver> = {};

    useCases.forEach(useCase => {
      const suitable = TRANSCEIVERS.filter(t => {
        const speedMatch = t.speed >= useCase.requirements.speed;
        const distanceMatch = t.maxDistance >= useCase.requirements.distance;
        const protocolMatch = t.protocol === useCase.requirements.protocol;
        const formFactorMatch = !useCase.requirements.formFactor ||
          t.formFactor === useCase.requirements.formFactor;

        return speedMatch && distanceMatch && protocolMatch && formFactorMatch;
      });

      // Select the most appropriate (lowest speed that meets requirements)
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
      setMatches(prev => ({
        ...prev,
        [useCaseId]: draggedTransceiver.id
      }));
      setDraggedTransceiver(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveMatch = (useCaseId: string) => {
    setMatches(prev => {
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
    return protocol === 'Ethernet' ? <Wifi className="h-4 w-4" /> : <Database className="h-4 w-4" />;
  };

  const groupedTransceivers = useMemo(() => {
    return {
      'SFP (1G)': TRANSCEIVERS.filter(t => t.formFactor === 'SFP' && t.speed === 1),
      'SFP+ (10G)': TRANSCEIVERS.filter(t => t.formFactor === 'SFP+'),
      'QSFP+ (40G)': TRANSCEIVERS.filter(t => t.formFactor === 'QSFP+'),
      'QSFP28 (100G)': TRANSCEIVERS.filter(t => t.formFactor === 'QSFP28'),
    };
  }, []);

  const completedMatches = Object.keys(matches).length;
  const progressPercentage = (completedMatches / useCases.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-bold">
                {completedMatches} / {useCases.length}
              </div>
              <Progress value={progressPercentage} className="w-32 mt-2" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className="text-sm font-semibold mb-2 text-gray-700">{category}</div>
                  <div className="space-y-2">
                    {transceivers.map((transceiver) => (
                      <div
                        key={transceiver.id}
                        draggable
                        onDragStart={() => handleDragStart(transceiver)}
                        className="p-3 border rounded-lg cursor-move hover:bg-blue-50 transition-colors bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{transceiver.name}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getFormFactorIcon(transceiver.formFactor)}
                                <span className="ml-1">{transceiver.formFactor}</span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getProtocolIcon(transceiver.protocol)}
                                <span className="ml-1">{transceiver.protocol}</span>
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {transceiver.speed}G · {transceiver.maxDistance}m · {transceiver.connectorType}
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
                    <Button
                      onClick={handleSubmit}
                      disabled={completedMatches === 0}
                    >
                      Submit Answers
                    </Button>
                  ) : (
                    <Button onClick={handleReset}>
                      <RefreshCw className="h-4 w-4 mr-1" />
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
                    ? TRANSCEIVERS.find(t => t.id === matchedTransceiverId)
                    : null;
                  const correctTransceiver = correctMatches[useCase.id];
                  const isCorrect = submitted && matchedTransceiver?.id === correctTransceiver?.id;
                  const isIncorrect = submitted && matchedTransceiver && matchedTransceiver.id !== correctTransceiver?.id;

                  return (
                    <div
                      key={useCase.id}
                      onDrop={() => handleDrop(useCase.id)}
                      onDragOver={handleDragOver}
                      className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                        matchedTransceiver
                          ? isCorrect
                            ? 'border-green-500 bg-green-50'
                            : isIncorrect
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium">{useCase.description}</p>
                            {submitted && (
                              isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              ) : isIncorrect ? (
                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                              ) : null
                            )}
                          </div>

                          <div className="flex gap-2 text-xs text-gray-600 mb-3">
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
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                              <div>
                                <div className="text-sm font-medium">{matchedTransceiver.name}</div>
                                <div className="text-xs text-gray-500">
                                  {matchedTransceiver.formFactor} · {matchedTransceiver.speed}G · {matchedTransceiver.maxDistance}m
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
                            <div className="flex items-center justify-center p-4 text-gray-400 text-sm">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Drop transceiver here
                            </div>
                          )}

                          {submitted && isIncorrect && correctTransceiver && (
                            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                              <div className="text-xs font-medium text-green-800 mb-1">Correct Answer:</div>
                              <div className="text-sm">{correctTransceiver.name}</div>
                              <div className="text-xs text-gray-600">
                                {correctTransceiver.formFactor} · {correctTransceiver.speed}G · {correctTransceiver.maxDistance}m
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
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{score}%</div>
                  <div className="text-gray-600 mb-4">
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
    </div>
  );
}
