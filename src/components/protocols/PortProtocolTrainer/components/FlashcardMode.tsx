/**
 * Flashcard mode component for spaced repetition learning
 */

import React from 'react';
import type { PortCard, CardProgress } from '../types';

interface FlashcardModeProps {
  currentCard: PortCard | null;
  currentProgress: CardProgress | undefined;
  currentCardIndex: number;
  dueCardsCount: number;
  showAnswer: boolean;
  onRevealAnswer: () => void;
  onCardReview: (correct: boolean) => void;
  onStartQuiz: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  currentCard,
  currentProgress,
  currentCardIndex,
  dueCardsCount,
  showAnswer,
  onRevealAnswer,
  onCardReview,
  onStartQuiz,
}) => {
  if (!currentCard) {
    return (
      <div className="no-cards">
        <h3>🎉 All caught up!</h3>
        <p>You've reviewed all due cards. Come back later or start a quiz!</p>
        <button onClick={onStartQuiz} className="quiz-btn">
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flashcard-mode">
      <div className="flashcard-header">
        <div className="card-counter">
          Card {currentCardIndex + 1} of {dueCardsCount} due
        </div>
        {currentProgress && (
          <div className="leitner-box">
            Box {currentProgress.box + 1}/5 | Accuracy: {currentProgress.accuracy.toFixed(0)}%
          </div>
        )}
      </div>

      <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <div className="port-number">{currentCard.port}</div>
          <div className="card-category">{currentCard.category}</div>
          {currentCard.examCritical && <div className="exam-badge">EXAM CRITICAL</div>}
        </div>

        {showAnswer && (
          <div className="flashcard-back">
            <h3>{currentCard.protocol}</h3>
            <div className="service-name">{currentCard.service}</div>
            <div className="protocol-details">
              <span className={`security-badge ${currentCard.security.toLowerCase()}`}>
                {currentCard.security}
              </span>
              <span className="tcp-udp-badge">{currentCard.tcpUdp}</span>
            </div>
            <p className="description">{currentCard.description}</p>
            <div className="mnemonic">
              <strong>💡 Memory Aid:</strong> {currentCard.mnemonic}
            </div>
          </div>
        )}
      </div>

      <div className="flashcard-controls">
        {!showAnswer ? (
          <button onClick={onRevealAnswer} className="reveal-btn">
            Reveal Answer
          </button>
        ) : (
          <div className="rating-buttons">
            <button onClick={() => onCardReview(false)} className="rating-btn hard">
              ❌ Incorrect
            </button>
            <button onClick={() => onCardReview(true)} className="rating-btn easy">
              ✅ Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
