/**
 * Progress Dashboard Page Wrapper
 * Aggregates progress data with visual charts, strengths/weaknesses, and recommendations
 */

import React, { useMemo } from 'react';
import { ProgressDashboard } from '../components/assessment/ProgressDashboard';
import { useProgressStore } from '../stores/progressStore';
import { learningObjectives } from '../components/assessment/assessment-data';
import type {
  ProgressData,
  LOProgress,
  ScenarioAttempt,
} from '../components/assessment/assessment-types';
import type { QuizAttempt } from '../services/assessment-service';

/**
 * Calculate study streak from localStorage activity data
 */
const calculateStudyStreak = (componentProgress: Record<string, any>): number => {
  const allProgress = Object.values(componentProgress);
  if (allProgress.length === 0) {
    return 0;
  }

  const dates = allProgress
    .map((p) => p.lastVisited)
    .filter(Boolean)
    .map((d) => new Date(d).toDateString())
    .sort()
    .reverse();

  if (dates.length === 0) {
    return 0;
  }

  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) {
    return 0;
  }

  for (let i = 1; i < dates.length; i++) {
    const current = new Date(dates[i]);
    const previous = new Date(dates[i - 1]);
    const diffDays = Math.floor((previous.getTime() - current.getTime()) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
};

/**
 * Get scenario attempts from localStorage
 */
const getScenarioAttempts = (): ScenarioAttempt[] => {
  try {
    const attemptsStr = localStorage.getItem('scenario_attempts');
    return attemptsStr ? JSON.parse(attemptsStr) : [];
  } catch {
    return [];
  }
};

/**
 * Get quiz attempts from localStorage
 */
const getQuizAttempts = (): QuizAttempt[] => {
  try {
    const attemptsStr = localStorage.getItem('quiz_attempts');
    return attemptsStr ? JSON.parse(attemptsStr) : [];
  } catch {
    return [];
  }
};

const ProgressDashboardPage: React.FC = () => {
  const componentProgress = useProgressStore((state) => state.componentProgress);
  const getOverallProgress = useProgressStore((state) => state.getOverallProgress);

  // Transform progress data for dashboard
  const progressData: ProgressData = useMemo(() => {
    const totalTimeSpent = Object.values(componentProgress).reduce(
      (sum, p) => sum + (p?.timeSpent || 0),
      0
    );

    // Get real quiz attempts for scoring data
    const quizAttempts = getQuizAttempts();
    const scenarioAttempts = getScenarioAttempts();

    // Build LO progress from component progress
    const loProgress: LOProgress[] = learningObjectives.map((lo) => {
      const component = componentProgress[lo.id];

      // Get real score from quiz attempts or component score
      const relatedQuizzes = quizAttempts.filter(
        (q) => q.quizTitle?.includes(lo.title) || q.quizId?.includes(lo.code)
      );
      const quizScores = relatedQuizzes.map((q) => q.percentage);
      const avgQuizScore =
        quizScores.length > 0 ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : 0;

      // Use actual score from component or quiz data, fallback to 0 if not attempted
      const baseScore = component?.score ?? avgQuizScore;
      const timeSpent = component?.timeSpent ?? 0;
      const attempts = component?.attempts ?? relatedQuizzes.length;

      // Calculate completion based on actual data
      const hasAttempts = attempts > 0;
      const completionPercentage = component?.completed
        ? 100
        : hasAttempts
          ? Math.min(Math.floor((attempts / 3) * 100), 95)
          : 0;

      // Determine mastery level from actual scores
      const masteryLevel: 'novice' | 'competent' | 'proficient' | 'expert' =
        baseScore >= 85
          ? 'expert'
          : baseScore >= 70
            ? 'proficient'
            : baseScore >= 50
              ? 'competent'
              : 'novice';

      return {
        loCode: lo.code,
        completionPercentage,
        masteryLevel,
        timeSpent,
        attemptsCount: attempts,
        averageScore: baseScore,
        lastPracticed: component?.lastVisited ? new Date(component.lastVisited) : undefined,
        commonMistakes:
          baseScore < 70 ? [`Review ${lo.title} fundamentals`, 'Practice more exercises'] : [],
        suggestedActivities:
          completionPercentage < 100
            ? [`Complete ${lo.title} exercises`, 'Take practice quiz', 'Review study materials']
            : [],
      };
    });

    // Calculate real average score from all LO data
    const loScores = loProgress.filter((lo) => lo.averageScore > 0).map((lo) => lo.averageScore);
    const avgScore =
      loScores.length > 0 ? loScores.reduce((sum, lo) => sum + lo, 0) / loScores.length : 0;

    // Calculate real domain scores from LO data
    const domainScores: Record<string, number> = {
      fundamentals: 0,
      infrastructure: 0,
      operations: 0,
      security: 0,
      troubleshooting: 0,
    };

    const domainCounts: Record<string, number> = {
      fundamentals: 0,
      infrastructure: 0,
      operations: 0,
      security: 0,
      troubleshooting: 0,
    };

    loProgress.forEach((lop) => {
      const lo = learningObjectives.find((l) => l.code === lop.loCode);
      if (lo && lop.averageScore > 0) {
        domainScores[lo.category] += lop.averageScore;
        domainCounts[lo.category]++;
      }
    });

    // Calculate averages
    Object.keys(domainScores).forEach((domain) => {
      if (domainCounts[domain] > 0) {
        domainScores[domain] /= domainCounts[domain];
      }
    });

    // Calculate strengths and weaknesses
    const domainEntries = Object.entries(domainScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]);

    const strengths = domainEntries
      .slice(0, 2)
      .map(
        ([domain, score]) =>
          `${domain.charAt(0).toUpperCase() + domain.slice(1)} (${Math.round(score)}%)`
      );

    const weaknesses = domainEntries
      .slice(-2)
      .filter(([_, score]) => score < 70)
      .map(
        ([domain, score]) =>
          `${domain.charAt(0).toUpperCase() + domain.slice(1)} (${Math.round(score)}%)`
      );

    // Calculate real study streak
    const studyStreak = calculateStudyStreak(componentProgress);

    // Get last activity
    const lastActivityDates = Object.values(componentProgress)
      .map((p) => p.lastVisited)
      .filter(Boolean)
      .map((d) => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    const lastActivity = lastActivityDates.length > 0 ? lastActivityDates[0] : new Date();

    // Calculate badge progress from real data
    const completedLOs = loProgress.filter((lo) => lo.completionPercentage === 100).length;
    const securityLOs = loProgress.filter((lo) => {
      const loObj = learningObjectives.find((l) => l.code === lo.loCode);
      return loObj?.category === 'security';
    });
    const securityAvg =
      securityLOs.length > 0
        ? securityLOs.reduce((sum, lo) => sum + lo.averageScore, 0) / securityLOs.length
        : 0;
    const completedScenarios = scenarioAttempts.filter((s) => s.status === 'completed').length;

    return {
      userId: 'local-user',
      loProgress,
      badges: [
        {
          id: 'subnet-master',
          name: 'Subnet Master',
          description: 'Master subnetting calculations',
          icon: '🎯',
          category: 'technical',
          requirement: 'Score 90%+ on subnetting LOs',
          earned: avgScore >= 90,
          earnedDate: avgScore >= 90 ? new Date() : undefined,
          progress: Math.min(avgScore, 100),
        },
        {
          id: 'protocol-pro',
          name: 'Protocol Pro',
          description: 'Master network protocols',
          icon: '🌐',
          category: 'technical',
          requirement: 'Complete all protocol LOs',
          earned: completedLOs >= 5,
          progress: Math.floor((completedLOs / loProgress.length) * 100),
        },
        {
          id: 'security-expert',
          name: 'Security Expert',
          description: 'Master security fundamentals',
          icon: '🔒',
          category: 'security',
          requirement: 'Score 85%+ on security LOs',
          earned: securityAvg >= 85,
          progress: Math.min(securityAvg, 100),
        },
        {
          id: 'troubleshooter',
          name: 'Master Troubleshooter',
          description: 'Expert in network troubleshooting',
          icon: '🔧',
          category: 'troubleshooting',
          requirement: 'Complete 5 troubleshooting scenarios',
          earned: completedScenarios >= 5,
          progress: Math.min((completedScenarios / 5) * 100, 100),
        },
      ],
      performanceTrends: [],
      scenarioAttempts,
      totalTimeSpent,
      studyStreak,
      lastActivity,
      examReadiness: {
        overallScore: avgScore,
        domainScores,
        strengths,
        weaknesses,
        recommendedStudyTime: Math.max(20 - Math.floor(avgScore / 5), 0),
        readyForExam: avgScore >= 70 && completedLOs >= loProgress.length * 0.8,
        confidence:
          avgScore >= 80 && completedLOs >= loProgress.length * 0.9
            ? 'high'
            : avgScore >= 60 && completedLOs >= loProgress.length * 0.6
              ? 'medium'
              : 'low',
      },
      studyPlan: [
        {
          weekNumber: 1,
          focus:
            weaknesses.length > 0
              ? weaknesses.map((w) => w.split(' (')[0])
              : ['Fundamentals', 'Infrastructure'],
          activities: loProgress
            .filter((lo) => lo.completionPercentage < 100 || lo.averageScore < 70)
            .slice(0, 5)
            .map((lo) => {
              const loObj = learningObjectives.find((l) => l.code === lo.loCode);
              return {
                loCode: lo.loCode,
                component: loObj?.title || 'Study Component',
                estimatedTime: lo.timeSpent > 0 ? Math.max(60, 120 - lo.timeSpent) : 90,
                priority: (lo.averageScore < 50
                  ? 'high'
                  : lo.averageScore < 70
                    ? 'medium'
                    : 'low') as 'high' | 'medium' | 'low',
              };
            }),
          goals: [
            weaknesses.length > 0
              ? `Improve ${weaknesses[0].split(' (')[0]}`
              : 'Build strong foundation',
            `Complete ${loProgress.filter((lo) => lo.completionPercentage < 100).length} remaining LOs`,
            avgScore < 70 ? 'Reach 70% average score' : 'Maintain high performance',
          ],
        },
      ],
    };
  }, [componentProgress, getOverallProgress]);

  return <ProgressDashboard progressData={progressData} />;
};

export default ProgressDashboardPage;
