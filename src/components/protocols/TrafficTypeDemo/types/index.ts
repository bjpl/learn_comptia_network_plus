/**
 * Type definitions for TrafficTypeDemo component
 */

export interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  active: boolean;
}

export interface Packet {
  id: string;
  from: number;
  to: number;
  progress: number;
}

export interface AnimationState {
  activeType: string;
  animating: boolean;
  packets: Packet[];
}
