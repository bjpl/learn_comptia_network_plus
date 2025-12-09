/**
 * Exam results display component
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, BarChart3 } from 'lucide-react';
import type { ScoreAnalysis } from '../types';

interface ExamResultsProps {
  scoreAnalysis: ScoreAnalysis;
  timeLimit?: number;
  onReturnToScenarios: () => void;
  onRetakeExam: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  scoreAnalysis,
  timeLimit,
  onReturnToScenarios,
  onRetakeExam,
}) => {
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
            <Button onClick={onReturnToScenarios}>
              Return to Scenarios
            </Button>
            {scoreAnalysis.passStatus === 'fail' && (
              <Button variant="outline" onClick={onRetakeExam}>
                Retake Exam
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
