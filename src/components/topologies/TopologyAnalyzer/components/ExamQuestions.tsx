/**
 * ExamQuestions Component
 * CompTIA Network+ exam scenarios and questions
 */

import React, { useState } from 'react';
import type { ExamQuestion } from '../types';

interface ExamQuestionsProps {
  questions: ExamQuestion[];
}

export const ExamQuestions: React.FC<ExamQuestionsProps> = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  if (questions.length === 0) {
    return <p className="no-questions">Select topologies to see exam questions</p>;
  }

  return (
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
                  onClick={() => setUserAnswers({ ...userAnswers, [question.id]: idx })}
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
  );
};
