import type { Metric } from 'web-vitals';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface PerformanceMetrics {
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
}

const metrics: PerformanceMetrics = {
  cls: null,
  inp: null,
  fcp: null,
  lcp: null,
  ttfb: null,
};

const handleMetric = (metric: Metric) => {
  switch (metric.name) {
    case 'CLS':
      metrics.cls = metric.value;
      break;
    case 'INP':
      metrics.inp = metric.value;
      break;
    case 'FCP':
      metrics.fcp = metric.value;
      break;
    case 'LCP':
      metrics.lcp = metric.value;
      break;
    case 'TTFB':
      metrics.ttfb = metric.value;
      break;
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.warn(`[Performance] ${metric.name}:`, metric.value);
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    // You can send to analytics service here
    // Example: sendToAnalytics(metric);
  }
};

export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  const callback = onPerfEntry || handleMetric;

  onCLS(callback);
  onINP(callback);
  onFCP(callback);
  onLCP(callback);
  onTTFB(callback);
};

export const getMetrics = (): PerformanceMetrics => {
  return { ...metrics };
};

export const logPerformanceMetrics = () => {
  const currentMetrics = getMetrics();

  if (import.meta.env.DEV) {
    console.warn('Performance Metrics:', currentMetrics);
  }

  return currentMetrics;
};

// Mark performance events
export const markPerformance = (name: string) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
};

export const measurePerformance = (name: string, startMark: string, endMark?: string) => {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }

      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (import.meta.env.DEV) {
        console.warn(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
      }

      return measure.duration;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
    }
  }
  return null;
};
