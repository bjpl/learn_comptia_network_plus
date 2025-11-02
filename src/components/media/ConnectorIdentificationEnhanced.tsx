/**
 * Enhanced Connector Identification Component
 * Interactive training tool for CompTIA Network+ LO 1.4
 * Includes identification quiz, wiring trainer, termination simulator, and fiber inspection
 */

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Info,
  TrendingUp,
  Cable,
  Zap,
  Eye,
  Award,
  Target,
  Lightbulb,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import Connector3DViewer from './Connector3DViewer';
import { CONNECTORS, T568A_LAYOUT, T568B_LAYOUT } from './media-data';
import type { ConnectorType, Pin } from './media-types';

interface ConnectorQuestion {
  connectorId: ConnectorType;
  options: ConnectorType[];
}

// interface _WiringChallenge - Reserved for future use
// Reserved for future wiring challenge feature
// interface WiringChallenge {
//   standard: 'T568A' | 'T568B';
//   currentOrder: Pin[];
//   correctOrder: Pin[];
// }

interface TerminationStep {
  id: number;
  title: string;
  description: string;
  tip: string;
  commonMistakes: string[];
}

interface UseCaseScenario {
  id: string;
  scenario: string;
  correctConnector: ConnectorType;
  incorrectConnectors: ConnectorType[];
  explanation: string;
}

const TERMINATION_STEPS: TerminationStep[] = [
  {
    id: 1,
    title: 'Strip Outer Jacket',
    description: 'Remove 1-1.5 inches of the outer cable jacket using a cable stripper',
    tip: 'Be careful not to nick the inner wires',
    commonMistakes: ['Stripping too much jacket', 'Cutting into wire insulation', 'Uneven cuts'],
  },
  {
    id: 2,
    title: 'Untwist Wire Pairs',
    description: 'Carefully untwist the four pairs of wires, maintaining pair integrity',
    tip: 'Untwist only as much as necessary (about 0.5 inches)',
    commonMistakes: [
      'Untwisting too much (causes crosstalk)',
      'Damaging wire insulation',
      'Mixing up pairs',
    ],
  },
  {
    id: 3,
    title: 'Arrange Wires',
    description: 'Arrange wires in correct order according to T568A or T568B standard',
    tip: 'Double-check color order before proceeding',
    commonMistakes: ['Wrong color order', 'Mixing T568A and T568B', 'Crossed wires'],
  },
  {
    id: 4,
    title: 'Trim Wires',
    description: 'Trim wires to be even, leaving about 1/2 inch from jacket',
    tip: 'Use proper wire cutters for a clean, straight cut',
    commonMistakes: [
      'Uneven wire lengths',
      "Too short (won't reach pins)",
      "Too long (won't crimp properly)",
    ],
  },
  {
    id: 5,
    title: 'Insert into RJ45',
    description: 'Insert wires fully into RJ45 connector until they reach the end',
    tip: 'Ensure jacket enters connector for strain relief',
    commonMistakes: [
      'Wires not fully inserted',
      'Jacket not inside connector',
      'Wire order changed during insertion',
    ],
  },
  {
    id: 6,
    title: 'Crimp Connector',
    description: 'Use crimping tool to firmly crimp the RJ45 connector',
    tip: 'One firm squeeze is better than multiple partial crimps',
    commonMistakes: ['Partial crimp', 'Crimping at wrong angle', 'Insufficient pressure'],
  },
  {
    id: 7,
    title: 'Test Cable',
    description: 'Use cable tester to verify all pins are properly connected',
    tip: 'Test for continuity, shorts, and proper wiring',
    commonMistakes: ['Skipping testing', 'Not checking all pins', 'Ignoring intermittent failures'],
  },
];

const USE_CASE_SCENARIOS: UseCaseScenario[] = [
  {
    id: 'uc1',
    scenario:
      'Connecting multiple servers in a datacenter rack with limited space and high density requirements',
    correctConnector: 'LC',
    incorrectConnectors: ['SC', 'ST', 'RJ45'],
    explanation:
      'LC connectors have a small form factor (half the size of SC), making them ideal for high-density datacenter applications. Their latch mechanism provides secure connections.',
  },
  {
    id: 'uc2',
    scenario: 'Standard office desktop computer connection to wall jack, 50 meters from switch',
    correctConnector: 'RJ45',
    incorrectConnectors: ['RJ11', 'LC', 'F-type'],
    explanation:
      'RJ45 is the standard Ethernet connector for copper twisted-pair cabling, supporting up to 100 meters and commonly used for desktop connections.',
  },
  {
    id: 'uc3',
    scenario: 'Connecting two buildings 2km apart on a campus with 10Gbps bandwidth requirements',
    correctConnector: 'LC',
    incorrectConnectors: ['RJ45', 'BNC', 'RJ11'],
    explanation:
      'Single-mode fiber with LC connectors can support 10Gbps over long distances (10km+), making it ideal for building-to-building connections.',
  },
  {
    id: 'uc4',
    scenario: 'Legacy multimode fiber installation from 1990s requiring bayonet-style connection',
    correctConnector: 'ST',
    incorrectConnectors: ['LC', 'SC', 'MPO'],
    explanation:
      'ST connectors with bayonet twist-lock mechanism were common in legacy installations and are still found in older multimode fiber systems.',
  },
  {
    id: 'uc5',
    scenario: 'Analog telephone connection for fax machine',
    correctConnector: 'RJ11',
    incorrectConnectors: ['RJ45', 'LC', 'BNC'],
    explanation:
      'RJ11 is the standard telephone connector with 6 positions, used for analog phone lines, fax machines, and modems.',
  },
  {
    id: 'uc6',
    scenario: 'Cable TV modem connection to service provider coaxial cable',
    correctConnector: 'F-type',
    incorrectConnectors: ['BNC', 'RJ45', 'RJ11'],
    explanation:
      'F-type connectors are threaded coaxial connectors used for cable TV and cable internet services, providing secure weather-resistant connections.',
  },
  {
    id: 'uc7',
    scenario: '40Gbps or 100Gbps spine-leaf datacenter connection using ribbon fiber cable',
    correctConnector: 'MPO',
    incorrectConnectors: ['LC', 'SC', 'ST'],
    explanation:
      'MPO (Multi-fiber Push On) connectors can handle 12 or 24 fibers simultaneously, making them ideal for high-bandwidth datacenter spine-leaf architectures.',
  },
  {
    id: 'uc8',
    scenario: 'Professional video camera BNC output to production switcher',
    correctConnector: 'BNC',
    incorrectConnectors: ['F-type', 'RJ45', 'LC'],
    explanation:
      'BNC connectors with bayonet mount provide quick, secure connections for professional video equipment and are commonly used in broadcast and security camera systems.',
  },
];

export default function ConnectorIdentificationEnhanced() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ConnectorType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Wiring trainer state
  const [wiringStandard, setWiringStandard] = useState<'T568A' | 'T568B'>('T568B');
  const [draggedWires, setDraggedWires] = useState<Pin[]>([]);
  const [wiringComplete, setWiringComplete] = useState(false);
  const [wiringAttempts, setWiringAttempts] = useState(0);

  // Termination simulator state
  const [terminationStep, setTerminationStep] = useState(0);
  const [terminationComplete, setTerminationComplete] = useState(false);

  // Use case matcher state
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedConnectorCase, setSelectedConnectorCase] = useState<ConnectorType | null>(null);
  const [scenarioResult, setScenarioResult] = useState<boolean | null>(null);
  const [scenarioScore, setScenarioScore] = useState(0);

  // Generate identification quiz questions
  const questions: ConnectorQuestion[] = useMemo(() => {
    return CONNECTORS.map((connector) => {
      const otherConnectors = CONNECTORS.filter((c) => c.id !== connector.id);
      const shuffled = [...otherConnectors].sort(() => Math.random() - 0.5);
      const wrongOptions = shuffled.slice(0, 3).map((c) => c.id);
      const options = [connector.id, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        connectorId: connector.id,
        options,
      };
    });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentConnector = CONNECTORS.find((c) => c.id === currentQuestion.connectorId);
  const progressPercentage = (answeredQuestions.size / questions.length) * 100;
  const isCorrect = showResult && selectedAnswer === currentQuestion.connectorId;
  const isComplete = answeredQuestions.size === questions.length;

  // Wiring trainer initialization
  useEffect(() => {
    if (activeTab === 'wiring') {
      const layout = wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;
      const shuffled = [...layout.pins].sort(() => Math.random() - 0.5);
      setDraggedWires(shuffled);
      setWiringComplete(false);
    }
  }, [activeTab, wiringStandard]);

  // Quiz handlers
  const handleAnswerSelect = (answer: ConnectorType) => {
    if (showResult) {
      return;
    }
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      return;
    }
    setShowResult(true);
    if (selectedAnswer === currentQuestion.connectorId) {
      setScore((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  // Wiring trainer handlers
  const handleCheckWiring = () => {
    const correctLayout = wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;
    const isCorrectOrder = draggedWires.every(
      (wire, idx) => wire.number === correctLayout.pins[idx].number
    );

    setWiringComplete(isCorrectOrder);
    setWiringAttempts((prev) => prev + 1);
  };

  const handleResetWiring = () => {
    const layout = wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;
    const shuffled = [...layout.pins].sort(() => Math.random() - 0.5);
    setDraggedWires(shuffled);
    setWiringComplete(false);
  };

  const handleSwitchStandard = (standard: 'T568A' | 'T568B') => {
    setWiringStandard(standard);
    setWiringComplete(false);
    setWiringAttempts(0);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('wireIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('wireIndex'));

    const newWires = [...draggedWires];
    [newWires[sourceIndex], newWires[targetIndex]] = [newWires[targetIndex], newWires[sourceIndex]];
    setDraggedWires(newWires);
  };

  // Termination simulator handlers
  const handleNextStep = () => {
    if (terminationStep < TERMINATION_STEPS.length - 1) {
      setTerminationStep((prev) => prev + 1);
    } else {
      setTerminationComplete(true);
    }
  };

  const handlePreviousStep = () => {
    if (terminationStep > 0) {
      setTerminationStep((prev) => prev - 1);
    }
  };

  const handleRestartTermination = () => {
    setTerminationStep(0);
    setTerminationComplete(false);
  };

  // Use case scenario handlers
  const handleSelectConnectorCase = (connector: ConnectorType) => {
    setSelectedConnectorCase(connector);
  };

  const handleCheckScenario = () => {
    if (!selectedConnectorCase) {
      return;
    }

    const scenario = USE_CASE_SCENARIOS[currentScenario];
    const isCorrect = selectedConnectorCase === scenario.correctConnector;
    setScenarioResult(isCorrect);

    if (isCorrect) {
      setScenarioScore((prev) => prev + 1);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < USE_CASE_SCENARIOS.length - 1) {
      setCurrentScenario((prev) => prev + 1);
      setSelectedConnectorCase(null);
      setScenarioResult(null);
    }
  };

  const handleRestartScenarios = () => {
    setCurrentScenario(0);
    setSelectedConnectorCase(null);
    setScenarioResult(null);
    setScenarioScore(0);
  };

  const currentStep = TERMINATION_STEPS[terminationStep];
  const scenario = USE_CASE_SCENARIOS[currentScenario];
  const correctLayout = wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cable className="h-6 w-6" />
                Connector Lab Enhancement
              </CardTitle>
              <CardDescription>
                Interactive training for CompTIA Network+ LO 1.4 - Connector identification and
                termination
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-500">Overall Progress</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      ((score + scenarioScore) / (questions.length + USE_CASE_SCENARIOS.length)) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quiz">
            <Target className="mr-1 h-4 w-4" />
            Identification
          </TabsTrigger>
          <TabsTrigger value="wiring">
            <Cable className="mr-1 h-4 w-4" />
            T568A/B Wiring
          </TabsTrigger>
          <TabsTrigger value="termination">
            <Zap className="mr-1 h-4 w-4" />
            Termination
          </TabsTrigger>
          <TabsTrigger value="fiber">
            <Eye className="mr-1 h-4 w-4" />
            Fiber Inspection
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            <Lightbulb className="mr-1 h-4 w-4" />
            Use Cases
          </TabsTrigger>
        </TabsList>

        {/* IDENTIFICATION QUIZ TAB */}
        <TabsContent value="quiz" className="space-y-6">
          {!isComplete ? (
            <>
              {/* Question card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </CardTitle>
                    <Badge variant="outline">{currentConnector?.type}</Badge>
                  </div>
                  <CardDescription>Identify the connector shown in the 3D model</CardDescription>
                  <Progress value={progressPercentage} className="mt-2" />
                </CardHeader>
                <CardContent>
                  <Connector3DViewer
                    connectorType={currentQuestion.connectorId}
                    autoRotate
                    showLabels={false}
                    showControls={true}
                    height="400px"
                  />
                </CardContent>
              </Card>

              {/* Answer options */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {currentQuestion.options.map((optionId) => {
                      const option = CONNECTORS.find((c) => c.id === optionId);
                      if (!option) {
                        return null;
                      }

                      const isSelected = selectedAnswer === optionId;
                      const isCorrectAnswer = optionId === currentQuestion.connectorId;

                      return (
                        <Button
                          key={optionId}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`h-auto justify-start px-6 py-4 ${
                            showResult && isCorrectAnswer
                              ? 'border-green-500 bg-green-100 hover:bg-green-100'
                              : showResult && isSelected && !isCorrectAnswer
                                ? 'border-red-500 bg-red-100 hover:bg-red-100'
                                : ''
                          }`}
                          onClick={() => handleAnswerSelect(optionId)}
                          disabled={showResult}
                        >
                          <div className="flex w-full items-center gap-3">
                            {showResult && isCorrectAnswer && (
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                            )}
                            {showResult && isSelected && !isCorrectAnswer && (
                              <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                            )}
                            <div className="flex-1 text-left">
                              <div className="font-semibold">{option.name}</div>
                              {showResult && (
                                <div className="mt-1 text-sm text-gray-600">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>

                    {!showResult ? (
                      <Button onClick={handleSubmit} disabled={!selectedAnswer}>
                        Submit Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        disabled={currentQuestionIndex === questions.length - 1}
                      >
                        Next Question
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Result feedback */}
              {showResult && currentConnector && (
                <Card className={`border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          Incorrect
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 text-lg font-semibold">{currentConnector.name}</div>
                        <p className="text-gray-700">{currentConnector.description}</p>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium">Typical Uses:</div>
                        <ul className="list-inside list-disc space-y-1">
                          {currentConnector.typicalUse.map((use, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              {use}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium">Key Features:</div>
                        <div className="flex flex-wrap gap-2">
                          {currentConnector.keyFeatures.map((feature, idx) => (
                            <Badge key={idx} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Completion card */
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Quiz Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-center">
                  <div>
                    <div className="mb-2 text-6xl font-bold text-blue-600">
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                    <div className="text-xl text-gray-700">
                      You scored {score} out of {questions.length}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {score === questions.length && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <p className="font-semibold text-green-800">Perfect Score!</p>
                        <p className="text-sm text-green-700">
                          Excellent work! You have mastered connector identification.
                        </p>
                      </div>
                    )}
                    {score >= questions.length * 0.7 && score < questions.length && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="font-semibold text-blue-800">Great Job!</p>
                        <p className="text-sm text-blue-700">
                          You have a strong understanding of network connectors.
                        </p>
                      </div>
                    )}
                    {score < questions.length * 0.7 && (
                      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <p className="font-semibold text-yellow-800">Keep Practicing!</p>
                        <p className="text-sm text-yellow-700">
                          Review the connector types and try again to improve your score.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleRestartQuiz} size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restart Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* T568A/B WIRING TAB */}
        <TabsContent value="wiring" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>T568A vs T568B Wiring Trainer</CardTitle>
                  <CardDescription>
                    Drag and drop wires to create the correct wiring order
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={wiringStandard === 'T568A' ? 'default' : 'outline'}
                    onClick={() => handleSwitchStandard('T568A')}
                  >
                    T568A
                  </Button>
                  <Button
                    variant={wiringStandard === 'T568B' ? 'default' : 'outline'}
                    onClick={() => handleSwitchStandard('T568B')}
                  >
                    T568B
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current wiring standard info */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 text-sm font-medium">
                    {wiringStandard === 'T568A' ? 'T568A Standard' : 'T568B Standard'}
                  </div>
                  <p className="text-sm text-gray-700">
                    {wiringStandard === 'T568A'
                      ? 'T568A: Used in government installations and provides backward compatibility with telephone systems. Green pairs on pins 1-2.'
                      : 'T568B: Most common in commercial installations. Orange pairs on pins 1-2. Preferred for new installations.'}
                  </p>
                </div>

                {/* Drag and drop interface */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Current order (draggable) */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Your Wire Order</h3>
                    <div className="space-y-2">
                      {draggedWires.map((pin, index) => (
                        <div
                          key={`drag-${index}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className="flex cursor-move items-center gap-3 rounded border-2 border-gray-300 bg-white p-3 hover:border-blue-400"
                        >
                          <div
                            className="h-10 w-10 rounded"
                            style={{
                              backgroundColor: pin.color.includes('white')
                                ? `#${pin.color.split('-')[1] || 'cccccc'}33`
                                : pin.color === 'unused'
                                  ? '#cccccc'
                                  : pin.color,
                              border: '2px solid #333',
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-mono text-sm font-bold">Pin {index + 1}</div>
                            <div className="text-xs text-gray-600">{pin.color}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct order (reference) */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      Correct Order {wiringComplete && '✓'}
                    </h3>
                    <div className="space-y-2">
                      {correctLayout.pins.map((pin, index) => (
                        <div
                          key={`correct-${index}`}
                          className={`flex items-center gap-3 rounded border-2 p-3 ${
                            wiringComplete
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div
                            className="h-10 w-10 rounded"
                            style={{
                              backgroundColor: pin.color.includes('white')
                                ? `#${pin.color.split('-')[1]}33`
                                : pin.color,
                              border: '2px solid #333',
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-mono text-sm font-bold">Pin {pin.number}</div>
                            <div className="text-xs text-gray-600">
                              {pin.color} - {pin.function}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {wiringAttempts > 0 && `Attempts: ${wiringAttempts}`}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetWiring}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={handleCheckWiring}>Check Wiring</Button>
                  </div>
                </div>

                {/* Result */}
                {wiringAttempts > 0 && (
                  <div
                    className={`rounded-lg border-2 p-4 ${
                      wiringComplete ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {wiringComplete ? (
                        <>
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          <div>
                            <div className="font-semibold text-green-800">Perfect!</div>
                            <div className="text-sm text-green-700">
                              You have correctly wired the {wiringStandard} standard.
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          <div>
                            <div className="font-semibold text-red-800">Not quite right</div>
                            <div className="text-sm text-red-700">
                              Check the wire order and try again. Compare with the correct order on
                              the right.
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Wiring standards comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                T568A vs T568B Key Differences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h3 className="mb-2 font-semibold text-green-800">T568A</h3>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Green pairs on pins 1-2</li>
                    <li>• Orange pairs on pins 3-6</li>
                    <li>• Government/federal standard</li>
                    <li>• Backward compatible with USOC</li>
                    <li>• Used in residential installations</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <h3 className="mb-2 font-semibold text-orange-800">T568B</h3>
                  <ul className="space-y-1 text-sm text-orange-700">
                    <li>• Orange pairs on pins 1-2</li>
                    <li>• Green pairs on pins 3-6</li>
                    <li>• Most common commercial standard</li>
                    <li>• Preferred for new installations</li>
                    <li>• Industry standard in US</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 text-sm font-medium">Important Notes:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Both standards have identical performance</li>
                  <li>• Mixing standards on the same cable creates a crossover cable</li>
                  <li>• Auto-MDIX in modern switches eliminates need for crossover cables</li>
                  <li>• Consistency is key - use same standard throughout installation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TERMINATION SIMULATOR TAB */}
        <TabsContent value="termination" className="space-y-6">
          {!terminationComplete ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Cable Termination Simulator - Step {terminationStep + 1} of{' '}
                    {TERMINATION_STEPS.length}
                  </CardTitle>
                  <Progress value={((terminationStep + 1) / TERMINATION_STEPS.length) * 100} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current step */}
                    <div>
                      <h2 className="mb-2 text-2xl font-bold">{currentStep.title}</h2>
                      <p className="text-lg text-gray-700">{currentStep.description}</p>
                    </div>

                    {/* Tip */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-800">
                        <Lightbulb className="h-4 w-4" />
                        Pro Tip
                      </div>
                      <p className="text-sm text-blue-700">{currentStep.tip}</p>
                    </div>

                    {/* Common mistakes */}
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="mb-2 text-sm font-medium text-red-800">
                        Common Mistakes to Avoid:
                      </div>
                      <ul className="space-y-1">
                        {currentStep.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="text-sm text-red-700">
                            • {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        disabled={terminationStep === 0}
                      >
                        Previous Step
                      </Button>
                      <Button onClick={handleNextStep}>
                        {terminationStep === TERMINATION_STEPS.length - 1
                          ? 'Complete'
                          : 'Next Step'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step progress indicator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Termination Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {TERMINATION_STEPS.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`rounded p-2 text-center text-xs ${
                          idx === terminationStep
                            ? 'bg-blue-500 text-white'
                            : idx < terminationStep
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Completion */
            <Card className="border-2 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Termination Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <p className="text-lg text-gray-700">
                    You have successfully completed the cable termination process!
                  </p>
                  <div className="rounded-lg bg-green-50 p-4">
                    <h3 className="mb-2 font-semibold text-green-800">What You Learned:</h3>
                    <ul className="space-y-1 text-left text-sm text-green-700">
                      <li>• Proper jacket stripping techniques</li>
                      <li>• Correct wire arrangement (T568A/B)</li>
                      <li>• Professional crimping procedures</li>
                      <li>• Cable testing and validation</li>
                      <li>• Common mistakes to avoid</li>
                    </ul>
                  </div>
                  <Button onClick={handleRestartTermination} size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Practice Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* FIBER INSPECTION TAB */}
        <TabsContent value="fiber" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fiber Polishing and Endface Inspection</CardTitle>
              <CardDescription>
                Learn about fiber connector polish types and inspection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* PC Polish */}
                <div className="rounded-lg border-2 border-gray-300 p-4">
                  <h3 className="mb-2 text-lg font-bold">PC (Physical Contact)</h3>
                  <div className="mb-3 flex h-40 items-center justify-center rounded bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-400 dark:text-gray-200">PC</div>
                      <div className="text-xs text-gray-500">Flat Polish</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • <strong>Return Loss:</strong> -35 dB to -40 dB
                    </li>
                    <li>
                      • <strong>Use:</strong> Multimode fiber
                    </li>
                    <li>
                      • <strong>Polish:</strong> Flat endface
                    </li>
                    <li>
                      • <strong>Color:</strong> Typically blue
                    </li>
                  </ul>
                </div>

                {/* UPC Polish */}
                <div className="rounded-lg border-2 border-blue-500 p-4">
                  <h3 className="mb-2 text-lg font-bold text-blue-700">
                    UPC (Ultra Physical Contact)
                  </h3>
                  <div className="mb-3 flex h-40 items-center justify-center rounded bg-blue-50">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400">UPC</div>
                      <div className="text-xs text-blue-600">Curved Polish</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • <strong>Return Loss:</strong> -50 dB or better
                    </li>
                    <li>
                      • <strong>Use:</strong> Single-mode fiber
                    </li>
                    <li>
                      • <strong>Polish:</strong> Slight curve
                    </li>
                    <li>
                      • <strong>Color:</strong> Blue connector
                    </li>
                  </ul>
                </div>

                {/* APC Polish */}
                <div className="rounded-lg border-2 border-green-500 p-4">
                  <h3 className="mb-2 text-lg font-bold text-green-700">
                    APC (Angled Physical Contact)
                  </h3>
                  <div className="mb-3 flex h-40 items-center justify-center rounded bg-green-50">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400">APC</div>
                      <div className="text-xs text-green-600">8° Angle</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>
                      • <strong>Return Loss:</strong> -60 dB or better
                    </li>
                    <li>
                      • <strong>Use:</strong> High-performance SMF
                    </li>
                    <li>
                      • <strong>Polish:</strong> 8° angle
                    </li>
                    <li>
                      • <strong>Color:</strong> Green connector
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endface inspection */}
          <Card>
            <CardHeader>
              <CardTitle>Endface Inspection Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h4 className="mb-2 font-semibold text-green-800">Good Endface</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Clean, scratch-free surface</li>
                      <li>• No visible contamination</li>
                      <li>• Proper polish geometry</li>
                      <li>• Low insertion loss (typically &lt; 0.3 dB)</li>
                      <li>• Meets return loss specifications</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="mb-2 font-semibold text-red-800">Defective Endface</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>• Scratches or pits in core</li>
                      <li>• Dust or oil contamination</li>
                      <li>• Chips or cracks</li>
                      <li>• High insertion loss (&gt; 0.5 dB)</li>
                      <li>• Poor return loss</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 text-sm font-medium">Inspection Best Practices:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Always inspect both connector ends before mating</li>
                    <li>• Use proper fiber microscope or inspection probe</li>
                    <li>• Clean with approved fiber cleaning tools</li>
                    <li>• Document inspection results for quality assurance</li>
                    <li>• Never mix PC/UPC with APC connectors</li>
                    <li>• Follow IEC 61300-3-35 standards for pass/fail criteria</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-yellow-800">
                    Insertion Loss vs Return Loss:
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-yellow-700">
                    <div>
                      <strong>Insertion Loss:</strong> Loss of signal power resulting from insertion
                      of device (connector, splice). Measured in dB. Lower is better.
                    </div>
                    <div>
                      <strong>Return Loss:</strong> Light reflected back toward source. Measured in
                      negative dB. Higher magnitude (more negative) is better. Critical for
                      high-speed applications.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USE CASE SCENARIOS TAB */}
        <TabsContent value="scenarios" className="space-y-6">
          {currentScenario < USE_CASE_SCENARIOS.length ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Use Case Scenario {currentScenario + 1} of {USE_CASE_SCENARIOS.length}
                    </CardTitle>
                    <Badge variant="outline">
                      Score: {scenarioScore} / {currentScenario + (scenarioResult !== null ? 1 : 0)}
                    </Badge>
                  </div>
                  <Progress value={((currentScenario + 1) / USE_CASE_SCENARIOS.length) * 100} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Scenario description */}
                    <div className="rounded-lg bg-gray-50 p-6">
                      <h3 className="mb-2 text-lg font-semibold">Scenario:</h3>
                      <p className="text-gray-700">{scenario.scenario}</p>
                    </div>

                    {/* Connector options */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold">Select the Best Connector:</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[scenario.correctConnector, ...scenario.incorrectConnectors]
                          .sort(() => Math.random() - 0.5)
                          .map((connectorId) => {
                            const connector = CONNECTORS.find((c) => c.id === connectorId);
                            if (!connector) {
                              return null;
                            }

                            const isSelected = selectedConnectorCase === connectorId;
                            const isCorrect = connectorId === scenario.correctConnector;

                            return (
                              <Button
                                key={connectorId}
                                variant={isSelected ? 'default' : 'outline'}
                                className={`h-auto flex-col gap-2 py-6 ${
                                  scenarioResult !== null && isCorrect
                                    ? 'border-green-500 bg-green-100'
                                    : scenarioResult !== null && isSelected && !isCorrect
                                      ? 'border-red-500 bg-red-100'
                                      : ''
                                }`}
                                onClick={() => handleSelectConnectorCase(connectorId)}
                                disabled={scenarioResult !== null}
                              >
                                {scenarioResult !== null && isCorrect && (
                                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                                )}
                                {scenarioResult !== null && isSelected && !isCorrect && (
                                  <XCircle className="h-6 w-6 text-red-600" />
                                )}
                                <div className="text-center">
                                  <div className="font-semibold">{connector.name}</div>
                                  <Badge variant="outline" className="mt-1">
                                    {connector.type}
                                  </Badge>
                                </div>
                              </Button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-end gap-2">
                      {scenarioResult === null ? (
                        <Button onClick={handleCheckScenario} disabled={!selectedConnectorCase}>
                          Submit Answer
                        </Button>
                      ) : (
                        <Button onClick={handleNextScenario}>
                          Next Scenario
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Result explanation */}
                    {scenarioResult !== null && (
                      <div
                        className={`rounded-lg border-2 p-4 ${
                          scenarioResult
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {scenarioResult ? (
                            <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                          ) : (
                            <XCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                          )}
                          <div className="flex-1">
                            <div
                              className={`mb-2 font-semibold ${
                                scenarioResult ? 'text-green-800' : 'text-red-800'
                              }`}
                            >
                              {scenarioResult ? 'Correct!' : 'Incorrect'}
                            </div>
                            <p
                              className={`text-sm ${
                                scenarioResult ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {scenario.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Scenarios complete */
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  All Scenarios Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-center">
                  <div>
                    <div className="mb-2 text-6xl font-bold text-blue-600">
                      {Math.round((scenarioScore / USE_CASE_SCENARIOS.length) * 100)}%
                    </div>
                    <div className="text-xl text-gray-700">
                      You scored {scenarioScore} out of {USE_CASE_SCENARIOS.length}
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-blue-800">Key Takeaways:</h3>
                    <ul className="space-y-1 text-left text-sm text-blue-700">
                      <li>• Match connector types to specific use cases</li>
                      <li>• Consider distance, bandwidth, and environment</li>
                      <li>• Understand fiber vs copper applications</li>
                      <li>• Know legacy vs modern connector standards</li>
                    </ul>
                  </div>

                  <Button onClick={handleRestartScenarios} size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Study tips card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            CompTIA Network+ Exam Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • <strong>Visual Identification:</strong> Be able to identify connectors by sight on
              the exam
            </li>
            <li>
              • <strong>T568A vs T568B:</strong> Know pin arrangements and when to use each standard
            </li>
            <li>
              • <strong>Fiber Connectors:</strong> Understand SC (square/push-pull), LC (small), ST
              (bayonet), MPO (multi-fiber)
            </li>
            <li>
              • <strong>Cable Types:</strong> Match connectors to cable types (fiber, copper,
              coaxial)
            </li>
            <li>
              • <strong>Crossover Cables:</strong> Created by mixing T568A and T568B on same cable
            </li>
            <li>
              • <strong>Auto-MDIX:</strong> Modern switches automatically detect and adapt,
              eliminating need for crossover cables
            </li>
            <li>
              • <strong>Fiber Polish:</strong> PC (multimode), UPC (single-mode), APC (angled, best
              return loss)
            </li>
            <li>
              • <strong>Testing:</strong> Always test terminated cables before deployment
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
