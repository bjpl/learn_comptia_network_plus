/**
 * Analysis Tab Component
 * Strengths/weaknesses analysis with visual charts
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';

interface AnalysisTabProps {
  domainProgress: Array<{ domain: string; completion: number; score: number; loCount: number }>;
  analysis: { strengths: string[]; weaknesses: string[] };
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ domainProgress, analysis }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Strengths Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.strengths.length > 0 ? (
              analysis.strengths.map((strength, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                  <span className="mt-0.5 font-bold text-green-600">+</span>
                  <div>
                    <p className="text-sm font-medium">{strength.split(' (')[0]}</p>
                    <p className="text-xs text-gray-600">
                      {strength.match(/\((.*?)\)/)?.[1] || ''} confidence
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">Continue practicing to build strengths</p>
            )}
          </CardContent>
        </Card>

        {/* Weaknesses Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.weaknesses.length > 0 ? (
              analysis.weaknesses.map((weakness, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-orange-50 p-3">
                  <span className="mt-0.5 font-bold text-orange-600">!</span>
                  <div>
                    <p className="text-sm font-medium">{weakness.split(' (')[0]}</p>
                    <p className="text-xs text-gray-600">
                      {weakness.match(/\((.*?)\)/)?.[1] || ''} - focus here
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">Excellent! No significant weak areas</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Domain Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainProgress.map(({ domain, score }) => {
              const barWidth = `${score}%`;
              const isStrength = analysis.strengths.some((s) => s.includes(domain));
              const isWeakness = analysis.weaknesses.some((w) => w.includes(domain));

              return (
                <div key={domain}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium capitalize">
                      {domain.replace('-', ' ')}
                      {isStrength && <span className="text-green-600">✓ Strength</span>}
                      {isWeakness && <span className="text-orange-600">⚠ Focus Area</span>}
                    </span>
                    <span className="text-sm font-bold">{Math.round(score)}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: barWidth }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
