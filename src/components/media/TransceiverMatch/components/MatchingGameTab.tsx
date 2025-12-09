import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TabsContent } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import type { Transceiver, UseCaseCard } from '../types';
import { groupTransceivers } from '../utils/matching';
import { getFormFactorIcon, getProtocolIcon } from '../utils/icons';

interface MatchingGameTabProps {
  useCases: UseCaseCard[];
  transceivers: Transceiver[];
  matches: Record<string, string>;
  correctMatches: Record<string, Transceiver>;
  submitted: boolean;
  score: number;
  completedMatches: number;
  progressPercentage: number;
  onDragStart: (transceiver: Transceiver) => void;
  onDrop: (useCaseId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemoveMatch: (useCaseId: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const MatchingGameTab: React.FC<MatchingGameTabProps> = ({
  useCases,
  transceivers,
  matches,
  correctMatches,
  submitted,
  score,
  completedMatches,
  progressPercentage,
  onDragStart,
  onDrop,
  onDragOver,
  onRemoveMatch,
  onSubmit,
  onReset,
}) => {
  const groupedTransceivers = useMemo(() => groupTransceivers(transceivers), [transceivers]);

  return (
    <TabsContent value="matching" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transceiver Matching Game</CardTitle>
              <CardDescription>
                Drag transceivers to match them with appropriate use cases
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700 dark:text-gray-400">Progress</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedMatches} / {useCases.length}
              </div>
              <Progress value={progressPercentage} className="mt-2 w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Transceiver Library */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Transceivers</CardTitle>
              <CardDescription>Drag these to match with use cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedTransceivers).map(([category, categoryTransceivers]) => (
                <div key={category}>
                  <div className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-300">
                    {category}
                  </div>
                  <div className="space-y-2">
                    {categoryTransceivers.map((transceiver) => (
                      <div
                        key={transceiver.id}
                        draggable
                        onDragStart={() => onDragStart(transceiver)}
                        className="cursor-move rounded-lg border bg-white p-3 transition-colors hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {transceiver.name}
                            </div>
                            <div className="mt-1 flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getFormFactorIcon(transceiver.formFactor)}
                                <span className="ml-1">{transceiver.formFactor}</span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getProtocolIcon(transceiver.protocol)}
                                <span className="ml-1">{transceiver.protocol}</span>
                              </Badge>
                            </div>
                            <div className="mt-1 text-xs text-gray-700 dark:text-gray-400">
                              {transceiver.speed}G · {transceiver.maxDistance}m ·{' '}
                              {transceiver.connectorType}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Use Cases</CardTitle>
                <div className="flex gap-2">
                  {!submitted ? (
                    <Button onClick={onSubmit} disabled={completedMatches === 0}>
                      Submit Answers
                    </Button>
                  ) : (
                    <Button onClick={onReset}>
                      <RefreshCw className="mr-1 h-4 w-4" />
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {useCases.map((useCase) => {
                  const matchedTransceiverId = matches[useCase.id];
                  const matchedTransceiver = matchedTransceiverId
                    ? transceivers.find((t) => t.id === matchedTransceiverId)
                    : null;
                  const correctTransceiver = correctMatches[useCase.id];
                  const isCorrect =
                    submitted && matchedTransceiver?.id === correctTransceiver?.id;
                  const isIncorrect =
                    submitted &&
                    matchedTransceiver &&
                    matchedTransceiver.id !== correctTransceiver?.id;

                  return (
                    <div
                      key={useCase.id}
                      onDrop={() => onDrop(useCase.id)}
                      onDragOver={onDragOver}
                      className={`rounded-lg border-2 border-dashed p-4 transition-colors dark:text-gray-100 ${
                        matchedTransceiver
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900'
                            : isIncorrect
                              ? 'border-red-500 bg-red-50 dark:bg-red-900'
                              : 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="mb-2 flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {useCase.description}
                            </p>
                            {submitted &&
                              (isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                              ) : isIncorrect ? (
                                <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                              ) : null)}
                          </div>

                          <div className="mb-3 flex gap-2 text-xs text-gray-700 dark:text-gray-400">
                            <Badge variant="outline" className="text-xs">
                              {useCase.requirements.speed}G
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {useCase.requirements.distance}m
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {useCase.requirements.protocol}
                            </Badge>
                            {useCase.requirements.formFactor && (
                              <Badge variant="outline" className="text-xs">
                                {useCase.requirements.formFactor}
                              </Badge>
                            )}
                          </div>

                          {matchedTransceiver ? (
                            <div className="flex items-center justify-between rounded border bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {matchedTransceiver.name}
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-400">
                                  {matchedTransceiver.formFactor} · {matchedTransceiver.speed}G
                                  · {matchedTransceiver.maxDistance}m
                                </div>
                              </div>
                              {!submitted && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemoveMatch(useCase.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-4 text-sm text-gray-400 dark:text-gray-500">
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Drop transceiver here
                            </div>
                          )}

                          {submitted && isIncorrect && correctTransceiver && (
                            <div className="mt-2 rounded border border-green-200 bg-green-50 p-2 dark:border-green-700 dark:bg-green-900">
                              <div className="mb-1 text-xs font-medium text-green-800 dark:text-green-200">
                                Correct Answer:
                              </div>
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {correctTransceiver.name}
                              </div>
                              <div className="text-xs text-gray-700 dark:text-gray-400">
                                {correctTransceiver.formFactor} · {correctTransceiver.speed}G ·{' '}
                                {correctTransceiver.maxDistance}m
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {submitted && (
            <Card className="mt-6 border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-gray-100">
                    {score}%
                  </div>
                  <div className="mb-4 text-gray-700 dark:text-gray-400">
                    {score >= 90
                      ? 'Excellent! You have a strong understanding of transceiver selection.'
                      : score >= 70
                        ? 'Good job! Review the incorrect matches to improve.'
                        : score >= 50
                          ? 'Not bad, but there is room for improvement.'
                          : 'Keep practicing! Review the transceiver specifications carefully.'}
                  </div>
                  <Progress value={score} className="h-4" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TabsContent>
  );
};
