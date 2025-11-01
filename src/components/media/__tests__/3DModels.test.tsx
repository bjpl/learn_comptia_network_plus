/**
 * Tests for 3D Connector Models
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { RJ45Connector } from '../models/RJ45Connector';
import { FiberOpticConnector } from '../models/FiberOpticConnector';
import { CoaxialConnector } from '../models/CoaxialConnector';
import { USBConnector } from '../models/USBConnector';

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Text: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <mesh {...props}>{children}</mesh>
  ),
}));

describe('3D Connector Models', () => {
  describe('RJ45Connector', () => {
    it('renders without crashing', () => {
      const { container } = render(<RJ45Connector />);
      expect(container).toBeInTheDocument();
    });

    it('renders with custom scale', () => {
      const { container } = render(<RJ45Connector scale={2} />);
      expect(container).toBeInTheDocument();
    });

    it('renders with labels when showLabels is true', () => {
      const { container } = render(<RJ45Connector showLabels={true} />);
      expect(container).toBeInTheDocument();
    });

    it('renders without labels when showLabels is false', () => {
      const { container } = render(<RJ45Connector showLabels={false} />);
      expect(container).toBeInTheDocument();
    });

    it('supports autoRotate prop', () => {
      const { container } = render(<RJ45Connector autoRotate={true} />);
      expect(container).toBeInTheDocument();
    });

    it('supports custom rotation', () => {
      const { container } = render(<RJ45Connector rotation={Math.PI / 2} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('FiberOpticConnector', () => {
    it('renders SC connector', () => {
      const { container } = render(<FiberOpticConnector type="SC" />);
      expect(container).toBeInTheDocument();
    });

    it('renders LC connector', () => {
      const { container } = render(<FiberOpticConnector type="LC" />);
      expect(container).toBeInTheDocument();
    });

    it('renders ST connector', () => {
      const { container } = render(<FiberOpticConnector type="ST" />);
      expect(container).toBeInTheDocument();
    });

    it('renders MPO connector', () => {
      const { container } = render(<FiberOpticConnector type="MPO" />);
      expect(container).toBeInTheDocument();
    });

    it('renders with custom scale', () => {
      const { container } = render(<FiberOpticConnector type="LC" scale={1.5} />);
      expect(container).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = render(<FiberOpticConnector type="SC" showLabels={true} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('CoaxialConnector', () => {
    it('renders F-type connector', () => {
      const { container } = render(<CoaxialConnector type="F-type" />);
      expect(container).toBeInTheDocument();
    });

    it('renders BNC connector', () => {
      const { container } = render(<CoaxialConnector type="BNC" />);
      expect(container).toBeInTheDocument();
    });

    it('renders with custom scale', () => {
      const { container } = render(<CoaxialConnector type="BNC" scale={2} />);
      expect(container).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = render(<CoaxialConnector type="F-type" showLabels={true} />);
      expect(container).toBeInTheDocument();
    });

    it('supports autoRotate', () => {
      const { container } = render(<CoaxialConnector type="BNC" autoRotate={true} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('USBConnector', () => {
    it('renders USB-A connector', () => {
      const { container } = render(<USBConnector type="USB-A" />);
      expect(container).toBeInTheDocument();
    });

    it('renders USB-C connector', () => {
      const { container } = render(<USBConnector type="USB-C" />);
      expect(container).toBeInTheDocument();
    });

    it('renders with custom scale', () => {
      const { container } = render(<USBConnector type="USB-C" scale={1.5} />);
      expect(container).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = render(<USBConnector type="USB-A" showLabels={true} />);
      expect(container).toBeInTheDocument();
    });

    it('supports custom rotation', () => {
      const { container } = render(<USBConnector type="USB-C" rotation={Math.PI} />);
      expect(container).toBeInTheDocument();
    });
  });
});
