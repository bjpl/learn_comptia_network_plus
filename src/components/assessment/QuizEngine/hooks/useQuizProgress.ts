/**
 * Quiz progress persistence hook
 */

import { useEffect } from 'react';
import type { QuizState } from '../../quiz-types';
import type { ScreenType } from '../types';

interface UseQuizProgressParams {
  quizState: QuizState | null;
  setQuizState: (state: QuizState) => void;
  setTimeElapsed: (time: number) => void;
  setScreen: (screen: ScreenType) => void;
}

export const useQuizProgress = ({
  quizState,
  setQuizState,
  setTimeElapsed,
  setScreen,
}: UseQuizProgressParams) => {
  // Load saved progress on mount
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
  }, [setQuizState, setTimeElapsed, setScreen]);

  // Save progress when quiz state changes
  useEffect(() => {
    if (quizState && !quizState.isCompleted) {
      try {
        localStorage.setItem('quizProgress', JSON.stringify({ quizState }));
      } catch {
        // Failed to save progress - continue without saving
      }
    }
  }, [quizState]);
};
