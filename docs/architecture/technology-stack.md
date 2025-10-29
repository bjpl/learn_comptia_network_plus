# Technology Stack - CompTIA Network+ Learning Platform

## Stack Overview

This document provides detailed justification for every technology choice in the learning platform stack, organized by layer and purpose.

---

## Frontend Stack

### Core Framework

#### React 18.2+ with TypeScript 5.3+

**Purpose**: Primary UI framework
**Package**: `react@18.2.0`, `react-dom@18.2.0`, `typescript@5.3.0`

**Justification**:
- **Concurrent Features**: Automatic batching, transitions, and Suspense for smooth UX
- **Component Model**: Perfect for 23 complex interactive components
- **TypeScript Integration**: Excellent type inference for props, hooks, and context
- **Ecosystem**: Unmatched library support for our specialized needs
- **Developer Experience**: Fast Refresh, excellent DevTools
- **Long-term Support**: Backed by Meta, large community

**Key Features Used**:
- `useTransition` - Non-blocking state updates for animations
- `useDeferredValue` - Keep UI responsive during expensive calculations
- `Suspense` - Code splitting and lazy loading
- `startTransition` - Prioritize user input over background updates

**Alternatives Rejected**:
- Vue 3: Smaller ecosystem for 3D/visualization libraries
- Svelte: Limited enterprise-scale educational platform examples
- Angular: Overkill complexity, steeper learning curve

---

### State Management

#### Zustand 4.x

**Purpose**: Global client state management
**Package**: `zustand@4.4.0`

**Justification**:
- **Minimal Boilerplate**: Define stores in ~10 lines vs Redux's 50+
- **No Provider Hell**: Access stores anywhere without wrapping components
- **TypeScript Support**: Excellent type inference with minimal annotations
- **DevTools**: Redux DevTools integration for debugging
- **Bundle Size**: 1.2 KB vs Redux 3.1 KB + 5.4 KB (Redux Toolkit)
- **Learning Curve**: Team can be productive in 30 minutes

**Usage Examples**:
```typescript
// Learning progress store
import create from 'zustand'

interface ProgressState {
  completedComponents: Set<string>
  currentObjective: string
  markComplete: (componentId: string) => void
}

export const useProgress = create<ProgressState>((set) => ({
  completedComponents: new Set(),
  currentObjective: 'LO-1.0',
  markComplete: (id) => set((state) => ({
    completedComponents: new Set(state.completedComponents).add(id)
  }))
}))
```

**Stores Planned**:
- `useAuthStore` - User authentication state
- `useProgressStore` - Learning progress tracking
- `useThemeStore` - UI theme and preferences
- `useGamificationStore` - Badges, achievements, streaks

**Alternatives Rejected**:
- Redux Toolkit: Too much boilerplate for this project size
- Jotai: Atom-based model is overkill for our needs
- Recoil: Still experimental, Facebook's internal use only

#### React Query 5.x (TanStack Query)

**Purpose**: Server state management
**Package**: `@tanstack/react-query@5.0.0`

**Justification**:
- **Automatic Caching**: Reduce backend load with intelligent caching
- **Background Refetching**: Keep data fresh without user action
- **Optimistic Updates**: Instant UI feedback before server confirms
- **Request Deduplication**: Prevent duplicate API calls
- **Retry Logic**: Automatic retry on network failures
- **TypeScript Integration**: Fully typed with excellent inference

**Key Features Used**:
```typescript
// Progress tracking with optimistic updates
const { mutate } = useMutation({
  mutationFn: (data) => api.post('/progress', data),
  onMutate: async (newProgress) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['progress'] })

    // Snapshot previous value
    const previous = queryClient.getQueryData(['progress'])

    // Optimistically update
    queryClient.setQueryData(['progress'], old => ({
      ...old,
      ...newProgress
    }))

    return { previous }
  },
  onError: (err, newProgress, context) => {
    // Rollback on error
    queryClient.setQueryData(['progress'], context.previous)
  }
})
```

**Cache Configuration**:
- User profile: 5 minutes stale time
- Progress data: 1 minute stale time
- Learning objectives: Infinite (static data)
- Assessments: No cache (always fresh)

**Alternatives Rejected**:
- SWR: Less feature-complete, smaller ecosystem
- Apollo Client: GraphQL-only, overkill for REST API
- RTK Query: Tied to Redux, unnecessary coupling

---

### UI Component Libraries

#### Tailwind CSS 3.x

**Purpose**: Utility-first CSS framework
**Package**: `tailwindcss@3.3.0`

**Justification**:
- **Rapid Development**: Build responsive UIs without leaving HTML
- **Consistency**: Design system enforced through configuration
- **Performance**: Automatic purging removes unused styles (tiny CSS)
- **Customization**: Full control over design tokens
- **Dark Mode**: Built-in dark mode support with `class` strategy
- **TypeScript Integration**: Typed class names with plugins

**Configuration Strategy**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        network: {
          osi: {
            physical: '#e11d48',
            datalink: '#ea580c',
            network: '#ca8a04',
            transport: '#16a34a',
            session: '#0891b2',
            presentation: '#2563eb',
            application: '#7c3aed'
          }
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'packet-flow': 'flow 3s ease-in-out infinite'
      }
    }
  }
}
```

**Alternatives Rejected**:
- CSS-in-JS (Emotion/Styled Components): Runtime performance cost
- Bootstrap: Too opinionated, harder to customize
- Material UI: Heavy bundle, React 17 incompatibilities

#### Radix UI (Primitives)

**Purpose**: Accessible, unstyled UI components
**Package**: `@radix-ui/react-*@1.0.0`

**Justification**:
- **Accessibility**: WCAG 2.1 AA compliant out of the box
- **Unstyled**: Full control with Tailwind CSS styling
- **Composable**: Build complex components from primitives
- **Keyboard Navigation**: Arrow keys, tab, escape all work correctly
- **Screen Reader Support**: Proper ARIA attributes
- **Focus Management**: Focus trap, focus restoration

**Components Used**:
- `@radix-ui/react-accordion` - OSI Layer Explanation Builder (Component 1)
- `@radix-ui/react-dialog` - Modals for detailed explanations
- `@radix-ui/react-dropdown-menu` - Function selectors, device configs
- `@radix-ui/react-progress` - Progress bars in dashboard
- `@radix-ui/react-tabs` - Tabbed interfaces in simulators
- `@radix-ui/react-tooltip` - Hint systems throughout
- `@radix-ui/react-slider` - Playback speed controls (Component 2)
- `@radix-ui/react-select` - Dropdown menus with search

**Alternatives Rejected**:
- Headless UI: Tailwind-specific, less flexible
- React Aria: More verbose API
- Reach UI: Less active development

#### Lucide React (Icons)

**Purpose**: Icon library
**Package**: `lucide-react@0.292.0`

**Justification**:
- **Tree-shakeable**: Import only icons you use
- **Consistent Design**: Clean, modern aesthetic
- **Customizable**: Full control over size, color, stroke
- **Accessibility**: Proper ARIA labels support
- **Bundle Size**: ~1 KB per icon (optimized SVGs)
- **1000+ Icons**: Comprehensive coverage for network devices

**Icon Sets Needed**:
- Network devices: Router, Server, HardDrive, Database, Wifi
- Protocols: Lock (security), Zap (speed), Shield (firewall)
- UI: Check, X, AlertTriangle, Info, Play, Pause, Settings

**Alternatives Rejected**:
- React Icons: Larger bundle, multiple icon sets mixed
- Heroicons: Smaller set, missing network-specific icons
- Font Awesome: Font-based (accessibility issues), heavy bundle

---

### Visualization Libraries

#### React Three Fiber 8.x + Three.js

**Purpose**: 3D rendering for connector identification lab
**Package**: `@react-three/fiber@8.15.0`, `three@0.159.0`, `@react-three/drei@9.92.0`

**Justification**:
- **Declarative 3D**: Write Three.js scenes with React components
- **Performance**: Direct WebGL rendering, 60 FPS target
- **React Integration**: Hooks, context, and state work normally
- **Drei Helpers**: Pre-built controls, cameras, loaders
- **TypeScript Support**: Full type coverage
- **Active Development**: Weekly updates, responsive maintainers

**Use Case: Component 13 (Connector Identification Lab)**:
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'

function ConnectorLab() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 5]} angle={0.15} penumbra={1} />

      <ConnectorModel
        type="RJ45"
        scale={2}
        onRotate={(angle) => checkAnswer(angle)}
      />

      <OrbitControls
        enableZoom={true}
        minDistance={2}
        maxDistance={10}
      />

      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.4}
        scale={10}
      />

      <Environment preset="studio" />
    </Canvas>
  )
}
```

**Features**:
- 360° rotation with OrbitControls
- X-ray mode (material transparency)
- Zoom 50%-400%
- Side-by-side comparison (multiple Canvas instances)
- Pin layout visualization

**3D Models**:
- Format: GLTF/GLB (compressed)
- Source: Custom-modeled or purchased from TurboSquid
- Optimization: Under 500 KB per model
- LOD (Level of Detail): Multiple quality levels

**Alternatives Rejected**:
- Babylon.js: Heavier bundle, less React-friendly
- PlayCanvas: Engine-focused, overkill for static models
- A-Frame: WebVR-focused, declarative but less flexible

#### React Flow 11.x

**Purpose**: Node-based diagrams and network topologies
**Package**: `reactflow@11.10.0`

**Justification**:
- **Built for Graphs**: Optimized for node-edge diagrams
- **Drag and Drop**: Built-in drag, pan, zoom
- **Custom Nodes**: Full control over node appearance
- **Edge Animations**: Packet flow visualization
- **Minimap**: Overview for large topologies
- **Auto-layout**: Dagre, Elk integration for automatic positioning
- **Performance**: Handles 1000+ nodes with virtualization

**Use Cases**:
- Component 2: Packet Journey Simulator (OSI layers as nodes)
- Component 6: Network Architecture Simulator (device placement)
- Component 15: Topology Comparison Analyzer (mesh, star, spine-leaf)
- Component 16: Topology Transformation Tool (animated transitions)

**Custom Node Types**:
```tsx
// Router node with configuration panel
const RouterNode = ({ data }) => {
  return (
    <div className="router-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-content">
        <RouterIcon className="w-8 h-8" />
        <span>{data.label}</span>
        <Badge variant="success">Active</Badge>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = {
  router: RouterNode,
  switch: SwitchNode,
  firewall: FirewallNode,
  // ... 10+ device types
}
```

**Edge Animations**:
```tsx
// Animated packet flow
const AnimatedEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY })

  return (
    <>
      <path d={edgePath} className="react-flow__edge-path" />
      <circle r="3" fill="blue">
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath href={`#${edgePath}`} />
        </animateMotion>
      </circle>
    </>
  )
}
```

**Alternatives Rejected**:
- Cytoscape.js: Non-React API, harder to integrate
- Vis.js: Older library, less active development
- D3.js Force Layout: Too low-level, would need to build everything

#### Recharts 2.x

**Purpose**: Data visualization for progress dashboard
**Package**: `recharts@2.10.0`

**Justification**:
- **React-First**: Components instead of imperative API
- **Responsive**: Automatic responsive container
- **Customizable**: Full control over styling
- **TypeScript**: Excellent type definitions
- **Bundle Size**: Reasonable at ~100 KB
- **Accessibility**: Keyboard navigation, ARIA support

**Use Case: Component 23 (Progress Tracking Dashboard)**:
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function PerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

**Chart Types Used**:
- **Line Chart**: Performance over time
- **Radar Chart**: Skill assessment across learning objectives
- **Bar Chart**: Component completion status
- **Pie Chart**: Time distribution across topics
- **Heatmap** (custom): Mistake pattern visualization

**Alternatives Rejected**:
- Chart.js: Non-React API, requires wrappers
- Victory: Heavier bundle, less performant
- Nivo: Beautiful but slower, larger bundle

#### Framer Motion 10.x

**Purpose**: Animation library
**Package**: `framer-motion@10.16.0`

**Justification**:
- **Best-in-Class**: Industry-leading React animation library
- **Layout Animations**: Automatic FLIP animations
- **Gesture Support**: Drag, pan, hover, tap
- **Variants System**: Orchestrate complex animations
- **Performance**: Uses CSS transforms and Web Animations API
- **Accessibility**: Respects `prefers-reduced-motion`
- **TypeScript**: Full type coverage

**Animation Use Cases**:

**1. Page Transitions**:
```tsx
import { motion, AnimatePresence } from 'framer-motion'

function PageTransition({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

**2. Packet Flow Animation (Component 2)**:
```tsx
const packetVariants = {
  start: { x: 0, scale: 1 },
  layer1: { x: 100, scale: 1.1 },
  layer2: { x: 200, scale: 1.2 },
  // ... through layer 7
  end: { x: 700, scale: 1 }
}

<motion.div
  className="packet"
  variants={packetVariants}
  animate={currentLayer}
  transition={{ duration: 0.5 }}
/>
```

**3. Card Flip (Flashcards)**:
```tsx
const [isFlipped, setIsFlipped] = useState(false)

<motion.div
  animate={{ rotateY: isFlipped ? 180 : 0 }}
  transition={{ duration: 0.6 }}
  style={{ transformStyle: 'preserve-3d' }}
  onClick={() => setIsFlipped(!isFlipped)}
>
  <CardFront />
  <CardBack />
</motion.div>
```

**4. Stagger Effects (Lists)**:
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

**Alternatives Rejected**:
- React Spring: More complex API, steeper learning curve
- CSS Animations: Limited control, hard to orchestrate
- GSAP: Imperative API, less React-friendly

#### DnD Kit 6.x

**Purpose**: Drag and drop functionality
**Package**: `@dnd-kit/core@6.0.0`, `@dnd-kit/sortable@7.0.0`

**Justification**:
- **Modern**: Built for React 18, uses hooks extensively
- **Accessible**: Keyboard navigation, screen reader support
- **Performance**: Faster than React DnD (no Redux)
- **Collision Detection**: Multiple algorithms built-in
- **Sensors**: Mouse, touch, keyboard all supported
- **Virtual Lists**: Works with react-window/virtuoso
- **TypeScript**: Excellent type definitions

**Use Cases**:

**1. Device Placement (Component 6)**:
```tsx
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'

function NetworkCanvas() {
  const [devices, setDevices] = useState([])

  const handleDragEnd = (event) => {
    const { active, over } = event

    setDevices(prev => [
      ...prev,
      {
        id: active.id,
        type: active.data.current.type,
        position: over.data.current.position
      }
    ])
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <DeviceLibrary />
      <CanvasDropzone />
    </DndContext>
  )
}
```

**2. Sortable Lists (Layer Ordering - Component 1)**:
```tsx
import { SortableContext, useSortable } from '@dnd-kit/sortable'

function LayerSort() {
  const [layers, setLayers] = useState([...osiLayers])

  return (
    <SortableContext items={layers}>
      {layers.map(layer => (
        <SortableLayer key={layer.id} layer={layer} />
      ))}
    </SortableContext>
  )
}
```

**3. Matching Game (Component 14)**:
```tsx
// Drag transceivers to matching slots
<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleMatch}
>
  <TransceiverList />
  <MatchingSlots />
</DndContext>
```

**Alternatives Rejected**:
- React DnD: Older architecture, Redux dependency
- React Beautiful DnD: No longer maintained
- Interact.js: Non-React API

---

### Form Handling

#### React Hook Form 7.x

**Purpose**: Form state management and validation
**Package**: `react-hook-form@7.48.0`

**Justification**:
- **Performance**: Uncontrolled components reduce re-renders
- **Validation**: Built-in rules + custom validation
- **Bundle Size**: 24 KB (smallest in class)
- **TypeScript**: Excellent type inference
- **Developer Experience**: Minimal boilerplate

**Use Cases**:
- Component 1: Layer Explanation Builder (complex multi-section form)
- Component 17: Subnet Designer (IP address validation)
- All assessment submissions

**Example**:
```tsx
import { useForm } from 'react-hook-form'

function SubnetForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange'
  })

  const onSubmit = (data) => {
    submitSubnetDesign(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('ipAddress', {
          required: 'IP address required',
          pattern: {
            value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
            message: 'Invalid IP address format'
          }
        })}
      />
      {errors.ipAddress && <span>{errors.ipAddress.message}</span>}

      <input
        {...register('cidr', {
          required: true,
          min: { value: 0, message: 'CIDR min 0' },
          max: { value: 32, message: 'CIDR max 32' }
        })}
        type="number"
      />

      <button type="submit">Calculate Subnets</button>
    </form>
  )
}
```

#### Zod 3.x

**Purpose**: Schema validation for forms and API
**Package**: `zod@3.22.0`

**Justification**:
- **Type Inference**: TypeScript types generated from schemas
- **Composable**: Build complex schemas from primitives
- **Error Messages**: Customizable validation messages
- **Runtime Safety**: Validate data at boundaries
- **Bundle Size**: Tree-shakeable, ~13 KB

**Integration with React Hook Form**:
```tsx
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const subnetSchema = z.object({
  ipAddress: z.string()
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP'),
  cidr: z.number().min(0).max(32),
  subnetMask: z.string().optional(),
  usableHosts: z.number().optional()
})

type SubnetFormData = z.infer<typeof subnetSchema>

const { register, handleSubmit } = useForm<SubnetFormData>({
  resolver: zodResolver(subnetSchema)
})
```

**Backend Validation**: Same schemas used on Express endpoints

---

## Build Tools

### Vite 5.x

**Purpose**: Build tool and dev server
**Package**: `vite@5.0.0`

**Justification**:
- **Fast HMR**: Instant updates (< 100ms)
- **Native ESM**: No bundling in development
- **Optimized Builds**: Rollup for production
- **Plugin Ecosystem**: React, TypeScript, PWA, etc.
- **Configuration**: Minimal setup required

**Configuration**:
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          diagrams: ['reactflow'],
          charts: ['recharts']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

### pnpm 8.x

**Purpose**: Package manager
**Package**: `pnpm@8.10.0`

**Justification**:
- **Speed**: 2x faster than npm, 3x faster than Yarn v1
- **Disk Efficiency**: Content-addressable storage (saves GB)
- **Strict Resolution**: Prevents phantom dependencies
- **Monorepo Support**: Built-in workspace support

---

## Testing Stack

### Vitest 1.x

**Purpose**: Unit and integration testing
**Package**: `vitest@1.0.0`

**Justification**:
- **Vite Native**: Shares configuration with Vite
- **Jest Compatible**: Drop-in replacement for Jest
- **Fast**: Parallel test execution, smart caching
- **ESM Support**: Native ES modules (no transform)
- **Watch Mode**: Instant feedback on changes

**Configuration**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
})
```

### React Testing Library 14.x

**Purpose**: Component testing
**Package**: `@testing-library/react@14.1.0`

**Justification**:
- **User-Centric**: Test behavior, not implementation
- **Accessibility First**: Queries mirror how users interact
- **Best Practices**: Encourages maintainable tests

**Example**:
```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('completes port identification exercise', async () => {
  const user = userEvent.setup()
  render(<PortIdentificationGame />)

  // Find port 80 card
  const port80 = screen.getByText('80')

  // Drag to HTTP slot
  const httpSlot = screen.getByRole('region', { name: 'HTTP' })
  await user.click(port80)
  await user.click(httpSlot)

  // Check feedback
  await waitFor(() => {
    expect(screen.getByText('Correct!')).toBeInTheDocument()
  })
})
```

### Playwright 1.x

**Purpose**: End-to-end testing
**Package**: `@playwright/test@1.40.0`

**Justification**:
- **Cross-Browser**: Chromium, Firefox, WebKit
- **Fast Execution**: Parallel tests by default
- **Auto-Wait**: Smart waiting for elements
- **Debugging**: Time-travel debugging, trace viewer

**Example**:
```typescript
import { test, expect } from '@playwright/test'

test('complete learning path', async ({ page }) => {
  await page.goto('/')

  // Start with LO 1.0
  await page.click('text=OSI Model')

  // Complete Layer 1 explanation
  await page.fill('[name="layer1-function"]', 'Physical signaling')
  await page.click('button:has-text("Submit")')

  // Verify progress updated
  await expect(page.locator('.progress-bar')).toHaveAttribute('aria-valuenow', '14')
})
```

---

## Backend Stack

### Node.js 20 LTS + Express 4.x

**Purpose**: API server
**Package**: `express@4.18.0`

**Justification**:
- **JavaScript Consistency**: Full-stack TypeScript
- **Async I/O**: Handle many concurrent connections
- **Middleware Ecosystem**: Authentication, validation, logging
- **Mature**: Battle-tested in production

**Key Middleware**:
- `helmet` - Security headers
- `cors` - CORS configuration
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `morgan` - HTTP logging
- `compression` - Gzip compression

### PostgreSQL 16

**Purpose**: Primary database
**Package**: `pg@8.11.0` (Node.js driver)

**Justification**:
- **ACID Compliance**: Data integrity for user progress
- **JSON/JSONB**: Flexible schemas for component data
- **Performance**: Excellent query optimizer
- **Full-Text Search**: Search learning materials
- **Extensions**: PostGIS (future geolocation features)

### Redis 7

**Purpose**: Caching and session store
**Package**: `redis@4.6.0`

**Justification**:
- **Performance**: In-memory, microsecond latency
- **Data Structures**: Strings, sets, sorted sets, hashes
- **Pub/Sub**: Real-time features
- **TTL Support**: Automatic expiration

---

## Deployment

### Vercel (Frontend)

**Justification**:
- **Optimized for Vite**: Zero-config deployment
- **Edge Network**: Global CDN
- **Preview Deployments**: Every PR gets URL
- **Analytics**: Core Web Vitals tracking

### Railway (Backend + Database)

**Justification**:
- **Starter Plan**: PostgreSQL + Redis included
- **Auto HTTPS**: Certificates managed
- **Easy Scaling**: Horizontal scaling available
- **Environment Variables**: Secure secret management

---

## Development Tools

### ESLint + Prettier

**Purpose**: Code quality and formatting
**Package**: `eslint@8.54.0`, `prettier@3.1.0`

**Configuration**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}
```

### Husky + lint-staged

**Purpose**: Pre-commit hooks
**Package**: `husky@8.0.0`, `lint-staged@15.1.0`

**Configuration**:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Bundle Size Budget

| Category | Budget | Monitoring |
|----------|--------|------------|
| Initial JS | < 200 KB | Lighthouse CI |
| Initial CSS | < 50 KB | Vite bundle analyzer |
| Each route chunk | < 100 KB | Rollup visualizer |
| Images | < 500 KB total | ImageOptim |
| Fonts | < 100 KB | Subsetting |

**Total First Load**: Target < 500 KB gzipped

---

## Summary Table

| Category | Technology | Version | Bundle Impact | Justification |
|----------|-----------|---------|---------------|---------------|
| **Core** |
| Framework | React | 18.2+ | 44 KB | Industry standard, concurrent features |
| Language | TypeScript | 5.3+ | 0 KB | Type safety, maintainability |
| Build Tool | Vite | 5.x | 0 KB | Fastest dev experience |
| Package Manager | pnpm | 8.x | 0 KB | Speed, disk efficiency |
| **State** |
| Global State | Zustand | 4.x | 1.2 KB | Minimal boilerplate |
| Server State | React Query | 5.x | 13 KB | Best server state management |
| **UI** |
| Styling | Tailwind CSS | 3.x | ~30 KB | Utility-first, customizable |
| Components | Radix UI | 1.x | ~10 KB/component | Accessible primitives |
| Icons | Lucide React | 0.292 | ~1 KB/icon | Tree-shakeable |
| **Visualization** |
| 3D | React Three Fiber | 8.x | ~120 KB | Best React 3D library |
| Diagrams | React Flow | 11.x | ~80 KB | Purpose-built for graphs |
| Charts | Recharts | 2.x | ~100 KB | React-friendly charting |
| Animations | Framer Motion | 10.x | ~35 KB | Best animation library |
| Drag & Drop | DnD Kit | 6.x | ~15 KB | Modern, accessible |
| **Forms** |
| Form State | React Hook Form | 7.x | 24 KB | Performant, minimal re-renders |
| Validation | Zod | 3.x | ~13 KB | Type-safe schemas |
| **Testing** |
| Unit Tests | Vitest | 1.x | 0 KB | Vite-native, fast |
| Component Tests | Testing Library | 14.x | 0 KB | Best practices enforced |
| E2E Tests | Playwright | 1.x | 0 KB | Cross-browser, reliable |
| **Backend** |
| Server | Node.js + Express | 20/4.x | N/A | Full-stack JS |
| Database | PostgreSQL | 16 | N/A | ACID, JSON support |
| Cache | Redis | 7 | N/A | Performance, sessions |

**Total Frontend Bundle** (gzipped): ~450 KB (within budget)
