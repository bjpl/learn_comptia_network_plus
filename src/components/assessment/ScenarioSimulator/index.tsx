/**
 * Enhanced Scenario Simulator Component (Component 21)
 * Main orchestration file - Re-exports modular implementation
 */

import React from 'react';
import type { ScenarioSimulatorProps } from './types';
import { useTransformationState } from './hooks/useTransformationState';
import { scoreAnswer } from './utils/scoreAnalysis';
import {
  ScenarioList,
  ExamResults,
  ScenarioHeader,
  ScenarioContext,
  ExamStartScreen,
  PhaseContent,
  PhaseNavigationDots,
} from './components';

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  scenarioId,
  timeLimit,
  examMode = 'practice',
  onComplete,
  onAnalysis,
}) => {
  const {
    selectedScenario,
    setSelectedScenario,
    currentPhaseIndex,
    setCurrentPhaseIndex,
    answers,
    setAnswers,
    showHints,
    setShowHints,
    currentAnswers,
    scored,
    setScored,
    timeRemaining,
    setTimeRemaining,
    examStarted,
    setExamStarted,
    showResults,
    scoreAnalysis,
    handleComplete,
    handleAnswerChange,
    resetState,
  } = useTransformationState({
    scenarioId,
    timeLimit,
    examMode,
    onComplete,
    onAnalysis,
  });

  const currentPhase = selectedScenario?.phases[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === (selectedScenario?.phases.length ?? 0) - 1;
  const totalAnswered = answers.length;
  const totalQuestions =
    selectedScenario?.phases.reduce((sum, phase) => sum + phase.assessmentPoints.length, 0) ?? 0;
  const progressPercentage = totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;

  const handleSubmitPhase = (): void => {
    if (!currentPhase) return;

    const phaseAnswers = currentPhase.assessmentPoints.map((ap) => {
      const answerText = currentAnswers[ap.loId] || '';
      const { score, feedback } = scoreAnswer(ap, answerText);

      return {
        phaseId: currentPhase.id,
        assessmentPointId: ap.loId,
        answer: answerText,
        score,
        feedback,
      };
    });

    setAnswers((prev) => [...prev, ...phaseAnswers]);
    setScored(true);
  };

  const handleNextPhase = (): void => {
    if (isLastPhase) {
      handleComplete();
    } else {
      setCurrentPhaseIndex((prev) => prev + 1);
      setScored(false);
      setShowHints(false);
    }
  };

  const handlePrevPhase = (): void => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex((prev) => prev - 1);
      setScored(false);
    }
  };

  const handleSelectPhase = (index: number): void => {
    setCurrentPhaseIndex(index);
    setScored(false);
  };

  // Results view after exam completion
  if (showResults && scoreAnalysis && selectedScenario) {
    return (
      <ExamResults
        scoreAnalysis={scoreAnalysis}
        timeLimit={timeLimit}
        onReturnToScenarios={() => {
          setSelectedScenario(null);
        }}
        onRetakeExam={resetState}
      />
    );
  }

  // Scenario selection view
  if (!selectedScenario) {
    return (
      <ScenarioList
        examMode={examMode}
        timeLimit={timeLimit}
        onSelectScenario={(scenario, initialTime) => {
          setSelectedScenario(scenario);
          if (examMode === 'timed') {
            setTimeRemaining(initialTime);
          }
        }}
      />
    );
  }

  // Main exam view
  return (
    <div className="space-y-6">
      <ScenarioHeader
        scenario={selectedScenario}
        examMode={examMode}
        examStarted={examStarted}
        timeRemaining={timeRemaining}
        currentPhaseIndex={currentPhaseIndex}
        totalAnswered={totalAnswered}
        totalQuestions={totalQuestions}
        progressPercentage={progressPercentage}
        onChangeScenario={() => setSelectedScenario(null)}
      />

      <ScenarioContext scenario={selectedScenario} />

      {examMode === 'timed' && !examStarted && currentPhaseIndex === 0 && !scored && (
        <ExamStartScreen
          timeLimit={timeLimit || selectedScenario.estimatedTime * 60}
          onStartExam={() => setExamStarted(true)}
        />
      )}

      {currentPhase && (examMode !== 'timed' || examStarted) && (
        <PhaseContent
          scenario={selectedScenario}
          currentPhaseIndex={currentPhaseIndex}
          showHints={showHints}
          currentAnswers={currentAnswers}
          answers={answers}
          scored={scored}
          isLastPhase={isLastPhase}
          onToggleHints={() => setShowHints(!showHints)}
          onAnswerChange={handleAnswerChange}
          onSubmitPhase={handleSubmitPhase}
          onNextPhase={handleNextPhase}
          onPrevPhase={handlePrevPhase}
        />
      )}

      <PhaseNavigationDots
        scenario={selectedScenario}
        currentPhaseIndex={currentPhaseIndex}
        onSelectPhase={handleSelectPhase}
      />
    </div>
  );
};

// Export with both names for compatibility
export default ScenarioSimulator;
export { ScenarioSimulator as IntegratedSimulator };

// Re-export types
export type { ScenarioSimulatorProps, ScoreAnalysis, ExamMode, QuestionType } from './types';
