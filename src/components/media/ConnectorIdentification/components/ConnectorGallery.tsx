/**
 * ConnectorGallery component - Displays connector 3D model and answer options
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import Connector3DViewer from '../../Connector3DViewer';
import { getConnectorById } from '../data/connectorDatabase';
import type { ConnectorQuestion } from '../types';
import type { ConnectorType } from '../../media-types';

interface ConnectorGalleryProps {
  currentQuestion: ConnectorQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: ConnectorType | null;
  showResult: boolean;
  progressPercentage: number;
  onAnswerSelect: (answer: ConnectorType) => void;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ConnectorGallery({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  showResult,
  progressPercentage,
  onAnswerSelect,
  onSubmit,
  onNext,
  onPrevious,
}: ConnectorGalleryProps) {
  const currentConnector = getConnectorById(currentQuestion.connectorId);

  return (
    <>
      {/* Question card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {totalQuestions}
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
              const option = getConnectorById(optionId);
              if (!option) return null;

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
                  onClick={() => onAnswerSelect(optionId)}
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
                        <div className="mt-1 text-sm text-gray-600">{option.description}</div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={onPrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            {!showResult ? (
              <Button onClick={onSubmit} disabled={!selectedAnswer}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={onNext} disabled={currentQuestionIndex === totalQuestions - 1}>
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
