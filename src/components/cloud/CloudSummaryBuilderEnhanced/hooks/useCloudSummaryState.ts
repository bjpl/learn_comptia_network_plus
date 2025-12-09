/**
 * Custom hook for managing Cloud Summary Builder state
 */

import { useState, useCallback } from 'react';
import type { TabType, CloudTerms, CostProfiles } from '../types';
import { EXAM_QUESTIONS } from '../constants';

export const useCloudSummaryState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('terms');
  const [selectedTermCategory, setSelectedTermCategory] =
    useState<keyof CloudTerms>('Deployment Models');
  const [costProfile, setCostProfile] = useState<keyof CostProfiles>('Medium app');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const handleAnswer = useCallback(
    (qId: string, answer: string) => {
      setUserAnswers({ ...userAnswers, [qId]: answer });
    },
    [userAnswers]
  );

  const isCorrect = useCallback(
    (qId: string): boolean | null => {
      const ans = userAnswers[qId];
      if (!ans) {
        return null;
      }
      const q = EXAM_QUESTIONS.find((x) => x.id === qId);
      return q ? ans === q.correct : null;
    },
    [userAnswers]
  );

  return {
    activeTab,
    setActiveTab,
    selectedTermCategory,
    setSelectedTermCategory,
    costProfile,
    setCostProfile,
    userAnswers,
    handleAnswer,
    isCorrect,
  };
};
