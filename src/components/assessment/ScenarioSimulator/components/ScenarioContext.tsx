/**
 * Scenario context display component
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { IntegratedScenario } from '../types';

interface ScenarioContextProps {
  scenario: IntegratedScenario;
}

export const ScenarioContext: React.FC<ScenarioContextProps> = ({ scenario }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Scenario Context</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Company Profile
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Name:</strong>{' '}
                {scenario.context.company}
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Locations:</strong>{' '}
                {scenario.context.locations}
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Users:</strong>{' '}
                {scenario.context.users}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Requirements</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {scenario.context.requirements.slice(0, 3).map((req, i) => (
                <li key={i}>• {req}</li>
              ))}
              {scenario.context.requirements.length > 3 && (
                <li className="text-gray-700 dark:text-gray-300">
                  +{scenario.context.requirements.length - 3} more...
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
