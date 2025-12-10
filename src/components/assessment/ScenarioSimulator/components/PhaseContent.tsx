/**
 * Phase content with assessment points
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ChevronRight, ChevronLeft, Circle, AlertCircle } from 'lucide-react';
import type { IntegratedScenario, UserAnswer } from '../types';

interface PhaseContentProps {
  scenario: IntegratedScenario;
  currentPhaseIndex: number;
  showHints: boolean;
  currentAnswers: Record<string, string>;
  answers: UserAnswer[];
  scored: boolean;
  isLastPhase: boolean;
  onToggleHints: () => void;
  onAnswerChange: (assessmentPointId: string, value: string) => void;
  onSubmitPhase: () => void;
  onNextPhase: () => void;
  onPrevPhase: () => void;
}

export const PhaseContent: React.FC<PhaseContentProps> = ({
  scenario,
  currentPhaseIndex,
  showHints,
  currentAnswers,
  answers,
  scored,
  isLastPhase,
  onToggleHints,
  onAnswerChange,
  onSubmitPhase,
  onNextPhase,
  onPrevPhase,
}) => {
  const currentPhase = scenario.phases[currentPhaseIndex];

  if (!currentPhase) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-gray-100">{currentPhase.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggleHints}>
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
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
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
                  onChange={(e) => onAnswerChange(ap.loId, e.target.value)}
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
                      <pre className="font-sans text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
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
          <Button variant="outline" onClick={onPrevPhase} disabled={currentPhaseIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Phase
          </Button>

          <div className="flex gap-2">
            {!scored && <Button onClick={onSubmitPhase}>Score Answers</Button>}
            {scored && (
              <Button onClick={onNextPhase}>
                {isLastPhase ? 'Complete Scenario' : 'Next Phase'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
