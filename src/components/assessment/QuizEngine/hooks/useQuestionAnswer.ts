/**
 * Question answer submission hook
 */

import { useCallback } from 'react';
import type { QuizState, UserAnswer as QuizUserAnswer } from '../../quiz-types';
import type { QuizConfig } from '../types';

interface UseQuestionAnswerParams {
  quizState: QuizState | null;
  selectedOptions: Set<string>;
  questionStartTime: number;
  config: QuizConfig;
  setShowExplanation: (show: boolean) => void;
  moveToNextQuestion: (answers: QuizUserAnswer[]) => void;
}

export const useQuestionAnswer = ({
  quizState,
  selectedOptions,
  questionStartTime,
  config,
  setShowExplanation,
  moveToNextQuestion,
}: UseQuestionAnswerParams) => {
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
  }, [quizState, selectedOptions, questionStartTime, config.feedbackMode, setShowExplanation, moveToNextQuestion]);

  const handleNext = useCallback(() => {
    if (!quizState) {
      return;
    }
    moveToNextQuestion(quizState.answers);
  }, [quizState, moveToNextQuestion]);

  return { submitAnswer, handleNext };
};
