import React, { useCallback } from 'react';
import type { LayerExplanationBuilderProps } from './types';
import { useLayerState, useLearningState } from './hooks';
import { calculateScore, calculateQuizScore, generateStudyNotes, exportAsText } from './utils';
import { QUIZ_QUESTIONS } from './constants';
import {
  Header,
  LayerBuilder,
  ProtocolMaster,
  RealWorldExamples,
  QuizMode,
  ExportReview,
} from './components';

export const LayerExplanationBuilder: React.FC<LayerExplanationBuilderProps> = ({
  onProgressUpdate,
}) => {
  const { layers, updateLayer, toggleProtocol } = useLayerState(onProgressUpdate);
  const {
    expandedLayer,
    setExpandedLayer,
    currentMode,
    setCurrentMode,
    hintsUsed,
    useHint,
    score,
    setScore,
    quizAnswers,
    setQuizAnswers,
    selectedExample,
    setSelectedExample,
  } = useLearningState();

  const handleCalculateScore = useCallback(() => {
    const newScore = calculateScore(layers, hintsUsed);
    setScore(newScore);
  }, [layers, hintsUsed, setScore]);

  const handleSubmitQuiz = useCallback(() => {
    const quizScore = calculateQuizScore(quizAnswers, QUIZ_QUESTIONS);
    setScore(quizScore);
  }, [quizAnswers, setScore]);

  const handleExport = useCallback(() => {
    const notes = generateStudyNotes(layers, score, hintsUsed);
    exportAsText(notes);
  }, [layers, score, hintsUsed]);

  const handlePreview = useCallback(() => {
    const notes = generateStudyNotes(layers, score, hintsUsed);
    alert('Preview:\n\n' + notes.substring(0, 500) + '...');
  }, [layers, score, hintsUsed]);

  return (
    <div
      className="layer-explanation-builder"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}
    >
      <Header
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        hintsUsed={hintsUsed}
        score={score}
        onCalculateScore={handleCalculateScore}
      />

      {currentMode === 1 && (
        <LayerBuilder
          layers={layers}
          expandedLayer={expandedLayer}
          setExpandedLayer={setExpandedLayer}
          updateLayer={updateLayer}
          toggleProtocol={toggleProtocol}
          hintsUsed={hintsUsed}
          onUseHint={useHint}
        />
      )}

      {currentMode === 2 && <ProtocolMaster />}

      {currentMode === 3 && (
        <RealWorldExamples
          selectedExample={selectedExample}
          setSelectedExample={setSelectedExample}
        />
      )}

      {currentMode === 4 && (
        <QuizMode
          quizAnswers={quizAnswers}
          setQuizAnswers={setQuizAnswers}
          onSubmitQuiz={handleSubmitQuiz}
        />
      )}

      {currentMode === 5 && (
        <ExportReview layers={layers} onExport={handleExport} onPreview={handlePreview} />
      )}
    </div>
  );
};

export default LayerExplanationBuilder;
