/**
 * Connector Identification Component
 * Interactive quiz-style component for learning connector types
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Info, TrendingUp } from 'lucide-react';
import Connector3DViewer from './Connector3DViewer';
import { CONNECTORS } from './media-data';
import type { ConnectorType } from './media-types';

interface ConnectorQuestion {
  connectorId: ConnectorType;
  options: ConnectorType[];
}

export default function ConnectorIdentification() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ConnectorType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Generate questions
  const questions: ConnectorQuestion[] = useMemo(() => {
    return CONNECTORS.map((connector) => {
      // Get 3 random wrong answers
      const otherConnectors = CONNECTORS.filter((c) => c.id !== connector.id);
      const shuffled = [...otherConnectors].sort(() => Math.random() - 0.5);
      const wrongOptions = shuffled.slice(0, 3).map((c) => c.id);

      // Shuffle correct answer with wrong ones
      const options = [connector.id, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        connectorId: connector.id,
        options
      };
    });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentConnector = CONNECTORS.find((c) => c.id === currentQuestion.connectorId);

  const handleAnswerSelect = (answer: ConnectorType) => {
    if (showResult) {return;}
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {return;}

    setShowResult(true);
    if (selectedAnswer === currentQuestion.connectorId) {
      setScore((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const progressPercentage = (answeredQuestions.size / questions.length) * 100;
  const isCorrect = showResult && selectedAnswer === currentQuestion.connectorId;
  const isComplete = answeredQuestions.size === questions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connector Identification Challenge</CardTitle>
              <CardDescription>
                Test your knowledge by identifying network connectors
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {score} / {answeredQuestions.size}
              </div>
              <Progress value={progressPercentage} className="w-32 mt-2" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isComplete ? (
        <>
          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <Badge variant="outline">{currentConnector?.type}</Badge>
              </CardTitle>
              <CardDescription>Identify the connector shown in the 3D model below</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 3D Viewer */}
              <Connector3DViewer
                connectorType={currentQuestion.connectorId}
                autoRotate
                showLabels={false}
                showControls={true}
                height="500px"
              />
            </CardContent>
          </Card>

          {/* Answer Options */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((optionId) => {
                  const option = CONNECTORS.find((c) => c.id === optionId);
                  if (!option) {return null;}

                  const isSelected = selectedAnswer === optionId;
                  const isCorrectAnswer = optionId === currentQuestion.connectorId;

                  return (
                    <Button
                      key={optionId}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`h-auto py-4 px-6 justify-start ${
                        showResult && isCorrectAnswer
                          ? 'bg-green-100 border-green-500 hover:bg-green-100'
                          : showResult && isSelected && !isCorrectAnswer
                            ? 'bg-red-100 border-red-500 hover:bg-red-100'
                            : ''
                      }`}
                      onClick={() => handleAnswerSelect(optionId)}
                      disabled={showResult}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {showResult && isCorrectAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        )}
                        {showResult && isSelected && !isCorrectAnswer && (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                        <div className="text-left flex-1">
                          <div className="font-semibold">{option.name}</div>
                          {showResult && (
                            <div className="text-sm text-gray-600 mt-1">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>

                {!showResult ? (
                  <Button onClick={handleSubmit} disabled={!selectedAnswer}>
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                    Next Question
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Result Feedback */}
          {showResult && currentConnector && (
            <Card className={`border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600" />
                      Incorrect
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-lg mb-2">{currentConnector.name}</div>
                    <p className="text-gray-700">{currentConnector.description}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Typical Uses:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {currentConnector.typicalUse.map((use, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Key Features:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentConnector.keyFeatures.map((feature, idx) => (
                        <Badge key={idx} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Completion Card */
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div>
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <div className="text-xl text-gray-700">
                  You scored {score} out of {questions.length}
                </div>
              </div>

              <div className="space-y-2">
                {score === questions.length && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-semibold">Perfect Score!</p>
                    <p className="text-sm text-green-700">
                      Excellent work! You've mastered connector identification.
                    </p>
                  </div>
                )}
                {score >= questions.length * 0.7 && score < questions.length && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-semibold">Great Job!</p>
                    <p className="text-sm text-blue-700">
                      You have a strong understanding of network connectors.
                    </p>
                  </div>
                )}
                {score < questions.length * 0.7 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-semibold">Keep Practicing!</p>
                    <p className="text-sm text-yellow-700">
                      Review the connector types and try again to improve your score.
                    </p>
                  </div>
                )}
              </div>

              <Button onClick={handleRestart} size="lg">
                Restart Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Use the 3D controls to rotate and zoom for a better view</li>
            <li>• Pay attention to connector shape, size, and locking mechanisms</li>
            <li>• Fiber connectors (SC, LC, ST) have ferrules for precise alignment</li>
            <li>• Copper connectors (RJ45, RJ11) have visible pins</li>
            <li>• Coaxial connectors (F-type, BNC) have center pins and threading/bayonets</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
