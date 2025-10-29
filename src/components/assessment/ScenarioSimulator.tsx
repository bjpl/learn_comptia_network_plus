/**
 * Scenario Simulator Component (Component 22)
 * Integrated scenario simulator with multi-step troubleshooting, time-based challenges,
 * and comprehensive assessment features for CompTIA Network+ learning
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Target,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  FileText,
  Award,
  Timer,
  Zap,
  TrendingUp
} from 'lucide-react';
import { integratedScenarios } from './assessment-data';
import type {
  IntegratedScenario,
  ScenarioAttempt,
  UserAnswer,
  AssessmentPoint
} from './assessment-types';

interface ScenarioSimulatorProps {
  scenarioId?: string;
  timeLimit?: number; // Optional time limit in seconds
  enableTimedMode?: boolean;
  difficultyMultiplier?: boolean; // Apply difficulty-based scoring
  onComplete?: (attempt: ScenarioAttempt) => void;
  onProgress?: (progress: number) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  scenarioId,
  timeLimit,
  enableTimedMode = false,
  difficultyMultiplier = true,
  onComplete,
  onProgress
}) => {
  const [selectedScenario, setSelectedScenario] = useState<IntegratedScenario | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(new Date());
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [scored, setScored] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit || null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (scenarioId) {
      const scenario = integratedScenarios.find(s => s.id === scenarioId);
      if (scenario) {
        setSelectedScenario(scenario);
      }
    }
  }, [scenarioId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const currentPhase = selectedScenario?.phases[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === (selectedScenario?.phases.length ?? 0) - 1;
  const totalAnswered = answers.length;
  const totalQuestions = selectedScenario?.phases.reduce(
    (sum, phase) => sum + phase.assessmentPoints.length,
    0
  ) ?? 0;
  const progressPercentage = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;

  const handleAnswerChange = (assessmentPointId: string, value: string) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [assessmentPointId]: value
    }));
  };

  const scoreAnswer = (assessmentPoint: AssessmentPoint, answer: string): { score: number; feedback: string } => {
    // Simplified scoring - in production, this would use more sophisticated NLP/pattern matching
    const answerLower = answer.toLowerCase();
    const criteriaCount = assessmentPoint.criteria.length;
    let matchedCriteria = 0;
    const matchedPoints: string[] = [];

    assessmentPoint.criteria.forEach(criterion => {
      const keywords = criterion.toLowerCase().split(' ').filter(w => w.length > 3);
      const matches = keywords.filter(kw => answerLower.includes(kw));
      if (matches.length >= Math.max(1, keywords.length * 0.3)) {
        matchedCriteria++;
        matchedPoints.push(criterion);
      }
    });

    const score = Math.round((matchedCriteria / criteriaCount) * assessmentPoint.maxScore);

    let feedback = `Score: ${score}/${assessmentPoint.maxScore}\n\n`;
    if (matchedPoints.length > 0) {
      feedback += `✓ Addressed points:\n${matchedPoints.map(p => `  • ${p}`).join('\n')}\n\n`;
    }

    const missedPoints = assessmentPoint.criteria.filter(c => !matchedPoints.includes(c));
    if (missedPoints.length > 0) {
      feedback += `✗ Consider adding:\n${missedPoints.map(p => `  • ${p}`).join('\n')}`;
    }

    return { score, feedback };
  };

  const handleSubmitPhase = () => {
    if (!currentPhase) {return;}

    const phaseAnswers: UserAnswer[] = currentPhase.assessmentPoints.map(ap => {
      const answerText = currentAnswers[ap.loId] || '';
      const { score, feedback } = scoreAnswer(ap, answerText);

      return {
        phaseId: currentPhase.id,
        assessmentPointId: ap.loId,
        answer: answerText,
        score,
        feedback
      };
    });

    setAnswers(prev => [...prev, ...phaseAnswers]);
    setScored(true);
  };

  const handleNextPhase = () => {
    if (isLastPhase) {
      handleComplete();
    } else {
      setCurrentPhaseIndex(prev => prev + 1);
      setCurrentAnswers({});
      setScored(false);
      setShowHints(false);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
      setScored(false);
    }
  };

  const handleComplete = () => {
    if (!selectedScenario) {return;}

    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const attempt: ScenarioAttempt = {
      scenarioId: selectedScenario.id,
      startTime,
      endTime: new Date(),
      currentPhase: currentPhaseIndex,
      answers,
      totalScore,
      maxScore: selectedScenario.totalPoints,
      status: 'completed'
    };

    onComplete?.(attempt);
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Integrated Scenario Simulator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Select a comprehensive scenario that tests multiple learning objectives simultaneously.
              These scenarios simulate real-world network design and troubleshooting situations.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {integratedScenarios.map(scenario => (
            <Card key={scenario.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedScenario(scenario)}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{scenario.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(scenario.difficulty)}>
                    {scenario.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{scenario.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span>{scenario.phases.length} phases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span>{scenario.totalPoints} points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{scenario.learningObjectives.length} LOs</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Learning Objectives:</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.learningObjectives.map(lo => (
                      <Badge key={lo} variant="outline" className="text-xs">
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
      {/* Header with progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedScenario.title}</h2>
              <Badge className={getDifficultyColor(selectedScenario.difficulty)}>
                {selectedScenario.difficulty}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => setSelectedScenario(null)}>
              Change Scenario
            </Button>
          </div>

          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-gray-600">
            Phase {currentPhaseIndex + 1} of {selectedScenario.phases.length} •
            {totalAnswered} of {totalQuestions} questions answered
          </p>
        </CardContent>
      </Card>

      {/* Scenario Context */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Company Profile</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Name:</strong> {selectedScenario.context.company}</li>
                <li><strong>Locations:</strong> {selectedScenario.context.locations}</li>
                <li><strong>Users:</strong> {selectedScenario.context.users}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <ul className="text-sm space-y-1">
                {selectedScenario.context.requirements.slice(0, 3).map((req, i) => (
                  <li key={i}>• {req}</li>
                ))}
                {selectedScenario.context.requirements.length > 3 && (
                  <li className="text-gray-500">
                    +{selectedScenario.context.requirements.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase */}
      {currentPhase && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentPhase.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
              >
                <Lightbulb className={`w-4 h-4 mr-2 ${showHints ? 'text-yellow-500' : ''}`} />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">{currentPhase.description}</p>

            {showHints && currentPhase.hints && (
              <Alert>
                <Lightbulb className="w-4 h-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {currentPhase.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Assessment Points */}
            <div className="space-y-6">
              {currentPhase.assessmentPoints.map((ap, idx) => {
                const existingAnswer = answers.find(
                  a => a.phaseId === currentPhase.id && a.assessmentPointId === ap.loId
                );

                return (
                  <div key={ap.loId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">LO {ap.loCode}</Badge>
                          <span className="text-sm text-gray-600">
                            {ap.maxScore} points
                          </span>
                        </div>
                        <h4 className="font-semibold">{ap.description}</h4>
                      </div>
                      {existingAnswer && (
                        <Badge variant={existingAnswer.score! >= ap.maxScore * 0.7 ? 'default' : 'destructive'}>
                          {existingAnswer.score}/{ap.maxScore}
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Assessment Criteria:</p>
                      <ul className="text-sm space-y-1">
                        {ap.criteria.map((criterion, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Circle className="w-3 h-3 mt-1 flex-shrink-0" />
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
                      className="mb-2"
                    />

                    {existingAnswer?.feedback && scored && (
                      <Alert className={existingAnswer.score! >= ap.maxScore * 0.7 ? 'bg-green-50' : 'bg-orange-50'}>
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          <pre className="text-sm whitespace-pre-wrap font-sans">
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
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevPhase}
                disabled={currentPhaseIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Phase
              </Button>

              <div className="flex gap-2">
                {!scored && (
                  <Button onClick={handleSubmitPhase}>
                    Score Answers
                  </Button>
                )}
                {scored && (
                  <Button onClick={handleNextPhase}>
                    {isLastPhase ? 'Complete Scenario' : 'Next Phase'}
                    <ChevronRight className="w-4 h-4 ml-2" />
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
            className={`w-3 h-3 rounded-full transition-colors ${
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
