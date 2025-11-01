/**
 * Time Tracking Tab Component
 * Study time metrics and distribution visualization
 */

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, BookOpen } from 'lucide-react';
import { learningObjectives } from './assessment-data';
import type { LOProgress } from './assessment-types';

interface TimeTrackingTabProps {
  loProgress: LOProgress[];
}

export const TimeTrackingTab: React.FC<TimeTrackingTabProps> = ({ loProgress }) => {
  const timeAnalysis = useMemo(() => {
    const totalMinutes = loProgress.reduce((sum, lo) => sum + lo.timeSpent, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const avgPerLO = loProgress.length > 0 ? totalMinutes / loProgress.length : 0;

    return { hours, minutes, avgPerLO, total: totalMinutes };
  }, [loProgress]);

  const timeByDomain = useMemo(() => {
    return loProgress.reduce((acc: Record<string, number>, lo) => {
      const loObj = learningObjectives.find((l) => l.code === lo.loCode);
      if (loObj) {
        acc[loObj.category] = (acc[loObj.category] || 0) + lo.timeSpent;
      }
      return acc;
    }, {});
  }, [loProgress]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm text-gray-600">Total Study Time</p>
                <p className="text-4xl font-bold text-blue-600">
                  {timeAnalysis.hours}h {timeAnalysis.minutes}m
                </p>
              </div>
              <Clock className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm text-gray-600">Avg per Learning Objective</p>
                <p className="text-4xl font-bold text-purple-600">
                  {Math.round(timeAnalysis.avgPerLO)}m
                </p>
              </div>
              <Flame className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-sm text-gray-600">Recommended Daily</p>
                <p className="text-4xl font-bold text-indigo-600">1-2h</p>
              </div>
              <BookOpen className="h-10 w-10 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time per Domain */}
      <Card>
        <CardHeader>
          <CardTitle>Time Investment by Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(timeByDomain).map(([domain, time]) => (
              <div key={domain}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{domain.replace('-', ' ')}</span>
                  <Badge variant="outline">
                    {Math.round(time / 60)}h {time % 60}m
                  </Badge>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                    style={{ width: `${Math.min((time / timeAnalysis.total) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
