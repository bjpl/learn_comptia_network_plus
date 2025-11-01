/**
 * Component #8: Enhanced Port Scanner Simulator
 * Educational port scanner for understanding network security concepts in CompTIA Network+
 *
 * Features:
 * - Multiple scan type simulators (TCP Connect, SYN, UDP, ACK)
 * - Port state visualization (Open, Closed, Filtered, Open|Filtered)
 * - Stealth vs non-stealth comparison
 * - Service banner detection
 * - Defense mechanism simulation (Firewall, IDS, rate limiting)
 * - Ethical hacking disclaimer and educational focus
 */

import React, { useState, useRef, useEffect } from 'react';

// ==================== TYPES ====================

type ScanType = 'tcp-connect' | 'syn-scan' | 'udp-scan' | 'ack-scan' | 'banner-grab';
type PortState = 'open' | 'closed' | 'filtered' | 'open|filtered' | 'unfiltered';

interface PacketExchange {
  step: number;
  source: 'scanner' | 'target';
  flags?: string[];
  type: string;
  description: string;
  detected?: boolean;
}

interface ScanResult {
  port: number;
  state: PortState;
  service: string;
  banner?: string;
  osFingerprint?: string;
  scanType: ScanType;
  exchanges: PacketExchange[];
  detected: boolean;
}

interface FirewallRule {
  id: string;
  port: number;
  action: 'allow' | 'block' | 'rate-limit';
  enabled: boolean;
}

interface DefenseConfig {
  firewallEnabled: boolean;
  idsEnabled: boolean;
  rateLimitEnabled: boolean;
  portKnocking: boolean;
  rules: FirewallRule[];
}

// ==================== CONSTANTS ====================

const COMMON_PORTS = [
  { port: 21, service: 'FTP', banner: 'vsftpd 3.0.3', risk: 'high' },
  { port: 22, service: 'SSH', banner: 'OpenSSH 8.2p1 Ubuntu', risk: 'low' },
  { port: 23, service: 'Telnet', banner: 'Linux telnetd', risk: 'critical' },
  { port: 25, service: 'SMTP', banner: 'Postfix smtpd', risk: 'medium' },
  { port: 53, service: 'DNS', banner: 'BIND 9.16.1', risk: 'medium' },
  { port: 80, service: 'HTTP', banner: 'nginx/1.18.0', risk: 'medium' },
  { port: 443, service: 'HTTPS', banner: 'nginx/1.18.0 (TLS 1.3)', risk: 'low' },
  { port: 445, service: 'SMB', banner: 'Samba smbd 4.11.6', risk: 'high' },
  { port: 3306, service: 'MySQL', banner: 'MySQL 8.0.23', risk: 'critical' },
  { port: 3389, service: 'RDP', banner: 'Microsoft Terminal Services', risk: 'critical' },
];

const SCAN_EXPLANATIONS = {
  'tcp-connect': {
    name: 'TCP Connect Scan',
    stealth: false,
    description: 'Completes full 3-way TCP handshake. Most reliable but easily detected.',
    steps: [
      'Scanner sends SYN packet',
      'Target responds with SYN-ACK (open) or RST (closed)',
      'Scanner sends ACK to complete handshake',
      'Scanner sends RST to close connection'
    ],
    detection: 'HIGH - Logs created, IDS alerts triggered',
    useCases: ['Reliable service detection', 'When stealth is not required', 'Troubleshooting connectivity'],
    pros: ['Most accurate results', 'Works through most firewalls', 'Clear service identification'],
    cons: ['Easily logged', 'IDS detection', 'Slower than SYN scan']
  },
  'syn-scan': {
    name: 'SYN Scan (Stealth/Half-Open)',
    stealth: true,
    description: 'Sends SYN, receives SYN-ACK, but sends RST instead of ACK. Never completes handshake.',
    steps: [
      'Scanner sends SYN packet',
      'Target responds with SYN-ACK (open) or RST (closed)',
      'Scanner sends RST to abort (no connection logged)',
    ],
    detection: 'MEDIUM - May avoid application logs, but IDS can still detect',
    useCases: ['Default nmap scan', 'Stealth scanning', 'Fast network reconnaissance'],
    pros: ['Faster than TCP Connect', 'Less likely to be logged', 'Good stealth/reliability balance'],
    cons: ['Requires raw socket access (root)', 'Still detectable by IDS', 'May be blocked by stateful firewalls']
  },
  'udp-scan': {
    name: 'UDP Scan',
    stealth: true,
    description: 'Sends UDP packets. Response interpretation is tricky due to connectionless nature.',
    steps: [
      'Scanner sends UDP packet to port',
      'Closed port: ICMP Port Unreachable',
      'Open port: Usually no response (or service-specific response)',
      'Filtered: No response at all'
    ],
    detection: 'LOW - No connection state, harder to detect',
    useCases: ['DNS discovery', 'SNMP detection', 'DHCP server identification'],
    pros: ['Discovers UDP services', 'Very stealthy', 'Less commonly scanned'],
    cons: ['Very slow (timeout-based)', 'Ambiguous results (open|filtered)', 'Can trigger rate limiting']
  },
  'ack-scan': {
    name: 'ACK Scan (Firewall Detection)',
    stealth: true,
    description: 'Never finds open ports. Used to map firewall rules and detect filtering.',
    steps: [
      'Scanner sends ACK packet (unsolicited)',
      'Unfiltered port: RST response',
      'Filtered port: No response or ICMP unreachable'
    ],
    detection: 'LOW - Looks like normal traffic anomaly',
    useCases: ['Firewall rule mapping', 'Detecting stateful firewalls', 'Network security assessment'],
    pros: ['Maps firewall rules', 'Very stealthy', 'Bypasses some IDS'],
    cons: ['Does not identify open ports', 'Limited practical use', 'Requires interpretation']
  },
  'banner-grab': {
    name: 'Service Banner Grabbing',
    stealth: false,
    description: 'Connects to service and retrieves version information for vulnerability assessment.',
    steps: [
      'Complete TCP connection to service',
      'Send protocol-specific request',
      'Capture service banner/version',
      'Analyze for vulnerabilities'
    ],
    detection: 'HIGH - Full connection logged',
    useCases: ['Version detection', 'Vulnerability scanning', 'OS fingerprinting'],
    pros: ['Accurate version info', 'Identifies vulnerabilities', 'OS detection possible'],
    cons: ['Highly detectable', 'Slow process', 'May trigger alarms']
  }
};

// ==================== MAIN COMPONENT ====================

export const PortScannerEnhanced: React.FC = () => {
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('syn-scan');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [defenseConfig, setDefenseConfig] = useState<DefenseConfig>({
    firewallEnabled: false,
    idsEnabled: false,
    rateLimitEnabled: false,
    portKnocking: false,
    rules: COMMON_PORTS.slice(0, 5).map(p => ({
      id: `rule-${p.port}`,
      port: p.port,
      action: 'allow',
      enabled: false
    }))
  });
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '╔════════════════════════════════════════════════════════════════╗',
    '║     Enhanced Port Scanner Simulator - CompTIA Network+        ║',
    '║              Educational Security Training Tool                ║',
    '╚════════════════════════════════════════════════════════════════╝',
    '',
    '⚠️  DISCLAIMER: This is an EDUCATIONAL SIMULATOR only.',
    '   Real port scanning without authorization is ILLEGAL.',
    '   Use only on networks you own or have permission to test.',
    ''
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const addTerminalOutput = (lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setTerminalOutput(prev => [...prev, ...newLines]);
  };

  // ==================== SCAN SIMULATION ====================

  const simulatePacketExchange = (scanType: ScanType, port: number, isFiltered: boolean): PacketExchange[] => {
    const isOpen = Math.random() > 0.5;

    switch (scanType) {
      case 'tcp-connect':
        if (isFiltered) {
          return [
            { step: 1, source: 'scanner', flags: ['SYN'], type: 'SYN', description: 'Scanner initiates connection', detected: true },
            { step: 2, source: 'target', type: 'TIMEOUT', description: 'No response (filtered by firewall)', detected: true }
          ];
        }
        return isOpen ? [
          { step: 1, source: 'scanner', flags: ['SYN'], type: 'SYN', description: 'Scanner initiates connection', detected: true },
          { step: 2, source: 'target', flags: ['SYN', 'ACK'], type: 'SYN-ACK', description: 'Target accepts connection', detected: true },
          { step: 3, source: 'scanner', flags: ['ACK'], type: 'ACK', description: 'Handshake complete', detected: true },
          { step: 4, source: 'scanner', flags: ['RST'], type: 'RST', description: 'Scanner terminates', detected: true }
        ] : [
          { step: 1, source: 'scanner', flags: ['SYN'], type: 'SYN', description: 'Scanner initiates connection', detected: true },
          { step: 2, source: 'target', flags: ['RST', 'ACK'], type: 'RST-ACK', description: 'Port closed, connection refused', detected: true }
        ];

      case 'syn-scan':
        if (isFiltered) {
          return [
            { step: 1, source: 'scanner', flags: ['SYN'], type: 'SYN', description: 'Scanner sends stealth probe', detected: false },
            { step: 2, source: 'target', type: 'TIMEOUT', description: 'No response (filtered)', detected: false }
          ];
        }
        return isOpen ? [
          { step: 1, source: 'scanner', flags: ['SYN'], type: 'SYN', description: 'Scanner sends stealth probe', detected: false },
          { step: 2, source: 'target', flags: ['SYN', 'ACK'], type: 'SYN-ACK', description: 'Port open, but...', detected: true },
          { step: 3, source: 'scanner', flags: ['RST'], type: 'RST', description: 'Scanner aborts (no connection log!)', detected: true }
        ] : [
          { step: 1, source: 'scanner', flags: ['SYN'], type: 'SYN', description: 'Scanner sends stealth probe', detected: false },
          { step: 2, source: 'target', flags: ['RST', 'ACK'], type: 'RST-ACK', description: 'Port closed', detected: true }
        ];

      case 'udp-scan':
        if (isFiltered) {
          return [
            { step: 1, source: 'scanner', type: 'UDP', description: 'Send UDP packet', detected: false },
            { step: 2, source: 'target', type: 'TIMEOUT', description: 'No response (open|filtered)', detected: false }
          ];
        }
        return isOpen ? [
          { step: 1, source: 'scanner', type: 'UDP', description: 'Send UDP packet', detected: false },
          { step: 2, source: 'target', type: 'TIMEOUT', description: 'No response (likely open)', detected: false }
        ] : [
          { step: 1, source: 'scanner', type: 'UDP', description: 'Send UDP packet', detected: false },
          { step: 2, source: 'target', type: 'ICMP', description: 'ICMP Port Unreachable (closed)', detected: true }
        ];

      case 'ack-scan':
        if (isFiltered) {
          return [
            { step: 1, source: 'scanner', flags: ['ACK'], type: 'ACK', description: 'Send unsolicited ACK', detected: false },
            { step: 2, source: 'target', type: 'TIMEOUT', description: 'No response (filtered)', detected: false }
          ];
        }
        return [
          { step: 1, source: 'scanner', flags: ['ACK'], type: 'ACK', description: 'Send unsolicited ACK', detected: false },
          { step: 2, source: 'target', flags: ['RST'], type: 'RST', description: 'Port unfiltered', detected: true }
        ];

      case 'banner-grab':
        if (isFiltered || !isOpen) {
          return [
            { step: 1, source: 'scanner', type: 'CONNECT', description: 'Attempt connection', detected: true },
            { step: 2, source: 'target', type: 'REFUSE', description: 'Connection failed', detected: true }
          ];
        }
        return [
          { step: 1, source: 'scanner', type: 'CONNECT', description: 'Establish full connection', detected: true },
          { step: 2, source: 'target', type: 'BANNER', description: 'Service sends banner', detected: true },
          { step: 3, source: 'scanner', type: 'ANALYZE', description: 'Analyze version info', detected: true },
          { step: 4, source: 'scanner', type: 'CLOSE', description: 'Close connection', detected: true }
        ];

      default:
        return [];
    }
  };

  const determinePortState = (scanType: ScanType, exchanges: PacketExchange[], isFiltered: boolean): PortState => {
    if (isFiltered) {
      return scanType === 'udp-scan' ? 'open|filtered' : 'filtered';
    }

    const lastExchange = exchanges[exchanges.length - 1];

    if (scanType === 'ack-scan') {
      return lastExchange.type === 'TIMEOUT' ? 'filtered' : 'unfiltered';
    }

    if (scanType === 'udp-scan') {
      return lastExchange.type === 'ICMP' ? 'closed' : 'open|filtered';
    }

    const hasOpenIndicator = exchanges.some(e =>
      e.type.includes('SYN-ACK') || e.type === 'BANNER'
    );
    const hasClosedIndicator = exchanges.some(e =>
      e.type.includes('RST') && !e.type.includes('SYN-ACK')
    );

    if (hasOpenIndicator) return 'open';
    if (hasClosedIndicator) return 'closed';

    return 'filtered';
  };

  const startScan = async () => {
    setScanning(true);
    setResults([]);

    const scanInfo = SCAN_EXPLANATIONS[selectedScanType];
    addTerminalOutput([
      '',
      `════════════════════════════════════════════════════════════`,
      `Starting ${scanInfo.name}`,
      `Stealth Level: ${scanInfo.stealth ? '🟢 HIGH' : '🔴 LOW'}`,
      `Detection Risk: ${scanInfo.detection}`,
      '',
      `Defense Status:`,
      `  Firewall: ${defenseConfig.firewallEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`,
      `  IDS/IPS: ${defenseConfig.idsEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`,
      `  Rate Limit: ${defenseConfig.rateLimitEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`,
      '',
      `PORT      STATE           SERVICE         DETECTION`,
      `════════════════════════════════════════════════════════════`
    ]);

    const portsToScan = COMMON_PORTS.slice(0, 8);
    const scanResults: ScanResult[] = [];

    for (const portInfo of portsToScan) {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if port is filtered by firewall
      const rule = defenseConfig.rules.find(r => r.port === portInfo.port);
      const isFiltered = defenseConfig.firewallEnabled &&
                        rule?.enabled &&
                        rule.action === 'block';

      const exchanges = simulatePacketExchange(selectedScanType, portInfo.port, isFiltered);
      const state = determinePortState(selectedScanType, exchanges, isFiltered);
      const wasDetected = defenseConfig.idsEnabled && exchanges.some(e => e.detected);

      const banner = selectedScanType === 'banner-grab' && state === 'open'
        ? portInfo.banner
        : undefined;

      const result: ScanResult = {
        port: portInfo.port,
        state,
        service: portInfo.service,
        banner,
        scanType: selectedScanType,
        exchanges,
        detected: wasDetected
      };

      scanResults.push(result);

      const stateStr = state.padEnd(15);
      const serviceStr = portInfo.service.padEnd(15);
      const detectionStr = wasDetected ? '🚨 DETECTED' : '✓ Stealth';

      addTerminalOutput(
        `${portInfo.port.toString().padEnd(10)}${stateStr}${serviceStr}${detectionStr}`
      );

      if (wasDetected && defenseConfig.idsEnabled) {
        addTerminalOutput(`  ⚠️  IDS Alert: Suspicious scan detected from scanner`);
      }
    }

    setResults(scanResults);

    addTerminalOutput([
      `════════════════════════════════════════════════════════════`,
      '',
      `Scan Complete: ${scanResults.length} ports scanned`,
      `Detection Events: ${scanResults.filter(r => r.detected).length}`,
      ``,
      `Click on any port for detailed packet analysis`,
      ''
    ]);

    setScanning(false);
  };

  // ==================== RENDER ====================

  const renderPacketExchange = (result: ScanResult) => {
    return (
      <div className="packet-exchange">
        <h4>Packet Exchange Analysis - Port {result.port}</h4>
        <div className="exchange-timeline">
          {result.exchanges.map((exchange, idx) => (
            <div key={idx} className={`exchange-step ${exchange.source} ${exchange.detected ? 'detected' : ''}`}>
              <div className="step-number">Step {exchange.step}</div>
              <div className="step-content">
                <div className="step-source">
                  {exchange.source === 'scanner' ? '📡 Scanner' : '🖥️ Target'}
                  {exchange.flags && (
                    <span className="flags"> [{exchange.flags.join(', ')}]</span>
                  )}
                </div>
                <div className="step-type">{exchange.type}</div>
                <div className="step-description">{exchange.description}</div>
                {exchange.detected && (
                  <div className="detection-badge">🚨 Logged/Detected</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="exchange-summary">
          <h5>Scan Result: <span className={`state-${result.state}`}>{result.state.toUpperCase()}</span></h5>
          {result.banner && (
            <div className="banner-info">
              <strong>Banner:</strong> {result.banner}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScanTypeInfo = () => {
    const info = SCAN_EXPLANATIONS[selectedScanType];
    return (
      <div className="scan-type-info">
        <h3>{info.name}</h3>
        <div className={`stealth-indicator ${info.stealth ? 'stealth' : 'normal'}`}>
          {info.stealth ? '🕵️ STEALTH SCAN' : '👁️ NON-STEALTH SCAN'}
        </div>
        <p className="description">{info.description}</p>

        <div className="info-section">
          <h4>How It Works:</h4>
          <ol>
            {info.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="info-section">
          <h4>Detection Risk: {info.detection}</h4>
          <h4>Use Cases:</h4>
          <ul>
            {info.useCases.map((useCase, idx) => (
              <li key={idx}>{useCase}</li>
            ))}
          </ul>
        </div>

        <div className="pros-cons">
          <div className="pros">
            <h4>✅ Advantages:</h4>
            <ul>
              {info.pros.map((pro, idx) => (
                <li key={idx}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className="cons">
            <h4>❌ Disadvantages:</h4>
            <ul>
              {info.cons.map((con, idx) => (
                <li key={idx}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderDefenseConfig = () => {
    return (
      <div className="defense-config">
        <h3>Defense Mechanisms</h3>

        <div className="defense-toggles">
          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={defenseConfig.firewallEnabled}
              onChange={e => setDefenseConfig(prev => ({
                ...prev,
                firewallEnabled: e.target.checked
              }))}
            />
            <span>🛡️ Firewall (Port Filtering)</span>
          </label>

          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={defenseConfig.idsEnabled}
              onChange={e => setDefenseConfig(prev => ({
                ...prev,
                idsEnabled: e.target.checked
              }))}
            />
            <span>🚨 IDS/IPS (Intrusion Detection)</span>
          </label>

          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={defenseConfig.rateLimitEnabled}
              onChange={e => setDefenseConfig(prev => ({
                ...prev,
                rateLimitEnabled: e.target.checked
              }))}
            />
            <span>⏱️ Rate Limiting</span>
          </label>

          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={defenseConfig.portKnocking}
              onChange={e => setDefenseConfig(prev => ({
                ...prev,
                portKnocking: e.target.checked
              }))}
            />
            <span>🚪 Port Knocking</span>
          </label>
        </div>

        {defenseConfig.firewallEnabled && (
          <div className="firewall-rules">
            <h4>Firewall Rules:</h4>
            {defenseConfig.rules.map(rule => (
              <div key={rule.id} className="firewall-rule">
                <label>
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={e => setDefenseConfig(prev => ({
                      ...prev,
                      rules: prev.rules.map(r =>
                        r.id === rule.id ? { ...r, enabled: e.target.checked } : r
                      )
                    }))}
                  />
                  Port {rule.port}
                </label>
                <select
                  value={rule.action}
                  onChange={e => setDefenseConfig(prev => ({
                    ...prev,
                    rules: prev.rules.map(r =>
                      r.id === rule.id ? { ...r, action: e.target.value as any } : r
                    )
                  }))}
                  disabled={!rule.enabled}
                >
                  <option value="allow">Allow</option>
                  <option value="block">Block</option>
                  <option value="rate-limit">Rate Limit</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="port-scanner-enhanced">
      {showDisclaimer && (
        <div className="disclaimer-modal">
          <div className="disclaimer-content">
            <h2>⚠️ EDUCATIONAL USE ONLY</h2>
            <div className="disclaimer-text">
              <p><strong>IMPORTANT LEGAL NOTICE:</strong></p>
              <p>This is a SIMULATED port scanner for EDUCATIONAL purposes only.</p>
              <p>Unauthorized port scanning is ILLEGAL and may violate:</p>
              <ul>
                <li>Computer Fraud and Abuse Act (CFAA)</li>
                <li>Your organization's acceptable use policy</li>
                <li>International cybersecurity laws</li>
              </ul>
              <p><strong>Only scan networks you OWN or have WRITTEN PERMISSION to test.</strong></p>
              <p>This simulator teaches Network+ concepts without performing real scans.</p>
            </div>
            <button onClick={() => setShowDisclaimer(false)} className="accept-button">
              I Understand - Continue to Educational Simulator
            </button>
          </div>
        </div>
      )}

      <div className="scanner-header">
        <h1>🔍 Enhanced Port Scanner Simulator</h1>
        <p className="subtitle">Learn network security scanning techniques - CompTIA Network+ Certification</p>
      </div>

      <div className="scanner-layout">
        <div className="left-panel">
          <div className="scan-controls">
            <h3>Scan Configuration</h3>

            <div className="scan-type-selector">
              <label>Scan Type:</label>
              <select
                value={selectedScanType}
                onChange={e => setSelectedScanType(e.target.value as ScanType)}
                disabled={scanning}
              >
                <option value="tcp-connect">TCP Connect Scan (Non-Stealth)</option>
                <option value="syn-scan">SYN Scan (Stealth)</option>
                <option value="udp-scan">UDP Scan</option>
                <option value="ack-scan">ACK Scan (Firewall Detection)</option>
                <option value="banner-grab">Banner Grabbing</option>
              </select>
            </div>

            <button
              onClick={startScan}
              disabled={scanning}
              className="scan-button"
            >
              {scanning ? '⟳ Scanning...' : '🚀 Start Scan'}
            </button>
          </div>

          {renderScanTypeInfo()}
          {renderDefenseConfig()}
        </div>

        <div className="right-panel">
          <div className="terminal" ref={terminalRef}>
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="terminal-line">{line}</div>
            ))}
          </div>

          {results.length > 0 && (
            <div className="results-panel">
              <h3>Scan Results - Click for Details</h3>
              <div className="results-grid">
                {results.map(result => (
                  <div
                    key={result.port}
                    className={`result-card ${selectedPort === result.port ? 'selected' : ''} state-${result.state}`}
                    onClick={() => setSelectedPort(result.port)}
                  >
                    <div className="result-port">Port {result.port}</div>
                    <div className="result-service">{result.service}</div>
                    <div className={`result-state state-${result.state}`}>
                      {result.state.toUpperCase()}
                    </div>
                    {result.detected && <div className="detected-badge">🚨</div>}
                  </div>
                ))}
              </div>

              {selectedPort && (
                <div className="packet-details">
                  {renderPacketExchange(results.find(r => r.port === selectedPort)!)}
                </div>
              )}
            </div>
          )}

          <div className="exam-tips">
            <h3>📚 CompTIA Network+ Exam Tips</h3>
            <ul>
              <li><strong>Security Implications:</strong> Open ports are potential attack vectors</li>
              <li><strong>Common Services:</strong> Memorize standard ports (21=FTP, 22=SSH, 80=HTTP, 443=HTTPS)</li>
              <li><strong>Firewall vs ACL:</strong> Firewalls are stateful, ACLs are stateless</li>
              <li><strong>Troubleshooting:</strong> Closed = service stopped, Filtered = firewall blocking</li>
              <li><strong>Best Practices:</strong> Disable unnecessary services, use non-standard ports for security through obscurity</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .port-scanner-enhanced {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0e0;
          font-family: 'Segoe UI', system-ui, sans-serif;
          padding: 20px;
        }

        .disclaimer-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .disclaimer-content {
          background: #1e1e1e;
          padding: 40px;
          border-radius: 15px;
          max-width: 600px;
          border: 3px solid #e74c3c;
        }

        .disclaimer-content h2 {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 20px;
        }

        .disclaimer-text {
          line-height: 1.8;
        }

        .disclaimer-text ul {
          margin: 15px 0;
          padding-left: 25px;
        }

        .accept-button {
          width: 100%;
          padding: 15px;
          background: #27ae60;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }

        .accept-button:hover {
          background: #229954;
        }

        .scanner-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .scanner-header h1 {
          color: #00d9ff;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #95a5a6;
          font-style: italic;
        }

        .scanner-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 20px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .left-panel, .right-panel {
          background: #1e1e1e;
          border-radius: 10px;
          padding: 20px;
        }

        .scan-controls {
          margin-bottom: 30px;
        }

        .scan-type-selector {
          margin: 15px 0;
        }

        .scan-type-selector label {
          display: block;
          margin-bottom: 8px;
          color: #00d9ff;
          font-weight: bold;
        }

        .scan-type-selector select {
          width: 100%;
          padding: 10px;
          background: #2d2d2d;
          color: #e0e0e0;
          border: 2px solid #00d9ff;
          border-radius: 5px;
          font-size: 14px;
        }

        .scan-button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .scan-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .scan-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .scan-type-info {
          background: #2d2d2d;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .scan-type-info h3 {
          color: #00d9ff;
          margin-bottom: 10px;
        }

        .stealth-indicator {
          display: inline-block;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .stealth-indicator.stealth {
          background: #27ae60;
        }

        .stealth-indicator.normal {
          background: #e74c3c;
        }

        .info-section {
          margin: 15px 0;
        }

        .info-section h4 {
          color: #00d9ff;
          margin-bottom: 8px;
        }

        .info-section ol, .info-section ul {
          padding-left: 20px;
        }

        .info-section li {
          margin: 5px 0;
          line-height: 1.6;
        }

        .pros-cons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }

        .pros, .cons {
          background: #1a1a1a;
          padding: 15px;
          border-radius: 5px;
        }

        .defense-config {
          background: #2d2d2d;
          padding: 20px;
          border-radius: 8px;
        }

        .defense-config h3 {
          color: #e74c3c;
          margin-bottom: 15px;
        }

        .defense-toggles {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .defense-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .defense-toggle input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .firewall-rules {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #3d3d3d;
        }

        .firewall-rule {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 10px 0;
          padding: 10px;
          background: #1a1a1a;
          border-radius: 5px;
        }

        .firewall-rule select {
          padding: 5px 10px;
          background: #2d2d2d;
          color: #e0e0e0;
          border: 1px solid #00d9ff;
          border-radius: 3px;
        }

        .terminal {
          background: #0a0a0a;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          padding: 20px;
          border-radius: 8px;
          height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
          font-size: 13px;
          line-height: 1.5;
        }

        .terminal-line {
          white-space: pre-wrap;
        }

        .terminal::-webkit-scrollbar {
          width: 10px;
        }

        .terminal::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .terminal::-webkit-scrollbar-thumb {
          background: #00d9ff;
          border-radius: 5px;
        }

        .results-panel {
          margin-top: 20px;
        }

        .results-panel h3 {
          color: #00d9ff;
          margin-bottom: 15px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }

        .result-card {
          background: #2d2d2d;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s;
          position: relative;
        }

        .result-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
        }

        .result-card.selected {
          border-color: #00d9ff;
        }

        .result-card.state-open {
          background: rgba(39, 174, 96, 0.2);
        }

        .result-card.state-closed {
          background: rgba(231, 76, 60, 0.2);
        }

        .result-card.state-filtered {
          background: rgba(241, 196, 15, 0.2);
        }

        .result-port {
          font-size: 24px;
          font-weight: bold;
          color: #00d9ff;
        }

        .result-service {
          font-size: 12px;
          color: #95a5a6;
          margin: 5px 0;
        }

        .result-state {
          font-size: 11px;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 3px;
          display: inline-block;
        }

        .result-state.state-open {
          background: #27ae60;
        }

        .result-state.state-closed {
          background: #e74c3c;
        }

        .result-state.state-filtered {
          background: #f39c12;
        }

        .result-state.state-unfiltered {
          background: #3498db;
        }

        .detected-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 16px;
        }

        .packet-details {
          background: #2d2d2d;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .packet-exchange h4 {
          color: #00d9ff;
          margin-bottom: 20px;
        }

        .exchange-timeline {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .exchange-step {
          display: flex;
          gap: 15px;
          padding: 15px;
          background: #1a1a1a;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .exchange-step.scanner {
          border-left-color: #00d9ff;
        }

        .exchange-step.target {
          border-left-color: #9b59b6;
        }

        .exchange-step.detected {
          background: rgba(231, 76, 60, 0.1);
        }

        .step-number {
          background: #3498db;
          color: white;
          padding: 5px 10px;
          border-radius: 50%;
          font-weight: bold;
          height: fit-content;
        }

        .step-content {
          flex: 1;
        }

        .step-source {
          font-weight: bold;
          color: #00d9ff;
          margin-bottom: 5px;
        }

        .flags {
          color: #f39c12;
          font-size: 12px;
        }

        .step-type {
          color: #27ae60;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .step-description {
          color: #bdc3c7;
          font-size: 14px;
        }

        .detection-badge {
          display: inline-block;
          background: #e74c3c;
          color: white;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 11px;
          margin-top: 5px;
        }

        .exchange-summary {
          margin-top: 20px;
          padding: 15px;
          background: #1a1a1a;
          border-radius: 8px;
        }

        .exchange-summary h5 {
          color: #00d9ff;
        }

        .banner-info {
          margin-top: 10px;
          padding: 10px;
          background: #2d2d2d;
          border-radius: 5px;
          font-family: 'Courier New', monospace;
          color: #00ff00;
        }

        .exam-tips {
          background: #2d2d2d;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .exam-tips h3 {
          color: #f39c12;
          margin-bottom: 15px;
        }

        .exam-tips ul {
          padding-left: 20px;
        }

        .exam-tips li {
          margin: 10px 0;
          line-height: 1.6;
        }

        .exam-tips strong {
          color: #00d9ff;
        }

        @media (max-width: 1200px) {
          .scanner-layout {
            grid-template-columns: 1fr;
          }

          .pros-cons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PortScannerEnhanced;
