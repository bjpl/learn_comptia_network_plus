/**
 * Port Protocol Trainer - Main orchestrator component
 * Features:
 * - Spaced repetition (Leitner system)
 * - Flashcard mode
 * - Quiz mode
 * - Memory palace with mnemonics
 * - Performance analytics
 * - Gamification (achievements, levels, XP)
 */

import React, { useState } from 'react';
import type { TrainingMode } from './types';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { useQuizEngine } from './hooks/useQuizEngine';
import { useTrainingStats } from './hooks/useTrainingStats';
import { FlashcardMode } from './components/FlashcardMode';
import { QuizMode } from './components/QuizMode';
import { MemoryPalace } from './components/MemoryPalace';
import { Analytics } from './components/Analytics';
import './styles.css';

export const PortProtocolTrainer: React.FC = () => {
  const [mode, setMode] = useState<TrainingMode>('flashcards');

  // Hooks for state management
  const {
    progress,
    currentCard,
    currentProgress,
    currentCardIndex,
    dueCards,
    showAnswer,
    setShowAnswer,
    handleCardReview: handleSpacedRepetitionReview,
  } = useSpacedRepetition();

  const {
    quizQuestions,
    currentQuestionIndex,
    quizResults,
    quizCompleted,
    selectedAnswer,
    setSelectedAnswer,
    startQuiz: startQuizEngine,
    handleQuizAnswer: handleQuizEngineAnswer,
  } = useQuizEngine();

  const { stats, updateStatsAfterReview, updateStatsAfterQuiz } = useTrainingStats();

  /**
   * Handle card review and update stats
   */
  const handleCardReview = (correct: boolean) => {
    const currentProg = progress.get(currentCard?.id || '') || {
      cardId: currentCard?.id || '',
      box: 0,
      lastReviewed: 0,
      nextReview: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0,
    };

    const previousBox = currentProg.box;
    handleSpacedRepetitionReview(correct);
    updateStatsAfterReview(correct, previousBox, progress);
  };

  /**
   * Start quiz and switch to quiz mode
   */
  const startQuiz = () => {
    startQuizEngine(10);
    setMode('quiz');
  };

  /**
   * Handle quiz answer and check for completion
   */
  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      const result = handleQuizEngineAnswer(answer);
      if (result && quizResults.length === quizQuestions.length - 1) {
        // Quiz just completed
        const score = ((quizResults.length + (result.correct ? 1 : 0)) / quizQuestions.length) * 100;
        const totalTime = [...quizResults, result].reduce((sum, r) => sum + r.timeSpent, 0);
        updateStatsAfterQuiz(score, totalTime);
      }
    }, 300);
  };

  return (
    <div className="port-protocol-trainer-enhanced">
      <header className="trainer-header">
        <h1>⚡ ULTIMATE Port/Protocol Trainer</h1>
        <p>CompTIA Network+ N10-008 Exam Preparation</p>

        <div className="trainer-stats-bar">
          <div className="stat-item">
            <span className="stat-label">Level {stats.level}</span>
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{
                  width: `${((stats.xp % 100) / 100) * 100}%`,
                }}
              />
            </div>
            <span className="stat-value">{stats.xp % 100}/100 XP</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{stats.studyStreak} 🔥</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mastered</span>
            <span className="stat-value">
              {stats.masteredCards}/{stats.totalCards}
            </span>
          </div>
        </div>
      </header>

      <nav className="mode-selector">
        <button
          onClick={() => setMode('flashcards')}
          className={`mode-btn ${mode === 'flashcards' ? 'active' : ''}`}
        >
          📇 Flashcards
        </button>
        <button onClick={startQuiz} className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`}>
          📝 Quiz Mode
        </button>
        <button
          onClick={() => setMode('memory-palace')}
          className={`mode-btn ${mode === 'memory-palace' ? 'active' : ''}`}
        >
          🏰 Memory Palace
        </button>
        <button
          onClick={() => setMode('analytics')}
          className={`mode-btn ${mode === 'analytics' ? 'active' : ''}`}
        >
          📊 Analytics
        </button>
      </nav>

      <main className="trainer-content">
        {mode === 'flashcards' && (
          <FlashcardMode
            currentCard={currentCard}
            currentProgress={currentProgress}
            currentCardIndex={currentCardIndex}
            dueCardsCount={dueCards.length}
            showAnswer={showAnswer}
            onRevealAnswer={() => setShowAnswer(true)}
            onCardReview={handleCardReview}
            onStartQuiz={startQuiz}
          />
        )}
        {mode === 'quiz' && (
          <QuizMode
            quizQuestions={quizQuestions}
            currentQuestionIndex={currentQuestionIndex}
            quizResults={quizResults}
            quizCompleted={quizCompleted}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleQuizAnswer}
            onStartQuiz={startQuiz}
            onBackToFlashcards={() => setMode('flashcards')}
          />
        )}
        {mode === 'memory-palace' && <MemoryPalace />}
        {mode === 'analytics' && <Analytics stats={stats} progress={progress} />}
      </main>
    </div>
  );
};

export default PortProtocolTrainer;
