/**
 * Progress Tracking Dashboard Component
 * Comprehensive progress monitoring and exam readiness tracking
 */

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Award,
  TrendingUp,
  Target,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  Filter,
  Trophy,
  Zap,
  BarChart3
} from 'lucide-react';
import { learningObjectives, masteryThresholds } from './assessment-data';
import type { ProgressData, LOProgress, DashboardFilters } from './assessment-types';

interface ProgressDashboardProps {
  progressData: ProgressData;
  onExportReport?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progressData,
  onExportReport
}) => {
  const [filters] = useState<DashboardFilters>({
    showOnlyIncomplete: false
  });
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate domain-level progress
  const domainProgress = useMemo(() => {
    const domains = {
      fundamentals: [] as LOProgress[],
      infrastructure: [] as LOProgress[],
      operations: [] as LOProgress[],
      security: [] as LOProgress[],
      troubleshooting: [] as LOProgress[]
    };

    progressData.loProgress.forEach(lop => {
      const lo = learningObjectives.find(l => l.code === lop.loCode);
      if (lo) {
        domains[lo.category].push(lop);
      }
    });

    return Object.entries(domains).map(([domain, los]) => {
      const avgCompletion = los.length > 0
        ? los.reduce((sum, l) => sum + l.completionPercentage, 0) / los.length
        : 0;
      const avgScore = los.length > 0
        ? los.reduce((sum, l) => sum + l.averageScore, 0) / los.length
        : 0;

      return {
        domain,
        completion: avgCompletion,
        score: avgScore,
        loCount: los.length
      };
    });
  }, [progressData.loProgress]);

  const getMasteryLevel = (score: number): string => {
    if (score >= masteryThresholds.expert) {return 'expert';}
    if (score >= masteryThresholds.proficient) {return 'proficient';}
    if (score >= masteryThresholds.competent) {return 'competent';}
    return 'novice';
  };

  const getMasteryColor = (level: string): string => {
    switch (level) {
      case 'expert': return 'bg-purple-500';
      case 'proficient': return 'bg-green-500';
      case 'competent': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getReadinessColor = (score: number): string => {
    if (score >= 85) {return 'text-green-600';}
    if (score >= 70) {return 'text-blue-600';}
    if (score >= 50) {return 'text-orange-600';}
    return 'text-red-600';
  };

  const earnedBadges = progressData.badges.filter(b => b.earned);
  const availableBadges = progressData.badges.filter(b => !b.earned);

  const filteredLOProgress = useMemo(() => {
    let filtered = [...progressData.loProgress];

    if (filters.showOnlyIncomplete) {
      filtered = filtered.filter(lop => lop.completionPercentage < 100);
    }

    if (filters.domains && filters.domains.length > 0) {
      filtered = filtered.filter(lop => {
        const lo = learningObjectives.find(l => l.code === lop.loCode);
        return lo && filters.domains!.includes(lo.category);
      });
    }

    if (filters.masteryLevels && filters.masteryLevels.length > 0) {
      filtered = filtered.filter(lop =>
        filters.masteryLevels!.includes(lop.masteryLevel)
      );
    }

    return filtered;
  }, [progressData.loProgress, filters]);

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exam Readiness</p>
                <p className={`text-3xl font-bold ${getReadinessColor(progressData.examReadiness.overallScore)}`}>
                  {progressData.examReadiness.overallScore}%
                </p>
              </div>
              <Target className={`w-8 h-8 ${getReadinessColor(progressData.examReadiness.overallScore)}`} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progressData.examReadiness.readyForExam ? '✓ Ready for exam' : 'Keep practicing'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Study Time</p>
                <p className="text-3xl font-bold">
                  {Math.round(progressData.totalTimeSpent / 60)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progressData.studyStreak} day streak 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Badges Earned</p>
                <p className="text-3xl font-bold">
                  {earnedBadges.length}/{progressData.badges.length}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {availableBadges.length} more available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scenarios Completed</p>
                <p className="text-3xl font-bold">
                  {progressData.scenarioAttempts.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Integrated assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learning-objectives">Learning Objectives</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Domain Mastery Radar Chart (simplified visualization) */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Mastery Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainProgress.map(({ domain, completion, score }) => (
                  <div key={domain}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {domain.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className={getMasteryColor(getMasteryLevel(score))}>
                          {getMasteryLevel(score)}
                        </Badge>
                        <span className="text-sm text-gray-600">{Math.round(score)}%</span>
                      </div>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exam Readiness Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Readiness Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {progressData.examReadiness.strengths.map((strength, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {progressData.examReadiness.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-orange-600">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Recommended Study Time</p>
                    <p className="text-sm text-gray-600">
                      {progressData.examReadiness.recommendedStudyTime} hours of additional practice
                    </p>
                  </div>
                  <Badge variant={progressData.examReadiness.readyForExam ? 'default' : 'secondary'}>
                    {progressData.examReadiness.confidence} confidence
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Objectives Tab */}
        <TabsContent value="learning-objectives" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Learning Objective Progress</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={onExportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLOProgress.map(lop => {
                  const lo = learningObjectives.find(l => l.code === lop.loCode);
                  return (
                    <Card key={lop.loCode}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">LO {lop.loCode}</Badge>
                              <h4 className="font-semibold">{lo?.title}</h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lop.timeSpent} min
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {lop.attemptsCount} attempts
                              </span>
                              <span>Avg: {Math.round(lop.averageScore)}%</span>
                            </div>
                          </div>
                          <Badge className={getMasteryColor(lop.masteryLevel)}>
                            {lop.masteryLevel}
                          </Badge>
                        </div>

                        <Progress value={lop.completionPercentage} className="mb-3" />

                        {lop.commonMistakes.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Common Mistakes:
                            </p>
                            <ul className="text-xs space-y-1">
                              {lop.commonMistakes.slice(0, 2).map((mistake, i) => (
                                <li key={i} className="text-orange-600">• {mistake}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {lop.suggestedActivities.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Suggested Activities:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {lop.suggestedActivities.map((activity, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Performance chart visualization</p>
                    <p className="text-sm">(Timeline showing score trends over time)</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Best Performance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.max(...progressData.loProgress.map(lop => lop.averageScore))}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Average Score</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(
                          progressData.loProgress.reduce((sum, lop) => sum + lop.averageScore, 0) /
                          progressData.loProgress.length
                        )}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Improvement Rate</p>
                      <p className="text-2xl font-bold text-purple-600">+12%</p>
                      <p className="text-xs text-gray-500">vs last week</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.scenarioAttempts.slice(0, 5).map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{attempt.scenarioId}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(attempt.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={attempt.status === 'completed' ? 'default' : 'secondary'}>
                        {attempt.status}
                      </Badge>
                      <p className="text-sm mt-1">
                        {attempt.totalScore}/{attempt.maxScore}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Earned Badges ({earnedBadges.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {earnedBadges.map(badge => (
                    <Card key={badge.id} className="text-center bg-gradient-to-br from-yellow-50 to-orange-50">
                      <CardContent className="pt-6">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h5 className="font-semibold mb-1">{badge.name}</h5>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        {badge.earnedDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-400" />
                  Available Badges ({availableBadges.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableBadges.map(badge => (
                    <Card key={badge.id} className="text-center opacity-60 hover:opacity-100 transition-opacity">
                      <CardContent className="pt-6">
                        <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                        <h5 className="font-semibold mb-1">{badge.name}</h5>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">{badge.requirement}</p>
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
                {progressData.studyPlan.map(week => (
                  <Card key={week.weekNumber}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Week {week.weekNumber}
                        </CardTitle>
                        <Badge variant="outline">
                          {week.activities.reduce((sum, a) => sum + a.estimatedTime, 0)} min
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Focus: {week.focus.join(', ')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {week.activities.map((activity, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                                className="w-16 justify-center"
                              >
                                {activity.priority}
                              </Badge>
                              <div>
                                <p className="font-medium text-sm">LO {activity.loCode}</p>
                                <p className="text-xs text-gray-600">{activity.component}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {activity.estimatedTime} min
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold mb-2">Goals:</p>
                        <ul className="text-sm space-y-1">
                          {week.goals.map((goal, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
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
