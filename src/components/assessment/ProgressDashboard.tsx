/**
 * Progress Dashboard Component
 * Comprehensive progress monitoring with visual charts, analysis, and recommendations
 */

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Target, Clock, AlertCircle, CheckCircle2, Trophy, Zap } from 'lucide-react';
import { learningObjectives, masteryThresholds } from './assessment-data';
import { AnalysisTab } from './AnalysisTab';
import { TimeTrackingTab } from './TimeTrackingTab';
import { RecommendationsTab } from './RecommendationsTab';
import type { ProgressData } from './assessment-types';

interface ProgressDashboardProps {
  progressData: ProgressData;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progressData }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate domain-level progress
  const domainProgress = useMemo(() => {
    const domains: Record<string, any[]> = {
      fundamentals: [],
      infrastructure: [],
      operations: [],
      security: [],
      troubleshooting: [],
    };

    progressData.loProgress.forEach((lop) => {
      const lo = learningObjectives.find((l) => l.code === lop.loCode);
      if (lo) {
        domains[lo.category].push(lop);
      }
    });

    return Object.entries(domains).map(([domain, los]) => {
      const avgCompletion =
        los.length > 0 ? los.reduce((sum, l) => sum + l.completionPercentage, 0) / los.length : 0;
      const avgScore =
        los.length > 0 ? los.reduce((sum, l) => sum + l.averageScore, 0) / los.length : 0;

      return { domain, completion: avgCompletion, score: avgScore, loCount: los.length };
    });
  }, [progressData.loProgress]);

  const getMasteryLevel = (score: number): string => {
    if (score >= masteryThresholds.expert) {
      return 'expert';
    }
    if (score >= masteryThresholds.proficient) {
      return 'proficient';
    }
    if (score >= masteryThresholds.competent) {
      return 'competent';
    }
    return 'novice';
  };

  const getMasteryColor = (level: string): string => {
    const colors: Record<string, string> = {
      expert: 'bg-purple-500',
      proficient: 'bg-green-500',
      competent: 'bg-blue-500',
    };
    return colors[level] || 'bg-gray-400';
  };

  const getReadinessColor = (score: number): string => {
    if (score >= 85) {
      return 'text-green-600';
    }
    if (score >= 70) {
      return 'text-blue-600';
    }
    if (score >= 50) {
      return 'text-orange-600';
    }
    return 'text-red-600';
  };

  // Analyze strengths and weaknesses
  const analysis = useMemo(() => {
    const byDomain: Record<string, number[]> = {};

    domainProgress.forEach((dp) => {
      if (!byDomain[dp.domain]) {
        byDomain[dp.domain] = [];
      }
      byDomain[dp.domain].push(dp.score);
    });

    const domainStats = Object.entries(byDomain).map(([domain, scores]) => ({
      domain,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    }));

    const sorted = [...domainStats].sort((a, b) => b.avgScore - a.avgScore);
    return {
      strengths: sorted
        .slice(0, 2)
        .map((s) => `${s.domain.replace('-', ' ')} (${Math.round(s.avgScore)}%)`),
      weaknesses: sorted
        .slice(-2)
        .filter((s) => s.avgScore < 70)
        .map((s) => `${s.domain.replace('-', ' ')} (${Math.round(s.avgScore)}%)`),
    };
  }, [domainProgress]);

  // Study recommendations
  const recommendations = useMemo(() => {
    const recs: { priority: 'high' | 'medium' | 'low'; text: string }[] = [];

    if (progressData.examReadiness.overallScore < 70) {
      recs.push({ priority: 'high', text: 'Focus on weak domains to reach 70%+ readiness' });
    }

    const incompleted = progressData.loProgress.filter((lo) => lo.completionPercentage < 100);
    if (incompleted.length > 5) {
      recs.push({
        priority: 'high',
        text: `Complete remaining ${incompleted.length} learning objectives`,
      });
    }

    analysis.weaknesses.forEach((weakness) => {
      recs.push({ priority: 'high', text: `Strengthen ${weakness.split(' (')[0]}` });
    });

    const totalMinutes = progressData.loProgress.reduce((sum, lo) => sum + lo.timeSpent, 0);
    if (totalMinutes < 60 * 4) {
      recs.push({
        priority: 'medium',
        text: 'Increase daily study time (recommend 1-2 hours/day)',
      });
    }

    const noviceCount = progressData.loProgress.filter((lo) => lo.masteryLevel === 'novice').length;
    if (noviceCount > 3) {
      recs.push({
        priority: 'medium',
        text: `Review fundamentals (${noviceCount} novice-level LOs)`,
      });
    }

    return recs.slice(0, 5);
  }, [progressData, analysis]);

  const earnedBadges = progressData.badges.filter((b) => b.earned);
  const availableBadges = progressData.badges.filter((b) => !b.earned);

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                  Exam Readiness
                </p>
                <p
                  className={`text-3xl font-bold ${getReadinessColor(progressData.examReadiness.overallScore)}`}
                >
                  {progressData.examReadiness.overallScore}%
                </p>
              </div>
              <Target
                className={`h-8 w-8 ${getReadinessColor(progressData.examReadiness.overallScore)}`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
              {progressData.examReadiness.readyForExam ? '✓ Ready for exam' : 'Keep practicing'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                  Total Study Time
                </p>
                <p className="text-3xl font-bold dark:text-gray-100">
                  {Math.round(progressData.totalTimeSpent / 60)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
              {progressData.studyStreak} day streak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                  Badges Earned
                </p>
                <p className="text-3xl font-bold dark:text-gray-100">
                  {earnedBadges.length}/{progressData.badges.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
              {availableBadges.length} more available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                  Scenarios Completed
                </p>
                <p className="text-3xl font-bold dark:text-gray-100">
                  {progressData.scenarioAttempts.filter((a) => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
              Integrated assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="time-tracking">Time</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="badges">Achievements</TabsTrigger>
          <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Mastery Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {domainProgress.map(({ domain, score }) => (
                <div key={domain}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize dark:text-gray-200 dark:text-gray-300">
                      {domain.replace('-', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge className={getMasteryColor(getMasteryLevel(score))}>
                        {getMasteryLevel(score)}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                        {Math.round(score)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exam Readiness Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold dark:text-gray-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm dark:text-gray-200 dark:text-gray-300"
                      >
                        <span className="text-green-600">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold dark:text-gray-100">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm dark:text-gray-200 dark:text-gray-300"
                      >
                        <span className="text-orange-600">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold dark:text-gray-100">Recommended Study Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                      {progressData.examReadiness.recommendedStudyTime} hours additional practice
                    </p>
                  </div>
                  <Badge
                    variant={progressData.examReadiness.readyForExam ? 'default' : 'secondary'}
                  >
                    {progressData.examReadiness.confidence} confidence
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <AnalysisTab domainProgress={domainProgress} analysis={analysis} />
        </TabsContent>

        {/* Time Tracking Tab */}
        <TabsContent value="time-tracking">
          <TimeTrackingTab loProgress={progressData.loProgress} />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <RecommendationsTab recommendations={recommendations} progressData={progressData} />
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="mb-4 flex items-center gap-2 font-semibold dark:text-gray-100">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Earned Badges ({earnedBadges.length})
                </h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {earnedBadges.map((badge) => (
                    <Card
                      key={badge.id}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 text-center dark:from-yellow-950 dark:to-orange-950"
                    >
                      <CardContent className="pt-6">
                        <div className="mb-2 text-4xl">{badge.icon}</div>
                        <h5 className="mb-1 font-semibold dark:text-gray-100">{badge.name}</h5>
                        <p className="mb-2 text-xs text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                          {badge.description}
                        </p>
                        {badge.earnedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                            {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4 flex items-center gap-2 font-semibold dark:text-gray-100">
                  <Zap className="h-5 w-5 text-gray-400 dark:text-gray-200 dark:text-gray-300" />
                  Available Badges ({availableBadges.length})
                </h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {availableBadges.map((badge) => (
                    <Card
                      key={badge.id}
                      className="text-center opacity-60 transition-opacity hover:opacity-100 dark:opacity-40 dark:hover:opacity-100"
                    >
                      <CardContent className="pt-6">
                        <div className="mb-2 text-4xl grayscale">{badge.icon}</div>
                        <h5 className="mb-1 font-semibold dark:text-gray-200">{badge.name}</h5>
                        <p className="mb-2 text-xs text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                          {badge.description}
                        </p>
                        <div className="mt-3">
                          <p className="mb-1 text-xs text-gray-500 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                            {badge.requirement}
                          </p>
                          {badge.progress !== undefined && (
                            <Progress value={badge.progress} className="h-1" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Plan Tab */}
        <TabsContent value="study-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Study Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressData.studyPlan.map((week) => (
                  <Card key={week.weekNumber}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg dark:text-gray-100">
                          Week {week.weekNumber}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="dark:border-gray-600 dark:text-gray-200 dark:text-gray-300"
                        >
                          {week.activities.reduce((sum, a) => sum + a.estimatedTime, 0)} min
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                        Focus: {week.focus.join(', ')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {week.activities.map((activity, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                              >
                                {activity.priority}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium dark:text-gray-100">
                                  LO {activity.loCode}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                                  {activity.component}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200 dark:text-gray-300 dark:text-gray-400">
                              <Clock className="h-4 w-4" />
                              {activity.estimatedTime} min
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="mb-2 text-sm font-semibold dark:text-gray-100">Goals:</p>
                        <ul className="space-y-1 text-sm dark:text-gray-200 dark:text-gray-300">
                          {week.goals.map((goal, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;
