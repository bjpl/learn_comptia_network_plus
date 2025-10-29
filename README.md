# CompTIA Network+ N10-009 Learning Platform

An interactive, web-based learning platform designed to help students master the CompTIA Network+ N10-009 certification exam objectives through hands-on practice and scenario-based learning.

## Project Overview

This platform implements 23 comprehensive interactive components covering all learning objectives from the CompTIA Network+ N10-009 certification, including:

- OSI Model explanation and troubleshooting
- Network appliances and infrastructure
- Cloud concepts and connectivity
- Protocols, ports, and services
- Transmission media and transceivers
- Network topologies and architectures
- IPv4/IPv6 addressing and subnetting
- Modern network technologies (SDN, Zero Trust, SASE, IaC)

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright
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

## License

MIT

## Support

For issues and questions, please refer to the project documentation in the `docs/` directory.
