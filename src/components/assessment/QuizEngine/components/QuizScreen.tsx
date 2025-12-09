/**
 * Active quiz screen component
 */

import React from 'react';
import type { QuizState } from '../../quiz-types';
import type { QuizConfig } from '../types';

interface QuizScreenProps {
  quizState: QuizState;
  selectedOptions: Set<string>;
  setSelectedOptions: (options: Set<string>) => void;
  timeElapsed: number;
  showExplanation: boolean;
  config: QuizConfig;
  submitAnswer: () => void;
  handleNext: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  quizState,
  selectedOptions,
  setSelectedOptions,
  timeElapsed,
  showExplanation,
  config,
  submitAnswer,
  handleNext,
}) => {
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
  const isAnswered = selectedOptions.size > 0;

  return (
    <div className="quiz-engine">
      <div className="quiz-container">
        <div className="quiz-progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="quiz-meta">
          <div className="question-counter">
            Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
          </div>
          <div className="quiz-timer">
            {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
          </div>
          <div className="domain-badge">{currentQuestion.domain}</div>
          <div className={`difficulty-badge difficulty-${currentQuestion.difficulty}`}>
            {currentQuestion.difficulty}
          </div>
        </div>

        <div className="question-container">
          <h2 className="question-text">{currentQuestion.question}</h2>

          {currentQuestion.type === 'multiple-select' && (
            <p className="question-hint">Select all that apply</p>
          )}

          <div className="options-container">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptions.has(option.id);
              const showCorrect = showExplanation && option.isCorrect;
              const showIncorrect = showExplanation && isSelected && !option.isCorrect;

              return (
                <div
                  key={option.id}
                  className={`option ${isSelected ? 'selected' : ''} ${
                    showCorrect ? 'correct' : ''
                  } ${showIncorrect ? 'incorrect' : ''}`}
                  onClick={() => {
                    if (showExplanation) {
                      return;
                    }

                    if (currentQuestion.type === 'multiple-select') {
                      const newSelected = new Set(selectedOptions);
                      if (isSelected) {
                        newSelected.delete(option.id);
                      } else {
                        newSelected.add(option.id);
                      }
                      setSelectedOptions(newSelected);
                    } else {
                      setSelectedOptions(new Set([option.id]));
                    }
                  }}
                >
                  <div className="option-marker">
                    {currentQuestion.type === 'multiple-select' ? (
                      <input type="checkbox" checked={isSelected} readOnly />
                    ) : (
                      <input type="radio" checked={isSelected} readOnly />
                    )}
                  </div>
                  <div className="option-text">{option.text}</div>
                  {showCorrect && <span className="icon-check">✓</span>}
                  {showIncorrect && <span className="icon-cross">✗</span>}
                </div>
              );
            })}
          </div>

          {showExplanation && (
            <div className="explanation-container">
              <div className="explanation">
                <h3>Explanation</h3>
                <p>{currentQuestion.explanation}</p>
              </div>
              <div className="exam-tip">
                <h3>Exam Tip</h3>
                <p>{currentQuestion.examTip}</p>
              </div>
              <button className="btn-primary" onClick={handleNext}>
                Next Question
              </button>
            </div>
          )}

          {!showExplanation && (
            <div className="quiz-actions">
              <button className="btn-primary" onClick={submitAnswer} disabled={!isAnswered}>
                {config.feedbackMode === 'immediate' ? 'Submit Answer' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
