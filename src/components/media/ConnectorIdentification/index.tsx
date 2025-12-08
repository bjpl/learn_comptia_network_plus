/**
 * ConnectorIdentification - Main orchestrator component
 * Modular architecture for CompTIA Network+ LO 1.4
 */

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Info,
  Cable,
  Zap,
  Eye,
  Award,
  Target,
  Lightbulb,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

import { IdentificationQuiz } from './components/IdentificationQuiz';
import { T568A_LAYOUT, T568B_LAYOUT } from '../media-data';
import { TERMINATION_STEPS, USE_CASE_SCENARIOS } from './constants';
import { getConnectorById } from './data/connectorDatabase';
import { checkWiringOrder, shuffleArray, getPinColorStyle } from './utils/connectorHelpers';
import {
  useConnectorState,
  useWiringState,
  useTerminationState,
  useScenarioState,
} from './hooks/useConnectorState';
import { useIdentificationProgress } from './hooks/useIdentificationProgress';
import type { ConnectorType } from '../media-types';

export default function ConnectorIdentification() {
  const {
    activeTab,
    setActiveTab,
    questions,
    quizState,
    handleAnswerSelect,
    handleSubmit,
    handleNext,
    handlePrevious,
    handleRestartQuiz,
  } = useConnectorState();

  const {
    state: wiringState,
    setWiringStandard,
    setDraggedWires,
    setWiringComplete,
    setWiringAttempts,
  } = useWiringState();

  const {
    state: terminationState,
    setTerminationStep,
    setTerminationComplete,
  } = useTerminationState();

  const {
    state: scenarioState,
    setCurrentScenario,
    setSelectedConnectorCase,
    setScenarioResult,
    setScenarioScore,
  } = useScenarioState();

  const progress = useIdentificationProgress(quizState, scenarioState, questions.length);

  // Wiring trainer initialization
  useEffect(() => {
    if (activeTab === 'wiring') {
      const layout = wiringState.wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;
      const shuffled = shuffleArray(layout.pins);
      setDraggedWires(shuffled);
      setWiringComplete(false);
    }
  }, [activeTab, wiringState.wiringStandard, setDraggedWires, setWiringComplete]);

  // Wiring handlers
  const handleCheckWiring = () => {
    const correctLayout = wiringState.wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;
    const isCorrect = checkWiringOrder(wiringState.draggedWires, correctLayout.pins);
    setWiringComplete(isCorrect);
    setWiringAttempts((prev) => prev + 1);
  };

  const handleResetWiring = () => {
    const layout = wiringState.wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;
    const shuffled = shuffleArray(layout.pins);
    setDraggedWires(shuffled);
    setWiringComplete(false);
  };

  const handleSwitchStandard = (standard: 'T568A' | 'T568B') => {
    setWiringStandard(standard);
    setWiringComplete(false);
    setWiringAttempts(0);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('wireIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('wireIndex'));
    const newWires = [...wiringState.draggedWires];
    [newWires[sourceIndex], newWires[targetIndex]] = [newWires[targetIndex], newWires[sourceIndex]];
    setDraggedWires(newWires);
  };

  // Termination handlers
  const handleNextStep = () => {
    if (terminationState.terminationStep < TERMINATION_STEPS.length - 1) {
      setTerminationStep((prev) => prev + 1);
    } else {
      setTerminationComplete(true);
    }
  };

  const handlePreviousStep = () => {
    if (terminationState.terminationStep > 0) {
      setTerminationStep((prev) => prev - 1);
    }
  };

  const handleRestartTermination = () => {
    setTerminationStep(0);
    setTerminationComplete(false);
  };

  // Scenario handlers
  const handleSelectConnectorCase = (connector: ConnectorType) => {
    setSelectedConnectorCase(connector);
  };

  const handleCheckScenario = () => {
    if (!scenarioState.selectedConnectorCase) return;
    const scenario = USE_CASE_SCENARIOS[scenarioState.currentScenario];
    const isCorrect = scenarioState.selectedConnectorCase === scenario.correctConnector;
    setScenarioResult(isCorrect);
    if (isCorrect) {
      setScenarioScore((prev) => prev + 1);
    }
  };

  const handleNextScenario = () => {
    if (scenarioState.currentScenario < USE_CASE_SCENARIOS.length - 1) {
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

  const currentStep = TERMINATION_STEPS[terminationState.terminationStep];
  const scenario = USE_CASE_SCENARIOS[scenarioState.currentScenario];
  const correctLayout = wiringState.wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;

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
                  <div className="text-2xl font-bold text-blue-600">{progress.overallProgress}%</div>
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
          <IdentificationQuiz
            quizState={quizState}
            questions={questions}
            progressPercentage={progress.quizProgress}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmit}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRestart={handleRestartQuiz}
          />
        </TabsContent>

        {/* T568A/B WIRING TAB - Inline for brevity */}
        <TabsContent value="wiring" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>T568A vs T568B Wiring Trainer</CardTitle>
                  <CardDescription>Drag and drop wires to create the correct wiring order</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={wiringState.wiringStandard === 'T568A' ? 'default' : 'outline'}
                    onClick={() => handleSwitchStandard('T568A')}
                  >
                    T568A
                  </Button>
                  <Button
                    variant={wiringState.wiringStandard === 'T568B' ? 'default' : 'outline'}
                    onClick={() => handleSwitchStandard('T568B')}
                  >
                    T568B
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 text-sm font-medium">
                    {wiringState.wiringStandard === 'T568A' ? 'T568A Standard' : 'T568B Standard'}
                  </div>
                  <p className="text-sm text-gray-700">
                    {wiringState.wiringStandard === 'T568A'
                      ? 'T568A: Used in government installations and provides backward compatibility with telephone systems. Green pairs on pins 1-2.'
                      : 'T568B: Most common in commercial installations. Orange pairs on pins 1-2. Preferred for new installations.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Your Wire Order</h3>
                    <div className="space-y-2">
                      {wiringState.draggedWires.map((pin, index) => (
                        <div
                          key={`drag-${index}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className="flex cursor-move items-center gap-3 rounded border-2 border-gray-300 bg-white p-3 hover:border-blue-400"
                        >
                          <div className="h-10 w-10 rounded" style={getPinColorStyle(pin.color)} />
                          <div className="flex-1">
                            <div className="font-mono text-sm font-bold">Pin {index + 1}</div>
                            <div className="text-xs text-gray-600">{pin.color}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      Correct Order {wiringState.wiringComplete && '✓'}
                    </h3>
                    <div className="space-y-2">
                      {correctLayout.pins.map((pin, index) => (
                        <div
                          key={`correct-${index}`}
                          className={`flex items-center gap-3 rounded border-2 p-3 ${
                            wiringState.wiringComplete
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="h-10 w-10 rounded" style={getPinColorStyle(pin.color)} />
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

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {wiringState.wiringAttempts > 0 && `Attempts: ${wiringState.wiringAttempts}`}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetWiring}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={handleCheckWiring}>Check Wiring</Button>
                  </div>
                </div>

                {wiringState.wiringAttempts > 0 && (
                  <div
                    className={`rounded-lg border-2 p-4 ${
                      wiringState.wiringComplete
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {wiringState.wiringComplete ? (
                        <>
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          <div>
                            <div className="font-semibold text-green-800">Perfect!</div>
                            <div className="text-sm text-green-700">
                              You have correctly wired the {wiringState.wiringStandard} standard.
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-red-600" />
                          <div>
                            <div className="font-semibold text-red-800">Not quite right</div>
                            <div className="text-sm text-red-700">
                              Check the wire order and try again. Compare with the correct order on the
                              right.
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

        {/* TERMINATION TAB - Inline for brevity */}
        <TabsContent value="termination" className="space-y-6">
          {!terminationState.terminationComplete ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Cable Termination Simulator - Step {terminationState.terminationStep + 1} of{' '}
                    {TERMINATION_STEPS.length}
                  </CardTitle>
                  <Progress
                    value={((terminationState.terminationStep + 1) / TERMINATION_STEPS.length) * 100}
                  />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-2 text-2xl font-bold">{currentStep.title}</h2>
                      <p className="text-lg text-gray-700">{currentStep.description}</p>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-800">
                        <Lightbulb className="h-4 w-4" />
                        Pro Tip
                      </div>
                      <p className="text-sm text-blue-700">{currentStep.tip}</p>
                    </div>

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

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        disabled={terminationState.terminationStep === 0}
                      >
                        Previous Step
                      </Button>
                      <Button onClick={handleNextStep}>
                        {terminationState.terminationStep === TERMINATION_STEPS.length - 1
                          ? 'Complete'
                          : 'Next Step'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                          idx === terminationState.terminationStep
                            ? 'bg-blue-500 text-white'
                            : idx < terminationState.terminationStep
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

        {/* FIBER TAB - Inline for brevity */}
        <TabsContent value="fiber" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fiber Polishing and Endface Inspection</CardTitle>
              <CardDescription>Learn about fiber connector polish types and inspection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg border-2 border-gray-300 p-4">
                  <h3 className="mb-2 text-lg font-bold">PC (Physical Contact)</h3>
                  <div className="mb-3 flex h-40 items-center justify-center rounded bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-400 dark:text-gray-200">PC</div>
                      <div className="text-xs text-gray-500">Flat Polish</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Return Loss:</strong> -35 dB to -40 dB</li>
                    <li>• <strong>Use:</strong> Multimode fiber</li>
                    <li>• <strong>Polish:</strong> Flat endface</li>
                    <li>• <strong>Color:</strong> Typically blue</li>
                  </ul>
                </div>

                <div className="rounded-lg border-2 border-blue-500 p-4">
                  <h3 className="mb-2 text-lg font-bold text-blue-700">UPC (Ultra Physical Contact)</h3>
                  <div className="mb-3 flex h-40 items-center justify-center rounded bg-blue-50">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400">UPC</div>
                      <div className="text-xs text-blue-600">Curved Polish</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Return Loss:</strong> -50 dB or better</li>
                    <li>• <strong>Use:</strong> Single-mode fiber</li>
                    <li>• <strong>Polish:</strong> Slight curve</li>
                    <li>• <strong>Color:</strong> Blue connector</li>
                  </ul>
                </div>

                <div className="rounded-lg border-2 border-green-500 p-4">
                  <h3 className="mb-2 text-lg font-bold text-green-700">APC (Angled Physical Contact)</h3>
                  <div className="mb-3 flex h-40 items-center justify-center rounded bg-green-50">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400">APC</div>
                      <div className="text-xs text-green-600">8° Angle</div>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Return Loss:</strong> -60 dB or better</li>
                    <li>• <strong>Use:</strong> High-performance SMF</li>
                    <li>• <strong>Polish:</strong> 8° angle</li>
                    <li>• <strong>Color:</strong> Green connector</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

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
                      <strong>Insertion Loss:</strong> Loss of signal power resulting from insertion of
                      device (connector, splice). Measured in dB. Lower is better.
                    </div>
                    <div>
                      <strong>Return Loss:</strong> Light reflected back toward source. Measured in
                      negative dB. Higher magnitude (more negative) is better. Critical for high-speed
                      applications.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SCENARIOS TAB - Inline for brevity */}
        <TabsContent value="scenarios" className="space-y-6">
          {scenarioState.currentScenario < USE_CASE_SCENARIOS.length ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Use Case Scenario {scenarioState.currentScenario + 1} of{' '}
                      {USE_CASE_SCENARIOS.length}
                    </CardTitle>
                    <Badge variant="outline">
                      Score: {scenarioState.scenarioScore} /{' '}
                      {scenarioState.currentScenario + (scenarioState.scenarioResult !== null ? 1 : 0)}
                    </Badge>
                  </div>
                  <Progress
                    value={((scenarioState.currentScenario + 1) / USE_CASE_SCENARIOS.length) * 100}
                  />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg bg-gray-50 p-6">
                      <h3 className="mb-2 text-lg font-semibold">Scenario:</h3>
                      <p className="text-gray-700">{scenario.scenario}</p>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold">Select the Best Connector:</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[scenario.correctConnector, ...scenario.incorrectConnectors]
                          .sort(() => Math.random() - 0.5)
                          .map((connectorId) => {
                            const connector = getConnectorById(connectorId);
                            if (!connector) return null;

                            const isSelected = scenarioState.selectedConnectorCase === connectorId;
                            const isCorrect = connectorId === scenario.correctConnector;

                            return (
                              <Button
                                key={connectorId}
                                variant={isSelected ? 'default' : 'outline'}
                                className={`h-auto flex-col gap-2 py-6 ${
                                  scenarioState.scenarioResult !== null && isCorrect
                                    ? 'border-green-500 bg-green-100'
                                    : scenarioState.scenarioResult !== null && isSelected && !isCorrect
                                      ? 'border-red-500 bg-red-100'
                                      : ''
                                }`}
                                onClick={() => handleSelectConnectorCase(connectorId)}
                                disabled={scenarioState.scenarioResult !== null}
                              >
                                {scenarioState.scenarioResult !== null && isCorrect && (
                                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                                )}
                                {scenarioState.scenarioResult !== null && isSelected && !isCorrect && (
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

                    <div className="flex justify-end gap-2">
                      {scenarioState.scenarioResult === null ? (
                        <Button
                          onClick={handleCheckScenario}
                          disabled={!scenarioState.selectedConnectorCase}
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <Button onClick={handleNextScenario}>
                          Next Scenario
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {scenarioState.scenarioResult !== null && (
                      <div
                        className={`rounded-lg border-2 p-4 ${
                          scenarioState.scenarioResult
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {scenarioState.scenarioResult ? (
                            <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                          ) : (
                            <XCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                          )}
                          <div className="flex-1">
                            <div
                              className={`mb-2 font-semibold ${
                                scenarioState.scenarioResult ? 'text-green-800' : 'text-red-800'
                              }`}
                            >
                              {scenarioState.scenarioResult ? 'Correct!' : 'Incorrect'}
                            </div>
                            <p
                              className={`text-sm ${
                                scenarioState.scenarioResult ? 'text-green-700' : 'text-red-700'
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
                      {Math.round((scenarioState.scenarioScore / USE_CASE_SCENARIOS.length) * 100)}%
                    </div>
                    <div className="text-xl text-gray-700">
                      You scored {scenarioState.scenarioScore} out of {USE_CASE_SCENARIOS.length}
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
              • <strong>Visual Identification:</strong> Be able to identify connectors by sight on the
              exam
            </li>
            <li>
              • <strong>T568A vs T568B:</strong> Know pin arrangements and when to use each standard
            </li>
            <li>
              • <strong>Fiber Connectors:</strong> Understand SC (square/push-pull), LC (small), ST
              (bayonet), MPO (multi-fiber)
            </li>
            <li>
              • <strong>Cable Types:</strong> Match connectors to cable types (fiber, copper, coaxial)
            </li>
            <li>
              • <strong>Crossover Cables:</strong> Created by mixing T568A and T568B on same cable
            </li>
            <li>
              • <strong>Auto-MDIX:</strong> Modern switches automatically detect and adapt, eliminating
              need for crossover cables
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
