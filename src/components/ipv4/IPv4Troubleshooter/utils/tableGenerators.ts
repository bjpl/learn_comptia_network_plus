/**
 * Table data generators for routing and ARP tables
 */
import type { RoutingTableEntry, ARPEntry } from '../types';

export const generateRoutingTable = (): RoutingTableEntry[] => {
  return [
    {
      destination: '192.168.1.0',
      netmask: '255.255.255.0',
      gateway: '0.0.0.0',
      interface: 'Local',
      metric: 0,
      status: 'valid',
    },
    {
      destination: '192.168.0.0',
      netmask: '255.255.0.0',
      gateway: '192.168.1.1',
      interface: 'Eth0',
      metric: 1,
      status: 'valid',
    },
    {
      destination: '0.0.0.0',
      netmask: '0.0.0.0',
      gateway: '192.168.1.1',
      interface: 'Eth0',
      metric: 10,
      status: 'valid',
    },
  ];
};

export const generateARPTable = (): ARPEntry[] => {
  return [
    {
      ipAddress: '192.168.1.1',
      macAddress: '00-1B-D4-3F-2A-1C',
      interface: 'Eth0',
      type: 'dynamic',
    },
    {
      ipAddress: '192.168.1.10',
      macAddress: '08-00-27-4A-BC-1F',
      interface: 'Eth0',
      type: 'dynamic',
    },
    {
      ipAddress: '192.168.1.255',
      macAddress: 'FF-FF-FF-FF-FF-FF',
      interface: 'Eth0',
      type: 'invalid',
    },
  ];
};
