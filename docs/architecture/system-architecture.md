# System Architecture - CompTIA Network+ N10-009 Interactive Learning Platform

## Executive Summary

This document presents the comprehensive system architecture for a web-based interactive learning platform targeting CompTIA Network+ N10-009 certification preparation. The platform features 23 distinct interactive components spanning OSI model education, network troubleshooting simulation, cloud architecture design, and modern networking technologies.

## Architecture Decision Record (ADR)

### ADR-001: Frontend Framework Selection

**Status**: Recommended
**Decision**: **React 18+ with TypeScript**
**Date**: 2025-10-28

#### Context
The platform requires 23 highly interactive components with complex state management, real-time visualizations, 3D rendering, animation sequences, and extensive form validation. Components range from simple flashcards to sophisticated network simulators with drag-and-drop interfaces.

#### Decision Drivers
1. Component complexity and reusability requirements
2. Rich ecosystem for visualization libraries
3. Strong TypeScript support for maintainability
4. Performance requirements for animations and simulations
5. Developer experience and learning curve
6. Long-term maintainability and community support

#### Considered Options

**Option A: React 18+ with TypeScript** ✅ SELECTED
- **Pros**:
  - Mature component model with hooks for complex state
  - Extensive ecosystem: React Three Fiber (3D), D3.js integration, React Flow (diagrams)
  - Concurrent rendering for smooth animations
  - Strong TypeScript support with excellent IDE integration
  - Large talent pool and extensive documentation
  - React DnD and React Beautiful DnD for drag-and-drop
  - Suspense and code-splitting for performance
- **Cons**:
  - Larger bundle size than alternatives
  - Requires additional libraries for state management
  - Boilerplate overhead for simple components

**Option B: Vue 3 with TypeScript**
- **Pros**:
  - Simpler learning curve
  - Built-in reactivity system
  - Smaller bundle size
  - Good TypeScript support
- **Cons**:
  - Smaller ecosystem for specialized visualization libraries
  - Less mature 3D rendering solutions (TresJS is newer)
  - Fewer enterprise-scale examples for educational platforms

**Option C: Svelte with TypeScript**
- **Pros**:
  - Smallest bundle size
  - Built-in animations
  - Excellent performance
  - Cleaner syntax
- **Cons**:
  - Smallest ecosystem for specialized needs
  - Limited 3D rendering libraries
  - Smaller talent pool
  - Less mature tooling for large-scale applications

#### Justification
React provides the best balance of:
- **Ecosystem maturity**: Critical libraries like React Three Fiber (3D connector lab), D3.js wrappers (network diagrams), React Flow (topology builders) are production-ready
- **Component architecture**: Perfect fit for atomic design with 23+ reusable components
- **Performance**: Concurrent rendering handles complex animations without blocking UI
- **TypeScript integration**: Excellent type safety for complex component props and state
- **Long-term viability**: Largest community ensures continued support and updates

### ADR-002: Component Architecture Pattern

**Status**: Recommended
**Decision**: **Atomic Design with Feature-Sliced Design (FSD)**
**Date**: 2025-10-28

#### Architecture Layers

```
src/
├── app/                          # Application layer (routing, providers)
├── pages/                        # Page-level components (learning objectives)
├── widgets/                      # Complex feature widgets (23 components)
├── features/                     # Reusable feature modules
│   ├── subnet-calculator/
│   ├── port-scanner/
│   ├── topology-builder/
│   └── osi-visualizer/
├── entities/                     # Business entities
│   ├── network-device/
│   ├── protocol/
│   ├── topology/
│   └── user-progress/
├── shared/                       # Shared utilities
│   ├── ui/                       # Atomic design components
│   │   ├── atoms/                # Buttons, inputs, icons
│   │   ├── molecules/            # Input groups, cards
│   │   ├── organisms/            # Forms, navigation
│   │   └── templates/            # Page layouts
│   ├── lib/                      # Utilities and helpers
│   ├── api/                      # API clients
│   └── config/                   # Configuration
└── processes/                    # Complex business flows
    ├── osi-learning-path/
    └── certification-assessment/
```

#### Justification
- **Atomic Design**: Provides clear component hierarchy for UI consistency
- **Feature-Sliced Design**: Organizes business logic around features/entities
- **Scalability**: 23 components require clear separation of concerns
- **Reusability**: Many shared patterns (drag-drop, animations, validation)
- **Maintainability**: Clear boundaries prevent component coupling

### ADR-003: State Management Strategy

**Status**: Recommended
**Decision**: **Zustand + React Query + Context API (Hybrid Approach)**
**Date**: 2025-10-28

#### State Categories

**1. Server State → React Query v5**
- User progress tracking (persistence to backend)
- Component completion status
- Assessment scores and analytics
- User preferences and settings
- **Rationale**: Automatic caching, background refetching, optimistic updates

**2. Global Client State → Zustand**
- Current learning objective
- Active component state
- Theme and UI preferences
- Gamification progress (badges, achievements)
- **Rationale**: Minimal boilerplate, excellent TypeScript support, no provider hell

**3. Local Component State → useState/useReducer**
- Form inputs and validation
- Animation states
- Modal visibility
- Temporary UI states
- **Rationale**: React built-ins sufficient for isolated state

**4. Cross-Component Communication → Context API**
- Drag-and-drop coordination
- Multi-step form wizards
- Nested component communication
- **Rationale**: Built-in, lightweight, perfect for component trees

#### Why Not Redux?
- Overkill for this application size
- Excessive boilerplate
- Zustand provides 80% of benefits with 20% of complexity
- React Query handles server state better than Redux + middleware

### ADR-004: Visualization and Animation Libraries

**Status**: Recommended
**Decision**: **Multi-Library Approach by Component Type**
**Date**: 2025-10-28

#### Library Selection by Use Case

**3D Rendering (Components 13: Connector Lab)**
- **Library**: React Three Fiber + Three.js + Drei
- **Rationale**:
  - Industry-standard 3D for web
  - React-friendly declarative API
  - Excellent performance with WebGL
  - Rich helper library (Drei) for controls and lighting
- **Features Needed**:
  - 360° rotation with OrbitControls
  - Zoom capabilities
  - X-ray mode (materials with opacity)
  - Side-by-side comparison viewports

**Network Diagrams (Components 2, 6, 9, 15, 16)**
- **Library**: React Flow (formerly React Flow Chart)
- **Rationale**:
  - Built specifically for node-based diagrams
  - Drag-and-drop out of the box
  - Custom node types for network devices
  - Auto-layout algorithms available
  - Edge animations for packet flow
- **Features Needed**:
  - Custom device nodes (routers, switches, firewalls)
  - Animated edges for traffic simulation
  - Minimap for large topologies
  - Connection validation rules

**Data Visualizations (Component 23: Dashboard)**
- **Library**: Recharts
- **Rationale**:
  - Built on D3.js but React-friendly
  - Responsive charts out of the box
  - TypeScript support
  - Accessible by default
- **Chart Types Needed**:
  - Progress bars
  - Radar charts (skill assessment)
  - Line charts (performance over time)
  - Heatmaps (mistake patterns)

**Animations (All components)**
- **Library**: Framer Motion
- **Rationale**:
  - Best-in-class React animation library
  - Gesture support (drag, pan, zoom)
  - Layout animations
  - Accessibility features (prefers-reduced-motion)
- **Animation Types**:
  - Page transitions
  - Card flips (flashcards)
  - Slide-ins (modals, drawers)
  - Stagger effects (lists)
  - Packet flow animations

**Drag-and-Drop (Components 6, 8, 14)**
- **Library**: DnD Kit
- **Rationale**:
  - Modern alternative to React DnD
  - Better performance
  - Touch support
  - Collision detection algorithms
  - Accessibility features
- **Use Cases**:
  - Device placement on canvas
  - Component matching games
  - Card sorting exercises

### ADR-005: Backend Architecture

**Status**: Recommended
**Decision**: **Node.js + Express + PostgreSQL + Redis**
**Date**: 2025-10-28

#### Backend Requirements Analysis

**Required Functionality**:
1. User authentication and authorization
2. Progress tracking persistence
3. Assessment scoring and analytics
4. Gamification badge system
5. Real-time scenario generation
6. Performance analytics aggregation

#### Technology Stack

**API Server**: Node.js 20 LTS + Express 4.x
- **Rationale**:
  - JavaScript/TypeScript full-stack consistency
  - Excellent async I/O for concurrent users
  - Rich middleware ecosystem
  - Easy WebSocket integration for real-time features

**Database**: PostgreSQL 16
- **Rationale**:
  - ACID compliance for user data integrity
  - JSON/JSONB support for flexible progress schemas
  - Excellent query performance with proper indexing
  - PostGIS extension if geolocation features added later
- **Schema Design**:
  - users (authentication, profiles)
  - learning_objectives (curriculum structure)
  - components (23 interactive components)
  - user_progress (completion tracking)
  - assessments (scoring, attempts)
  - achievements (gamification)

**Cache Layer**: Redis 7
- **Rationale**:
  - Session storage (faster than database)
  - Leaderboard sorting (sorted sets)
  - Rate limiting
  - Real-time analytics aggregation
  - Pub/sub for real-time updates

**File Storage**: Local filesystem or S3-compatible
- For user-generated network diagrams
- Exported configurations
- Certificate/badge images

#### API Design
- RESTful endpoints for CRUD operations
- GraphQL consideration for complex queries (future)
- WebSocket endpoint for real-time collaboration features (future)

### ADR-006: Build Tools and Development Environment

**Status**: Recommended
**Decision**: **Vite + pnpm + TypeScript**
**Date**: 2025-10-28

#### Build Tool: Vite 5

**Rationale**:
- Lightning-fast HMR (Hot Module Replacement)
- Native ES modules in development
- Optimized production builds with Rollup
- Excellent TypeScript support out of the box
- Plugin ecosystem (React, CSS frameworks, etc.)
- Best developer experience for React applications

**Why Not Webpack?**
- Slower development server startup
- More complex configuration
- Slower HMR compared to Vite
- Vite has better defaults for modern development

**Why Not Create React App?**
- Deprecated and no longer maintained
- Slower build times
- Less flexible configuration

#### Package Manager: pnpm

**Rationale**:
- Fastest install times (content-addressable storage)
- Disk space efficiency (shared dependencies)
- Strict dependency resolution (prevents phantom dependencies)
- Monorepo support (if project expands)
- Drop-in npm replacement

#### TypeScript Configuration

**Strict Mode Enabled**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Rationale**: Catch errors at compile time, improve maintainability

### ADR-007: Testing Strategy

**Status**: Recommended
**Decision**: **Vitest + Testing Library + Playwright**
**Date**: 2025-10-28

#### Testing Pyramid

**Unit Tests (70%)**: Vitest + React Testing Library
- **Rationale**:
  - Vitest: Jest-compatible API but faster (uses Vite)
  - Testing Library: Tests behavior, not implementation
  - Focus on utility functions, hooks, components in isolation
- **Coverage Targets**: 80% for shared utilities, 70% for components

**Integration Tests (20%)**: Vitest + MSW (Mock Service Worker)
- **Rationale**:
  - Test feature workflows (multi-step scenarios)
  - MSW intercepts network requests (no backend needed)
  - Test state management integration
- **Coverage Targets**: All critical user flows

**End-to-End Tests (10%)**: Playwright
- **Rationale**:
  - Cross-browser testing (Chromium, Firefox, WebKit)
  - Fast and reliable
  - Excellent debugging tools
  - Component testing mode available
- **Coverage Targets**: Critical paths (auth, progress save, assessment)

#### Additional Tools
- **Visual Regression**: Playwright visual comparisons
- **Accessibility**: axe-core integration in tests
- **Performance**: Lighthouse CI in GitHub Actions

### ADR-008: Deployment Strategy

**Status**: Recommended
**Decision**: **Vercel (Frontend) + Railway/Render (Backend)**
**Date**: 2025-10-28

#### Frontend Deployment: Vercel

**Rationale**:
- Optimized for React/Vite applications
- Automatic CDN distribution
- Instant rollbacks
- Preview deployments for PRs
- Excellent performance with edge functions
- Zero-config for most Vite projects

**Alternatives Considered**:
- Netlify: Similar features, slightly slower edge network
- AWS Amplify: More complex, overkill for this project
- GitHub Pages: No server-side rendering support

#### Backend Deployment: Railway or Render

**Rationale**:
- Both support Node.js + PostgreSQL + Redis
- Simple environment variable management
- Automatic HTTPS
- Database backups included
- Reasonable free tier for MVP
- Easy scaling when needed

**Production Checklist**:
- Environment-based configuration
- Health check endpoints
- Database migration strategy
- Logging and monitoring (Sentry integration)
- CDN for static assets
- Rate limiting and security headers

## System Quality Attributes

### Performance Requirements

**Target Metrics**:
- Initial page load: < 2 seconds
- Time to Interactive (TTI): < 3 seconds
- Largest Contentful Paint (LCP): < 2.5 seconds
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

**Performance Strategies**:
1. **Code Splitting**: Route-based + component-based
2. **Lazy Loading**: Load components on-demand
3. **Image Optimization**: WebP format, responsive images
4. **Caching**: Aggressive caching with service workers
5. **Bundle Analysis**: Regular bundle size monitoring
6. **Tree Shaking**: Remove unused code
7. **Compression**: Brotli compression on server

### Accessibility Requirements (WCAG 2.1 Level AA)

**Mandatory Features**:
- Keyboard navigation for all interactive elements
- Screen reader support (ARIA labels, roles, live regions)
- Focus indicators (visible focus states)
- Color contrast ratios: 4.5:1 for text, 3:1 for UI elements
- Captions for video content (if added)
- Skip navigation links
- Responsive text sizing (rem units)
- No seizure-inducing animations (respect prefers-reduced-motion)

**Testing**:
- Automated: axe-core in CI/CD pipeline
- Manual: Screen reader testing (NVDA, JAWS, VoiceOver)
- Tools: Lighthouse accessibility audit, WAVE browser extension

### Security Requirements

**Frontend Security**:
- Content Security Policy (CSP) headers
- XSS prevention (React escapes by default, but validate in editors)
- HTTPS only (HSTS headers)
- No sensitive data in localStorage (use httpOnly cookies)
- Dependency scanning (npm audit, Snyk)

**Backend Security**:
- JWT authentication with short expiration
- Rate limiting (express-rate-limit)
- Input validation (Zod schemas)
- SQL injection prevention (parameterized queries)
- CORS configuration (whitelist origins)
- Helmet.js for security headers
- Regular security audits

### Scalability Considerations

**Frontend Scalability**:
- Stateless components (horizontal scaling)
- CDN distribution (global reach)
- Service worker caching (reduce server load)
- Virtualized lists for large datasets (react-window)

**Backend Scalability**:
- Stateless API design (horizontal scaling)
- Database connection pooling
- Redis caching for hot data
- Read replicas for PostgreSQL (if needed)
- Message queue for async tasks (future: Bull + Redis)

**Bottleneck Monitoring**:
- Frontend: Web Vitals, custom performance marks
- Backend: APM tools (New Relic, DataDog)
- Database: Query analysis, slow query logs
- Infrastructure: CPU/memory/network monitoring

## Data Flow Architecture

### User Interaction Flow

```
User Interaction
    ↓
React Component (UI)
    ↓
State Management (Zustand/Context)
    ↓
API Client (React Query)
    ↓
HTTP/WebSocket
    ↓
Express API Server
    ↓
Business Logic Layer
    ↓
Database Layer (PostgreSQL)
    ↓
Cache Layer (Redis)
```

### Progress Tracking Flow

```
User Completes Component Activity
    ↓
Frontend Validation
    ↓
Optimistic Update (React Query)
    ↓
POST /api/progress
    ↓
Backend Validation
    ↓
Update PostgreSQL (user_progress)
    ↓
Update Redis (achievements cache)
    ↓
Emit WebSocket Event (real-time update)
    ↓
Frontend Receives Update
    ↓
UI Updates (progress bars, badges)
```

### Assessment Scoring Flow

```
User Submits Assessment
    ↓
Frontend Calculates Preliminary Score
    ↓
POST /api/assessments
    ↓
Backend Validates Answers
    ↓
Apply Scoring Rubrics
    ↓
Update user_progress
    ↓
Check Badge Eligibility
    ↓
Return Final Score + Achievements
    ↓
Frontend Updates Dashboard
```

## Non-Functional Requirements Summary

| Quality Attribute | Target | Strategy |
|------------------|--------|----------|
| Performance | < 3s TTI | Code splitting, lazy loading, CDN |
| Availability | 99.5% uptime | Cloud hosting, health checks, auto-restart |
| Scalability | 10,000 concurrent users | Stateless design, horizontal scaling, caching |
| Security | OWASP Top 10 compliance | Input validation, authentication, HTTPS |
| Accessibility | WCAG 2.1 AA | Semantic HTML, ARIA, keyboard nav |
| Maintainability | < 4 hours onboarding | Clear architecture, documentation, TypeScript |
| Testability | 80% code coverage | Unit/integration/E2E tests, CI/CD |

## Technology Stack Summary

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend Framework | React 18 + TypeScript | Best ecosystem, concurrent rendering, type safety |
| State Management | Zustand + React Query | Minimal boilerplate, excellent caching |
| UI Components | Tailwind CSS + Radix UI | Utility-first styling, accessible primitives |
| 3D Rendering | React Three Fiber | Best React 3D library, WebGL performance |
| Network Diagrams | React Flow | Purpose-built for node diagrams |
| Charts | Recharts | React-friendly, responsive |
| Animations | Framer Motion | Best animation library for React |
| Drag & Drop | DnD Kit | Modern, accessible, performant |
| Build Tool | Vite 5 | Fastest dev experience |
| Package Manager | pnpm | Fastest installs, disk efficiency |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E |
| Backend | Node.js + Express | Full-stack JavaScript, async I/O |
| Database | PostgreSQL 16 | ACID, JSON support, performance |
| Cache | Redis 7 | Session storage, leaderboards |
| Deployment | Vercel + Railway | Optimized for stack, easy scaling |

## Next Steps

1. **Prototype Development**: Build Component 9 (Port/Protocol Trainer) as proof-of-concept
2. **Design System Creation**: Establish atomic design components
3. **API Contract Definition**: OpenAPI/Swagger specification
4. **Database Schema Design**: Detailed ERD with migrations
5. **CI/CD Pipeline Setup**: GitHub Actions workflows
6. **Development Environment**: Docker Compose for local development

## References

- [React Documentation](https://react.dev)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Flow](https://reactflow.dev)
- [Vite Guide](https://vitejs.dev/guide)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)
- [Web Performance Working Group](https://www.w3.org/webperf/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
