/**
 * Scenario selection list component
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Zap, Flag, BarChart3, Clock, Target, Award, FileText } from 'lucide-react';
import { integratedScenarios } from '../../assessment-data';
import type { IntegratedScenario, ExamMode } from '../types';
import { getDifficultyColor } from '../utils/difficultyStyles';

interface ScenarioListProps {
  examMode: ExamMode;
  timeLimit?: number;
  onSelectScenario: (scenario: IntegratedScenario, initialTimeRemaining: number) => void;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  examMode,
  timeLimit,
  onSelectScenario,
}) => {
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
              const initialTime = examMode === 'timed'
                ? timeLimit || scenario.estimatedTime * 60
                : 0;
              onSelectScenario(scenario, initialTime);
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
};
