import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { BookOpen, CheckCircle2, Lightbulb } from 'lucide-react';

export const ExamPrepTab: React.FC = () => {
  return (
    <TabsContent value="exam-prep" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            CompTIA Network+ Exam Preparation
          </CardTitle>
          <CardDescription>Critical knowledge points for exam success</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Key Exam Topics - LO 1.4</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  <strong>Form Factor Identification:</strong> Distinguish GBIC, SFP, SFP+,
                  QSFP, QSFP+, QSFP28, CFP by size, speed, and use case
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  <strong>Speed Capabilities:</strong> SFP=1G, SFP+=10G, QSFP+=40G, QSFP28=100G
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  <strong>Distance Limitations:</strong> -SR (short range, multimode, 100-550m),
                  -LR (long range, single-mode, 10km), -ER (extended range, 40km)
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  <strong>Fiber Compatibility:</strong> Multimode (850nm, orange cable) vs
                  Single-mode (1310/1550nm, yellow cable)
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  <strong>BiDi Operation:</strong> Single fiber, different Tx/Rx wavelengths,
                  cost savings
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span>
                  <strong>WDM Technologies:</strong> CWDM (20nm spacing, 8-18 channels), DWDM
                  (0.4-0.8nm spacing, 40+ channels)
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-900">Common Exam Scenarios</h3>
            <div className="space-y-3 text-sm">
              <div className="text-gray-900">
                <strong className="text-green-800">
                  Q: Connect two buildings 8km apart at 10Gbps?
                </strong>
                <div className="mt-1 text-green-700">
                  A: 10GBASE-LR (SFP+) with single-mode fiber - long range capability
                </div>
              </div>
              <div className="text-gray-900">
                <strong className="text-green-800">
                  Q: Rack-to-rack connection, 5m, 10Gbps, cost-effective?
                </strong>
                <div className="mt-1 text-green-700">
                  A: SFP+ DAC (Direct Attach Copper) - lowest cost for short distances
                </div>
              </div>
              <div className="text-gray-900">
                <strong className="text-green-800">
                  Q: SFP+ module in SFP port - what happens?
                </strong>
                <div className="mt-1 text-green-700">
                  A: Physical incompatibility - SFP+ will NOT fit in SFP-only port. However, SFP
                  modules CAN work in SFP+ ports at reduced 1G speed
                </div>
              </div>
              <div className="text-gray-900">
                <strong className="text-green-800">
                  Q: 100G datacenter spine, 100m distance?
                </strong>
                <div className="mt-1 text-green-700">
                  A: QSFP28 100GBASE-SR4 with OM4 multimode fiber
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h3 className="mb-2 font-semibold text-purple-900">Memory Aids</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-900">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>
                  <strong>"QSFP = Quad = 4x"</strong> - QSFP transceivers always have 4 channels
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>
                  <strong>"SR = Short, LR = Long, ER = Extended"</strong> - Easy distance recall
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>
                  <strong>"850 = Multimode, 1310/1550 = Single-mode"</strong> - Wavelength to
                  fiber type
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-900">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>
                  <strong>"BiDi = Bi-directional = 1 fiber, 2 wavelengths"</strong> - Cost
                  savings
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
