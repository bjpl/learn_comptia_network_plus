/**
 * Custom hook for managing tooltip state
 */

import { useState } from 'react';

export interface Tooltip {
  id: string;
  content: string;
  examTip: string;
  position: { x: number; y: number };
}

export const useTooltip = () => {
  const [activeTooltip, setActiveTooltip] = useState<Tooltip | null>(null);

  const showTooltip = (id: string, content: string, examTip: string, event: React.MouseEvent) => {
    setActiveTooltip({
      id,
      content,
      examTip,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return {
    activeTooltip,
    showTooltip,
    hideTooltip,
  };
};
