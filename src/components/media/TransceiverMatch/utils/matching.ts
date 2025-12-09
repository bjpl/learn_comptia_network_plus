import type { Transceiver, UseCaseCard } from '../types';

export const findCorrectMatches = (
  useCases: UseCaseCard[],
  transceivers: Transceiver[]
): Record<string, Transceiver> => {
  const matches: Record<string, Transceiver> = {};

  useCases.forEach((useCase) => {
    const suitable = transceivers.filter((t) => {
      const speedMatch = t.speed >= useCase.requirements.speed;
      const distanceMatch = t.maxDistance >= useCase.requirements.distance;
      const protocolMatch = t.protocol === useCase.requirements.protocol;
      const formFactorMatch =
        !useCase.requirements.formFactor || t.formFactor === useCase.requirements.formFactor;

      return speedMatch && distanceMatch && protocolMatch && formFactorMatch;
    });

    if (suitable.length > 0) {
      const optimal = suitable.sort((a, b) => a.speed - b.speed)[0];
      matches[useCase.id] = optimal;
    }
  });

  return matches;
};

export const calculateScore = (
  matches: Record<string, string>,
  correctMatches: Record<string, Transceiver>,
  totalCases: number
): number => {
  let correctCount = 0;
  Object.entries(matches).forEach(([useCaseId, transceiverId]) => {
    const correctTransceiver = correctMatches[useCaseId];
    if (correctTransceiver && correctTransceiver.id === transceiverId) {
      correctCount++;
    }
  });

  return Math.round((correctCount / totalCases) * 100);
};

export const groupTransceivers = (transceivers: Transceiver[]) => {
  return {
    'SFP (1G)': transceivers.filter((t) => t.formFactor === 'SFP' && t.speed === 1),
    'SFP+ (10G)': transceivers.filter((t) => t.formFactor === 'SFP+'),
    'QSFP+ (40G)': transceivers.filter((t) => t.formFactor === 'QSFP+'),
    'QSFP28 (100G)': transceivers.filter((t) => t.formFactor === 'QSFP28'),
  };
};
