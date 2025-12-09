import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { TROUBLESHOOTING_TIPS } from '../constants/data';

export const TroubleshootingTab: React.FC = () => {
  return (
    <TabsContent value="troubleshooting" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Transceiver Troubleshooting Guide
          </CardTitle>
          <CardDescription>
            Common issues, causes, and solutions for transceiver problems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {TROUBLESHOOTING_TIPS.map((tip, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="mb-3 flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div className="text-lg font-semibold">{tip.symptom}</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-semibold text-red-700">
                    Possible Causes:
                  </div>
                  <ul className="space-y-1 text-sm">
                    {tip.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-red-500">•</span>
                        <span className="text-gray-900">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-green-700">Solutions:</div>
                  <ul className="space-y-1 text-sm">
                    {tip.solutions.map((solution, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-gray-900">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div className="text-sm text-gray-900">
                <strong className="text-yellow-900">Optical Power Budget:</strong> Always check
                dBm levels. Typical ranges: -3 to -10 dBm (good), -10 to -20 dBm (acceptable),
                below -20 dBm (check for issues). Use an optical power meter for accurate
                measurements.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
