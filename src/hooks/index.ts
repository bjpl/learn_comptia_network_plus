/**
 * CompTIA Network+ Learning Platform - Hooks Index
 * Central export point for all React hooks
 */

// Export progress tracking hooks
export {
  useProgress,
  useSessionTime,
  useStreakCheck,
  useAchievementNotifications,
} from './useProgress';
export { default as progressHook } from './useProgress';

// Export scoring hooks
export {
  useScoring,
  useRealtimeScore,
  useAnswerStreak,
  useDomainProgress,
  useTimeTracking,
  useScorePrediction,
} from './useScoring';
export { default as scoringHook } from './useScoring';

// Export timer hooks
export {
  useTimer,
  useInterval,
  useDebounce,
  useThrottle,
  useCountdownWithCallbacks,
  useTimedChallenge,
  formatDuration,
  parseTimeString,
} from './useTimer';
export { default as timerHook } from './useTimer';

// Export mobile detection hooks
export {
  useMobileDetection,
  useMinimumWidth,
  useOrientation,
  type DeviceType,
  type MobileDetectionState,
} from './useMobileDetection';
export { default as mobileDetectionHook } from './useMobileDetection';
