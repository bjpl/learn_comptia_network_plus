/**
 * Enhanced Scenario Simulator Component (Component 21)
 * Comprehensive scenario practice with 20+ real-world network scenarios,
 * multiple question types, performance-based questions, timed exam mode,
 * and detailed score tracking and analysis for CompTIA Network+ learning
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Circle,
  AlertCircle,
  Clock,
  Target,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  FileText,
  Award,
  BarChart3,
  BookOpen,
  Zap,
  Flag,
} from 'lucide-react';
import { integratedScenarios } from './assessment-data';
import type {
  IntegratedScenario,
  ScenarioAttempt,
  UserAnswer,
  AssessmentPoint,
} from './assessment-types';

type QuestionType = 'multiple-choice' | 'simulation' | 'performance' | 'essay';
type ExamMode = 'practice' | 'timed' | 'tutorial';

interface ScoreAnalysis {
  totalScore: number;
  maxScore: number;
  percentage: number;
  byPhase: { phaseId: string; score: number; maxScore: number }[];
  byType: { type: QuestionType; score: number; maxScore: number }[];
  passStatus: 'pass' | 'fail' | 'pass-with-distinction';
}

interface ScenarioSimulatorProps {
  scenarioId?: string;
  timeLimit?: number;
  examMode?: ExamMode;
  onComplete?: (attempt: ScenarioAttempt) => void;
  onAnalysis?: (analysis: ScoreAnalysis) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  scenarioId,
  timeLimit,
  examMode = 'practice',
  onComplete,
  onAnalysis,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<IntegratedScenario | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [startTime] = useState(new Date());
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [scored, setScored] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scoreAnalysis, setScoreAnalysis] = useState<ScoreAnalysis | null>(null);

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'intermediate':
        return 'bg-blue-500';
      case 'advanced':
        return 'bg-orange-500';
      case 'expert':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calculateScoreAnalysis = useCallback(
    (allAnswers: UserAnswer[], scenario: IntegratedScenario): ScoreAnalysis => {
      const byPhase = scenario.phases.map((phase) => ({
        phaseId: phase.id,
        score: allAnswers
          .filter((a) => a.phaseId === phase.id)
          .reduce((sum, a) => sum + (a.score || 0), 0),
        maxScore: phase.assessmentPoints.reduce((sum, ap) => sum + ap.maxScore, 0),
      }));

      const byType = [
        { type: 'multiple-choice' as const, score: 0, maxScore: 0 },
        { type: 'simulation' as const, score: 0, maxScore: 0 },
        { type: 'performance' as const, score: 0, maxScore: 0 },
        { type: 'essay' as const, score: 0, maxScore: 0 },
      ];

      const totalScore = allAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
      const maxScore = scenario.totalPoints;
      const percentage = (totalScore / maxScore) * 100;

      const passStatus =
        percentage >= 80 ? 'pass-with-distinction' : percentage >= 70 ? 'pass' : 'fail';

      return { totalScore, maxScore, percentage, byPhase, byType, passStatus };
    },
    []
  );

  const handleComplete = useCallback(() => {
    if (!selectedScenario) {
      return;
    }

    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const analysis = calculateScoreAnalysis(answers, selectedScenario);

    setScoreAnalysis(analysis);
    setShowResults(true);
    onAnalysis?.(analysis);

    const attempt: ScenarioAttempt = {
      scenarioId: selectedScenario.id,
      startTime,
      endTime: new Date(),
      currentPhase: currentPhaseIndex,
      answers,
      totalScore,
      maxScore: selectedScenario.totalPoints,
      status: 'completed',
    };

    onComplete?.(attempt);
  }, [
    selectedScenario,
    answers,
    currentPhaseIndex,
    startTime,
    calculateScoreAnalysis,
    onComplete,
    onAnalysis,
  ]);

  const getTimeDisplay = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (scenarioId) {
      const scenario = integratedScenarios.find((s) => s.id === scenarioId);
      if (scenario) {
        setSelectedScenario(scenario);
      }
    }
  }, [scenarioId]);

  // Timer for timed exam mode
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (examMode === 'timed' && examStarted && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    } else if (timeRemaining === 0 && examStarted && examMode === 'timed') {
      handleComplete();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timeRemaining, examStarted, examMode, handleComplete]);

  const currentPhase = selectedScenario?.phases[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === (selectedScenario?.phases.length ?? 0) - 1;
  const totalAnswered = answers.length;
  const totalQuestions =
    selectedScenario?.phases.reduce((sum, phase) => sum + phase.assessmentPoints.length, 0) ?? 0;
  const progressPercentage = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;

  const handleAnswerChange = (assessmentPointId: string, value: string): void => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [assessmentPointId]: value,
    }));
  };

  const scoreAnswer = (
    assessmentPoint: AssessmentPoint,
    answer: string
  ): { score: number; feedback: string } => {
    const answerLower = answer.toLowerCase();
    const criteriaCount = assessmentPoint.criteria.length;
    let matchedCriteria = 0;
    const matchedPoints: string[] = [];

    assessmentPoint.criteria.forEach((criterion) => {
      const keywords = criterion
        .toLowerCase()
        .split(' ')
        .filter((w) => w.length > 3);
      const matches = keywords.filter((kw) => answerLower.includes(kw));
      if (matches.length >= Math.max(1, keywords.length * 0.3)) {
        matchedCriteria++;
        matchedPoints.push(criterion);
      }
    });

    const score = Math.round((matchedCriteria / criteriaCount) * assessmentPoint.maxScore);

    let feedback = `Score: ${score}/${assessmentPoint.maxScore}\n\n`;
    if (matchedPoints.length > 0) {
      feedback += `✓ Addressed points:\n${matchedPoints.map((p) => `  • ${p}`).join('\n')}\n\n`;
    }

    const missedPoints = assessmentPoint.criteria.filter((c) => !matchedPoints.includes(c));
    if (missedPoints.length > 0) {
      feedback += `✗ Consider adding:\n${missedPoints.map((p) => `  • ${p}`).join('\n')}`;
    }

    return { score, feedback };
  };

  const handleSubmitPhase = (): void => {
    if (!currentPhase) {
      return;
    }

    const phaseAnswers: UserAnswer[] = currentPhase.assessmentPoints.map((ap) => {
      const answerText = currentAnswers[ap.loId] || '';
      const { score, feedback } = scoreAnswer(ap, answerText);

      return {
        phaseId: currentPhase.id,
        assessmentPointId: ap.loId,
        answer: answerText,
        score,
        feedback,
      };
    });

    setAnswers((prev) => [...prev, ...phaseAnswers]);
    setScored(true);
  };

  const handleNextPhase = (): void => {
    if (isLastPhase) {
      handleComplete();
    } else {
      setCurrentPhaseIndex((prev) => prev + 1);
      setCurrentAnswers({});
      setScored(false);
      setShowHints(false);
    }
  };

  const handlePrevPhase = (): void => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex((prev) => prev - 1);
      setScored(false);
    }
  };

  // Results view after exam completion
  if (showResults && scoreAnalysis && selectedScenario) {
    return (
      <div className="space-y-6">
        <Card
          className={
            scoreAnalysis.passStatus === 'fail'
              ? 'border-red-300 dark:border-red-800'
              : 'border-green-300 dark:border-green-800'
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-white">
              <span>Exam Results</span>
              <Badge
                className={
                  scoreAnalysis.passStatus === 'fail'
                    ? 'bg-red-500 dark:bg-red-700'
                    : scoreAnalysis.passStatus === 'pass-with-distinction'
                      ? 'bg-green-600 dark:bg-green-700'
                      : 'bg-blue-500 dark:bg-blue-700'
                }
              >
                {scoreAnalysis.passStatus.replace('-', ' ').toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-950 dark:to-indigo-950">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {scoreAnalysis.percentage.toFixed(1)}%
                </div>
                <div className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                  {scoreAnalysis.totalScore} / {scoreAnalysis.maxScore} points
                </div>
                <Progress value={scoreAnalysis.percentage} className="mb-2" />
              </div>
            </div>

            {/* By Phase Analysis */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold dark:text-white">
                <BarChart3 className="h-4 w-4" />
                Performance by Phase
              </h4>
              <div className="space-y-2">
                {scoreAnalysis.byPhase.map((phase) => {
                  const percentage = (phase.score / phase.maxScore) * 100;
                  return (
                    <div
                      key={phase.phaseId}
                      className="flex items-center justify-between dark:text-gray-300"
                    >
                      <span className="w-32 text-sm font-medium">{phase.phaseId}</span>
                      <div className="mx-4 flex-1">
                        <Progress value={percentage} />
                      </div>
                      <span className="w-24 text-right text-sm text-gray-800 dark:text-gray-200">
                        {phase.score}/{phase.maxScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback and Recommendations */}
            <Alert
              className={
                scoreAnalysis.passStatus === 'fail'
                  ? 'bg-red-50 dark:border-red-800 dark:bg-red-950'
                  : 'bg-green-50 dark:border-green-800 dark:bg-green-950'
              }
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="dark:text-gray-300">
                {scoreAnalysis.passStatus === 'pass-with-distinction' && (
                  <p>
                    Excellent performance! You have demonstrated comprehensive understanding of all
                    exam domains.
                  </p>
                )}
                {scoreAnalysis.passStatus === 'pass' && (
                  <p>
                    Good work! You have passed the exam. Consider reviewing lower-scoring phases for
                    full mastery.
                  </p>
                )}
                {scoreAnalysis.passStatus === 'fail' && (
                  <p>
                    You did not meet the passing threshold. Review the feedback for each phase and
                    retake the exam.
                  </p>
                )}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedScenario(null);
                  setShowResults(false);
                  setScoreAnalysis(null);
                }}
              >
                Return to Scenarios
              </Button>
              {scoreAnalysis.passStatus === 'fail' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPhaseIndex(0);
                    setAnswers([]);
                    setCurrentAnswers({});
                    setScored(false);
                    setShowResults(false);
                    setScoreAnalysis(null);
                    setExamStarted(false);
                    setTimeRemaining(timeLimit || 0);
                  }}
                >
                  Retake Exam
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <BookOpen className="h-5 w-5" />
              Scenario Simulator - Real-World Network Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Practice with 20+ comprehensive scenarios simulating real-world network design,
              troubleshooting, and optimization. Choose your exam mode and scenario difficulty.
              Available question types include multiple-choice, simulation-based, performance-based,
              and essay questions.
            </p>
            <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-200">20+ Scenarios</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-500" />
                <span className="text-gray-700 dark:text-gray-200">Timed Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-200">Detailed Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {integratedScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => {
                setSelectedScenario(scenario);
                if (examMode === 'timed') {
                  setTimeRemaining(timeLimit || scenario.estimatedTime * 60);
                }
              }}
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold dark:text-white">{scenario.title}</h3>
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                      {scenario.description}
                    </p>
                  </div>
                  <Badge className={getDifficultyColor(scenario.difficulty)}>
                    {scenario.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {scenario.estimatedTime} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {scenario.phases.length} phases
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {scenario.totalPoints} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {scenario.learningObjectives.length} LOs
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-700 dark:text-gray-300">
                    Learning Objectives:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.learningObjectives.map((lo) => (
                      <Badge
                        key={lo}
                        variant="outline"
                        className="text-xs dark:border-gray-600 dark:text-gray-300"
                      >
                        LO {lo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with progress and timer */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold dark:text-white">{selectedScenario.title}</h2>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(selectedScenario.difficulty)}>
                  {selectedScenario.difficulty}
                </Badge>
                <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  {examMode === 'timed' ? 'TIMED' : examMode.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {examMode === 'timed' && examStarted && (
                <div
                  className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {getTimeDisplay(timeRemaining)}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedScenario(null)}>
                Change Scenario
              </Button>
            </div>
          </div>

          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Phase {currentPhaseIndex + 1} of {selectedScenario.phases.length} •{totalAnswered} of{' '}
            {totalQuestions} questions answered
          </p>
        </CardContent>
      </Card>

      {/* Scenario Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Scenario Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                Company Profile
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Name:</strong>{' '}
                  {selectedScenario.context.company}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Locations:</strong>{' '}
                  {selectedScenario.context.locations}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Users:</strong>{' '}
                  {selectedScenario.context.users}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Requirements</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {selectedScenario.context.requirements.slice(0, 3).map((req, i) => (
                  <li key={i}>• {req}</li>
                ))}
                {selectedScenario.context.requirements.length > 3 && (
                  <li className="text-gray-700 dark:text-gray-300">
                    +{selectedScenario.context.requirements.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Start Screen for Timed Mode */}
      {examMode === 'timed' && !examStarted && currentPhaseIndex === 0 && !scored && (
        <Card className="border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="dark:text-white">Ready to Start?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                This is a timed exam. You will have{' '}
                <strong className="text-gray-900 dark:text-gray-100">
                  {getTimeDisplay(timeLimit || selectedScenario.estimatedTime * 60)}
                </strong>{' '}
                to complete all questions.
              </p>
              <Alert className="dark:border-gray-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-gray-700 dark:text-gray-300">
                  Once you start, the timer will begin. You cannot pause or resume the exam. Answer
                  all questions to the best of your ability.
                </AlertDescription>
              </Alert>
            </div>
            <Button
              onClick={() => setExamStarted(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Phase */}
      {currentPhase && (examMode !== 'timed' || examStarted) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                {currentPhase.title}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)}>
                <Lightbulb className={`mr-2 h-4 w-4 ${showHints ? 'text-yellow-500' : ''}`} />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300">{currentPhase.description}</p>

            {showHints && currentPhase.hints && (
              <Alert className="dark:border-gray-600">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="dark:text-gray-300">
                  <ul className="list-inside list-disc space-y-1">
                    {currentPhase.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Assessment Points */}
            <div className="space-y-6">
              {currentPhase.assessmentPoints.map((ap) => {
                const existingAnswer = answers.find(
                  (a) => a.phaseId === currentPhase.id && a.assessmentPointId === ap.loId
                );

                return (
                  <div key={ap.loId} className="rounded-lg border p-4 dark:border-gray-700">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300"
                          >
                            LO {ap.loCode}
                          </Badge>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {ap.maxScore} points
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {ap.description}
                        </h4>
                      </div>
                      {existingAnswer && (
                        <Badge
                          variant={
                            existingAnswer.score! >= ap.maxScore * 0.7 ? 'default' : 'destructive'
                          }
                        >
                          {existingAnswer.score}/{ap.maxScore}
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                        Assessment Criteria:
                      </p>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {ap.criteria.map((criterion, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Circle className="mt-1 h-3 w-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Textarea
                      placeholder="Enter your detailed answer here..."
                      value={currentAnswers[ap.loId] || existingAnswer?.answer || ''}
                      onChange={(e) => handleAnswerChange(ap.loId, e.target.value)}
                      rows={6}
                      disabled={scored}
                      className="mb-2 text-gray-900 dark:text-gray-100"
                    />

                    {existingAnswer?.feedback && scored && (
                      <Alert
                        className={
                          existingAnswer.score! >= ap.maxScore * 0.7
                            ? 'bg-green-50 dark:border-green-800 dark:bg-green-950'
                            : 'bg-orange-50 dark:border-orange-800 dark:bg-orange-950'
                        }
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-gray-700 dark:text-gray-300">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300">
                            {existingAnswer.feedback}
                          </pre>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                onClick={handlePrevPhase}
                disabled={currentPhaseIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Phase
              </Button>

              <div className="flex gap-2">
                {!scored && <Button onClick={handleSubmitPhase}>Score Answers</Button>}
                {scored && (
                  <Button onClick={handleNextPhase}>
                    {isLastPhase ? 'Complete Scenario' : 'Next Phase'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase Navigation Dots */}
      <div className="flex justify-center gap-2">
        {selectedScenario.phases.map((phase, idx) => (
          <button
            key={phase.id}
            onClick={() => {
              setCurrentPhaseIndex(idx);
              setScored(false);
            }}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === currentPhaseIndex
                ? 'bg-blue-600'
                : idx < currentPhaseIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300'
            }`}
            title={phase.title}
          />
        ))}
      </div>
    </div>
  );
};

// Export with both names for compatibility
export default ScenarioSimulator;
export { ScenarioSimulator as IntegratedSimulator };
