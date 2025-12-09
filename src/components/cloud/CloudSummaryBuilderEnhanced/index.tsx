/**
 * Component 12: Cloud Concept Summary Card Builder (Enhanced)
 * CompTIA Network+ Learning Objective 1.2
 *
 * Exam-focused enhanced features:
 * - Key cloud terms and definitions
 * - Service comparison matrix
 * - Use case matcher
 * - Cost calculator basics
 * - 4 exam practice questions with instant feedback
 *
 * Decomposed into modular architecture for maintainability
 */

import React from 'react';
import { useCloudSummaryState } from './hooks/useCloudSummaryState';
import {
  TabNavigation,
  TerminologyTab,
  ComparisonTab,
  UseCaseTab,
  CostTab,
  ExamTab,
  CloudSummaryStyles,
} from './components';

export const CloudSummaryBuilderEnhanced: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedTermCategory,
    setSelectedTermCategory,
    costProfile,
    setCostProfile,
    userAnswers,
    handleAnswer,
    isCorrect,
  } = useCloudSummaryState();

  return (
    <div className="cloud-enhanced-builder">
      <div className="header">
        <h2>Cloud Concepts Masterclass</h2>
        <p>Terminology, comparisons, use cases, costs, and exam practice</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="tab-content-wrapper">
        {activeTab === 'terms' && (
          <TerminologyTab
            selectedCategory={selectedTermCategory}
            onCategoryChange={setSelectedTermCategory}
          />
        )}

        {activeTab === 'comparison' && <ComparisonTab />}

        {activeTab === 'usecase' && <UseCaseTab />}

        {activeTab === 'cost' && (
          <CostTab costProfile={costProfile} onProfileChange={setCostProfile} />
        )}

        {activeTab === 'exam' && (
          <ExamTab userAnswers={userAnswers} onAnswer={handleAnswer} isCorrect={isCorrect} />
        )}
      </div>

      <CloudSummaryStyles />
    </div>
  );
};

export default CloudSummaryBuilderEnhanced;
