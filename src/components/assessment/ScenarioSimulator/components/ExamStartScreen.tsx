/**
 * Exam start screen for timed mode
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getTimeDisplay } from '../utils/timeUtils';

interface ExamStartScreenProps {
  timeLimit: number;
  onStartExam: () => void;
}

export const ExamStartScreen: React.FC<ExamStartScreenProps> = ({ timeLimit, onStartExam }) => {
  return (
    <Card className="border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <CardHeader>
        <CardTitle className="dark:text-white">Ready to Start?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            This is a timed exam. You will have{' '}
            <strong className="text-gray-900 dark:text-gray-100">
              {getTimeDisplay(timeLimit)}
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
          onClick={onStartExam}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Start Exam
        </Button>
      </CardContent>
    </Card>
  );
};
