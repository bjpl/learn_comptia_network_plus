import type { DeviceTypeOption } from '../types';

export const DEVICE_TYPE_OPTIONS: DeviceTypeOption[] = [
  { value: 'router', label: 'Router' },
  { value: 'switch', label: 'Switch' },
  { value: 'firewall-stateful', label: 'Firewall' },
  { value: 'load-balancer', label: 'Load Balancer' },
  { value: 'wireless-controller', label: 'Wireless Controller' },
];

export const KEYBOARD_SHORTCUTS = [
  'Arrow keys: Move selected device (Shift for larger steps)',
  'Tab/Shift+Tab: Cycle through devices',
  'Enter: Configure selected device',
  'Delete: Remove selected device',
  'Escape: Deselect device',
];
