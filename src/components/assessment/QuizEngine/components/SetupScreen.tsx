/**
 * Quiz setup screen component
 */

import React from 'react';
import type { Domain, Difficulty } from '../../quiz-types';
import type { QuizConfig } from '../types';
import { domainInfo } from '../../quiz-data';

interface SetupScreenProps {
  config: QuizConfig;
  setConfig: (config: QuizConfig) => void;
  startQuiz: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ config, setConfig, startQuiz }) => {
  return (
    <div className="quiz-engine">
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>CompTIA Network+ Practice Quiz</h1>
          <p>Customize your quiz settings and start practicing</p>
        </div>

        <div className="quiz-setup">
          <div className="setup-section">
            <label>Number of Questions</label>
            <input
              type="number"
              min="5"
              max="50"
              value={config.numberOfQuestions}
              onChange={(e) =>
                setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) || 20 })
              }
            />
          </div>

          <div className="setup-section">
            <label>Select Domains</label>
            <div className="checkbox-group">
              {Object.entries(domainInfo).map(([key, info]) => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={config.domains.includes(key as Domain)}
                    onChange={(e) => {
                      const domains = e.target.checked
                        ? [...config.domains, key as Domain]
                        : config.domains.filter((d) => d !== key);
                      setConfig({ ...config, domains });
                    }}
                  />
                  <span>
                    {key} - {info.name} ({info.weight})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <label>Difficulty Levels</label>
            <div className="checkbox-group">
              {['easy', 'medium', 'hard'].map((diff) => (
                <label key={diff} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={config.difficulties.includes(diff as Difficulty)}
                    onChange={(e) => {
                      const difficulties = e.target.checked
                        ? [...config.difficulties, diff as Difficulty]
                        : config.difficulties.filter((d) => d !== diff);
                      setConfig({ ...config, difficulties });
                    }}
                  />
                  <span className={`difficulty-${diff}`}>{diff.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <label>Feedback Mode</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.feedbackMode === 'immediate'}
                  onChange={() => setConfig({ ...config, feedbackMode: 'immediate' })}
                />
                <span>Immediate (see explanation after each question)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={config.feedbackMode === 'review-at-end'}
                  onChange={() => setConfig({ ...config, feedbackMode: 'review-at-end' })}
                />
                <span>Review at End (exam simulation mode)</span>
              </label>
            </div>
          </div>

          <div className="setup-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={config.randomize}
                onChange={(e) => setConfig({ ...config, randomize: e.target.checked })}
              />
              <span>Randomize question order</span>
            </label>
          </div>

          <button className="btn-primary btn-large" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
