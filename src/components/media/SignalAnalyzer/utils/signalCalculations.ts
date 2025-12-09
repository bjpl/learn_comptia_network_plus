import type { CableType } from '../../signal-data';
import {
  calculateAttenuation,
  calculateCrosstalk,
  calculateSNR,
  calculateEyeDiagramMetrics,
} from '../../signal-data';
import type { SignalMetrics, ComparisonMetrics, EyeDiagramMetrics } from '../types';

export const INITIAL_SIGNAL_STRENGTH = 0; // dBm

export function calculateSignalMetrics(
  cable: CableType,
  frequency: number,
  distance: number,
  interferenceLevel: number
): SignalMetrics {
  const attenuation = calculateAttenuation(cable, frequency, distance);
  const crosstalkNEXT = calculateCrosstalk(cable, distance, 'NEXT');
  const crosstalkFEXT = calculateCrosstalk(cable, distance, 'FEXT');
  const snr = calculateSNR(INITIAL_SIGNAL_STRENGTH, attenuation, interferenceLevel);
  const receivedSignal = INITIAL_SIGNAL_STRENGTH - attenuation;

  return {
    attenuation,
    crosstalkNEXT,
    crosstalkFEXT,
    snr,
    receivedSignal,
  };
}

export function calculateComparisonMetrics(
  cable: CableType,
  frequency: number,
  distance: number,
  interferenceLevel: number,
  compareMode: boolean
): ComparisonMetrics {
  if (!compareMode) {
    return {
      attenuation: 0,
      snr: 0,
      receivedSignal: 0,
    };
  }

  const attenuation = calculateAttenuation(cable, frequency, distance);
  const snr = calculateSNR(INITIAL_SIGNAL_STRENGTH, attenuation, interferenceLevel);
  const receivedSignal = INITIAL_SIGNAL_STRENGTH - attenuation;

  return {
    attenuation,
    snr,
    receivedSignal,
  };
}

export function getEyeDiagramMetrics(
  snr: number,
  attenuation: number
): EyeDiagramMetrics {
  return calculateEyeDiagramMetrics(snr, attenuation);
}
