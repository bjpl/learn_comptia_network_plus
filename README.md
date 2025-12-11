# CompTIA Network+ N10-009 Learning Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://bjpl.github.io/learn_comptia_network_plus/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Security](https://img.shields.io/badge/Security-A--Grade-success?style=for-the-badge)](docs/SECURITY_AUDIT_REPORT.md)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **Production-ready educational platform** showcasing React 18, TypeScript 5.7, Three.js 3D visualization, and enterprise-grade security practices.

**[View Live Demo](https://bjpl.github.io/learn_comptia_network_plus/)**

---

## Project Metrics

| Metric                        | Value       | Details                  |
| ----------------------------- | ----------- | ------------------------ |
| **Lines of Code**             | 97,095      | TypeScript strict mode   |
| **Components**                | 401 files   | 210 directories          |
| **Test Files**                | 42          | Unit, Integration, E2E   |
| **Security Grade**            | A- (92/100) | Zero vulnerabilities     |
| **TypeScript Errors**         | 0           | Strict mode enabled      |
| **3D Visualizations**         | 106         | Three.js/R3F             |
| **Performance Optimizations** | 92          | memo/useMemo/useCallback |
| **Accessibility**             | WCAG 2.1 AA | Full compliance          |

---

## Skills Demonstrated

| Category          | Technologies & Practices                                     |
| ----------------- | ------------------------------------------------------------ |
| **Frontend**      | React 18, TypeScript 5.7 (strict), Zustand, Vite 7           |
| **3D Graphics**   | Three.js, React Three Fiber, @react-three/drei               |
| **Testing**       | Vitest, Playwright E2E (6 device configs), Testing Library   |
| **Security**      | JWT auth, CSRF protection, rate limiting, input sanitization |
| **Performance**   | Code splitting, lazy loading, bundle optimization            |
| **Accessibility** | WCAG 2.1 AA, skip links, ARIA, screen reader support         |
| **DevOps**        | GitHub Actions CI/CD, automated deployment                   |
| **Architecture**  | Feature-based structure, custom hooks, state management      |

---

## Project Overview

An interactive, web-based learning platform designed to help students master the CompTIA Network+ N10-009 certification exam objectives through hands-on practice and scenario-based learning.

**Version:** 1.0.0 | **Status:** Production | **Certification:** CompTIA Network+ N10-009

This platform provides comprehensive interactive learning featuring:

- **Interactive 3D Visualizations**: React Three Fiber for network topology visualization
- **OSI Model**: Layer-by-layer explanation and troubleshooting scenarios
- **Network Infrastructure**: Appliances, devices, and architecture
- **Cloud Concepts**: Connectivity options and cloud services
- **Protocols & Services**: Comprehensive port and protocol reference
- **IP Addressing**: IPv4/IPv6 addressing, subnetting, and CIDR
- **Modern Technologies**: SDN, Zero Trust, SASE, Infrastructure as Code
- **Adaptive Learning**: Progress tracking and personalized study paths
- **Accessibility**: WCAG 2.1 AA compliance for inclusive learning

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript 5.7
- **Build Tool**: Vite 6.0
- **State Management**: Zustand 5.0
- **UI Library**: Material-UI (MUI) 5.18.0
- **3D Visualization**: React Three Fiber 8.18 for interactive 3D graphics
- **Animation**: Framer Motion 11.15
- **Icons**: Lucide React
- **Testing**: Vitest 2.1 + Playwright 1.49
- **Deployment**: GitHub Pages (gh-pages)
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

### Unit Tests

```bash
npm test                  # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:ui          # Open Vitest UI
```

### Integration Tests

```bash
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

### All Tests

```bash
npm run validate         # Run all checks (type-check, lint, format, test)
```

## Code Quality

### Linting

```bash
npm run lint             # Auto-fix issues
npm run lint:check       # Check without fixing
```

### Formatting

```bash
npm run format           # Format all files
npm run format:check     # Check formatting
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

```
learn_comptia_network+/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Business logic and API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Root component
│   └── main.tsx        # Application entry point
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests
├── public/             # Static assets
├── docs/               # Documentation
├── config/             # Configuration files
└── package.json
```

## Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/component-name`
2. **Develop**: Write code following TypeScript and React best practices
3. **Test**: Write tests for new functionality
4. **Validate**: Run `npm run validate` before committing
5. **Commit**: Use clear, descriptive commit messages
6. **Push**: Push to remote and create pull request

## Component Architecture

Each learning component follows these principles:

- **Separation of Concerns**: UI, logic, and state management are separated
- **Type Safety**: Full TypeScript coverage with strict mode
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized rendering with React.memo and useMemo
- **Testing**: Comprehensive unit and integration tests

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR
5. Keep commits atomic and well-described

## Learning Objectives Coverage

### Domain 1.0: Networking Concepts

- LO 1.0: OSI Reference Model (Components 1-3)
- LO 1.1: Network Appliances (Components 4-6)
- LO 1.2: Cloud Concepts (Components 7-8)
- LO 1.3: Ports & Protocols (Components 9-11)
- LO 1.4: Transmission Media (Components 12-14)
- LO 1.5: Network Topologies (Components 15-16)
- LO 1.7: IPv4 Addressing (Components 17-18)
- LO 1.8: Modern Networks (Components 19-21)

### Cross-Component Features

- Integrated Scenario Simulator (Component 22)
- Progress Tracking Dashboard (Component 23)

## Architecture Highlights

### Security Implementation

- **Authentication**: JWT with bcrypt (12 rounds), refresh token rotation
- **Protection**: CSRF tokens, Helmet CSP, rate limiting (10+ endpoint-specific limiters)
- **Validation**: Zod schemas, DOMPurify sanitization, 100% parameterized SQL
- **Audit**: Zero npm vulnerabilities, comprehensive security middleware

### Performance Strategy

- **Code Splitting**: Manual chunks for vendors (React, Three.js, MUI)
- **Lazy Loading**: All routes use `React.lazy()` with Suspense
- **Optimization**: 92 `useMemo`/`useCallback`/`React.memo` implementations
- **Targets**: Lighthouse 90+ scores, <600KB chunk size limits

### Testing Infrastructure

- **Unit Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright across 6 device configurations
- **Coverage**: Comprehensive mocking (storage, auth, fetch, crypto)
- **CI/CD**: Automated lint → typecheck → test → build → deploy

### Documentation

- [Security Audit Report](docs/SECURITY_AUDIT_REPORT.md) - A- grade assessment
- [Architecture Evaluation](docs/ARCHITECTURE_EVALUATION.md) - System design analysis
- [GOAP Strategy](docs/PORTFOLIO_STRATEGY.md) - Development methodology

---

## License

MIT

## Support

For issues and questions, please refer to the project documentation in the `docs/` directory.

---

<p align="center">
  <strong>Built with React 18 + TypeScript 5.7 + Three.js</strong><br>
  <a href="https://bjpl.github.io/learn_comptia_network_plus/">View Live Demo</a>
</p>
