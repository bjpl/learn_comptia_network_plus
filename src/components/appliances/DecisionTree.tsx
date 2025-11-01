import React, { useState, useCallback } from 'react';
import type { DecisionNode } from './appliances-types';
import { decisionTreeData, networkDevices } from './appliances-data';

interface DecisionTreeProps {
  onRecommendation?: (deviceIds: string[]) => void;
}

const DecisionTree: React.FC<DecisionTreeProps> = ({ onRecommendation }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>(['start']);
  const [_showRecommendation, setShowRecommendation] = useState(false);

  const currentNode = decisionTreeData.get(currentNodeId);

  const handleAnswer = useCallback((answer: 'yes' | 'no') => {
    if (!currentNode || currentNode.type === 'recommendation') {return;}

    const nextNodeId = answer === 'yes' ? currentNode.yesPath : currentNode.noPath;

    if (nextNodeId) {
      const nextNode = decisionTreeData.get(nextNodeId);

      setCurrentNodeId(nextNodeId);
      setHistory([...history, nextNodeId]);

      if (nextNode?.type === 'recommendation') {
        setShowRecommendation(true);
        if (onRecommendation && nextNode.devices) {
          onRecommendation(nextNode.devices);
        }
      }
    }
  }, [currentNode, history, onRecommendation]);

  const handleReset = () => {
    setCurrentNodeId('start');
    setHistory(['start']);
    setShowRecommendation(false);
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousNodeId = newHistory[newHistory.length - 1];

      setCurrentNodeId(previousNodeId);
      setHistory(newHistory);
      setShowRecommendation(false);
    }
  };

  const getDeviceDetails = (deviceId: string) => {
    return networkDevices.find(d => d.id === deviceId);
  };

  if (!currentNode) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-500">Error: Node not found</p>
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Virtual vs Physical Decision Tree</h2>
        <p className="text-gray-600">
          Answer a series of questions to determine whether physical, virtual, or cloud-based appliances are best for your needs.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Progress:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${(history.length / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{history.length} / ~5 steps</span>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 overflow-x-auto">
          {history.map((nodeId, index) => {
            const node = decisionTreeData.get(nodeId);
            return (
              <React.Fragment key={nodeId}>
                {index > 0 && <span>→</span>}
                <span className={index === history.length - 1 ? 'font-semibold text-blue-600' : ''}>
                  {node?.text.slice(0, 30)}...
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Question or Recommendation */}
      {currentNode.type === 'question' ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ?
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{currentNode.text}</h3>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleAnswer('yes')}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  ✓ Yes
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  ✗ No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ✓
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Recommendation: {currentNode.text}</h3>
              <p className="text-gray-700 mb-4">{currentNode.rationale}</p>
            </div>
          </div>

          {/* Recommended Devices */}
          {currentNode.devices && currentNode.devices.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Recommended Devices:</h4>

              <div className="grid gap-4 md:grid-cols-2">
                {currentNode.devices.map((deviceId) => {
                  const device = getDeviceDetails(deviceId);
                  if (!device) {return null;}

                  return (
                    <div
                      key={deviceId}
                      className="bg-white rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-gray-800">{device.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          device.category === 'physical' ? 'bg-blue-100 text-blue-800' :
                          device.category === 'virtual' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {device.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{device.manufacturer} - {device.model}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                        <div>
                          <span className="font-medium">Throughput:</span> {device.specs.throughput}
                        </div>
                        <div>
                          <span className="font-medium">Year 1:</span> ${device.pricing.totalCostYear1.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-xs text-gray-600">
                        <p className="font-medium mb-1">Best for:</p>
                        <ul className="list-disc list-inside">
                          {device.useCase.slice(0, 2).map((use, idx) => (
                            <li key={idx}>{use}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleGoBack}
          disabled={history.length <= 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            history.length <= 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          ← Go Back
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          🔄 Start Over
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">💡 How to use this tool:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Answer each question based on your organization's requirements</li>
          <li>Click "Go Back" if you want to change a previous answer</li>
          <li>The tool will recommend physical, virtual, or cloud-based appliances</li>
          <li>Recommendations include specific devices with pricing and use cases</li>
        </ul>
      </div>
    </div>
  );
};

export default DecisionTree;
