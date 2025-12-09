import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Lightbulb, Info } from 'lucide-react';
import { WDM_TYPES } from '../constants/data';

export const BiDiWDMTab: React.FC = () => {
  return (
    <TabsContent value="bidi-wdm" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wavelength Division Multiplexing (WDM) Technologies</CardTitle>
          <CardDescription>
            Understanding BiDi, CWDM, and DWDM for capacity multiplication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {WDM_TYPES.map((wdm) => (
            <div key={wdm.name} className="rounded-lg border-2 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 text-lg">
                  {wdm.name}
                </Badge>
                <span className="text-sm font-medium text-gray-700">{wdm.fullName}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <div className="mb-1 font-semibold text-gray-800 dark:text-gray-300">
                    Technical Specs
                  </div>
                  <div className="space-y-1 text-gray-700 dark:text-gray-400">
                    <div>
                      <strong>Channels:</strong> {wdm.channels}
                    </div>
                    <div>
                      <strong>Wavelength Range:</strong> {wdm.wavelengthRange}
                    </div>
                    <div>
                      <strong>Channel Spacing:</strong> {wdm.spacing}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-gray-800 dark:text-gray-300">
                    Applications
                  </div>
                  <div className="space-y-1 text-gray-700 dark:text-gray-400">
                    <div>
                      <strong>Primary Use:</strong> {wdm.useCase}
                    </div>
                    <div>
                      <strong>Capacity Benefit:</strong> {wdm.capacity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div className="text-sm text-gray-900">
                <strong className="text-green-900">BiDi Explained:</strong> Bidirectional
                transceivers use different wavelengths for transmit (Tx) and receive (Rx) on a
                SINGLE fiber strand. One end transmits at 1270nm / receives at 1330nm, while the
                other end does the opposite. This cuts fiber usage in half and reduces
                installation costs.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
              <div className="text-sm text-gray-900">
                <strong className="text-purple-900">Cost Savings:</strong> WDM technologies
                multiply fiber capacity without adding cables. DWDM can carry 80+ channels on a
                single fiber pair, replacing what would otherwise require 80 separate fiber
                pairs - massive cost savings for long-distance runs.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
