/**
 * Custom hook for managing cloud service selections and exam practice
 */

import { useState } from 'react';
import type { TabType, UserAnswers, CloudTermCategory, CostCalculatorInputs } from '../types';
import { CLOUD_TERMS } from '../data/cloudServices';
import { EXAM_QUESTIONS, COST_CALCULATOR_INPUTS } from '../data/templates';
import { getQuestionScore } from '../utils/diagramCalculations';

export const useCloudServices = () => {
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [selectedTermCategory, setSelectedTermCategory] =
    useState<keyof CloudTermCategory>('Deployment Models');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [costProfile, setCostProfile] = useState<keyof CostCalculatorInputs>('Medium app');

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const getScore = (questionId: string): boolean | null => {
    return getQuestionScore(questionId, userAnswers, EXAM_QUESTIONS);
  };

  return {
    activeTab,
    setActiveTab,
    selectedTermCategory,
    setSelectedTermCategory,
    userAnswers,
    costProfile,
    setCostProfile,
    handleQuestionAnswer,
    getScore,
    cloudTerms: CLOUD_TERMS,
    costInputs: COST_CALCULATOR_INPUTS,
    examQuestions: EXAM_QUESTIONS,
  };
};
