/**
 * Main PortProtocolTrainer component (refactored)
 * Orchestrates flashcard learning, quiz mode, memory palace, and analytics
 */

import React, { useState, useMemo } from 'react';
import { FlashcardSystem } from './FlashcardSystem';
import { QuizEngine } from './QuizEngine';
import { ProgressTracker } from './ProgressTracker';
import { AnalyticsView } from './AnalyticsView';
import { MemoryPalace } from './MemoryPalace';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { generateQuizQuestions } from './utils';
import type { TrainingMode, QuizQuestion, QuizResult } from './types';
import './styles.css';

export const PortProtocolTrainer: React.FC = () => {
  const [mode, setMode] = useState<TrainingMode>('flashcards');
  const { progress, stats, dueCards, reviewCard, addQuizScore } = useSpacedRepetition();

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const currentCard = useMemo(() => {
    if (mode === 'flashcards' && dueCards.length > 0) {
      return dueCards[currentCardIndex % dueCards.length];
    }
    return null;
  }, [mode, dueCards, currentCardIndex]);

  const currentProgress = useMemo(() => {
    if (currentCard) {
      return progress.get(currentCard.id);
    }
    return undefined;
  }, [currentCard, progress]);

  const handleCardReview = (correct: boolean) => {
    if (!currentCard) {
      return;
    }

    reviewCard(currentCard, correct);
    setShowAnswer(false);

    if (dueCards.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % dueCards.length);
    }
  };

  const startQuiz = () => {
    const questions = generateQuizQuestions(10);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setQuizCompleted(false);
    setSelectedAnswer('');
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setMode('quiz');
  };

  const handleQuizAnswer = (answer: string) => {
    if (!quizQuestions[currentQuestionIndex]) {
      return;
    }

    setSelectedAnswer(answer);

    setTimeout(() => {
      const question = quizQuestions[currentQuestionIndex];
      const correct = answer === question.correctAnswer;
      const timeSpent = Date.now() - questionStartTime;

      const result: QuizResult = {
        questionId: question.id,
        correct,
        timeSpent,
        selectedAnswer: answer,
      };

      const newResults = [...quizResults, result];
      setQuizResults(newResults);

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
        setQuestionStartTime(Date.now());
      } else {
        const score = (newResults.filter((r) => r.correct).length / newResults.length) * 100;
        const totalTime = Date.now() - quizStartTime;

        addQuizScore(score, totalTime);
        setQuizCompleted(true);
      }
    }, 300);
  };

  return (
    <div className="port-protocol-trainer-enhanced">
      <header className="trainer-header">
        <h1>⚡ ULTIMATE Port/Protocol Trainer</h1>
        <p>CompTIA Network+ N10-008 Exam Preparation</p>

        <ProgressTracker stats={stats} />
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
          <FlashcardSystem
            currentCard={currentCard}
            currentProgress={currentProgress}
            currentCardIndex={currentCardIndex}
            dueCardsCount={dueCards.length}
            showAnswer={showAnswer}
            onReveal={() => setShowAnswer(true)}
            onReview={handleCardReview}
            onStartQuiz={startQuiz}
          />
        )}
        {mode === 'quiz' && (
          <QuizEngine
            quizQuestions={quizQuestions}
            currentQuestionIndex={currentQuestionIndex}
            quizResults={quizResults}
            quizCompleted={quizCompleted}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleQuizAnswer}
            onRetry={startQuiz}
            onBackToFlashcards={() => setMode('flashcards')}
          />
        )}
        {mode === 'memory-palace' && <MemoryPalace />}
        {mode === 'analytics' && <AnalyticsView stats={stats} progress={progress} />}
      </main>
    </div>
  );
};

export default PortProtocolTrainer;
