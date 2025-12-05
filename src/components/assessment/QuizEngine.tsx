/**
 * QuizEngine Component
 * Comprehensive quiz system for CompTIA Network+ exam preparation
 */

import React, { useState, useEffect, useCallback } from 'react';
import type {
  QuizConfig,
  QuizState,
  UserAnswer as QuizUserAnswer,
  QuizScore,
  Domain,
  Difficulty,
} from './quiz-types';
import { getRandomQuestions, domainInfo } from './quiz-data';
import './QuizEngine.css';

interface QuizEngineProps {
  initialConfig?: Partial<QuizConfig>;
}

const DEFAULT_CONFIG: QuizConfig = {
  numberOfQuestions: 20,
  domains: ['1.0', '2.0', '3.0', '4.0', '5.0'],
  difficulties: ['easy', 'medium', 'hard'],
  feedbackMode: 'review-at-end',
  randomize: true,
  retryIncorrectOnly: false,
};

export const QuizEngine: React.FC<QuizEngineProps> = ({ initialConfig }) => {
  const [screen, setScreen] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [config, setConfig] = useState<QuizConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer effect
  useEffect(() => {
    if (screen === 'quiz' && quizState && !quizState.isPaused && !quizState.isCompleted) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [screen, quizState]);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quizProgress');
      if (saved) {
        const progress = JSON.parse(saved) as { quizState?: QuizState };
        if (progress.quizState && !progress.quizState.isCompleted) {
          const resume = window.confirm('Resume your previous quiz?');
          if (resume) {
            setQuizState(progress.quizState);
            setTimeElapsed(
              Math.floor((Date.now() - new Date(progress.quizState.startTime).getTime()) / 1000)
            );
            setScreen('quiz');
          }
        }
      }
    } catch {
      // Failed to load saved progress - ignore and start fresh
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (quizState && !quizState.isCompleted) {
      try {
        localStorage.setItem('quizProgress', JSON.stringify({ quizState }));
      } catch {
        // Failed to save progress - continue without saving
      }
    }
  }, [quizState]);

  const startQuiz = useCallback(() => {
    const questions = getRandomQuestions(
      config.numberOfQuestions,
      config.domains,
      config.difficulties
    );

    if (questions.length === 0) {
      alert('No questions match your criteria. Please adjust your filters.');
      return;
    }

    const newQuizState: QuizState = {
      quizId: `quiz-${Date.now()}`,
      startTime: new Date(),
      currentQuestionIndex: 0,
      questions,
      answers: [],
      config,
      isPaused: false,
      isCompleted: false,
    };

    setQuizState(newQuizState);
    setTimeElapsed(0);
    setQuestionStartTime(Date.now());
    setSelectedOptions(new Set());
    setScreen('quiz');
  }, [config]);

  const moveToNextQuestion = useCallback(
    (updatedAnswers: QuizUserAnswer[]) => {
      if (!quizState) {
        return;
      }

      const nextIndex = quizState.currentQuestionIndex + 1;

      if (nextIndex >= quizState.questions.length) {
        // Quiz completed
        setQuizState({
          ...quizState,
          answers: updatedAnswers,
          endTime: new Date(),
          isCompleted: true,
        });
        setScreen('results');
      } else {
        // Move to next question
        setQuizState({
          ...quizState,
          currentQuestionIndex: nextIndex,
          answers: updatedAnswers,
        });
        setSelectedOptions(new Set());
        setQuestionStartTime(Date.now());
        setShowExplanation(false);
      }
    },
    [quizState]
  );

  const submitAnswer = useCallback(() => {
    if (!quizState) {
      return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const correctOptionIds = new Set(
      currentQuestion.options.filter((opt) => opt.isCorrect).map((opt) => opt.id)
    );

    const selectedArray = Array.from(selectedOptions);
    const isCorrect =
      selectedArray.length === correctOptionIds.size &&
      selectedArray.every((id) => correctOptionIds.has(id));

    const answer: QuizUserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIds: selectedArray,
      isCorrect,
      timeSpent: Math.floor((Date.now() - questionStartTime) / 1000),
      timestamp: new Date(),
    };

    const updatedAnswers = [...quizState.answers, answer];

    if (config.feedbackMode === 'immediate') {
      setShowExplanation(true);
    } else {
      moveToNextQuestion(updatedAnswers);
    }
  }, [quizState, selectedOptions, questionStartTime, config.feedbackMode, moveToNextQuestion]);

  const handleNext = useCallback(() => {
    if (!quizState) {
      return;
    }
    moveToNextQuestion(quizState.answers);
  }, [quizState, moveToNextQuestion]);

  const calculateScore = useCallback((): QuizScore => {
    if (!quizState) {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        skippedQuestions: 0,
        percentage: 0,
        passingScore: 720,
        passed: false,
        timeSpent: 0,
        domainBreakdown: [],
        difficultyBreakdown: [],
      };
    }

    const correctAnswers = quizState.answers.filter((a) => a.isCorrect).length;
    const incorrectAnswers = quizState.answers.filter((a) => !a.isCorrect).length;
    const percentage = (correctAnswers / quizState.questions.length) * 100;
    const scaledScore = (percentage / 100) * 900;

    // Domain breakdown
    const domainScores = new Map();
    quizState.questions.forEach((q, index) => {
      if (!domainScores.has(q.domain)) {
        domainScores.set(q.domain, { total: 0, correct: 0, domainName: q.domainName });
      }
      const stats = domainScores.get(q.domain);
      stats.total++;
      if (quizState.answers[index]?.isCorrect) {
        stats.correct++;
      }
    });

    const domainBreakdown = Array.from(domainScores.entries()).map(
      ([domain, stats]: [string, { total: number; correct: number; domainName: string }]) => ({
        domain: domain as Domain,
        domainName: stats.domainName,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        percentage: (stats.correct / stats.total) * 100,
      })
    );

    // Difficulty breakdown
    const difficultyScores = new Map();
    quizState.questions.forEach((q, index) => {
      if (!difficultyScores.has(q.difficulty)) {
        difficultyScores.set(q.difficulty, { total: 0, correct: 0 });
      }
      const stats = difficultyScores.get(q.difficulty);
      stats.total++;
      if (quizState.answers[index]?.isCorrect) {
        stats.correct++;
      }
    });

    const difficultyBreakdown = Array.from(difficultyScores.entries()).map(
      ([difficulty, stats]: [string, { total: number; correct: number }]) => ({
        difficulty: difficulty as Difficulty,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        percentage: (stats.correct / stats.total) * 100,
      })
    );

    return {
      totalQuestions: quizState.questions.length,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions: 0,
      percentage,
      passingScore: 720,
      passed: scaledScore >= 720,
      timeSpent: timeElapsed,
      domainBreakdown,
      difficultyBreakdown,
    };
  }, [quizState, timeElapsed]);

  const retryIncorrect = useCallback(() => {
    if (!quizState) {
      return;
    }

    const incorrectQuestions = quizState.questions.filter((_q, index) => {
      const answer = quizState.answers[index];
      return answer && !answer.isCorrect;
    });

    const newQuizState: QuizState = {
      quizId: `quiz-retry-${Date.now()}`,
      startTime: new Date(),
      currentQuestionIndex: 0,
      questions: incorrectQuestions,
      answers: [],
      config: { ...config, retryIncorrectOnly: true },
      isPaused: false,
      isCompleted: false,
    };

    setQuizState(newQuizState);
    setTimeElapsed(0);
    setQuestionStartTime(Date.now());
    setSelectedOptions(new Set());
    setScreen('quiz');
  }, [quizState, config]);

  const resetQuiz = useCallback(() => {
    window.localStorage.removeItem('quizProgress');
    setQuizState(null);
    setSelectedOptions(new Set());
    setTimeElapsed(0);
    setShowExplanation(false);
    setScreen('setup');
  }, []);

  // Render setup screen
  if (screen === 'setup') {
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
  }

  // Render quiz screen
  if (screen === 'quiz' && quizState) {
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
  }

  // Render results screen
  if (screen === 'results' && quizState) {
    const score = calculateScore();

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
  }

  return null;
};

export default QuizEngine;
