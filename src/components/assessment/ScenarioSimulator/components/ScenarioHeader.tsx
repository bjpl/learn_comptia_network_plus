/**
 * Scenario header with progress and timer
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { IntegratedScenario, ExamMode } from '../types';
import { getDifficultyColor } from '../utils/difficultyStyles';
import { getTimeDisplay } from '../utils/timeUtils';

interface ScenarioHeaderProps {
  scenario: IntegratedScenario;
  examMode: ExamMode;
  examStarted: boolean;
  timeRemaining: number;
  currentPhaseIndex: number;
  totalAnswered: number;
  totalQuestions: number;
  progressPercentage: number;
  onChangeScenario: () => void;
}

export const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  examMode,
  examStarted,
  timeRemaining,
  currentPhaseIndex,
  totalAnswered,
  totalQuestions,
  progressPercentage,
  onChangeScenario,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold dark:text-white">{scenario.title}</h2>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(scenario.difficulty)}>
                {scenario.difficulty}
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
            <Button variant="outline" size="sm" onClick={onChangeScenario}>
              Change Scenario
            </Button>
          </div>
        </div>

        <Progress value={progressPercentage} className="mb-2" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Phase {currentPhaseIndex + 1} of {scenario.phases.length} • {totalAnswered} of{' '}
          {totalQuestions} questions answered
        </p>
      </CardContent>
    </Card>
  );
};
