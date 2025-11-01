/**
 * Progress Dashboard Page Wrapper
 * Provides default props and data to ProgressDashboard component
 */

import React from 'react';
import { ProgressDashboard } from '../components/assessment/ProgressDashboard';
import { useProgressStore } from '../stores/progressStore';
import type { ProgressData } from '../components/assessment/assessment-types';

const ProgressDashboardPage: React.FC = () => {
  const componentProgress = useProgressStore((state) => state.componentProgress);
  const getOverallProgress = useProgressStore((state) => state.getOverallProgress);

  // Transform progress data for dashboard with all required fields
  const progressData: ProgressData = {
    userId: 'local-user',
    loProgress: [],
    badges: [],
    performanceTrends: [],
    scenarioAttempts: [],
    totalTimeSpent:
      Object.values(componentProgress).reduce((sum, p) => sum + (p?.timeSpent || 0), 0) / 60, // Convert to minutes
    studyStreak: 0,
    lastActivity: new Date(),
    examReadiness: {
      overallScore: getOverallProgress().percentage,
      domainScores: {},
      strengths: [],
      weaknesses: [],
      recommendedStudyTime: 0,
      readyForExam: getOverallProgress().percentage >= 80,
      confidence:
        getOverallProgress().percentage > 80
          ? 'high'
          : getOverallProgress().percentage > 60
            ? 'medium'
            : 'low',
    },
    studyPlan: [],
  };

  return <ProgressDashboard progressData={progressData} />;
};

export default ProgressDashboardPage;
