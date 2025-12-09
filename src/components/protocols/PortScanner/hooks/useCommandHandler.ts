/**
 * Hook for handling commands
 */

import { useState } from 'react';
import type { VirtualNetwork } from '../../protocols-types';
import { VIRTUAL_NETWORKS, PROTOCOLS } from '../../protocols-data';
import { extractPort } from '../utils/commandParser';
import {
  formatHelpOutput,
  formatNetworkList,
  formatScanHeader,
  formatServiceLine,
  formatScanComplete,
} from '../utils/terminalOutput';
import { calculateScore, formatScoreOutput } from '../utils/scoring';
import { formatRemediationHeader, getRemediationByRisk } from '../utils/remediation';

export const useCommandHandler = (
  selectedNetwork: VirtualNetwork,
  setSelectedNetwork: (network: VirtualNetwork) => void,
  scannerState: any,
  startScanning: () => void,
  updateScanProgress: (port: number, service: any) => void,
  completeScan: () => void,
  addOutput: (lines: string | string[]) => void,
  clearOutput: () => void
) => {
  const [score, setScore] = useState(0);
  const [assessmentMode, setAssessmentMode] = useState(false);
  const [remediation, setRemediation] = useState<Map<number, string[]>>(new Map());

  const showHelp = () => {
    addOutput(formatHelpOutput());
  };

  const listNetworks = () => {
    addOutput(formatNetworkList(VIRTUAL_NETWORKS));
  };

  const startScan = (cmd: string) => {
    const parts = cmd.split(' ');
    let targetNetwork = selectedNetwork;

    if (parts.length > 1) {
      const networkId = parts[1];
      const found = VIRTUAL_NETWORKS.find((n) => n.id === networkId);
      if (found) {
        targetNetwork = found;
        setSelectedNetwork(found);
      } else {
        addOutput(`Network "${networkId}" not found. Use "networks" to list available networks.`);
        return;
      }
    }

    addOutput(formatScanHeader(targetNetwork.name, targetNetwork.difficulty, targetNetwork.description));
    startScanning();

    // Simulate scanning with delays
    targetNetwork.services.forEach((service, index) => {
      setTimeout(
        () => {
          addOutput(formatServiceLine(service));
          updateScanProgress(service.port, service);

          if (index === targetNetwork.services.length - 1) {
            setTimeout(() => {
              addOutput(formatScanComplete(targetNetwork.services.length));
              completeScan();
            }, 500);
          }
        },
        (index + 1) * 800
      );
    });
  };

  const showPortInfo = (port: number) => {
    const service = selectedNetwork.services.find((s) => s.port === port);
    if (!service) {
      addOutput(`Port ${port} not found in scan results. Run "scan" first.`);
      return;
    }

    const protocol = PROTOCOLS.find((p) => p.ports.some((portInfo) => portInfo.number === port));

    addOutput([
      '',
      `═══════════════ PORT ${port} ANALYSIS ═══════════════`,
      '',
      `Service:     ${service.service}`,
      `Version:     ${service.version}`,
      `State:       ${service.state}`,
      `Protocol:    ${service.protocol}`,
      `Risk Level:  ${service.risk.toUpperCase()}`,
      '',
    ]);

    if (protocol) {
      addOutput([
        `Full Name:   ${protocol.fullName}`,
        '',
        'Description:',
        `  ${protocol.description}`,
        '',
        'Use Case:',
        `  ${protocol.useCase}`,
        '',
        'Security Implications:',
        `  ${protocol.securityImplications}`,
        '',
      ]);
    }

    addOutput([
      '─────────────── SECURITY RECOMMENDATIONS ───────────────',
      '',
      ...service.recommendations.map((rec, idx) => `  ${idx + 1}. ${rec}`),
      '',
      `Use "remediate ${port}" to start remediation decision tree`,
      '',
    ]);
  };

  const showRemediationOptions = (port: number) => {
    const service = selectedNetwork.services.find((s) => s.port === port);
    if (!service) {
      addOutput(`Port ${port} not found. Run "scan" first.`);
      return;
    }

    addOutput(formatRemediationHeader(port, service.service, service.risk));
    addOutput(getRemediationByRisk(service.risk, service.recommendations));

    // Track remediation for scoring
    const currentRemediation = remediation.get(port) || [];
    setRemediation((prev) =>
      new Map(prev).set(port, [...currentRemediation, ...service.recommendations])
    );
  };

  const startAssessment = () => {
    setAssessmentMode(true);
    addOutput([
      '',
      '═════════════ SECURITY ASSESSMENT MODE ═════════════',
      '',
      'Answer the following questions about the scanned services:',
      '',
      'For each open port, you will need to:',
      '  1. Identify the service correctly',
      '  2. Assess the risk level',
      '  3. Recommend appropriate security measures',
      '',
      'Use "info [port]" to review services',
      'Use "score" when ready to see your assessment',
      '',
    ]);
  };

  const showScore = () => {
    const totalServices = selectedNetwork.services.length;
    const criticalServices = selectedNetwork.services.filter((s) => s.risk === 'critical').length;
    const remediatedServices = remediation.size;

    const { baseScore, criticalPenalty, finalScore } = calculateScore(
      totalServices,
      criticalServices,
      remediatedServices
    );

    setScore(finalScore);
    addOutput(
      formatScoreOutput(
        totalServices,
        criticalServices,
        remediatedServices,
        baseScore,
        criticalPenalty,
        finalScore
      )
    );
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    addOutput(`> ${cmd}`);

    if (trimmedCmd === 'help') {
      showHelp();
    } else if (trimmedCmd === 'scan' || trimmedCmd.startsWith('scan ')) {
      startScan(trimmedCmd);
    } else if (trimmedCmd === 'clear') {
      clearOutput();
    } else if (trimmedCmd.startsWith('info ')) {
      const port = extractPort(trimmedCmd);
      if (port) showPortInfo(port);
    } else if (trimmedCmd.startsWith('remediate ')) {
      const port = extractPort(trimmedCmd);
      if (port) showRemediationOptions(port);
    } else if (trimmedCmd === 'assess') {
      startAssessment();
    } else if (trimmedCmd === 'score') {
      showScore();
    } else if (trimmedCmd.startsWith('networks')) {
      listNetworks();
    } else {
      addOutput(`Unknown command: ${trimmedCmd}`);
      addOutput('Type "help" for available commands');
    }
  };

  return { handleCommand, score, assessmentMode };
};
