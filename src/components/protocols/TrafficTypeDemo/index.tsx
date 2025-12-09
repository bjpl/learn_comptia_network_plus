/**
 * TrafficTypeDemo - Main component (re-export)
 * Animated 10-node network showing unicast, multicast, anycast, and broadcast
 *
 * Original size: 873 lines
 * Refactored: Modular structure with separate components, hooks, utils, and types
 */

import React, { useState, useRef } from 'react';
import { TRAFFIC_TYPES } from '../protocols-data';
import type { TrafficType } from '../protocols-types';
import { createCircularNodes } from './utils/nodeHelpers';
import { useTrafficAnimation } from './hooks/useTrafficAnimation';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { DemoHeader } from './components/DemoHeader';
import { TrafficSelector } from './components/TrafficSelector';
import { NetworkCanvas } from './components/NetworkCanvas';
import { TrafficInfo } from './components/TrafficInfo';
import { ExplanationSection } from './components/ExplanationSection';
import { ComparisonSection } from './components/ComparisonSection';
import { DemoStyles } from './components/DemoStyles';

export const TrafficTypeDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedType, setSelectedType] = useState<TrafficType>(TRAFFIC_TYPES[0]);
  const [userExplanation, setUserExplanation] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const nodes = createCircularNodes();

  const { animationState, startAnimation, resetAnimation } = useTrafficAnimation(
    nodes,
    selectedType,
    canvasRef
  );

  const handleTypeChange = (type: TrafficType) => {
    setSelectedType(type);
    resetAnimation();
  };

  const { handleKeyDown } = useKeyboardControls({
    selectedType,
    animating: animationState.animating,
    onTypeChange: handleTypeChange,
    onStartAnimation: startAnimation,
    onResetAnimation: resetAnimation,
  });

  return (
    <div
      className="traffic-type-demo"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Traffic Type Demonstrator"
    >
      <DemoHeader />

      <div className="demo-container">
        <TrafficSelector selectedType={selectedType} onSelectType={handleTypeChange} />

        <NetworkCanvas
          canvasRef={canvasRef}
          selectedType={selectedType}
          animationState={animationState}
          onStartAnimation={startAnimation}
          onResetAnimation={resetAnimation}
        />

        <TrafficInfo selectedType={selectedType} />

        <ExplanationSection
          selectedType={selectedType}
          userExplanation={userExplanation}
          onExplanationChange={setUserExplanation}
        />

        <ComparisonSection
          showComparison={showComparison}
          onToggleComparison={() => setShowComparison(!showComparison)}
        />
      </div>

      <DemoStyles />
    </div>
  );
};

export default TrafficTypeDemo;
