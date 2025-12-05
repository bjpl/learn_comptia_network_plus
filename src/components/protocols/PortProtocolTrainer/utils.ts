/**
 * Utility functions for PortProtocolTrainer
 */

import type { PortCard, CardProgress, QuizQuestion } from './types';
import { EXAM_CRITICAL_PORTS } from './data';

export const calculateNextReview = (box: number): number => {
  const intervals = [0, 1, 3, 7, 14]; // days
  const days = intervals[Math.min(box, 4)];
  return Date.now() + days * 24 * 60 * 60 * 1000;
};

export const getDueCards = (progress: Map<string, CardProgress>): PortCard[] => {
  const now = Date.now();
  return EXAM_CRITICAL_PORTS.filter((card) => {
    const cardProgress = progress.get(card.id);
    if (!cardProgress) {
      return true;
    } // New cards
    return cardProgress.nextReview <= now;
  }).sort((a, b) => {
    const progressA = progress.get(a.id);
    const progressB = progress.get(b.id);
    const boxA = progressA?.box || 0;
    const boxB = progressB?.box || 0;
    return boxA - boxB; // Lower boxes first
  });
};

export const generateQuizQuestions = (count: number = 10): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const shuffled = [...EXAM_CRITICAL_PORTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  selected.forEach((card, index) => {
    const questionType: QuizQuestion['type'] =
      index % 4 === 0
        ? 'port-to-protocol'
        : index % 4 === 1
          ? 'protocol-to-port'
          : index % 4 === 2
            ? 'tcp-udp'
            : 'security';

    let question: QuizQuestion;

    switch (questionType) {
      case 'port-to-protocol': {
        const wrongProtocols = shuffled
          .filter((c) => c.protocol !== card.protocol)
          .slice(0, 3)
          .map((c) => c.protocol);
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `What protocol uses port ${card.port}?`,
          correctAnswer: card.protocol,
          options: [card.protocol, ...wrongProtocols].sort(() => Math.random() - 0.5),
          explanation: `Port ${card.port} is used by ${card.protocol} (${card.service}). ${card.description}`,
          portNumber: card.port,
        };
        break;
      }

      case 'protocol-to-port': {
        const wrongPorts = shuffled
          .filter((c) => c.port !== card.port)
          .slice(0, 3)
          .map((c) => c.port.toString());
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `What is the default port for ${card.protocol}?`,
          correctAnswer: card.port.toString(),
          options: [card.port.toString(), ...wrongPorts].sort(() => Math.random() - 0.5),
          explanation: `${card.protocol} uses port ${card.port}. Mnemonic: ${card.mnemonic}`,
          portNumber: card.port,
        };
        break;
      }

      case 'tcp-udp': {
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `Does port ${card.port} (${card.protocol}) use TCP or UDP?`,
          correctAnswer: card.tcpUdp,
          options:
            card.tcpUdp === 'TCP/UDP'
              ? ['TCP/UDP', 'TCP only', 'UDP only', 'Neither']
              : ['TCP', 'UDP', 'TCP/UDP', 'Both equally'],
          explanation: `${card.protocol} on port ${card.port} uses ${card.tcpUdp}.`,
          portNumber: card.port,
        };
        break;
      }

      case 'security': {
        question = {
          id: `q-${card.id}-${index}`,
          type: questionType,
          question: `Is ${card.protocol} (port ${card.port}) considered secure by default?`,
          correctAnswer:
            card.security === 'Secure'
              ? 'Yes'
              : card.security === 'Insecure'
                ? 'No'
                : 'Optional/Depends',
          options: ['Yes', 'No', 'Optional/Depends', 'Not applicable'].sort(
            () => Math.random() - 0.5
          ),
          explanation: `${card.protocol} is ${card.security}. ${card.description}`,
          portNumber: card.port,
        };
        break;
      }

      default:
        throw new Error('Invalid question type');
    }

    questions.push(question);
  });

  return questions;
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateXPForReview = (correct: boolean, box: number): number => {
  const baseXP = 10;
  const multiplier = correct ? box + 1 : 0.5;
  return Math.floor(baseXP * multiplier);
};
