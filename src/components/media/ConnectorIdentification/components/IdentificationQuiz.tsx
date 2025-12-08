/**
 * IdentificationQuiz component - Main quiz orchestrator
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { ConnectorGallery } from './ConnectorGallery';
import { ConnectorDetails } from './ConnectorDetails';
import { getConnectorById } from '../data/connectorDatabase';
import type { ConnectorState } from '../types';
import type { ConnectorType } from '../../media-types';
import type { ConnectorQuestion } from '../types';

interface IdentificationQuizProps {
  quizState: ConnectorState;
  questions: ConnectorQuestion[];
  progressPercentage: number;
  onAnswerSelect: (answer: ConnectorType) => void;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
}

export function IdentificationQuiz({
  quizState,
  questions,
  progressPercentage,
  onAnswerSelect,
  onSubmit,
  onNext,
  onPrevious,
  onRestart,
}: IdentificationQuizProps) {
  const { currentQuestionIndex, selectedAnswer, showResult, score, answeredQuestions } = quizState;
  const currentQuestion = questions[currentQuestionIndex];
  const currentConnector = getConnectorById(currentQuestion.connectorId);
  const isCorrect = showResult && selectedAnswer === currentQuestion.connectorId;
  const isComplete = answeredQuestions.size === questions.length;

  if (isComplete) {
    return (
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

            <Button onClick={onRestart} size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ConnectorGallery
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        progressPercentage={progressPercentage}
        onAnswerSelect={onAnswerSelect}
        onSubmit={onSubmit}
        onNext={onNext}
        onPrevious={onPrevious}
      />

      {showResult && currentConnector && (
        <ConnectorDetails connector={currentConnector} isCorrect={isCorrect} />
      )}
    </>
  );
}
