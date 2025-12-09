/**
 * Terminal output formatting utilities
 */

export const getInitialOutput = (): string[] => [
  '╔════════════════════════════════════════════════════════════════╗',
  '║           Network+ Port Scanner Simulator v2.0.0              ║',
  '║         Educational Tool - CompTIA Network+ Training           ║',
  '╚════════════════════════════════════════════════════════════════╝',
  '',
  'Type "help" for available commands',
  'Select a target network to begin scanning',
  '',
];

export const formatHelpOutput = (): string[] => [
  '',
  '═══════════════════ AVAILABLE COMMANDS ═══════════════════',
  '',
  '  scan              - Scan current network for open ports',
  '  scan [network]    - Scan specific network (easy/medium/hard)',
  '  info [port]       - Get detailed information about a port',
  '  remediate [port]  - Show security recommendations for a port',
  '  assess            - Start security assessment mode',
  '  score             - Show current assessment score',
  '  networks          - List available networks',
  '  clear             - Clear terminal output',
  '  help              - Show this help message',
  '',
  '════════════════════════════════════════════════════════════',
  '',
];

export const formatNetworkList = (networks: Array<{ id: string; difficulty: string; description: string }>): string[] => [
  '',
  '═══════════════ AVAILABLE NETWORKS ═══════════════',
  '',
  ...networks.map(
    (net) =>
      `  ${net.id.padEnd(20)} - ${net.difficulty.toUpperCase().padEnd(10)} - ${net.description}`
  ),
  '',
  'Use "scan [network-id]" to scan a specific network',
  '',
];

export const formatScanHeader = (networkName: string, difficulty: string, description: string): string[] => [
  '',
  `Starting scan on: ${networkName}`,
  `Difficulty: ${difficulty.toUpperCase()}`,
  `Target: ${description}`,
  '',
  '════════════════════════════════════════════════════════════',
  'PORT      STATE    SERVICE           VERSION',
  '════════════════════════════════════════════════════════════',
];

export const formatServiceLine = (service: {
  port: number;
  state: string;
  service: string;
  version: string;
}): string => {
  const portStr = service.port.toString().padEnd(10);
  const stateStr = service.state.padEnd(9);
  const serviceStr = service.service.padEnd(18);
  const versionStr = service.version;

  return `${portStr}${stateStr}${serviceStr}${versionStr}`;
};

export const formatScanComplete = (count: number): string[] => [
  '════════════════════════════════════════════════════════════',
  '',
  `Scan complete. Found ${count} open ports.`,
  'Use "info [port]" to get detailed information',
  'Use "assess" to start security assessment',
  '',
];
