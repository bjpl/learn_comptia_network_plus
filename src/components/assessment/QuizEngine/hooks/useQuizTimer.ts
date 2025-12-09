/**
 * Quiz timer hook
 */

import { useEffect, useState } from 'react';
import type { QuizState } from '../../quiz-types';
import type { ScreenType } from '../types';

export const useQuizTimer = (screen: ScreenType, quizState: QuizState | null) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (screen === 'quiz' && quizState && !quizState.isPaused && !quizState.isCompleted) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [screen, quizState]);

  return { timeElapsed, setTimeElapsed };
};
