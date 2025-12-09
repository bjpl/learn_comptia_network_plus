# Three.js Components - Quick Reference

## Import Patterns

### For New Components (Recommended)

```tsx
import { Connector3DViewerLazy } from '@/components/media/lazy-exports';

function MyComponent() {
  return (
    <Connector3DViewerLazy
      connectorType="RJ45"
      showLabels={true}
      height="400px"
    />
  );
}
```

### For Custom Lazy Loading

```tsx
import { lazy, Suspense } from 'react';
import { ThreeDLoadingFallback } from '@/components/media/ThreeDLoadingFallback';

const My3DComponent = lazy(() => import('./My3DComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<ThreeDLoadingFallback height="500px" />}>
      <My3DComponent {...props} />
    </Suspense>
  );
}
```

## Available Components

### ThreeDLoadingFallback

Shows loading state while 3D components load.

**Props:**
- `message?: string` - Custom loading message (default: "Loading 3D viewer...")
- `height?: string` - Container height (default: "500px")

**Example:**
```tsx
<ThreeDLoadingFallback
  message="Preparing 3D model..."
  height="600px"
/>
```

### Connector3DViewerLazy

Lazy-loaded 3D connector viewer.

**Props:**
- `connectorType: ConnectorType` - Type of connector to display
- `autoRotate?: boolean` - Enable auto-rotation (default: false)
- `showLabels?: boolean` - Show connector labels (default: true)
- `showControls?: boolean` - Show UI controls (default: true)
- `height?: string` - Canvas height (default: "400px")
- `onToggleFullscreen?: () => void` - Fullscreen toggle handler

**Example:**
```tsx
<Connector3DViewerLazy
  connectorType="RJ45"
  autoRotate={true}
  showLabels={true}
  showControls={true}
  height="600px"
/>
```

### Connector3DCanvas

Isolated Three.js canvas for ConnectorLab.

**Props:**
- `selectedConnector: ConnectorType` - Main connector to display
- `comparisonConnector?: ConnectorType` - Second connector for comparison
- `viewMode: 'normal' | 'xray' | 'comparison'` - Display mode
- `xrayMode: boolean` - Enable x-ray visualization
- `rotation: number` - Rotation angle in radians
- `zoom: number` - Zoom level (0.5 to 4)

**Example:**
```tsx
import { lazy, Suspense } from 'react';
const Connector3DCanvas = lazy(() => import('./Connector3DCanvas'));

<Suspense fallback={<ThreeDLoadingFallback />}>
  <Connector3DCanvas
    selectedConnector="RJ45"
    viewMode="normal"
    xrayMode={false}
    rotation={0}
    zoom={1}
  />
</Suspense>
```

## Connector Types

```typescript
type ConnectorType =
  | 'RJ45'      // Ethernet
  | 'RJ11'      // Telephone
  | 'SC'        // Fiber optic
  | 'LC'        // Fiber optic
  | 'ST'        // Fiber optic
  | 'MPO'       // Multi-fiber
  | 'F-type'    // Coaxial
  | 'BNC'       // Coaxial
  | 'USB-A'     // USB Type-A
  | 'USB-C';    // USB Type-C
```

## File Locations

```
src/components/media/
├── Connector3DCanvas.tsx         - Isolated 3D canvas
├── Connector3DViewer.tsx         - Reusable 3D viewer
├── Connector3DViewerLazy.tsx     - Lazy wrapper
├── ConnectorLab.tsx              - Main lab component
├── ThreeDLoadingFallback.tsx     - Loading component
├── lazy-exports.ts               - Centralized exports
└── models/
    ├── RJ45Connector.tsx
    ├── FiberOpticConnector.tsx
    ├── CoaxialConnector.tsx
    └── USBConnector.tsx
```

## Best Practices

### ✅ DO

```tsx
// Use lazy loading for 3D components
const My3D = lazy(() => import('./My3DComponent'));

// Always wrap with Suspense
<Suspense fallback={<ThreeDLoadingFallback />}>
  <My3D />
</Suspense>

// Use provided lazy wrappers
import { Connector3DViewerLazy } from '@/components/media/lazy-exports';
```

### ❌ DON'T

```tsx
// Don't import Three.js directly in non-3D components
import * as THREE from 'three';

// Don't forget Suspense boundary
<My3DComponent /> // Missing Suspense!

// Don't import Canvas directly
import { Canvas } from '@react-three/fiber'; // In main bundle!
```

## Performance Tips

1. **Preload on hover** (advanced):
```tsx
const preload3D = () => import('./Connector3DCanvas');

<button
  onMouseEnter={preload3D}
  onClick={() => setShow3D(true)}
>
  Show 3D
</button>
```

2. **Lazy load per route**:
```tsx
const ConnectorLabPage = lazy(() => import('./pages/ConnectorLab'));
```

3. **Bundle analysis**:
```bash
npm run build -- --report
```

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Check import path matches file location

### Issue: Loading state never resolves
**Solution:** Verify Suspense boundary exists and fallback is provided

### Issue: Three.js in main bundle
**Solution:** Ensure using lazy import, not direct import

### Issue: Types not found
**Solution:** Run `npm run typecheck` to verify types

## Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Connector3DViewerLazy } from '@/components/media/lazy-exports';

test('shows loading state', () => {
  render(<Connector3DViewerLazy connectorType="RJ45" />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

## Additional Resources

- [Full Documentation](/docs/THREE_JS_OPTIMIZATION.md)
- [Implementation Summary](/docs/IMPLEMENTATION_SUMMARY.md)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Three.js Docs](https://threejs.org/docs/)
