/**
 * Progress Tracking Validation Schemas
 * Zod schemas for learning progress data validation
 */

import { z } from 'zod';

/**
 * Module completion schema
 */
export const moduleCompletionSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required').max(100),
  sectionId: z.string().min(1, 'Section ID is required').max(100),
  completed: z.boolean(),
  completedAt: z.string().datetime().optional(),
  timeSpent: z.number().min(0, 'Time spent must be positive').max(86400, 'Time spent must be less than 24 hours'),
  score: z.number().min(0, 'Score must be between 0 and 100').max(100).optional(),
});

export type ModuleCompletionData = z.infer<typeof moduleCompletionSchema>;

/**
 * Lesson progress schema
 */
export const lessonProgressSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required').max(100),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  progress: z.number().min(0, 'Progress must be between 0 and 100').max(100),
  lastAccessedAt: z.string().datetime(),
  timeSpent: z.number().min(0).max(86400),
  bookmarked: z.boolean().default(false),
  notes: z.string().max(5000, 'Notes must be less than 5000 characters').optional(),
});

export type LessonProgressData = z.infer<typeof lessonProgressSchema>;

/**
 * Study session schema
 */
export const studySessionSchema = z.object({
  sessionId: z.string().uuid().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().min(0, 'Duration must be positive').max(86400),
  modules: z.array(z.string()).max(50, 'Too many modules in one session'),
  activities: z.array(z.object({
    type: z.enum(['lesson', 'quiz', 'practice', 'review']),
    itemId: z.string(),
    duration: z.number().min(0),
  })).max(100, 'Too many activities in one session'),
  focusScore: z.number().min(0).max(100).optional(),
});

export type StudySessionData = z.infer<typeof studySessionSchema>;

/**
 * Bookmark schema
 */
export const bookmarkSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  contentType: z.enum(['lesson', 'module', 'section', 'quiz', 'resource']),
  title: z.string().min(1, 'Title is required').max(200),
  note: z.string().max(500, 'Note must be less than 500 characters').optional(),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  createdAt: z.string().datetime(),
});

export type BookmarkData = z.infer<typeof bookmarkSchema>;

/**
 * Note schema
 */
export const noteSchema = z.object({
  noteId: z.string().uuid().optional(),
  contentId: z.string().min(1, 'Content ID is required'),
  contentType: z.enum(['lesson', 'module', 'section']),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Note content is required').max(10000, 'Note must be less than 10000 characters'),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  isPrivate: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type NoteData = z.infer<typeof noteSchema>;

/**
 * Progress sync schema
 */
export const progressSyncSchema = z.object({
  userId: z.string().min(1),
  lastSyncAt: z.string().datetime(),
  modules: z.array(moduleCompletionSchema).max(1000),
  lessons: z.array(lessonProgressSchema).max(5000),
  sessions: z.array(studySessionSchema).max(100),
  bookmarks: z.array(bookmarkSchema).max(500),
  notes: z.array(noteSchema).max(1000),
});

export type ProgressSyncData = z.infer<typeof progressSyncSchema>;

/**
 * Daily goal schema
 */
export const dailyGoalSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  targetMinutes: z.number().min(5, 'Target must be at least 5 minutes').max(480, 'Target must be less than 8 hours'),
  completedMinutes: z.number().min(0).max(1440),
  achieved: z.boolean(),
});

export type DailyGoalData = z.infer<typeof dailyGoalSchema>;

/**
 * Streak schema
 */
export const streakSchema = z.object({
  currentStreak: z.number().min(0),
  longestStreak: z.number().min(0),
  lastActivityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  streakStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type StreakData = z.infer<typeof streakSchema>;
