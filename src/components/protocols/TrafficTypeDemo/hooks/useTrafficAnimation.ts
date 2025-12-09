/**
 * Hook for managing traffic animation state and logic
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { AnimationState, Packet, Node } from '../types';
import type { TrafficType } from '../../protocols-types';
import { getPacketColor } from '../utils/colorHelpers';
import { drawNetworkConnections, drawNode, drawPacket } from '../utils/canvasHelpers';

export const useTrafficAnimation = (
  nodes: Node[],
  selectedType: TrafficType,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    activeType: 'unicast',
    animating: false,
    packets: [],
  });
  const animationFrameRef = useRef<number>();

  const drawNetwork = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Draw connections between nodes
      drawNetworkConnections(ctx, nodes);

      // Draw nodes
      nodes.forEach((node) => {
        const isSource = selectedType.visual.sourceNodes.includes(node.id);
        const isDestination = selectedType.visual.destinationNodes.includes(node.id);
        drawNode(ctx, node, isSource, isDestination);
      });
    },
    [nodes, selectedType.visual.sourceNodes, selectedType.visual.destinationNodes]
  );

  const animateTraffic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw network background
    drawNetwork(ctx);

    // Draw packets
    animationState.packets.forEach((packet) => {
      const fromNode = nodes[packet.from];
      const toNode = nodes[packet.to];

      const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
      const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

      drawPacket(ctx, x, y, getPacketColor(selectedType.id));
    });

    // Update packet positions
    const updatedPackets = animationState.packets
      .map((p) => ({ ...p, progress: p.progress + 0.02 }))
      .filter((p) => p.progress <= 1);

    setAnimationState((prev) => ({
      ...prev,
      packets: updatedPackets,
      animating: updatedPackets.length > 0,
    }));

    if (updatedPackets.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateTraffic);
    }
  }, [animationState.packets, nodes, selectedType.id, drawNetwork, canvasRef]);

  useEffect(() => {
    if (animationState.animating) {
      animateTraffic();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState.animating, animateTraffic]);

  const startAnimation = useCallback(() => {
    const sourceNodes = selectedType.visual.sourceNodes;
    const destNodes = selectedType.visual.destinationNodes;

    const newPackets = sourceNodes.flatMap((source) =>
      destNodes.map((dest) => ({
        id: `${source}-${dest}-${Date.now()}`,
        from: source,
        to: dest,
        progress: 0,
      }))
    );

    setAnimationState({
      activeType: selectedType.id,
      animating: true,
      packets: newPackets,
    });
  }, [selectedType]);

  const resetAnimation = useCallback(() => {
    setAnimationState({
      activeType: selectedType.id,
      animating: false,
      packets: [],
    });
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [selectedType.id]);

  return {
    animationState,
    startAnimation,
    resetAnimation,
  };
};
