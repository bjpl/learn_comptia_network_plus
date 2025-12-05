/**
 * Exam Questions component for TopologyAnalyzer
 */

import React from 'react';
import type { ExamQuestion } from './types';

interface ExamQuestionsProps {
  questions: ExamQuestion[];
  userAnswers: Record<string, number>;
  onAnswerSelect: (questionId: string, answerIndex: number) => void;
}

export const ExamQuestionsComponent: React.FC<ExamQuestionsProps> = ({
  questions,
  userAnswers,
  onAnswerSelect,
}) => {
  if (questions.length === 0) {
    return <p className="no-questions">Select topologies to see exam questions</p>;
  }

  const getQuestionScore = (question: ExamQuestion): boolean | null => {
    const userAnswer = userAnswers[question.id];
    if (userAnswer === undefined) {
      return null;
    }
    return userAnswer === question.correctAnswer;
  };

  return (
    <div className="exam-details">
      <h3>CompTIA Network+ Exam Scenarios</h3>
      <p className="intro-text">Test your knowledge with topology-specific exam questions</p>

      <div className="questions-container">
        {questions.map((question) => {
          const userAnswer = userAnswers[question.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === question.correctAnswer;

          return (
            <div
              key={question.id}
              className={`question-card ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
            >
              <div className="question-header">
                <span className="difficulty-badge">{question.difficulty}</span>
                <span className="topology-tag">{question.topologyType}</span>
              </div>

              <p className="question-text">{question.question}</p>

              <div className="options">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option ${
                      userAnswer === idx
                        ? idx === question.correctAnswer
                          ? 'selected-correct'
                          : 'selected-wrong'
                        : idx === question.correctAnswer && isAnswered
                          ? 'correct-answer'
                          : ''
                    }`}
                    onClick={() => onAnswerSelect(question.id, idx)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>

              {isAnswered && (
                <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
