import React from 'react';
import type { DecisionTreeProps } from './types';
import { useDecisionTreeState } from './hooks/useDecisionTreeState';
import { examScenarios } from './utils/examScenarios';
import {
  QuestionView,
  RecommendationView,
  ComparisonView,
  ExamScenarioView,
  ProgressBar,
  NavigationButtons,
  HelpSection,
} from './components';

const DecisionTree: React.FC<DecisionTreeProps> = ({ onRecommendation }) => {
  const {
    currentNode,
    history,
    showComparison,
    comparisonData,
    showExamScenario,
    examIndex,
    recommendedDevices,
    handleAnswer,
    handleReset,
    handleGoBack,
    handleCompareDevices,
    setShowComparison,
    setShowExamScenario,
    setExamIndex,
  } = useDecisionTreeState(onRecommendation);

  if (!currentNode) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <p className="text-red-500">Error: Node not found</p>
        <button
          onClick={handleReset}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow-lg">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Network Device Decision Tree
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Answer targeted questions to get personalized device recommendations with cost analysis
          and exam scenarios.
        </p>
      </div>

      {/* Progress & Breadcrumb */}
      <ProgressBar history={history} />

      {/* Main Content */}
      {showExamScenario ? (
        <ExamScenarioView
          scenario={examScenarios[examIndex]}
          onClose={() => setShowExamScenario(false)}
          onNext={() => setExamIndex((i) => (i + 1) % examScenarios.length)}
        />
      ) : showComparison && comparisonData ? (
        <ComparisonView data={comparisonData} onClose={() => setShowComparison(false)} />
      ) : currentNode.type === 'question' ? (
        <QuestionView currentNode={currentNode} onAnswer={handleAnswer} />
      ) : (
        <RecommendationView
          currentNode={currentNode}
          devices={recommendedDevices}
          onCompare={handleCompareDevices}
          onExamScenario={() => setShowExamScenario(true)}
        />
      )}

      {/* Navigation */}
      <NavigationButtons history={history} onGoBack={handleGoBack} onReset={handleReset} />

      {/* Help */}
      <HelpSection />
    </div>
  );
};

export default DecisionTree;
