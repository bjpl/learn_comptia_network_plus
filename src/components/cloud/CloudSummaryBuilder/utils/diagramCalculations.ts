/**
 * Diagram calculation utilities for CloudSummaryBuilder
 */

import type { CloudSummary, ScoreBreakdown, CloudScenario } from '../../cloud-types';

export const calculateWordCount = (summary: Partial<CloudSummary>): number => {
  const texts = [
    summary.deploymentJustification || '',
    summary.connectivityReasoning || '',
    summary.nfvImplementation || '',
    summary.cloudGateways?.usage || '',
    summary.scalabilityFeatures?.description || '',
    summary.elasticityImplementation || '',
  ];

  return texts.reduce((count, text) => {
    return (
      count +
      text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    );
  }, 0);
};

export const calculateScore = (
  userSummary: Partial<CloudSummary>,
  selectedScenario: CloudScenario,
  wordCount: number
): ScoreBreakdown => {
  const feedback: string[] = [];
  let modelsScore = 0;
  let concisenessScore = 0;
  let coverageScore = 0;

  const ideal = selectedScenario.idealSolution;

  // Models and Concepts (40%)
  let modelsPoints = 0;
  const maxModelsPoints = 5;

  if (userSummary.deploymentModel === ideal.deploymentModel) {
    modelsPoints++;
  } else {
    feedback.push(`Deployment model should be ${ideal.deploymentModel}`);
  }

  if (userSummary.serviceModel === ideal.serviceModel) {
    modelsPoints++;
  } else {
    feedback.push(`Service model should be ${ideal.serviceModel}`);
  }

  if (userSummary.connectivityMethod === ideal.connectivityMethod) {
    modelsPoints++;
  } else {
    feedback.push(`Connectivity method should be ${ideal.connectivityMethod}`);
  }

  if (userSummary.cloudGateways?.internetGateway === ideal.cloudGateways.internetGateway) {
    modelsPoints++;
  }

  if (userSummary.scalabilityFeatures?.type === ideal.scalabilityFeatures.type) {
    modelsPoints++;
  }

  modelsScore = (modelsPoints / maxModelsPoints) * 40;

  // Conciseness (20%) - target 100 words, penalty for going over
  if (wordCount <= 100) {
    concisenessScore = 20;
  } else if (wordCount <= 150) {
    concisenessScore = 15;
    feedback.push(`Word count is ${wordCount}. Aim for under 100 words for conciseness.`);
  } else if (wordCount <= 200) {
    concisenessScore = 10;
    feedback.push(
      `Word count is ${wordCount}. Too verbose - significantly reduce to under 100 words.`
    );
  } else {
    concisenessScore = 5;
    feedback.push(`Word count is ${wordCount}. Far too long - must be under 100 words.`);
  }

  // Coverage (40%) - check if all required elements are present
  let coveragePoints = 0;
  const maxCoveragePoints = 8;

  if (userSummary.deploymentJustification && userSummary.deploymentJustification.length > 10) {
    coveragePoints++;
  } else {
    feedback.push('Provide deployment model justification');
  }

  if (userSummary.serviceExamples && userSummary.serviceExamples.length > 0) {
    coveragePoints++;
  } else {
    feedback.push('Include specific service examples');
  }

  if (userSummary.connectivityReasoning && userSummary.connectivityReasoning.length > 10) {
    coveragePoints++;
  } else {
    feedback.push('Explain connectivity method reasoning');
  }

  if (userSummary.nfvImplementation && userSummary.nfvImplementation.length > 10) {
    coveragePoints++;
  } else {
    feedback.push('Describe NFV implementation');
  }

  if (userSummary.vpcConfiguration?.subnets && userSummary.vpcConfiguration.subnets.length > 0) {
    coveragePoints++;
  } else {
    feedback.push('Define VPC subnet configuration');
  }

  if (userSummary.cloudGateways?.usage && userSummary.cloudGateways.usage.length > 10) {
    coveragePoints++;
  } else {
    feedback.push('Explain cloud gateway usage');
  }

  if (
    userSummary.scalabilityFeatures?.description &&
    userSummary.scalabilityFeatures.description.length > 10
  ) {
    coveragePoints++;
  } else {
    feedback.push('Describe scalability features');
  }

  if (
    userSummary.multitenancyConsiderations &&
    userSummary.multitenancyConsiderations.length > 0
  ) {
    coveragePoints++;
  } else {
    feedback.push('Address multitenancy considerations');
  }

  coverageScore = (coveragePoints / maxCoveragePoints) * 40;

  const total = Math.round(modelsScore + concisenessScore + coverageScore);

  if (total >= 90) {
    feedback.unshift('Excellent summary!');
  } else if (total >= 80) {
    feedback.unshift('Good summary with minor improvements needed');
  } else if (total >= 70) {
    feedback.unshift('Adequate summary, several areas need improvement');
  } else {
    feedback.unshift('Summary needs significant improvement');
  }

  return {
    modelsAndConcepts: Math.round(modelsScore),
    conciseness: Math.round(concisenessScore),
    coverage: Math.round(coverageScore),
    total,
    feedback,
  };
};

export const getQuestionScore = (
  questionId: string,
  userAnswers: Record<string, string>,
  examQuestions: Array<{ id: string; correct: string }>
): boolean | null => {
  const answer = userAnswers[questionId];
  if (!answer) {
    return null;
  }
  const question = examQuestions.find((q) => q.id === questionId);
  return question ? answer === question.correct : null;
};
