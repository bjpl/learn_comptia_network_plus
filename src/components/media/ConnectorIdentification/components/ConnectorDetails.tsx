/**
 * ConnectorDetails component - Displays detailed connector information after answer
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Connector3DModel } from '../../media-types';

interface ConnectorDetailsProps {
  connector: Connector3DModel;
  isCorrect: boolean;
}

export function ConnectorDetails({ connector, isCorrect }: ConnectorDetailsProps) {
  return (
    <Card className={`border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isCorrect ? (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Correct!
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-600" />
              Incorrect
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-lg font-semibold">{connector.name}</div>
            <p className="text-gray-700">{connector.description}</p>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Typical Uses:</div>
            <ul className="list-inside list-disc space-y-1">
              {connector.typicalUse.map((use: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">
                  {use}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">Key Features:</div>
            <div className="flex flex-wrap gap-2">
              {connector.keyFeatures.map((feature: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
