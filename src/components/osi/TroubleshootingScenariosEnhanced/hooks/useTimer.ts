/**
 * Custom hook for managing timers
 */

import { useState, useEffect } from 'react';

export function useTimer(
  isExamMode: boolean,
  timeLimit: number | null,
  currentScenarioIndex?: number,
  onTimeUp?: () => void
) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (isExamMode && timeLimit) {
      setTimeRemaining(timeLimit);
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            if (prev === 0 && onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isExamMode, currentScenarioIndex, timeLimit, onTimeUp]);

  return { timeRemaining, setTimeRemaining };
}

export function useSessionTimer() {
  const [sessionStartTime] = useState<Date>(new Date());
  const [timeSpent, setTimeSpent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  return { timeSpent, sessionStartTime };
}
