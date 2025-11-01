/**
 * Recommendations Tab Component
 * Personalized study recommendations and suggested next steps
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Target, TrendingUp, Zap } from 'lucide-react';
import type { ProgressData } from './assessment-types';

interface RecommendationsTabProps {
  recommendations: Array<{ priority: 'high' | 'medium' | 'low'; text: string }>;
  progressData: ProgressData;
}

export const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  recommendations,
  progressData,
}) => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Brain className="h-5 w-5 text-blue-600" />
            Personalized Study Recommendations
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Based on your performance, here's what to focus on next
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <div
                key={i}
                className={`rounded-lg border-l-4 p-4 ${
                  rec.priority === 'high'
                    ? 'border-l-red-500 bg-red-50'
                    : rec.priority === 'medium'
                      ? 'border-l-orange-500 bg-orange-50'
                      : 'border-l-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    className={
                      rec.priority === 'high'
                        ? 'bg-red-600'
                        : rec.priority === 'medium'
                          ? 'bg-orange-600'
                          : 'bg-green-600'
                    }
                  >
                    {rec.priority}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rec.text}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      {rec.priority === 'high' && 'This is critical for exam readiness.'}
                      {rec.priority === 'medium' && 'This will improve your overall performance.'}
                      {rec.priority === 'low' && 'This is optional but helpful.'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <Lightbulb className="mx-auto mb-2 h-12 w-12 text-yellow-500" />
              <p className="font-medium text-gray-700">You're on track!</p>
              <p className="text-sm text-gray-600">
                Continue your current study pace and focus on weak areas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Practice Weak Domains</p>
                <p className="text-xs text-gray-600">Spend extra time on areas below 70%</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Start
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Complete Unfinished LOs</p>
                <p className="text-xs text-gray-600">
                  {progressData.loProgress.filter((lo) => lo.completionPercentage < 100).length}{' '}
                  objectives remaining
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Review
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Earn More Badges</p>
                <p className="text-xs text-gray-600">
                  {progressData.badges.filter((b) => !b.earned).length} badges available
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
