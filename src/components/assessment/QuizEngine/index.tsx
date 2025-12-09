/**
 * QuizEngine Component - Main entry point
 * Comprehensive quiz system for CompTIA Network+ exam preparation
 */

import React, { useState } from 'react';
import type { QuizState } from '../quiz-types';
import type { QuizEngineProps, ScreenType } from './types';
import { DEFAULT_CONFIG } from './types';
import { useQuizTimer, useQuizProgress, useQuizActions, useQuestionAnswer } from './hooks';
import { SetupScreen, QuizScreen, ResultsScreen } from './components';
import { calculateScore } from './utils/scoreCalculator';
import '../QuizEngine.css';

export const QuizEngine: React.FC<QuizEngineProps> = ({ initialConfig }) => {
  const [screen, setScreen] = useState<ScreenType>('setup');
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG, ...initialConfig });
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  const { timeElapsed, setTimeElapsed } = useQuizTimer(screen, quizState);

  useQuizProgress({ quizState, setQuizState, setTimeElapsed, setScreen });

  const { startQuiz, moveToNextQuestion, retryIncorrect, resetQuiz } = useQuizActions({
    config,
    quizState,
    setQuizState,
    setTimeElapsed,
    setScreen,
    setSelectedOptions,
    setQuestionStartTime,
    setShowExplanation,
  });

  const { submitAnswer, handleNext } = useQuestionAnswer({
    quizState,
    selectedOptions,
    questionStartTime,
    config,
    setShowExplanation,
    moveToNextQuestion,
  });

  if (screen === 'setup') {
    return <SetupScreen config={config} setConfig={setConfig} startQuiz={startQuiz} />;
  }

  if (screen === 'quiz' && quizState) {
    return (
      <QuizScreen
        quizState={quizState}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        timeElapsed={timeElapsed}
        showExplanation={showExplanation}
        config={config}
        submitAnswer={submitAnswer}
        handleNext={handleNext}
      />
    );
  }

  if (screen === 'results' && quizState) {
    const score = calculateScore(quizState, timeElapsed);
    return <ResultsScreen score={score} retryIncorrect={retryIncorrect} resetQuiz={resetQuiz} />;
  }

  return null;
};

export default QuizEngine;
