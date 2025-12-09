/**
 * Troubleshooting wizard data
 */
import type { WizardStep } from '../types';

export const wizardSteps: WizardStep[] = [
  {
    title: 'Check Physical Connectivity',
    description: 'Verify cable connections and link lights are active',
    checks: [
      'Check Ethernet cable is properly connected',
      'Verify link light is illuminated (green)',
      'Look for any damage to the connector',
    ],
  },
  {
    title: 'Verify IP Configuration',
    description: 'Check if device has valid IP address assigned',
    checks: [
      'Run ipconfig (Windows) or ifconfig (Linux)',
      'Verify IP is not APIPA (169.254.x.x)',
      'Confirm subnet mask is correct',
    ],
  },
  {
    title: 'Test Gateway Connectivity',
    description: 'Ensure default gateway is reachable',
    checks: [
      'Ping default gateway IP',
      'Check ARP table for gateway MAC address',
      'Verify gateway is on same subnet',
    ],
  },
  {
    title: 'Check Routing',
    description: 'Verify routing table is correct',
    checks: [
      'Review routing table with route print (Windows) or ip route (Linux)',
      'Confirm default route points to gateway',
      'Look for any invalid or duplicate routes',
    ],
  },
  {
    title: 'Test DNS Resolution',
    description: 'Verify DNS is working properly',
    checks: [
      'Ping known IP address to test connectivity',
      'Use nslookup or dig to test DNS',
      'Verify DNS servers are configured',
    ],
  },
];
