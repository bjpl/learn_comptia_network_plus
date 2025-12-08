/**
 * Constants for Topology Builder
 */

import type { DeviceType, DeviceSpec, TopologyTemplate, ConnectionType } from './types';

export const deviceSpecs: Record<DeviceType, DeviceSpec> = {
  router: { label: 'Router', cost: 500, icon: '🔀' },
  switch: { label: 'Switch', cost: 300, icon: '🔌' },
  hub: { label: 'Hub', cost: 100, icon: '⭕' },
  firewall: { label: 'Firewall', cost: 800, icon: '🛡️' },
  server: { label: 'Server', cost: 2000, icon: '🖥️' },
  workstation: { label: 'Workstation', cost: 1000, icon: '💻' },
  'wireless-ap': { label: 'Wireless AP', cost: 200, icon: '📡' },
  cloud: { label: 'Cloud', cost: 0, icon: '☁️' },
};

export const connectionCosts: Record<ConnectionType, number> = {
  ethernet: 2,
  fiber: 5,
  wireless: 50,
};

// Canvas dimensions
export const CANVAS_DEVICE_SIZE = 80;
export const DEVICE_GRID_OFFSET_X = 80;
export const DEVICE_GRID_OFFSET_Y = 100;
export const DEVICE_START_X = 300;
export const DEVICE_START_Y = 200;
export const DEVICES_PER_ROW = 5;

// Re-export templates from data directory
export { templates } from './data/deviceTypes';

// Legacy export for backwards compatibility
const legacyTemplates: TopologyTemplate[] = [
  {
    id: 'small-office',
    name: 'Small Office',
    description: 'Basic star topology for small office (5-10 users)',
    devices: [
      {
        id: 'd1',
        type: 'router',
        label: 'Gateway Router',
        position: { x: 300, y: 150 },
        cost: 500,
      },
      {
        id: 'd2',
        type: 'switch',
        label: 'Main Switch',
        position: { x: 300, y: 250 },
        cost: 300,
      },
      {
        id: 'd3',
        type: 'workstation',
        label: 'Workstation 1',
        position: { x: 150, y: 350 },
        cost: 1000,
      },
      {
        id: 'd4',
        type: 'workstation',
        label: 'Workstation 2',
        position: { x: 300, y: 350 },
        cost: 1000,
      },
      {
        id: 'd5',
        type: 'server',
        label: 'File Server',
        position: { x: 450, y: 350 },
        cost: 2000,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'd1', targetId: 'd2', type: 'ethernet', length: 5, cost: 10 },
      { id: 'c2', sourceId: 'd2', targetId: 'd3', type: 'ethernet', length: 20, cost: 40 },
      { id: 'c3', sourceId: 'd2', targetId: 'd4', type: 'ethernet', length: 15, cost: 30 },
      { id: 'c4', sourceId: 'd2', targetId: 'd5', type: 'ethernet', length: 25, cost: 50 },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Network',
    description: 'Redundant two-tier network with distribution and access layers',
    devices: [
      {
        id: 'd1',
        type: 'router',
        label: 'Core Router 1',
        position: { x: 250, y: 100 },
        cost: 500,
      },
      {
        id: 'd2',
        type: 'router',
        label: 'Core Router 2',
        position: { x: 450, y: 100 },
        cost: 500,
      },
      {
        id: 'd3',
        type: 'firewall',
        label: 'Firewall',
        position: { x: 350, y: 50 },
        cost: 800,
      },
      {
        id: 'd4',
        type: 'switch',
        label: 'Distribution SW 1',
        position: { x: 200, y: 250 },
        cost: 300,
      },
      {
        id: 'd5',
        type: 'switch',
        label: 'Distribution SW 2',
        position: { x: 500, y: 250 },
        cost: 300,
      },
      {
        id: 'd6',
        type: 'switch',
        label: 'Access SW 1',
        position: { x: 150, y: 400 },
        cost: 300,
      },
      {
        id: 'd7',
        type: 'switch',
        label: 'Access SW 2',
        position: { x: 350, y: 400 },
        cost: 300,
      },
      {
        id: 'd8',
        type: 'switch',
        label: 'Access SW 3',
        position: { x: 550, y: 400 },
        cost: 300,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'd3', targetId: 'd1', type: 'fiber', length: 10, cost: 50 },
      { id: 'c2', sourceId: 'd3', targetId: 'd2', type: 'fiber', length: 10, cost: 50 },
      { id: 'c3', sourceId: 'd1', targetId: 'd2', type: 'fiber', length: 15, cost: 75 },
      { id: 'c4', sourceId: 'd1', targetId: 'd4', type: 'fiber', length: 20, cost: 100 },
      { id: 'c5', sourceId: 'd1', targetId: 'd5', type: 'fiber', length: 30, cost: 150 },
      { id: 'c6', sourceId: 'd2', targetId: 'd4', type: 'fiber', length: 30, cost: 150 },
      { id: 'c7', sourceId: 'd2', targetId: 'd5', type: 'fiber', length: 20, cost: 100 },
      { id: 'c8', sourceId: 'd4', targetId: 'd6', type: 'ethernet', length: 25, cost: 50 },
      { id: 'c9', sourceId: 'd4', targetId: 'd7', type: 'ethernet', length: 25, cost: 50 },
      { id: 'c10', sourceId: 'd5', targetId: 'd7', type: 'ethernet', length: 25, cost: 50 },
      { id: 'c11', sourceId: 'd5', targetId: 'd8', type: 'ethernet', length: 25, cost: 50 },
    ],
  },
  {
    id: 'datacenter',
    name: 'Data Center (Spine-Leaf)',
    description: 'Modern spine-and-leaf architecture for east-west traffic',
    devices: [
      { id: 'd1', type: 'switch', label: 'Spine 1', position: { x: 250, y: 100 }, cost: 300 },
      { id: 'd2', type: 'switch', label: 'Spine 2', position: { x: 450, y: 100 }, cost: 300 },
      { id: 'd3', type: 'switch', label: 'Leaf 1', position: { x: 150, y: 250 }, cost: 300 },
      { id: 'd4', type: 'switch', label: 'Leaf 2', position: { x: 350, y: 250 }, cost: 300 },
      { id: 'd5', type: 'switch', label: 'Leaf 3', position: { x: 550, y: 250 }, cost: 300 },
      {
        id: 'd6',
        type: 'server',
        label: 'Server Rack 1',
        position: { x: 150, y: 380 },
        cost: 2000,
      },
      {
        id: 'd7',
        type: 'server',
        label: 'Server Rack 2',
        position: { x: 350, y: 380 },
        cost: 2000,
      },
      {
        id: 'd8',
        type: 'server',
        label: 'Server Rack 3',
        position: { x: 550, y: 380 },
        cost: 2000,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'd1', targetId: 'd3', type: 'fiber', length: 15, cost: 75 },
      { id: 'c2', sourceId: 'd1', targetId: 'd4', type: 'fiber', length: 20, cost: 100 },
      { id: 'c3', sourceId: 'd1', targetId: 'd5', type: 'fiber', length: 30, cost: 150 },
      { id: 'c4', sourceId: 'd2', targetId: 'd3', type: 'fiber', length: 30, cost: 150 },
      { id: 'c5', sourceId: 'd2', targetId: 'd4', type: 'fiber', length: 20, cost: 100 },
      { id: 'c6', sourceId: 'd2', targetId: 'd5', type: 'fiber', length: 15, cost: 75 },
      { id: 'c7', sourceId: 'd3', targetId: 'd6', type: 'fiber', length: 10, cost: 50 },
      { id: 'c8', sourceId: 'd4', targetId: 'd7', type: 'fiber', length: 10, cost: 50 },
      { id: 'c9', sourceId: 'd5', targetId: 'd8', type: 'fiber', length: 10, cost: 50 },
    ],
  },
];

// Use imported templates as default
export default legacyTemplates;
