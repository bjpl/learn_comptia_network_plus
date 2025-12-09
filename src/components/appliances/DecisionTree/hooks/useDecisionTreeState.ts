import { useState, useCallback, useMemo } from 'react';
import { decisionTreeData } from '../../appliances-data';
import type { ComparisonData } from '../types';
import type { ComparisonDevice } from '../../appliances-types';
import { getDeviceDetails, generateComparison } from '../utils/deviceUtils';

export const useDecisionTreeState = (onRecommendation?: (deviceIds: string[]) => void) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>(['start']);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [showExamScenario, setShowExamScenario] = useState(false);
  const [examIndex, setExamIndex] = useState(0);

  const currentNode = decisionTreeData.get(currentNodeId);

  const handleAnswer = useCallback(
    (answer: 'yes' | 'no') => {
      if (!currentNode || currentNode.type === 'recommendation') {
        return;
      }

      const nextNodeId = answer === 'yes' ? currentNode.yesPath : currentNode.noPath;

      if (nextNodeId) {
        const nextNode = decisionTreeData.get(nextNodeId);

        setCurrentNodeId(nextNodeId);
        setHistory([...history, nextNodeId]);
        setShowComparison(false);

        if (nextNode?.type === 'recommendation' && onRecommendation && nextNode.devices) {
          onRecommendation(nextNode.devices);
        }
      }
    },
    [currentNode, history, onRecommendation]
  );

  const handleReset = () => {
    setCurrentNodeId('start');
    setHistory(['start']);
    setShowComparison(false);
    setShowExamScenario(false);
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousNodeId = newHistory[newHistory.length - 1];

      setCurrentNodeId(previousNodeId);
      setHistory(newHistory);
      setShowComparison(false);
    }
  };

  const handleCompareDevices = () => {
    if (currentNode?.type === 'recommendation' && currentNode.devices) {
      const devices = currentNode.devices
        .map(getDeviceDetails)
        .filter((d): d is ComparisonDevice => d !== undefined);

      if (devices.length > 0) {
        const comparison = generateComparison(devices);
        setComparisonData({ devices, comparison });
        setShowComparison(true);
      }
    }
  };

  const recommendedDevices = useMemo(() => {
    if (currentNode?.type === 'recommendation' && currentNode.devices) {
      return currentNode.devices
        .map(getDeviceDetails)
        .filter((d): d is ComparisonDevice => d !== undefined);
    }
    return [];
  }, [currentNode]);

  return {
    currentNodeId,
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
  };
};
