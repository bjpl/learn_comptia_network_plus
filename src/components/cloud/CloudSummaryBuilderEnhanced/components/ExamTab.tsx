/**
 * Exam Practice Tab Component
 */

import React from 'react';
import { EXAM_QUESTIONS } from '../constants';

interface ExamTabProps {
  userAnswers: Record<string, string>;
  onAnswer: (qId: string, answer: string) => void;
  isCorrect: (qId: string) => boolean | null;
}

export const ExamTab: React.FC<ExamTabProps> = ({ userAnswers, onAnswer, isCorrect }) => {
  return (
    <div className="tab-section">
      <h3>Exam Practice Questions</h3>
      <div className="exam-list">
        {EXAM_QUESTIONS.map((q) => (
          <div
            key={q.id}
            className={`exam-box ${isCorrect(q.id) === true ? 'correct' : isCorrect(q.id) === false ? 'incorrect' : ''}`}
          >
            <h4>{q.question}</h4>
            <div className="options">
              {q.options.map((opt) => (
                <label key={opt} className="option">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={userAnswers[q.id] === opt}
                    onChange={() => onAnswer(q.id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {userAnswers[q.id] && (
              <div className={`feedback ${isCorrect(q.id) ? 'success' : 'error'}`}>
                <strong>{isCorrect(q.id) ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
