/**
 * Hook for managing quiz generation and quiz state
 */

import { useState } from 'react';
import type { QuizQuestion, QuizResult } from '../types';
import { EXAM_CRITICAL_PORTS } from '../data/examCriticalPorts';

/**
 * Generate quiz questions from port cards
 */
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

export const useQuizEngine = () => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  /**
   * Start a new quiz with specified number of questions
   */
  const startQuiz = (questionCount: number = 10) => {
    const questions = generateQuizQuestions(questionCount);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setQuizCompleted(false);
    setSelectedAnswer('');
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  /**
   * Handle answer selection and move to next question
   */
  const handleQuizAnswer = (answer: string): QuizResult | null => {
    if (!quizQuestions[currentQuestionIndex]) {
      return null;
    }

    const question = quizQuestions[currentQuestionIndex];
    const correct = answer === question.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    const result: QuizResult = {
      questionId: question.id,
      correct,
      timeSpent,
      selectedAnswer: answer,
    };

    const newResults = [...quizResults, result];
    setQuizResults(newResults);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      setQuizCompleted(true);
    }

    return result;
  };

  /**
   * Get quiz score as percentage
   */
  const getQuizScore = (): number => {
    if (quizResults.length === 0) {
      return 0;
    }
    return (quizResults.filter((r) => r.correct).length / quizResults.length) * 100;
  };

  /**
   * Get total time taken for quiz
   */
  const getTotalTime = (): number => {
    return quizResults.reduce((sum, r) => sum + r.timeSpent, 0);
  };

  return {
    quizQuestions,
    currentQuestionIndex,
    quizResults,
    quizCompleted,
    selectedAnswer,
    setSelectedAnswer,
    startQuiz,
    handleQuizAnswer,
    getQuizScore,
    getTotalTime,
  };
};
