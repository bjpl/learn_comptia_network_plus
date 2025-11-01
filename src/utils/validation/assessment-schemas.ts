/**
 * Assessment Validation Schemas
 * Zod schemas for quiz and assessment data validation
 */

import { z } from 'zod';

/**
 * Answer schema
 */
export const answerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedAnswer: z.union([
    z.string(), // Single choice
    z.array(z.string()), // Multiple choice
    z.number(), // Numeric answer
  ]),
  timeSpent: z.number().min(0, 'Time spent must be positive').max(3600, 'Time spent per question limited to 1 hour'),
  flagged: z.boolean().default(false),
  confidence: z.number().min(1, 'Confidence must be 1-5').max(5).optional(),
});

export type AnswerData = z.infer<typeof answerSchema>;

/**
 * Assessment submission schema
 */
export const assessmentSubmissionSchema = z.object({
  assessmentId: z.string().min(1, 'Assessment ID is required').max(100),
  assessmentType: z.enum(['practice', 'quiz', 'exam', 'diagnostic']),
  answers: z.array(answerSchema).min(1, 'At least one answer is required').max(200, 'Too many answers'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  totalTimeSpent: z.number().min(0, 'Time spent must be positive').max(14400, 'Assessment time limited to 4 hours'),
  isComplete: z.boolean(),
  isPaused: z.boolean().default(false),
});

export type AssessmentSubmissionData = z.infer<typeof assessmentSubmissionSchema>;

/**
 * Assessment result schema
 */
export const assessmentResultSchema = z.object({
  resultId: z.string().uuid(),
  assessmentId: z.string().min(1),
  userId: z.string().min(1),
  score: z.number().min(0, 'Score must be between 0 and 100').max(100),
  totalQuestions: z.number().min(1).max(200),
  correctAnswers: z.number().min(0),
  incorrectAnswers: z.number().min(0),
  skippedQuestions: z.number().min(0),
  timeSpent: z.number().min(0),
  passed: z.boolean(),
  percentile: z.number().min(0).max(100).optional(),
  completedAt: z.string().datetime(),
});

export type AssessmentResultData = z.infer<typeof assessmentResultSchema>;

/**
 * Quiz attempt schema
 */
export const quizAttemptSchema = z.object({
  attemptId: z.string().uuid().optional(),
  quizId: z.string().min(1, 'Quiz ID is required'),
  attemptNumber: z.number().min(1, 'Attempt number must be positive').max(10, 'Maximum 10 attempts allowed'),
  status: z.enum(['in_progress', 'completed', 'abandoned']),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  score: z.number().min(0).max(100).optional(),
  answers: z.array(answerSchema).max(100),
});

export type QuizAttemptData = z.infer<typeof quizAttemptSchema>;

/**
 * Question feedback schema
 */
export const questionFeedbackSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  assessmentId: z.string().min(1, 'Assessment ID is required'),
  feedbackType: z.enum(['unclear', 'incorrect', 'typo', 'outdated', 'other']),
  comment: z.string().min(10, 'Feedback must be at least 10 characters').max(1000, 'Feedback must be less than 1000 characters'),
  reportedAt: z.string().datetime(),
});

export type QuestionFeedbackData = z.infer<typeof questionFeedbackSchema>;

/**
 * Practice session schema
 */
export const practiceSessionSchema = z.object({
  sessionId: z.string().uuid().optional(),
  topicIds: z.array(z.string()).min(1, 'At least one topic is required').max(20, 'Maximum 20 topics per session'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
  questionCount: z.number().min(5, 'Minimum 5 questions').max(100, 'Maximum 100 questions'),
  mode: z.enum(['timed', 'untimed', 'adaptive']),
  timeLimit: z.number().min(60, 'Minimum 1 minute').max(7200, 'Maximum 2 hours').optional(),
  includeExplanations: z.boolean().default(true),
  shuffleQuestions: z.boolean().default(true),
  shuffleAnswers: z.boolean().default(true),
});

export type PracticeSessionData = z.infer<typeof practiceSessionSchema>;

/**
 * Performance analytics schema
 */
export const performanceAnalyticsSchema = z.object({
  userId: z.string().min(1),
  period: z.enum(['daily', 'weekly', 'monthly', 'all_time']),
  averageScore: z.number().min(0).max(100),
  totalAssessments: z.number().min(0),
  totalQuestions: z.number().min(0),
  correctAnswers: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  strongTopics: z.array(z.object({
    topicId: z.string(),
    topicName: z.string(),
    accuracy: z.number().min(0).max(100),
  })).max(10),
  weakTopics: z.array(z.object({
    topicId: z.string(),
    topicName: z.string(),
    accuracy: z.number().min(0).max(100),
  })).max(10),
  timeSpentByTopic: z.record(z.string(), z.number()),
  progressTrend: z.array(z.object({
    date: z.string(),
    score: z.number().min(0).max(100),
  })).max(365),
});

export type PerformanceAnalyticsData = z.infer<typeof performanceAnalyticsSchema>;

/**
 * Exam readiness schema
 */
export const examReadinessSchema = z.object({
  userId: z.string().min(1),
  overallReadiness: z.number().min(0, 'Readiness must be between 0 and 100').max(100),
  domainReadiness: z.array(z.object({
    domainId: z.string(),
    domainName: z.string(),
    readiness: z.number().min(0).max(100),
    weakAreas: z.array(z.string()).max(10),
  })).max(7),
  recommendedStudyTime: z.number().min(0, 'Recommended study time must be positive'),
  estimatedPassProbability: z.number().min(0).max(100),
  lastUpdated: z.string().datetime(),
});

export type ExamReadinessData = z.infer<typeof examReadinessSchema>;
