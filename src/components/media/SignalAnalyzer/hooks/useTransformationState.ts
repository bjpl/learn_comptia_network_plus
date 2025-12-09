import { useState } from 'react';
import type { CableType } from '../../signal-data';
import { cableTypes } from '../../signal-data';
import type { SignalAnalyzerState } from '../types';

export function useSignalAnalyzerState(): SignalAnalyzerState & {
  setSelectedCable: (cable: CableType) => void;
  setDistance: (distance: number) => void;
  setFrequency: (frequency: number) => void;
  setInterferenceLevel: (level: number) => void;
  setShowEyeDiagram: (show: boolean) => void;
  setCompareMode: (mode: boolean) => void;
  setSelectedCompareCable: (cable: CableType) => void;
} {
  const [selectedCable, setSelectedCable] = useState<CableType>(cableTypes[0]);
  const [distance, setDistance] = useState<number>(50);
  const [frequency, setFrequency] = useState<number>(100);
  const [interferenceLevel, setInterferenceLevel] = useState<number>(5);
  const [showEyeDiagram, setShowEyeDiagram] = useState<boolean>(true);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedCompareCable, setSelectedCompareCable] = useState<CableType>(cableTypes[1]);

  return {
    selectedCable,
    distance,
    frequency,
    interferenceLevel,
    showEyeDiagram,
    compareMode,
    selectedCompareCable,
    setSelectedCable,
    setDistance,
    setFrequency,
    setInterferenceLevel,
    setShowEyeDiagram,
    setCompareMode,
    setSelectedCompareCable,
  };
}
