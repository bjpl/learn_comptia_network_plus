/**
 * Assessment Service
 * Handles quiz and assessment operations
 */

import { apiClient } from './api-client';
import { API_ENDPOINTS, shouldUseMockAPI } from '../config/api-config';
import { mockApiDelay } from '../utils/auth';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in seconds
  passingScore: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export interface QuizSubmission {
  quizId: string;
  answers: QuizAnswer[];
  totalTime: number;
  completedAt: string;
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  score: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }>;
  completedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

/**
 * Get quiz by ID
 */
export const getQuiz = async (quizId: string): Promise<Quiz> => {
  if (shouldUseMockAPI()) {
    return mockGetQuiz(quizId);
  }

  const response = await apiClient.get<Quiz>(API_ENDPOINTS.ASSESSMENT.GET_QUIZ(quizId));
  return response.data;
};

/**
 * Mock get quiz
 */
const mockGetQuiz = async (quizId: string): Promise<Quiz> => {
  await mockApiDelay(400);

  // Mock quiz data
  const mockQuiz: Quiz = {
    id: quizId,
    title: 'Network Fundamentals Quiz',
    description: 'Test your knowledge of networking basics',
    timeLimit: 600, // 10 minutes
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'What is the default subnet mask for a Class C network?',
        options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
        correctAnswer: 2,
        explanation: 'Class C networks use a default subnet mask of 255.255.255.0',
        category: 'IP Addressing',
        difficulty: 'easy',
      },
      {
        id: 'q2',
        question: 'Which OSI layer is responsible for routing?',
        options: ['Physical', 'Data Link', 'Network', 'Transport'],
        correctAnswer: 2,
        explanation: 'The Network layer (Layer 3) is responsible for routing packets',
        category: 'OSI Model',
        difficulty: 'medium',
      },
      {
        id: 'q3',
        question: 'What protocol uses port 443?',
        options: ['HTTP', 'HTTPS', 'FTP', 'SSH'],
        correctAnswer: 1,
        explanation: 'HTTPS uses port 443 for secure web traffic',
        category: 'Protocols',
        difficulty: 'easy',
      },
    ],
  };

  return mockQuiz;
};

/**
 * Submit quiz answers
 */
export const submitQuiz = async (submission: QuizSubmission): Promise<QuizResult> => {
  if (shouldUseMockAPI()) {
    return mockSubmitQuiz(submission);
  }

  const response = await apiClient.post<QuizResult>(
    API_ENDPOINTS.ASSESSMENT.SUBMIT_ANSWER(submission.quizId),
    submission
  );

  return response.data;
};

/**
 * Mock submit quiz
 */
const mockSubmitQuiz = async (submission: QuizSubmission): Promise<QuizResult> => {
  await mockApiDelay(800);

  // Get quiz to check answers
  const quiz = await mockGetQuiz(submission.quizId);

  const results = submission.answers.map((answer) => {
    const question = quiz.questions.find((q) => q.id === answer.questionId);
    if (!question) {
      throw new Error(`Question ${answer.questionId} not found`);
    }

    const isCorrect = answer.selectedAnswer === question.correctAnswer;

    return {
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const passed = percentage >= quiz.passingScore;

  const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const result: QuizResult = {
    attemptId,
    quizId: submission.quizId,
    score: correctAnswers,
    percentage,
    passed,
    correctAnswers,
    totalQuestions,
    timeSpent: submission.totalTime,
    answers: results,
    completedAt: submission.completedAt,
  };

  // Store attempt
  const attemptsStr = localStorage.getItem('quiz_attempts');
  const attempts = attemptsStr ? JSON.parse(attemptsStr) : [];

  attempts.push({
    id: attemptId,
    quizId: submission.quizId,
    quizTitle: quiz.title,
    score: correctAnswers,
    percentage,
    passed,
    completedAt: submission.completedAt,
  });

  localStorage.setItem('quiz_attempts', JSON.stringify(attempts));
  localStorage.setItem(`quiz_result_${attemptId}`, JSON.stringify(result));

  return result;
};

/**
 * Get quiz results by attempt ID
 */
export const getQuizResults = async (attemptId: string): Promise<QuizResult> => {
  if (shouldUseMockAPI()) {
    return mockGetQuizResults(attemptId);
  }

  const response = await apiClient.get<QuizResult>(API_ENDPOINTS.ASSESSMENT.GET_RESULTS(attemptId));

  return response.data;
};

/**
 * Mock get quiz results
 */
const mockGetQuizResults = async (attemptId: string): Promise<QuizResult> => {
  await mockApiDelay(300);

  const resultStr = localStorage.getItem(`quiz_result_${attemptId}`);

  if (!resultStr) {
    throw {
      response: {
        status: 404,
        data: {
          message: 'Quiz results not found',
        },
      },
    } as const;
  }

  return JSON.parse(resultStr) as QuizResult;
};

/**
 * Get all quiz attempts
 */
export const getQuizAttempts = async (): Promise<QuizAttempt[]> => {
  if (shouldUseMockAPI()) {
    return mockGetQuizAttempts();
  }

  const response = await apiClient.get<{ attempts: QuizAttempt[] }>(
    API_ENDPOINTS.ASSESSMENT.GET_ATTEMPTS
  );

  return response.data.attempts;
};

/**
 * Mock get quiz attempts
 */
const mockGetQuizAttempts = async (): Promise<QuizAttempt[]> => {
  await mockApiDelay(300);

  const attemptsStr = localStorage.getItem('quiz_attempts');
  return attemptsStr ? (JSON.parse(attemptsStr) as QuizAttempt[]) : [];
};

/**
 * Get quiz statistics
 */
export const getQuizStatistics = (
  attempts: QuizAttempt[]
): {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  passRate: number;
  recentAttempts: QuizAttempt[];
} => {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      passRate: 0,
      recentAttempts: [],
    };
  }

  const totalAttempts = attempts.length;
  const averageScore = attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts;
  const bestScore = Math.max(...attempts.map((a) => a.percentage));
  const passed = attempts.filter((a) => a.passed).length;
  const passRate = (passed / totalAttempts) * 100;

  // Get 5 most recent attempts
  const recentAttempts = [...attempts]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return {
    totalAttempts,
    averageScore,
    bestScore,
    passRate,
    recentAttempts,
  };
};
