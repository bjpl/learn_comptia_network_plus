/**
 * Type definitions for PortScanner component
 */

export interface ScannerState {
  scanning: boolean;
  currentPort: number;
  results: Array<{
    port: number;
    state: string;
    service: string;
    version: string;
    protocol: string;
    risk: string;
    recommendations: string[];
  }>;
  selectedPort: number | undefined;
}

export interface CommandHandlers {
  help: () => void;
  scan: (cmd: string) => void;
  clear: () => void;
  info: (port: number) => void;
  remediate: (port: number) => void;
  assess: () => void;
  score: () => void;
  networks: () => void;
}
