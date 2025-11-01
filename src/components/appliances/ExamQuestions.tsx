import React, { useState, useMemo } from 'react';
import type { ExamQuestion } from './appliances-types';

interface ExamQuestionsProps {
  questions: ExamQuestion[];
  onDeviceClick?: (deviceId: string) => void;
}

const ExamQuestions: React.FC<ExamQuestionsProps> = ({ questions, onDeviceClick }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>(
    'all'
  );

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === 'all') {
      return questions;
    }
    return questions.filter((q) => q.difficulty === difficultyFilter);
  }, [questions, difficultyFilter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) {
      return; // Already answered
    }

    setSelectedAnswer(optionId);
    setShowExplanation(true);

    const selectedOption = currentQuestion.options.find((opt) => opt.id === optionId);
    if (selectedOption?.correct) {
      setScore({ ...score, correct: score.correct + 1, total: score.total + 1 });
    } else {
      setScore({ ...score, total: score.total + 1 });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  const getOptionClassName = (option: ExamQuestion['options'][0]) => {
    const baseClass = 'w-full rounded-lg border-2 p-4 text-left transition-all cursor-pointer';

    if (!showExplanation) {
      return `${baseClass} border-gray-200 hover:border-blue-500 hover:bg-blue-50`;
    }

    if (option.id === selectedAnswer) {
      if (option.correct) {
        return `${baseClass} border-green-500 bg-green-50`;
      } else {
        return `${baseClass} border-red-500 bg-red-50`;
      }
    }

    if (option.correct && showExplanation) {
      return `${baseClass} border-green-500 bg-green-50`;
    }

    return `${baseClass} border-gray-200 bg-gray-50 opacity-60`;
  };

  const getOptionIcon = (option: ExamQuestion['options'][0]) => {
    if (!showExplanation) {
      return null;
    }

    if (option.correct) {
      return (
        <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (option.id === selectedAnswer && !option.correct) {
      return (
        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return null;
  };

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          No questions available for this difficulty level.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            Exam Practice Questions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            CompTIA Network+ N10-008 - Device Identification
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {score.correct} / {score.total} correct
          </div>
        </div>
      </div>

      {/* Difficulty filter */}
      <div className="mb-4 flex gap-2">
        {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => {
              setDifficultyFilter(difficulty);
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
            }}
            className={`rounded-lg px-3 py-1 text-sm font-semibold ${
              difficultyFilter === difficulty
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${difficultyColor(currentQuestion.difficulty)}`}
          >
            {currentQuestion.difficulty}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option.id)}
              disabled={showExplanation}
              className={getOptionClassName(option) + ' dark:text-gray-100'}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.text}</span>
                {getOptionIcon(option)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mb-6 space-y-4">
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900">
            <h5 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Explanation</h5>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {currentQuestion.explanation}
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900">
            <h5 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">Exam Tip</h5>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {currentQuestion.examTip}
            </p>
          </div>

          {currentQuestion.relatedDevices.length > 0 && onDeviceClick && (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <h5 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                Related Devices
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.relatedDevices.map((deviceId) => (
                  <button
                    key={deviceId}
                    onClick={() => onDeviceClick(deviceId)}
                    className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    View {deviceId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          {showExplanation && currentQuestionIndex < filteredQuestions.length - 1 && (
            <button
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Next Question
            </button>
          )}
        </div>

        <button
          onClick={handleReset}
          className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Reset Quiz
        </button>
      </div>
    </div>
  );
};

export default ExamQuestions;
