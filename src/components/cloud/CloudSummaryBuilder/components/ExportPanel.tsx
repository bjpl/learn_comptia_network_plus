/**
 * ExportPanel component - displays cost calculator and exam practice
 */

import React from 'react';
import type { CostCalculatorInputs, ExamQuestion, UserAnswers } from '../types';

interface ExportPanelProps {
  mode: 'cost' | 'exam';
  costProfile?: keyof CostCalculatorInputs;
  costInputs?: CostCalculatorInputs;
  onCostProfileChange?: (profile: keyof CostCalculatorInputs) => void;
  examQuestions?: ExamQuestion[];
  userAnswers?: UserAnswers;
  onAnswerQuestion?: (questionId: string, answer: string) => void;
  getQuestionScore?: (questionId: string) => boolean | null;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  mode,
  costProfile,
  costInputs,
  onCostProfileChange,
  examQuestions,
  userAnswers,
  onAnswerQuestion,
  getQuestionScore,
}) => {
  if (mode === 'cost' && costProfile && costInputs && onCostProfileChange) {
    return (
      <div className="tab-content">
        <div className="cost-calculator">
          <h3>Cloud Cost Estimation</h3>
          <div className="cost-profile-selector">
            <label>Select a profile:</label>
            {Object.keys(costInputs).map((profile) => (
              <button
                key={profile}
                className={`profile-btn ${costProfile === profile ? 'active' : ''}`}
                onClick={() => onCostProfileChange(profile as keyof CostCalculatorInputs)}
              >
                {profile}
              </button>
            ))}
          </div>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span className="cost-label">Compute (CPU/Memory):</span>
              <span className="cost-value">${costInputs[costProfile].compute}/month</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Storage (GB):</span>
              <span className="cost-value">${costInputs[costProfile].storage}/month</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Bandwidth (TB):</span>
              <span className="cost-value">${costInputs[costProfile].bandwidth}/month</span>
            </div>
            <div className="cost-item total">
              <span className="cost-label">Total Estimated Cost:</span>
              <span className="cost-value">${costInputs[costProfile].monthly}/month</span>
            </div>
          </div>
          <div className="cost-note">
            <p>
              These are simplified estimates. Actual costs vary by provider, region, and usage
              patterns. Check AWS, Azure, or GCP cost calculators for detailed pricing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'exam' && examQuestions && userAnswers && onAnswerQuestion && getQuestionScore) {
    return (
      <div className="tab-content">
        <div className="exam-practice">
          <h3>Exam Practice Questions</h3>
          <div className="exam-questions">
            {examQuestions.map((q) => (
              <div
                key={q.id}
                className={`exam-question ${getQuestionScore(q.id) === true ? 'correct' : getQuestionScore(q.id) === false ? 'incorrect' : ''}`}
              >
                <h4>{q.question}</h4>
                <div className="exam-options">
                  {q.options.map((option) => (
                    <label key={option} className="exam-option">
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        checked={userAnswers[q.id] === option}
                        onChange={() => onAnswerQuestion(q.id, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {userAnswers[q.id] && (
                  <div className={`exam-feedback ${getQuestionScore(q.id) ? 'success' : 'error'}`}>
                    <p>
                      <strong>{getQuestionScore(q.id) ? 'Correct!' : 'Incorrect.'}</strong>{' '}
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
