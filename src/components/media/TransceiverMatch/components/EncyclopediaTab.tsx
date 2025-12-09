import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, Info } from 'lucide-react';
import { TRANSCEIVER_SPECS } from '../constants/data';

export const EncyclopediaTab: React.FC = () => {
  return (
    <TabsContent value="encyclopedia" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Transceiver Form Factor Encyclopedia
          </CardTitle>
          <CardDescription>
            Complete reference guide for CompTIA Network+ LO 1.4 transceiver types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TRANSCEIVER_SPECS.map((spec) => (
              <div key={spec.formFactor} className="rounded-lg border p-4 hover:bg-gray-50">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="px-3 py-1 text-lg">{spec.formFactor}</Badge>
                      <span className="text-sm text-gray-500">({spec.introduced})</span>
                    </div>
                    <div className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {spec.fullName}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      <strong>Speed:</strong> {spec.speed} | <strong>Channels:</strong>{' '}
                      {spec.channels} | <strong>Size:</strong> {spec.size}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm">
                      <strong className="text-blue-700">Use Case:</strong> {spec.useCase}
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-400">
                        {spec.keyFeature}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="text-sm text-gray-900">
                <strong className="text-blue-900">Exam Tip:</strong> Remember the pattern - QSFP
                = 4x speed of equivalent SFP (QSFP+ is 4x10G = 40G, QSFP28 is 4x25G = 100G).
                SFP+ modules can fit in SFP ports but will run at reduced 1G speed.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
