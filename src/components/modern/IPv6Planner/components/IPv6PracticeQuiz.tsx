/**
 * IPv6 Practice Quiz Component
 * Interactive quiz for IPv6 exam preparation
 */

import React from 'react';
import { ipv6Questions } from '../data/ipv6Concepts';

interface IPv6PracticeQuizProps {
  currentQuestion: number;
  setCurrentQuestion: (q: number) => void;
  answers: number[];
  setAnswers: (a: number[]) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
}

const IPv6PracticeQuiz: React.FC<IPv6PracticeQuizProps> = ({
  currentQuestion,
  setCurrentQuestion,
  answers,
  setAnswers,
  showResults,
  setShowResults,
}) => {
  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < ipv6Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const calculateScore = (): number => {
    const correct = answers.filter((answer, idx) => answer === ipv6Questions[idx].correct).length;
    return Math.round((correct / ipv6Questions.length) * 100);
  };

  return (
    <div className="space-y-6">
      {!showResults ? (
        <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              IPv6 Exam Practice Questions
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Question {currentQuestion + 1} of {ipv6Questions.length}
            </div>
          </div>

          <div className="mb-6 w-full bg-gray-300">
            <div
              className="h-2 bg-blue-600 transition-all"
              style={{ width: `${((currentQuestion + 1) / ipv6Questions.length) * 100}%` }}
            />
          </div>

          <div className="mb-8">
            <h4 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {ipv6Questions[currentQuestion].question}
            </h4>
            <div className="space-y-3">
              {ipv6Questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    answers[currentQuestion] === idx
                      ? 'border-blue-600 bg-blue-100 dark:bg-blue-900'
                      : 'border-gray-300 bg-white hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <div
                      className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        answers[currentQuestion] === idx
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-400'
                      }`}
                    >
                      {answers[currentQuestion] === idx && <span className="text-xs">✓</span>}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:border-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="ml-auto rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {currentQuestion === ipv6Questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
          <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Quiz Results
          </h3>
          <div className="mb-8 text-center">
            <div className="text-5xl font-bold text-green-600">{calculateScore()}%</div>
            <div className="mt-2 text-gray-700 dark:text-gray-300">
              {answers.filter((answer, idx) => answer === ipv6Questions[idx].correct).length} out
              of {ipv6Questions.length} correct
            </div>
          </div>

          <div className="mb-8 space-y-4">
            {ipv6Questions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correct;
              return (
                <div
                  key={q.id}
                  className={`rounded-lg border-l-4 p-4 ${
                    isCorrect
                      ? 'border-l-green-600 bg-white dark:bg-gray-800'
                      : 'border-l-red-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {q.question}
                      </div>
                      <div
                        className={`mt-2 text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                    <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="mt-3 border-t border-gray-300 pt-3 text-sm text-gray-800 dark:text-gray-300">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      Explanation:
                    </div>
                    <div>{q.explanation}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={resetQuiz}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default IPv6PracticeQuiz;
