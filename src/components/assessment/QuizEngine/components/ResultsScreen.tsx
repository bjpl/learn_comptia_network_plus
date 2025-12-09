/**
 * Quiz results screen component
 */

import React from 'react';
import type { QuizScore } from '../../quiz-types';

interface ResultsScreenProps {
  score: QuizScore;
  retryIncorrect: () => void;
  resetQuiz: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  retryIncorrect,
  resetQuiz,
}) => {
  return (
    <div className="quiz-engine">
      <div className="quiz-container results-container">
        <div className="results-header">
          <h1>{score.passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}</h1>
          <div className={`score-circle ${score.passed ? 'passed' : 'failed'}`}>
            <div className="score-percentage">{score.percentage.toFixed(1)}%</div>
            <div className="score-label">
              {score.correctAnswers}/{score.totalQuestions} Correct
            </div>
          </div>
          <p className="score-scaled">
            Scaled Score: {Math.round((score.percentage / 100) * 900)}/900
            {score.passed ? ' (PASS)' : ' (FAIL - 720 required)'}
          </p>
        </div>

        <div className="results-stats">
          <div className="stat-card">
            <div className="stat-value">{score.correctAnswers}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{score.incorrectAnswers}</div>
            <div className="stat-label">Incorrect</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {Math.floor(score.timeSpent / 60)}:
              {(score.timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <div className="stat-label">Time</div>
          </div>
        </div>

        <div className="domain-breakdown">
          <h2>Performance by Domain</h2>
          {score.domainBreakdown.map((domain) => (
            <div key={domain.domain} className="domain-score">
              <div className="domain-info">
                <span className="domain-name">
                  {domain.domain} - {domain.domainName}
                </span>
                <span className="domain-percentage">{domain.percentage.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${domain.percentage}%`,
                    backgroundColor:
                      domain.percentage >= 70
                        ? '#10b981'
                        : domain.percentage >= 50
                          ? '#f59e0b'
                          : '#ef4444',
                  }}
                ></div>
              </div>
              <div className="domain-detail">
                {domain.correctAnswers}/{domain.totalQuestions} correct
              </div>
            </div>
          ))}
        </div>

        <div className="difficulty-breakdown">
          <h2>Performance by Difficulty</h2>
          <div className="difficulty-grid">
            {score.difficultyBreakdown.map((diff) => (
              <div key={diff.difficulty} className="difficulty-card">
                <div className={`difficulty-label difficulty-${diff.difficulty}`}>
                  {diff.difficulty.toUpperCase()}
                </div>
                <div className="difficulty-score">{diff.percentage.toFixed(0)}%</div>
                <div className="difficulty-detail">
                  {diff.correctAnswers}/{diff.totalQuestions}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          {score.incorrectAnswers > 0 && (
            <button className="btn-secondary" onClick={retryIncorrect}>
              Retry Incorrect ({score.incorrectAnswers})
            </button>
          )}
          <button className="btn-primary" onClick={resetQuiz}>
            New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
