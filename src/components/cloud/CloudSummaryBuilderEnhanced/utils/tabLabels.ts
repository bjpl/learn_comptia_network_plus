/**
 * Utility functions for tab labels and display
 */

import type { TabType } from '../types';

export const getTabLabel = (tab: TabType): string => {
  const labels: Record<TabType, string> = {
    terms: 'Terminology',
    comparison: 'Comparison',
    usecase: 'Use Cases',
    cost: 'Cost',
    exam: 'Exam',
  };
  return labels[tab];
};

export const TAB_OPTIONS: readonly TabType[] = [
  'terms',
  'comparison',
  'usecase',
  'cost',
  'exam',
] as const;
