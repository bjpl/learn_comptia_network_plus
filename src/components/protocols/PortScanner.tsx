/**
 * Component 11: Port Scanner Simulator
 * Terminal-style interface simulating nmap/port scanning with security recommendations
 */

import React, { useState, useEffect, useRef } from 'react';
import { VIRTUAL_NETWORKS, PROTOCOLS } from './protocols-data';
import type { VirtualNetwork, ScannerState } from './protocols-types';

export const PortScanner: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<VirtualNetwork>(VIRTUAL_NETWORKS[0]);
  const [scannerState, setScannerState] = useState<ScannerState>({
    scanning: false,
    currentPort: 0,
    results: [],
    selectedPort: undefined,
  });
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '╔════════════════════════════════════════════════════════════════╗',
    '║           Network+ Port Scanner Simulator v2.0.0              ║',
    '║         Educational Tool - CompTIA Network+ Training           ║',
    '╚════════════════════════════════════════════════════════════════╝',
    '',
    'Type "help" for available commands',
    'Select a target network to begin scanning',
    '',
  ]);
  const [command, setCommand] = useState('');
  const [score, setScore] = useState(0);
  const [, setAssessmentMode] = useState(false);
  const [remediation, setRemediation] = useState<Map<number, string[]>>(new Map());
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const addOutput = (lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setTerminalOutput((prev) => [...prev, ...newLines]);
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    addOutput(`> ${cmd}`);

    if (trimmedCmd === 'help') {
      showHelp();
    } else if (trimmedCmd === 'scan' || trimmedCmd.startsWith('scan ')) {
      startScan(trimmedCmd);
    } else if (trimmedCmd === 'clear') {
      setTerminalOutput([]);
    } else if (trimmedCmd.startsWith('info ')) {
      const port = parseInt(trimmedCmd.split(' ')[1]);
      showPortInfo(port);
    } else if (trimmedCmd.startsWith('remediate ')) {
      const port = parseInt(trimmedCmd.split(' ')[1]);
      showRemediationOptions(port);
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

    setCommand('');
  };

  const showHelp = () => {
    addOutput([
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
    ]);
  };

  const listNetworks = () => {
    addOutput([
      '',
      '═══════════════ AVAILABLE NETWORKS ═══════════════',
      '',
      ...VIRTUAL_NETWORKS.map(
        (net) =>
          `  ${net.id.padEnd(20)} - ${net.difficulty.toUpperCase().padEnd(10)} - ${net.description}`
      ),
      '',
      'Use "scan [network-id]" to scan a specific network',
      '',
    ]);
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

    addOutput([
      '',
      `Starting scan on: ${targetNetwork.name}`,
      `Difficulty: ${targetNetwork.difficulty.toUpperCase()}`,
      `Target: ${targetNetwork.description}`,
      '',
      '════════════════════════════════════════════════════════════',
      'PORT      STATE    SERVICE           VERSION',
      '════════════════════════════════════════════════════════════',
    ]);

    setScannerState({
      scanning: true,
      currentPort: 0,
      results: [],
      selectedPort: undefined,
    });

    // Simulate scanning with delays
    targetNetwork.services.forEach((service, index) => {
      setTimeout(
        () => {
          const portStr = service.port.toString().padEnd(10);
          const stateStr = service.state.padEnd(9);
          const serviceStr = service.service.padEnd(18);
          const versionStr = service.version;

          addOutput(`${portStr}${stateStr}${serviceStr}${versionStr}`);

          setScannerState((prev) => ({
            ...prev,
            currentPort: service.port,
            results: [...prev.results, service],
          }));

          if (index === targetNetwork.services.length - 1) {
            setTimeout(() => {
              addOutput([
                '════════════════════════════════════════════════════════════',
                '',
                `Scan complete. Found ${targetNetwork.services.length} open ports.`,
                'Use "info [port]" to get detailed information',
                'Use "assess" to start security assessment',
                '',
              ]);
              setScannerState((prev) => ({ ...prev, scanning: false }));
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
      ...service.recommendations.map((rec, _idx) => `  ${_idx + 1}. ${rec}`),
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

    addOutput([
      '',
      `═══════ REMEDIATION DECISION TREE - PORT ${port} ═══════`,
      '',
      `Service: ${service.service} (${service.risk.toUpperCase()} risk)`,
      '',
      'What would you do? (Choose your approach)',
      '',
    ]);

    // Generate decision tree based on risk level
    if (service.risk === 'critical') {
      addOutput([
        '⚠️  CRITICAL RISK - Immediate action required!',
        '',
        'Recommended actions (in order of priority):',
        '  1. DISABLE service immediately if not required',
        '  2. ISOLATE from internet/untrusted networks',
        '  3. UPDATE to latest secure version',
        '  4. IMPLEMENT strong authentication',
        '  5. ENABLE encryption if available',
        '  6. MONITOR for suspicious activity',
        '',
        'Specific recommendations for this service:',
        ...service.recommendations.map((rec) => `  → ${rec}`),
        '',
      ]);
    } else if (service.risk === 'high') {
      addOutput([
        '⚠️  HIGH RISK - Action needed soon',
        '',
        'Recommended actions:',
        '  1. REVIEW necessity of service',
        '  2. RESTRICT access (firewall/VPN)',
        '  3. UPDATE to latest version',
        '  4. STRENGTHEN authentication',
        '  5. MONITOR access logs',
        '',
        'Specific recommendations:',
        ...service.recommendations.map((rec) => `  → ${rec}`),
        '',
      ]);
    } else if (service.risk === 'medium') {
      addOutput([
        '⚡ MEDIUM RISK - Should be addressed',
        '',
        'Recommended actions:',
        '  1. VERIFY security configuration',
        '  2. IMPLEMENT best practices',
        '  3. SCHEDULE regular updates',
        '  4. REVIEW access controls',
        '',
        'Specific recommendations:',
        ...service.recommendations.map((rec) => `  → ${rec}`),
        '',
      ]);
    } else {
      addOutput([
        '✓ LOW RISK - Maintain security posture',
        '',
        'Recommended actions:',
        '  1. MAINTAIN current configuration',
        '  2. REGULAR security updates',
        '  3. PERIODIC security reviews',
        '',
        'Specific recommendations:',
        ...service.recommendations.map((rec) => `  → ${rec}`),
        '',
      ]);
    }

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

    const baseScore = (remediatedServices / totalServices) * 100;
    const criticalPenalty = criticalServices * 10;
    const finalScore = Math.max(0, Math.min(100, baseScore - criticalPenalty));

    setScore(finalScore);

    addOutput([
      '',
      '═══════════════ ASSESSMENT SCORE ═══════════════',
      '',
      `Services Scanned:      ${totalServices}`,
      `Critical Risks Found:  ${criticalServices}`,
      `Services Remediated:   ${remediatedServices}`,
      '',
      `Base Score:            ${baseScore.toFixed(1)}%`,
      `Critical Penalty:      -${criticalPenalty}%`,
      '',
      `═══════════════════════════════════════════════`,
      `FINAL SCORE:           ${finalScore.toFixed(1)}%`,
      `═══════════════════════════════════════════════`,
      '',
      finalScore >= 90
        ? '🏆 EXCELLENT! Outstanding security awareness!'
        : finalScore >= 75
          ? '✓ GOOD! Solid understanding of security principles'
          : finalScore >= 60
            ? '⚡ FAIR! Review critical vulnerabilities'
            : '⚠️  NEEDS IMPROVEMENT! Focus on high-risk services',
      '',
    ]);
  };

  return (
    <div className="port-scanner">
      <div className="scanner-header">
        <h2>Port Scanner Simulator</h2>
        <p className="subtitle">Learn network security through hands-on port scanning practice</p>
      </div>

      <div className="scanner-container">
        <div className="network-selector">
          <label>Target Network:</label>
          <select
            value={selectedNetwork.id}
            onChange={(e) => {
              const network = VIRTUAL_NETWORKS.find((n) => n.id === e.target.value);
              if (network) {
                setSelectedNetwork(network);
                addOutput([
                  '',
                  `Target changed to: ${network.name}`,
                  `Difficulty: ${network.difficulty.toUpperCase()}`,
                  `Run "scan" to begin port scan`,
                  '',
                ]);
              }
            }}
          >
            {VIRTUAL_NETWORKS.map((net) => (
              <option key={net.id} value={net.id}>
                {net.name} ({net.difficulty})
              </option>
            ))}
          </select>

          <div className={`difficulty-badge ${selectedNetwork.difficulty}`}>
            {selectedNetwork.difficulty.toUpperCase()}
          </div>
        </div>

        <div className="terminal" ref={terminalRef}>
          {terminalOutput.map((line, index) => (
            <div key={index} className="terminal-line">
              {line}
            </div>
          ))}
          {scannerState.scanning && (
            <div className="terminal-line scanning">
              <span className="spinner">⟳</span> Scanning port {scannerState.currentPort}...
            </div>
          )}
        </div>

        <div className="command-input">
          <span className="prompt">scanner@network+:~$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCommand(command);
              }
            }}
            placeholder="Enter command... (type 'help' for commands)"
            disabled={scannerState.scanning}
          />
        </div>

        <div className="quick-actions">
          <button onClick={() => handleCommand('scan')} disabled={scannerState.scanning}>
            🔍 Scan Network
          </button>
          <button onClick={() => handleCommand('assess')}>📊 Start Assessment</button>
          <button onClick={() => handleCommand('score')}>🏆 Show Score</button>
          <button onClick={() => handleCommand('help')}>❓ Help</button>
        </div>

        {score > 0 && (
          <div className={`score-display ${score >= 75 ? 'good' : score >= 50 ? 'fair' : 'poor'}`}>
            <h3>Current Score: {score.toFixed(1)}%</h3>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${score}%` }} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .port-scanner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Courier New', monospace;
        }

        .scanner-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .scanner-header h2 {
          color: #2c3e50;
          font-family: 'Segoe UI', sans-serif;
        }

        .subtitle {
          color: #7f8c8d;
          font-family: 'Segoe UI', sans-serif;
          font-style: italic;
        }

        .scanner-container {
          background: #1e1e1e;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          overflow: hidden;
        }

        .network-selector {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: #2d2d2d;
          border-bottom: 2px solid #3498db;
        }

        .network-selector label {
          color: #ecf0f1;
          font-weight: bold;
        }

        .network-selector select {
          flex: 1;
          padding: 8px 15px;
          background: #34495e;
          color: #ecf0f1;
          border: 2px solid #3498db;
          border-radius: 5px;
          font-family: inherit;
          font-size: 14px;
        }

        .difficulty-badge {
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }

        .difficulty-badge.easy {
          background: #2ecc71;
          color: white;
        }

        .difficulty-badge.medium {
          background: #f39c12;
          color: white;
        }

        .difficulty-badge.hard {
          background: #e74c3c;
          color: white;
        }

        .terminal {
          height: 500px;
          overflow-y: auto;
          padding: 20px;
          background: #1e1e1e;
          color: #00ff00;
          font-size: 14px;
          line-height: 1.6;
        }

        .terminal-line {
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .terminal-line.scanning {
          color: #3498db;
        }

        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .terminal::-webkit-scrollbar {
          width: 10px;
        }

        .terminal::-webkit-scrollbar-track {
          background: #2d2d2d;
        }

        .terminal::-webkit-scrollbar-thumb {
          background: #3498db;
          border-radius: 5px;
        }

        .command-input {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: #2d2d2d;
          border-top: 1px solid #34495e;
        }

        .prompt {
          color: #3498db;
          margin-right: 10px;
          font-weight: bold;
        }

        .command-input input {
          flex: 1;
          padding: 8px 15px;
          background: #34495e;
          color: #ecf0f1;
          border: 2px solid #3498db;
          border-radius: 5px;
          font-family: inherit;
          font-size: 14px;
        }

        .command-input input:focus {
          outline: none;
          border-color: #2ecc71;
        }

        .command-input input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quick-actions {
          display: flex;
          gap: 10px;
          padding: 15px 20px;
          background: #2d2d2d;
          border-top: 1px solid #34495e;
        }

        .quick-actions button {
          flex: 1;
          padding: 10px 15px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-actions button:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .quick-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .score-display {
          padding: 20px;
          background: #2d2d2d;
          border-top: 2px solid #34495e;
        }

        .score-display h3 {
          color: #ecf0f1;
          font-family: 'Segoe UI', sans-serif;
          margin-bottom: 15px;
          text-align: center;
        }

        .score-bar {
          height: 30px;
          background: #34495e;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
        }

        .score-fill {
          height: 100%;
          transition: width 0.5s ease;
          background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
        }

        .score-display.good .score-fill {
          background: linear-gradient(90deg, #2ecc71, #27ae60);
        }

        .score-display.fair .score-fill {
          background: linear-gradient(90deg, #f39c12, #e67e22);
        }

        .score-display.poor .score-fill {
          background: linear-gradient(90deg, #e74c3c, #c0392b);
        }

        @media (max-width: 768px) {
          .terminal {
            height: 400px;
            font-size: 12px;
          }

          .quick-actions {
            flex-wrap: wrap;
          }

          .quick-actions button {
            flex: 1 1 45%;
          }
        }
      `}</style>
    </div>
  );
};

export default PortScanner;
