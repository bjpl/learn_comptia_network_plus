/**
 * Tests for Connector3DViewer component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Connector3DViewer from '../Connector3DViewer';

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas-mock">{children}</div>,
  useFrame: () => {}
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
  Environment: () => null,
  Text: () => null
}));

describe('Connector3DViewer', () => {
  it('renders without crashing', async () => {
    render(<Connector3DViewer connectorType="RJ45" />);
    await waitFor(() => {
      expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
    });
  });

  it('displays controls when showControls is true', () => {
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    expect(screen.getByText('Rotate')).toBeInTheDocument();
    expect(screen.getByText('Zoom In')).toBeInTheDocument();
    expect(screen.getByText('Zoom Out')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('hides controls when showControls is false', () => {
    render(<Connector3DViewer connectorType="RJ45" showControls={false} />);

    expect(screen.queryByText('Rotate')).not.toBeInTheDocument();
    expect(screen.queryByText('Zoom In')).not.toBeInTheDocument();
  });

  it('handles rotate button click', async () => {
    const user = userEvent.setup();
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    const rotateButton = screen.getByText('Rotate');
    await user.click(rotateButton);

    // Component should still be rendered
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });

  it('handles zoom in button click', async () => {
    const user = userEvent.setup();
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    const zoomInButton = screen.getByText('Zoom In');
    await user.click(zoomInButton);

    // Check zoom percentage has increased
    await waitFor(() => {
      expect(screen.getByText(/Zoom: 120%/)).toBeInTheDocument();
    });
  });

  it('handles zoom out button click', async () => {
    const user = userEvent.setup();
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    const zoomOutButton = screen.getByText('Zoom Out');
    await user.click(zoomOutButton);

    // Check zoom percentage has decreased
    await waitFor(() => {
      expect(screen.getByText(/Zoom: 80%/)).toBeInTheDocument();
    });
  });

  it('handles reset button click', async () => {
    const user = userEvent.setup();
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    // Zoom in first
    await user.click(screen.getByText('Zoom In'));
    await waitFor(() => {
      expect(screen.getByText(/Zoom: 120%/)).toBeInTheDocument();
    });

    // Reset
    await user.click(screen.getByText('Reset'));
    await waitFor(() => {
      expect(screen.getByText(/Zoom: 100%/)).toBeInTheDocument();
    });
  });

  it('toggles labels visibility', async () => {
    const user = userEvent.setup();
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    const toggleButton = screen.getByText('Hide Labels');
    await user.click(toggleButton);

    expect(screen.getByText('Show Labels')).toBeInTheDocument();
  });

  it('renders different connector types', () => {
    const connectorTypes: Array<'RJ45' | 'SC' | 'LC' | 'F-type' | 'BNC'> = [
      'RJ45', 'SC', 'LC', 'F-type', 'BNC'
    ];

    connectorTypes.forEach((type) => {
      const { container } = render(<Connector3DViewer connectorType={type} />);
      expect(container.querySelector('[role="img"]')).toHaveAttribute(
        'aria-label',
        `3D visualization of ${type} connector`
      );
    });
  });

  it('applies custom height', () => {
    render(<Connector3DViewer connectorType="RJ45" height="600px" />);

    const container = screen.getByRole('img');
    expect(container).toHaveStyle({ height: '600px' });
  });

  it('calls onToggleFullscreen when provided', async () => {
    const user = userEvent.setup();
    const handleFullscreen = vi.fn();

    render(
      <Connector3DViewer
        connectorType="RJ45"
        showControls={true}
        onToggleFullscreen={handleFullscreen}
      />
    );

    const fullscreenButton = screen.getByLabelText('Toggle fullscreen');
    await user.click(fullscreenButton);

    expect(handleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<Connector3DViewer connectorType="RJ45" showControls={true} />);

    expect(screen.getByLabelText('Rotate connector 45 degrees')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset view')).toBeInTheDocument();
  });

  it('displays keyboard shortcuts hint', () => {
    render(<Connector3DViewer connectorType="RJ45" />);

    expect(screen.getByText(/Left click \+ drag to rotate/)).toBeInTheDocument();
  });
});
