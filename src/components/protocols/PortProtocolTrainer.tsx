/**
 * Component 9: Port/Protocol Explanation Trainer
 * Flashcard system requiring explanations, not just memorization
 */

import React, { useState, useEffect } from 'react';
import { FLASH_CARDS, PROTOCOLS, IP_PROTOCOLS } from './protocols-data';
import type { FlashCard} from './protocols-types';
import { Protocol, IPProtocol } from './protocols-types';

interface ExplanationState {
  userExplanation: string;
  wordCount: number;
  submitted: boolean;
  feedback: string;
  score: number;
}

export const PortProtocolTrainer: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hintsShown, setHintsShown] = useState<number[]>([]);
  const [explanation, setExplanation] = useState<ExplanationState>({
    userExplanation: '',
    wordCount: 0,
    submitted: false,
    feedback: '',
    score: 0
  });
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  const [currentMode, setCurrentMode] = useState<'protocols' | 'ip-types'>('protocols');

  const currentCard = FLASH_CARDS[currentCardIndex];
  const protocol = PROTOCOLS.find(p => p.id === currentCard?.protocolId);

  const handleExplanationChange = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setExplanation({
      ...explanation,
      userExplanation: text,
      wordCount: words.length,
      submitted: false
    });
  };

  const handleSubmitExplanation = () => {
    const minimumWords = currentCard.minimumWords || 20;
    const score = calculateExplanationScore(explanation.userExplanation, currentCard);

    let feedback = '';
    if (explanation.wordCount < minimumWords) {
      feedback = `Too brief! Please provide at least ${minimumWords} words to demonstrate understanding.`;
    } else if (score < 60) {
      feedback = 'Your explanation needs more detail. Try to include key concepts from the answer.';
    } else if (score < 80) {
      feedback = 'Good effort! Consider adding more specific details about security or functionality.';
    } else {
      feedback = 'Excellent explanation! You demonstrated clear understanding.';
      setCompletedCards(prev => new Set([...prev, currentCard.id]));
    }

    setExplanation({
      ...explanation,
      submitted: true,
      feedback,
      score
    });
  };

  const calculateExplanationScore = (userText: string, card: FlashCard): number => {
    const lowerUser = userText.toLowerCase();
    const lowerAnswer = card.answer.toLowerCase();

    // Extract key concepts from the answer
    const keyConcepts = [
      'encrypt', 'plaintext', 'security', 'authentication',
      'port', 'tcp', 'udp', 'server', 'client',
      'data', 'control', 'command', 'vulnerable',
      'attack', 'protection', 'tls', 'ssl'
    ];

    let conceptScore = 0;
    keyConcepts.forEach(concept => {
      if (lowerUser.includes(concept) && lowerAnswer.includes(concept)) {
        conceptScore += 5;
      }
    });

    // Length bonus (up to 20 points)
    const lengthScore = Math.min(20, (userText.length / 150) * 20);

    // Specific terms from answer (up to 30 points)
    const answerWords = lowerAnswer.split(/\s+/).filter(w => w.length > 5);
    const userWords = new Set(lowerUser.split(/\s+/));
    const matchedWords = answerWords.filter(w => userWords.has(w));
    const specificityScore = Math.min(30, (matchedWords.length / answerWords.length) * 30);

    return Math.min(100, conceptScore + lengthScore + specificityScore);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % FLASH_CARDS.length);
    setShowAnswer(false);
    setHintsShown([]);
    setExplanation({
      userExplanation: '',
      wordCount: 0,
      submitted: false,
      feedback: '',
      score: 0
    });
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + FLASH_CARDS.length) % FLASH_CARDS.length);
    setShowAnswer(false);
    setHintsShown([]);
    setExplanation({
      userExplanation: '',
      wordCount: 0,
      submitted: false,
      feedback: '',
      score: 0
    });
  };

  const showHint = (index: number) => {
    if (!hintsShown.includes(index)) {
      setHintsShown([...hintsShown, index]);
    }
  };

  const filteredCards = filterProtocol === 'all'
    ? FLASH_CARDS
    : FLASH_CARDS.filter(card => card.protocolId === filterProtocol);

  const progressPercentage = (completedCards.size / FLASH_CARDS.length) * 100;

  return (
    <div className="port-protocol-trainer">
      <div className="trainer-header">
        <h2>Port & Protocol Explanation Trainer</h2>
        <p className="subtitle">Deep understanding through explanation, not just memorization</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          <span className="progress-text">
            {completedCards.size} / {FLASH_CARDS.length} cards mastered
          </span>
        </div>

        <div className="filter-controls">
          <label>Filter by protocol:</label>
          <select
            value={filterProtocol}
            onChange={(e) => setFilterProtocol(e.target.value)}
          >
            <option value="all">All Protocols</option>
            {PROTOCOLS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flashcard-container">
        <div className="card-counter">
          Card {currentCardIndex + 1} of {FLASH_CARDS.length}
        </div>

        {protocol && (
          <div className={`protocol-badge ${protocol.security}`}>
            <span className="protocol-name">{protocol.name}</span>
            <span className="protocol-ports">
              {protocol.ports.map(p => p.number).join(', ')}
            </span>
            <span className={`security-indicator ${protocol.security}`}>
              {protocol.security}
            </span>
          </div>
        )}

        <div className="flashcard">
          <div className="card-question">
            <h3>Question:</h3>
            <p>{currentCard.question}</p>
          </div>

          {currentCard.requiresExplanation && (
            <div className="explanation-section">
              <h4>{currentCard.explanationPrompt}</h4>
              <textarea
                value={explanation.userExplanation}
                onChange={(e) => handleExplanationChange(e.target.value)}
                placeholder="Type your explanation here... (minimum 20 words)"
                rows={6}
                disabled={explanation.submitted}
              />

              <div className="explanation-meta">
                <span className={`word-count ${explanation.wordCount < (currentCard.minimumWords || 20) ? 'insufficient' : 'sufficient'}`}>
                  Word count: {explanation.wordCount} / {currentCard.minimumWords || 20} minimum
                </span>

                {!explanation.submitted ? (
                  <button
                    onClick={handleSubmitExplanation}
                    disabled={explanation.wordCount < (currentCard.minimumWords || 20)}
                    className="submit-btn"
                  >
                    Submit Explanation
                  </button>
                ) : (
                  <div className={`score-badge score-${Math.floor(explanation.score / 20)}`}>
                    Score: {explanation.score}/100
                  </div>
                )}
              </div>

              {explanation.submitted && (
                <div className={`feedback ${explanation.score >= 80 ? 'positive' : 'needs-work'}`}>
                  <strong>Feedback:</strong> {explanation.feedback}
                </div>
              )}
            </div>
          )}

          <div className="hints-section">
            <h4>Need a hint?</h4>
            <div className="hints-buttons">
              {currentCard.hints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => showHint(index)}
                  disabled={hintsShown.includes(index)}
                  className="hint-btn"
                >
                  {hintsShown.includes(index) ? hint : `Hint ${index + 1}`}
                </button>
              ))}
            </div>
          </div>

          {showAnswer && (
            <div className="card-answer">
              <h3>Answer:</h3>
              <p>{currentCard.answer}</p>
            </div>
          )}

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="toggle-answer-btn"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>

        <div className="navigation-controls">
          <button onClick={handlePreviousCard} className="nav-btn">
            ← Previous
          </button>
          <button onClick={handleNextCard} className="nav-btn">
            Next →
          </button>
        </div>

        {protocol && (
          <div className="protocol-details">
            <h4>Protocol Details: {protocol.fullName}</h4>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Type:</strong> {protocol.type}
              </div>
              <div className="detail-item">
                <strong>Use Case:</strong> {protocol.useCase}
              </div>
              <div className="detail-item security-implications">
                <strong>Security:</strong> {protocol.securityImplications}
              </div>
            </div>

            <div className="vulnerabilities">
              <strong>Common Vulnerabilities:</strong>
              <ul>
                {protocol.commonVulnerabilities.map((vuln, idx) => (
                  <li key={idx}>{vuln}</li>
                ))}
              </ul>
            </div>

            <div className="best-practices">
              <strong>Best Practices:</strong>
              <ul>
                {protocol.bestPractices.map((practice, idx) => (
                  <li key={idx}>{practice}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .port-protocol-trainer {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .trainer-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .trainer-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #7f8c8d;
          font-style: italic;
        }

        .progress-bar {
          position: relative;
          height: 30px;
          background: #ecf0f1;
          border-radius: 15px;
          margin: 20px 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2ecc71);
          transition: width 0.5s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: #2c3e50;
        }

        .filter-controls {
          margin: 20px 0;
        }

        .filter-controls select {
          margin-left: 10px;
          padding: 8px 15px;
          border: 2px solid #3498db;
          border-radius: 5px;
          font-size: 14px;
        }

        .flashcard-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 30px;
        }

        .card-counter {
          text-align: center;
          color: #7f8c8d;
          margin-bottom: 15px;
          font-weight: bold;
        }

        .protocol-badge {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .protocol-badge.insecure {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .protocol-badge.secure {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .security-indicator {
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }

        .security-indicator.secure {
          background: #2ecc71;
        }

        .security-indicator.insecure {
          background: #e74c3c;
        }

        .security-indicator.optional {
          background: #f39c12;
        }

        .flashcard {
          margin: 20px 0;
        }

        .card-question h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .card-question p {
          font-size: 18px;
          line-height: 1.6;
          color: #34495e;
        }

        .explanation-section {
          margin: 25px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .explanation-section h4 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .explanation-section textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #bdc3c7;
          border-radius: 5px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s;
        }

        .explanation-section textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .explanation-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .word-count {
          font-weight: bold;
        }

        .word-count.insufficient {
          color: #e74c3c;
        }

        .word-count.sufficient {
          color: #2ecc71;
        }

        .submit-btn {
          padding: 10px 25px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
        }

        .submit-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .score-badge {
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          color: white;
        }

        .score-0, .score-1, .score-2 { background: #e74c3c; }
        .score-3 { background: #f39c12; }
        .score-4, .score-5 { background: #2ecc71; }

        .feedback {
          margin-top: 15px;
          padding: 15px;
          border-radius: 5px;
        }

        .feedback.positive {
          background: #d5f4e6;
          border: 2px solid #2ecc71;
          color: #27ae60;
        }

        .feedback.needs-work {
          background: #fadbd8;
          border: 2px solid #e74c3c;
          color: #c0392b;
        }

        .hints-section {
          margin: 25px 0;
        }

        .hints-section h4 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .hints-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .hint-btn {
          padding: 8px 15px;
          background: #f39c12;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .hint-btn:hover:not(:disabled) {
          background: #e67e22;
        }

        .hint-btn:disabled {
          background: #ecf0f1;
          color: #7f8c8d;
          cursor: default;
        }

        .card-answer {
          margin: 25px 0;
          padding: 20px;
          background: #e8f5e9;
          border-radius: 8px;
          border-left: 4px solid #2ecc71;
        }

        .card-answer h3 {
          color: #27ae60;
          margin-bottom: 15px;
        }

        .card-answer p {
          font-size: 16px;
          line-height: 1.8;
          color: #2c3e50;
        }

        .toggle-answer-btn {
          width: 100%;
          padding: 12px;
          background: #9b59b6;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-answer-btn:hover {
          background: #8e44ad;
        }

        .navigation-controls {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
        }

        .nav-btn {
          padding: 12px 30px;
          background: #34495e;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .nav-btn:hover {
          background: #2c3e50;
        }

        .protocol-details {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .protocol-details h4 {
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #3498db;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .detail-item {
          padding: 10px;
          background: white;
          border-radius: 5px;
          border-left: 3px solid #3498db;
        }

        .vulnerabilities, .best-practices {
          margin-top: 15px;
        }

        .vulnerabilities ul, .best-practices ul {
          margin-left: 20px;
          line-height: 1.8;
        }

        .vulnerabilities {
          color: #c0392b;
        }

        .best-practices {
          color: #27ae60;
        }

        @media (max-width: 768px) {
          .flashcard-container {
            padding: 15px;
          }

          .protocol-badge {
            flex-direction: column;
            gap: 10px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PortProtocolTrainer;
