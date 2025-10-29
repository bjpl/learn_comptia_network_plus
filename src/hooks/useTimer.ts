/**
 * CompTIA Network+ Learning Platform - Timer Hook
 * React hook for countdown timers and stopwatches
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerState, TimerConfig } from '../types';

// ============================================================================
// Types
// ============================================================================

interface UseTimerReturn extends TimerState {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  addTime: (seconds: number) => void;
  formatTime: (format?: 'mm:ss' | 'hh:mm:ss' | 'ms') => string;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for countdown timer or stopwatch
 *
 * @param config - Timer configuration
 * @returns Timer state and control functions
 *
 * @example
 * ```typescript
 * // Countdown timer (60 seconds)
 * const timer = useTimer({
 *   duration: 60,
 *   autoStart: true,
 *   onComplete: () => alert('Time is up!'),
 *   onTick: (state) => console.log(state.remaining)
 * });
 *
 * // Stopwatch (no duration)
 * const stopwatch = useTimer({
 *   autoStart: false
 * });
 *
 * return (
 *   <div>
 *     <div>Time: {timer.formatTime()}</div>
 *     <button onClick={timer.start}>Start</button>
 *     <button onClick={timer.pause}>Pause</button>
 *     <button onClick={timer.reset}>Reset</button>
 *   </div>
 * );
 * ```
 */
export function useTimer(config: TimerConfig = {}): UseTimerReturn {
  const {
    duration,
    autoStart = false,
    onComplete,
    onTick,
    warningThreshold = 10,
  } = config;

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  // Calculate remaining time
  const remaining = duration !== undefined ? Math.max(0, duration - elapsed) : undefined;

  // Timer tick effect
  useEffect(() => {
    if (!isRunning || isPaused) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const totalElapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
      setElapsed(totalElapsed);

      // Check if countdown is complete
      if (duration !== undefined && totalElapsed >= duration) {
        setIsComplete(true);
        setIsRunning(false);
        if (onComplete) {
          onComplete();
        }
      }

      // Call onTick callback
      if (onTick) {
        const state: TimerState = {
          elapsed: totalElapsed,
          remaining: duration !== undefined ? Math.max(0, duration - totalElapsed) : undefined,
          isRunning: true,
          isPaused: false,
          isComplete: false,
        };
        onTick(state);
      }
    }, 100); // Update every 100ms for smooth display

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, duration, onComplete, onTick]);

  // Start timer
  const start = useCallback(() => {
    if (isComplete) {
      // Reset if completed
      setElapsed(0);
      setIsComplete(false);
    }
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setIsRunning(true);
    setIsPaused(false);
  }, [isComplete]);

  // Pause timer
  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      pausedTimeRef.current = Date.now() - startTimeRef.current;
    }
  }, [isRunning, isPaused]);

  // Resume timer
  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  // Stop timer
  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setElapsed(0);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Add time (for countdown)
  const addTime = useCallback((seconds: number) => {
    if (duration !== undefined) {
      // Adjust start time to effectively add time
      startTimeRef.current -= seconds * 1000;
      setElapsed(prev => Math.max(0, prev - seconds));
    }
  }, [duration]);

  // Format time display
  const formatTime = useCallback(
    (format: 'mm:ss' | 'hh:mm:ss' | 'ms' = 'mm:ss'): string => {
      const seconds = duration !== undefined && remaining !== undefined ? remaining : elapsed;

      if (format === 'ms') {
        const ms = seconds * 1000;
        return `${ms}ms`;
      }

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (format === 'hh:mm:ss') {
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
      }

      return `${pad(minutes)}:${pad(secs)}`;
    },
    [elapsed, remaining, duration]
  );

  return {
    elapsed,
    remaining,
    isRunning,
    isPaused,
    isComplete,
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
    formatTime,
  };
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook for interval-based actions
 *
 * @param callback - Function to call at each interval
 * @param delay - Delay in milliseconds (null to pause)
 *
 * @example
 * ```typescript
 * const [count, setCount] = useState(0);
 * useInterval(() => setCount(c => c + 1), 1000);
 * ```
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {return;}

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook for debounced values
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * ```typescript
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 *
 * useEffect(() => {
 *   // Perform search with debouncedSearch
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled values
 *
 * @param value - Value to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

/**
 * Hook for countdown with callbacks at specific times
 *
 * @param duration - Duration in seconds
 * @param callbacks - Map of time -> callback
 * @returns Timer controls
 *
 * @example
 * ```typescript
 * const timer = useCountdownWithCallbacks(60, {
 *   30: () => console.log('30 seconds left'),
 *   10: () => console.log('10 seconds left'),
 *   0: () => console.log('Time is up!')
 * });
 * ```
 */
export function useCountdownWithCallbacks(
  duration: number,
  callbacks: Record<number, () => void>
): UseTimerReturn {
  const calledRef = useRef<Set<number>>(new Set());

  const timer = useTimer({
    duration,
    onTick: (state) => {
      if (state.remaining === undefined) {return;}

      Object.entries(callbacks).forEach(([time, callback]) => {
        const timeNum = parseInt(time, 10);
        if (state.remaining! <= timeNum && !calledRef.current.has(timeNum)) {
          calledRef.current.add(timeNum);
          callback();
        }
      });
    },
  });

  // Reset called callbacks when timer resets
  const reset = useCallback(() => {
    calledRef.current.clear();
    timer.reset();
  }, [timer]);

  return {
    ...timer,
    reset,
  };
}

/**
 * Hook for timed challenges
 *
 * @param duration - Duration in seconds
 * @param onComplete - Callback when time runs out
 * @returns Timer state and completion status
 */
export function useTimedChallenge(
  duration: number,
  onComplete?: () => void
): {
  timer: UseTimerReturn;
  isTimeWarning: boolean;
  isCritical: boolean;
  percentRemaining: number;
} {
  const timer = useTimer({
    duration,
    autoStart: true,
    onComplete,
    warningThreshold: 10,
  });

  const percentRemaining = timer.remaining
    ? (timer.remaining / duration) * 100
    : 0;

  const isTimeWarning = percentRemaining <= 25 && percentRemaining > 10;
  const isCritical = percentRemaining <= 10;

  return {
    timer,
    isTimeWarning,
    isCritical,
    percentRemaining,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Pad number with leading zero
 */
function pad(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Format seconds to human-readable string
 *
 * @param seconds - Seconds to format
 * @returns Formatted string (e.g., "2h 30m 15s")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) {parts.push(`${hours}h`);}
  if (minutes > 0) {parts.push(`${minutes}m`);}
  if (secs > 0 || parts.length === 0) {parts.push(`${secs}s`);}

  return parts.join(' ');
}

/**
 * Parse time string to seconds
 *
 * @param timeStr - Time string (e.g., "1:30" or "90")
 * @returns Seconds
 */
export function parseTimeString(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);

  if (parts.length === 1) {
    return parts[0]; // Just seconds
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // mm:ss
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hh:mm:ss
  }

  return 0;
}

export default useTimer;
