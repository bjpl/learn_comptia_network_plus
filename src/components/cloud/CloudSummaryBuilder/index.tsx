/**
 * CloudSummaryBuilder - Main orchestrator component
 * Component 12: Cloud Concept Summary Card Builder (Enhanced)
 * CompTIA Network+ Learning Objective 1.2
 */

import React from 'react';
import { cloudScenarios } from '../cloud-data';
import { useDiagramState } from './hooks/useDiagramState';
import { useCloudServices } from './hooks/useCloudServices';
import { DiagramCanvas } from './components/DiagramCanvas';
import { ServicePalette } from './components/ServicePalette';
import { ConnectionManager } from './components/ConnectionManager';
import { ExportPanel } from './components/ExportPanel';
import { TemplateSelector } from './components/TemplateSelector';
import { styles } from './styles';
import type { TabType } from './types';

export const CloudSummaryBuilder: React.FC = () => {
  const {
    selectedScenario,
    userSummary,
    setUserSummary,
    score,
    wordCount,
    showIdealSolution,
    setShowIdealSolution,
    handleSubmit,
    handleReset,
    handleScenarioChange,
  } = useDiagramState(cloudScenarios[0]);

  const {
    activeTab,
    setActiveTab,
    selectedTermCategory,
    setSelectedTermCategory,
    userAnswers,
    costProfile,
    setCostProfile,
    handleQuestionAnswer,
    getScore,
    cloudTerms,
    costInputs,
    examQuestions,
  } = useCloudServices();

  const tabs: Array<{ key: TabType; label: string }> = [
    { key: 'builder', label: 'Builder' },
    { key: 'terms', label: 'Terminology' },
    { key: 'comparison', label: 'Service Comparison' },
    { key: 'usecase', label: 'Use Cases' },
    { key: 'cost', label: 'Cost Calculator' },
    { key: 'exam', label: 'Exam Practice' },
  ];

  return (
    <div className="cloud-summary-builder">
      <div className="header">
        <h2>Cloud Concept Summary Card Builder (Enhanced)</h2>
        <p>Master cloud concepts with scenarios, definitions, comparisons, and exam practice</p>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'builder' && (
        <>
          <TemplateSelector
            scenarios={cloudScenarios}
            selectedScenario={selectedScenario}
            onScenarioChange={(id) => handleScenarioChange(id, cloudScenarios)}
          />
          <DiagramCanvas
            selectedScenario={selectedScenario}
            userSummary={userSummary}
            setUserSummary={setUserSummary}
            wordCount={wordCount}
            score={score}
            showIdealSolution={showIdealSolution}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onToggleIdealSolution={() => setShowIdealSolution(!showIdealSolution)}
          />
        </>
      )}

      {activeTab === 'terms' && (
        <ServicePalette
          cloudTerms={cloudTerms}
          selectedCategory={selectedTermCategory}
          onCategoryChange={setSelectedTermCategory}
        />
      )}

      {activeTab === 'comparison' && <ConnectionManager mode="comparison" />}

      {activeTab === 'usecase' && <ConnectionManager mode="usecase" />}

      {activeTab === 'cost' && (
        <ExportPanel
          mode="cost"
          costProfile={costProfile}
          costInputs={costInputs}
          onCostProfileChange={setCostProfile}
        />
      )}

      {activeTab === 'exam' && (
        <ExportPanel
          mode="exam"
          examQuestions={examQuestions}
          userAnswers={userAnswers}
          onAnswerQuestion={handleQuestionAnswer}
          getQuestionScore={getScore}
        />
      )}

      <style>{styles}</style>
    </div>
  );
};

export default CloudSummaryBuilder;
