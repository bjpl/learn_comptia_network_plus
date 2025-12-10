/**
 * Quiz action handlers hook
 */

import { useCallback } from 'react';
import type { QuizState, UserAnswer as QuizUserAnswer } from '../../quiz-types';
import type { QuizConfig, ScreenType } from '../types';
import { getRandomQuestions } from '../../quiz-data';

interface UseQuizActionsParams {
  config: QuizConfig;
  quizState: QuizState | null;
  setQuizState: (state: QuizState) => void;
  setTimeElapsed: (time: number) => void;
  setScreen: (screen: ScreenType) => void;
  setSelectedOptions: (options: Set<string>) => void;
  setQuestionStartTime: (time: number) => void;
  setShowExplanation: (show: boolean) => void;
}

export const useQuizActions = ({
  config,
  quizState,
  setQuizState,
  setTimeElapsed,
  setScreen,
  setSelectedOptions,
  setQuestionStartTime,
  setShowExplanation,
}: UseQuizActionsParams) => {
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
  }, [config, setQuizState, setTimeElapsed, setQuestionStartTime, setSelectedOptions, setScreen]);

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
    [
      quizState,
      setQuizState,
      setScreen,
      setSelectedOptions,
      setQuestionStartTime,
      setShowExplanation,
    ]
  );

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
  }, [
    quizState,
    config,
    setQuizState,
    setTimeElapsed,
    setQuestionStartTime,
    setSelectedOptions,
    setScreen,
  ]);

  const resetQuiz = useCallback(() => {
    window.localStorage.removeItem('quizProgress');
    setQuizState(null as unknown as QuizState);
    setSelectedOptions(new Set());
    setTimeElapsed(0);
    setShowExplanation(false);
    setScreen('setup');
  }, [setQuizState, setSelectedOptions, setTimeElapsed, setShowExplanation, setScreen]);

  return { startQuiz, moveToNextQuestion, retryIncorrect, resetQuiz };
};
