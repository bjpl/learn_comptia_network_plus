/**
 * Quiz engine component for PortProtocolTrainer
 */

import React from 'react';
import type { QuizQuestion, QuizResult } from './types';

interface QuizEngineProps {
  quizQuestions: QuizQuestion[];
  currentQuestionIndex: number;
  quizResults: QuizResult[];
  quizCompleted: boolean;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  onRetry: () => void;
  onBackToFlashcards: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quizQuestions,
  currentQuestionIndex,
  quizResults,
  quizCompleted,
  selectedAnswer,
  onSelectAnswer,
  onRetry,
  onBackToFlashcards,
}) => {
  if (quizCompleted) {
    const score = (quizResults.filter((r) => r.correct).length / quizResults.length) * 100;
    const totalTime = quizResults.reduce((sum, r) => sum + r.timeSpent, 0);

    return (
      <div className="quiz-results">
        <h2>Quiz Complete!</h2>
        <div className="score-display">
          <div className="score-number">{score.toFixed(0)}%</div>
          <div className="score-details">
            {quizResults.filter((r) => r.correct).length} / {quizResults.length} correct
          </div>
          <div className="time-taken">Time: {(totalTime / 1000).toFixed(1)}s</div>
        </div>

        <div className="quiz-breakdown">
          {quizQuestions.map((q, index) => {
            const result = quizResults[index];
            return (
              <div
                key={q.id}
                className={`question-review ${result.correct ? 'correct' : 'incorrect'}`}
              >
                <div className="question-number">Q{index + 1}</div>
                <div className="question-text">{q.question}</div>
                <div className="answer-comparison">
                  <div>
                    Your answer: <strong>{result.selectedAnswer}</strong>
                  </div>
                  {!result.correct && (
                    <div className="correct-answer">
                      Correct: <strong>{q.correctAnswer}</strong>
                    </div>
                  )}
                </div>
                <div className="explanation">{q.explanation}</div>
              </div>
            );
          })}
        </div>

        <div className="quiz-actions">
          <button onClick={onRetry} className="retry-btn">
            Try Again
          </button>
          <button onClick={onBackToFlashcards} className="back-btn">
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestionIndex];
  if (!question) {
    return null;
  }

  return (
    <div className="quiz-mode">
      <div className="quiz-header">
        <div className="question-counter">
          Question {currentQuestionIndex + 1} / {quizQuestions.length}
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-question">
        <h3>{question.question}</h3>
        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelectAnswer(option);
              }}
              className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
              disabled={selectedAnswer !== ''}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
