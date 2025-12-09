/**
 * Component 11: Port Scanner Simulator
 * Terminal-style interface simulating nmap/port scanning with security recommendations
 *
 * Main re-export file - orchestrates all subcomponents
 */

import React, { useState } from 'react';
import { VIRTUAL_NETWORKS } from '../protocols-data';
import type { VirtualNetwork } from '../protocols-types';
import { useTerminalOutput } from './hooks/useTerminalOutput';
import { useScannerState } from './hooks/useScannerState';
import { useCommandHandler } from './hooks/useCommandHandler';
import {
  NetworkSelector,
  Terminal,
  CommandInput,
  QuickActions,
  ScoreDisplay,
  ScannerStyles,
} from './components';

export const PortScanner: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<VirtualNetwork>(VIRTUAL_NETWORKS[0]);
  const [command, setCommand] = useState('');

  const { output, addOutput, clearOutput, terminalRef } = useTerminalOutput();
  const { state, startScanning, updateScanProgress, completeScan } = useScannerState();

  const { handleCommand, score } = useCommandHandler(
    selectedNetwork,
    setSelectedNetwork,
    state,
    startScanning,
    updateScanProgress,
    completeScan,
    addOutput,
    clearOutput
  );

  const handleNetworkChange = (network: VirtualNetwork) => {
    setSelectedNetwork(network);
    addOutput([
      '',
      `Target changed to: ${network.name}`,
      `Difficulty: ${network.difficulty.toUpperCase()}`,
      `Run "scan" to begin port scan`,
      '',
    ]);
  };

  const executeCommand = (cmd: string) => {
    handleCommand(cmd);
    setCommand('');
  };

  return (
    <div className="port-scanner">
      <div className="scanner-header">
        <h2>Port Scanner Simulator</h2>
        <p className="subtitle">Learn network security through hands-on port scanning practice</p>
      </div>

      <div className="scanner-container">
        <NetworkSelector
          selectedNetwork={selectedNetwork}
          networks={VIRTUAL_NETWORKS}
          onNetworkChange={handleNetworkChange}
        />

        <Terminal
          output={output}
          scanning={state.scanning}
          currentPort={state.currentPort}
          terminalRef={terminalRef}
        />

        <CommandInput
          value={command}
          onChange={setCommand}
          onSubmit={executeCommand}
          disabled={state.scanning}
        />

        <QuickActions
          onScan={() => executeCommand('scan')}
          onAssess={() => executeCommand('assess')}
          onScore={() => executeCommand('score')}
          onHelp={() => executeCommand('help')}
          disabled={state.scanning}
        />

        <ScoreDisplay score={score} />
      </div>

      <ScannerStyles />
    </div>
  );
};

export default PortScanner;
