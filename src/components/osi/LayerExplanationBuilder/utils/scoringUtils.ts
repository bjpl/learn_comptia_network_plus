import type { OSILayer } from '../../osi-types';
import { LAYER_FUNCTIONS, PROTOCOLS, PDUS } from '../../osi-data';
import type { QuizQuestion } from '../types';

export const calculateScore = (layers: OSILayer[], hintsUsed: number): number => {
  let totalScore = 0;
  let maxScore = 0;

  layers.forEach((layer) => {
    // Primary function (25%)
    const correctFunction = LAYER_FUNCTIONS[layer.number].find(
      (f) => f.correct && f.id === layer.primaryFunction
    );
    if (correctFunction) {
      totalScore += 25;
    }
    maxScore += 25;

    // Protocols (25%)
    const correctProtocols = PROTOCOLS.filter((p) => p.layer === layer.number).map((p) => p.name);
    const correctSelected = layer.selectedProtocols.filter((p) =>
      correctProtocols.includes(p)
    ).length;
    const incorrectSelected = layer.selectedProtocols.filter(
      (p) => !correctProtocols.includes(p)
    ).length;
    const protocolScore = Math.max(0, correctSelected * 10 - incorrectSelected * 5);
    totalScore += Math.min(25, protocolScore);
    maxScore += 25;

    // PDU (10%)
    const correctPDU = PDUS.find((p) => p.layer === layer.number);
    if (correctPDU && layer.pdu.toLowerCase() === correctPDU.name.toLowerCase()) {
      totalScore += 10;
    }
    maxScore += 10;

    // Explanation (40%)
    const wordCount = layer.interactionExplanation.split(' ').filter((w) => w.length > 0).length;
    if (wordCount >= 150) {
      // Basic quality checks
      const hasUpperLayer =
        layer.number < 7 &&
        layer.interactionExplanation.toLowerCase().includes('layer ' + (layer.number + 1));
      const hasLowerLayer =
        layer.number > 1 &&
        layer.interactionExplanation.toLowerCase().includes('layer ' + (layer.number - 1));
      const qualityScore = (hasUpperLayer ? 20 : 0) + (hasLowerLayer ? 20 : 0);
      totalScore += qualityScore;
    }
    maxScore += 40;
  });

  // Apply hint penalty
  const hintPenalty = hintsUsed * 0.1;
  const finalScore = Math.max(0, (totalScore / maxScore) * 100 * (1 - hintPenalty));
  return Math.round(finalScore);
};

export const calculateQuizScore = (
  quizAnswers: Record<string, string>,
  questions: QuizQuestion[]
): number => {
  let correctAnswers = 0;
  questions.forEach((question) => {
    if (quizAnswers[question.id] === question.correctAnswer) {
      correctAnswers++;
    }
  });
  return Math.round((correctAnswers / questions.length) * 100);
};
