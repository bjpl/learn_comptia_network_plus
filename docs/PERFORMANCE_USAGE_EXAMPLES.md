# Performance Optimization - Usage Examples

## Quick Reference Guide

This document provides practical examples for using the performance optimization features in the CompTIA Network+ Learning Platform.

---

## 1. Lazy Loading Components

### Basic Lazy Loading

```typescript
import React from 'react';

// ❌ Bad: Eager loading (loads immediately)
import HeavyComponent from './HeavyComponent';

// ✅ Good: Lazy loading (loads on demand)
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </React.Suspense>
  );
}
```

### Using LazyLoadWrapper

```typescript
import { LazyLoadWrapper } from '@/components/shared/LazyLoadWrapper';

function FeaturePage() {
  return (
    <LazyLoadWrapper
      loader={() => import('./ExpensiveFeature')}
      fallback={<CustomLoadingState />} // Optional
    />
  );
}
```

---

## 2. Loading States

### LoadingSpinner Component

```typescript
import { LoadingSpinner, LoadingSpinnerSmall } from '@/components/shared/LoadingSpinner';

// Full page loading
function PageLoader() {
  return <LoadingSpinner />;
}

// Inline loading
function InlineLoader() {
  return (
    <div className="flex justify-center p-4">
      <LoadingSpinnerSmall />
    </div>
  );
}
```

### Custom Loading States

```typescript
function CustomLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600">Loading network topology...</p>
    </div>
  );
}
```

---

## 3. Optimized Images

### OptimizedImage Component

```typescript
import { OptimizedImage } from '@/components/shared/OptimizedImage';

function NetworkDiagram() {
  return (
    <OptimizedImage
      src="/diagrams/network-topology.png"
      alt="Network topology diagram"
      width={800}
      height={600}
      loading="lazy"  // Native lazy loading
      className="rounded-lg shadow-md"
    />
  );
}
```

### With Loading States

```typescript
function ImageWithLoader() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && <LoadingSpinnerSmall />}
      <OptimizedImage
        src="/images/connector.jpg"
        alt="RJ45 connector"
        width={400}
        height={300}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
```

---

## 4. Virtual Lists

### Basic Virtual List

```typescript
import { VirtualList } from '@/components/shared/VirtualList';

interface NetworkDevice {
  id: string;
  name: string;
  ipAddress: string;
}

function DeviceList({ devices }: { devices: NetworkDevice[] }) {
  return (
    <VirtualList
      items={devices}
      renderItem={(device) => (
        <div className="p-4 border-b">
          <h3>{device.name}</h3>
          <p>{device.ipAddress}</p>
        </div>
      )}
      estimateSize={80}  // Approximate item height
      height="600px"
    />
  );
}
```

### Advanced Virtual List

```typescript
function AdvancedVirtualList() {
  const largeDataset = useMemo(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Device ${i}`,
      status: i % 2 === 0 ? 'online' : 'offline'
    })),
    []
  );

  return (
    <VirtualList
      items={largeDataset}
      renderItem={(item, index) => (
        <div
          className={`p-4 ${item.status === 'online' ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-sm text-gray-600">#{index}</span>
        </div>
      )}
      estimateSize={60}
      height="800px"
      className="border rounded-lg"
    />
  );
}
```

---

## 5. Web Workers

### Subnet Calculation Worker

```typescript
import { workerManager } from '@/utils/workerManager';
import { useEffect, useState } from 'react';

function SubnetCalculator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateSubnet = (ip: string, cidr: number) => {
    setLoading(true);

    workerManager.calculateSubnet(
      ip,
      cidr,
      (subnetResult) => {
        setResult(subnetResult);
        setLoading(false);
      },
      (error) => {
        console.error('Worker error:', error);
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <button onClick={() => calculateSubnet('192.168.1.0', 24)}>
        Calculate Subnet
      </button>
      {loading && <LoadingSpinnerSmall />}
      {result && (
        <div>
          <p>Network: {result.network}</p>
          <p>Broadcast: {result.broadcast}</p>
          <p>Hosts: {result.hosts}</p>
        </div>
      )}
    </div>
  );
}
```

### Binary Conversion Worker

```typescript
function BinaryConverter() {
  const [binary, setBinary] = useState('');

  const convertToBinary = (decimal: number) => {
    workerManager.calculateBinary(
      decimal,
      (result) => {
        setBinary(result);
      },
      (error) => {
        console.error('Conversion failed:', error);
      }
    );
  };

  return (
    <div>
      <input
        type="number"
        onChange={(e) => convertToBinary(parseInt(e.target.value))}
      />
      <p>Binary: {binary}</p>
    </div>
  );
}
```

### Custom Worker Task

```typescript
function DataProcessor() {
  const processLargeData = async (data: any[]) => {
    workerManager.processData(
      data,
      (processedData) => {
        console.log('Data processed:', processedData);
      },
      (error) => {
        console.error('Processing failed:', error);
      }
    );
  };

  return (
    <button onClick={() => processLargeData(largeArray)}>
      Process Data in Background
    </button>
  );
}
```

---

## 6. Performance Monitoring

### Track Web Vitals

```typescript
// In main.tsx (already implemented)
import { reportWebVitals } from './utils/performance';

reportWebVitals((metric) => {
  // Send to analytics
  console.log(`[Web Vitals] ${metric.name}:`, metric.value);

  // Optional: Send to analytics service
  // analytics.track('web_vitals', {
  //   name: metric.name,
  //   value: metric.value,
  //   id: metric.id,
  // });
});
```

### Custom Performance Marks

```typescript
import { markPerformance, measurePerformance } from '@/utils/performance';

function HeavyComponent() {
  useEffect(() => {
    // Mark start
    markPerformance('heavy-component-mount');

    return () => {
      // Mark end and measure
      markPerformance('heavy-component-unmount');
      measurePerformance(
        'heavy-component-lifetime',
        'heavy-component-mount',
        'heavy-component-unmount'
      );
    };
  }, []);

  return <div>Heavy Component</div>;
}
```

### Performance Logging

```typescript
import { logPerformanceMetrics } from '@/utils/performance';

function PerformanceDashboard() {
  const showMetrics = () => {
    const metrics = logPerformanceMetrics();
    console.table(metrics);
  };

  return (
    <button onClick={showMetrics}>
      Show Performance Metrics
    </button>
  );
}
```

---

## 7. Component Optimization

### React.memo for Expensive Components

```typescript
import { memo } from 'react';

interface DeviceCardProps {
  device: NetworkDevice;
  onSelect: (id: string) => void;
}

// ❌ Bad: Re-renders on every parent update
function DeviceCard({ device, onSelect }: DeviceCardProps) {
  return (
    <div onClick={() => onSelect(device.id)}>
      {device.name}
    </div>
  );
}

// ✅ Good: Only re-renders when props change
export const DeviceCard = memo(({ device, onSelect }: DeviceCardProps) => {
  return (
    <div onClick={() => onSelect(device.id)}>
      {device.name}
    </div>
  );
});
```

### useMemo for Expensive Calculations

```typescript
import { useMemo } from 'react';

function NetworkAnalyzer({ devices }: { devices: NetworkDevice[] }) {
  // ❌ Bad: Recalculates on every render
  const statistics = calculateNetworkStats(devices);

  // ✅ Good: Only recalculates when devices change
  const statistics = useMemo(
    () => calculateNetworkStats(devices),
    [devices]
  );

  return (
    <div>
      <p>Total Devices: {statistics.total}</p>
      <p>Online: {statistics.online}</p>
      <p>Offline: {statistics.offline}</p>
    </div>
  );
}
```

### useCallback for Event Handlers

```typescript
import { useCallback, useState } from 'react';

function DeviceManager() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);

  // ❌ Bad: Creates new function on every render
  const handleDeviceSelect = (id: string) => {
    setDevices(prev => prev.map(d =>
      d.id === id ? { ...d, selected: true } : d
    ));
  };

  // ✅ Good: Memoized function
  const handleDeviceSelect = useCallback((id: string) => {
    setDevices(prev => prev.map(d =>
      d.id === id ? { ...d, selected: true } : d
    ));
  }, []);

  return (
    <div>
      {devices.map(device => (
        <DeviceCard
          key={device.id}
          device={device}
          onSelect={handleDeviceSelect}
        />
      ))}
    </div>
  );
}
```

---

## 8. Service Worker

### Check Service Worker Status

```typescript
function ServiceWorkerStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`badge ${isOnline ? 'badge-success' : 'badge-warning'}`}>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
}
```

### Update Service Worker

```typescript
function ServiceWorkerUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          setUpdateAvailable(true);
        });
      });
    }
  }, []);

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      });
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-lg shadow-lg">
      <p className="mb-2">New version available!</p>
      <button onClick={updateApp} className="btn btn-sm">
        Update Now
      </button>
    </div>
  );
}
```

---

## 9. Route Prefetching

### Prefetch Next Route

```typescript
import { useEffect } from 'react';

function HomePage() {
  useEffect(() => {
    // Prefetch likely next page
    const prefetchTimer = setTimeout(() => {
      import('./pages/Dashboard');
    }, 2000); // Prefetch after 2 seconds

    return () => clearTimeout(prefetchTimer);
  }, []);

  return <div>Home Page</div>;
}
```

### Prefetch on Hover

```typescript
import { Link } from 'react-router-dom';

function NavigationMenu() {
  const handleMouseEnter = (path: string) => {
    // Prefetch on hover
    switch (path) {
      case '/osi':
        import('@/components/osi/OSIModelExplorer');
        break;
      case '/cloud':
        import('@/components/cloud/CloudArchitectureDesigner');
        break;
    }
  };

  return (
    <nav>
      <Link
        to="/osi"
        onMouseEnter={() => handleMouseEnter('/osi')}
      >
        OSI Model
      </Link>
      <Link
        to="/cloud"
        onMouseEnter={() => handleMouseEnter('/cloud')}
      >
        Cloud Architecture
      </Link>
    </nav>
  );
}
```

---

## 10. Error Boundaries with Performance

### Performance-Aware Error Boundary

```typescript
import { Component, ReactNode } from 'react';
import { markPerformance } from '@/utils/performance';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PerformanceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    markPerformance('error-boundary-caught');
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Performance Error Boundary caught:', error, errorInfo);

    // Log to analytics
    if (import.meta.env.PROD) {
      // analytics.track('error', {
      //   error: error.message,
      //   stack: error.stack,
      //   componentStack: errorInfo.componentStack,
      // });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">
            Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Best Practices Checklist

### Do's ✅

- [ ] Use lazy loading for routes and heavy components
- [ ] Implement loading states for better UX
- [ ] Optimize images with lazy loading
- [ ] Use virtual lists for large datasets (>100 items)
- [ ] Offload heavy computations to web workers
- [ ] Monitor performance with Web Vitals
- [ ] Use React.memo for expensive components
- [ ] Implement useMemo for expensive calculations
- [ ] Use useCallback for event handlers
- [ ] Prefetch likely next routes

### Don'ts ❌

- [ ] Don't import entire libraries eagerly
- [ ] Don't render large lists without virtualization
- [ ] Don't perform heavy calculations in render
- [ ] Don't create new functions in render
- [ ] Don't forget loading states
- [ ] Don't skip performance monitoring
- [ ] Don't use inline functions in props
- [ ] Don't mutate state directly

---

## Performance Testing Commands

```bash
# Development with performance monitoring
npm run dev
# Check console for Web Vitals

# Production build with analysis
npm run build
# Opens bundle visualizer automatically

# Preview production build
npm run preview
# Test production performance

# Run Lighthouse audit
npx lighthouse http://localhost:4173 --view --output html

# Test on slow 3G network
npx lighthouse http://localhost:4173 --throttling.cpuSlowdownMultiplier=4 --throttling-method=devtools

# Generate performance report
npx lighthouse http://localhost:4173 --output json --output-path ./performance-report.json
```

---

## Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Last Updated**: 2025-01-29
**Version**: 1.0.0
