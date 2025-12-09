/**
 * History handlers hook (undo/redo)
 */

import { useCallback } from 'react';
import { useCloudDesignerStore } from '../../stores/cloudDesignerStore';

export const useHistoryHandlers = () => {
  const history = useCloudDesignerStore((state) => state.history);
  const setDesign = useCloudDesignerStore((state) => state.setDesign);

  const handleUndo = useCallback(() => {
    if (history.past.length > 0) {
      const previous = history.past[history.past.length - 1];
      setDesign(previous);
    }
  }, [history.past, setDesign]);

  const handleRedo = useCallback(() => {
    if (history.future.length > 0) {
      const next = history.future[0];
      setDesign(next);
    }
  }, [history.future, setDesign]);

  return {
    handleUndo,
    handleRedo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};
