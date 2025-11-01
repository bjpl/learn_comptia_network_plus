/**
 * Interactive terminal simulator for network troubleshooting practice
 * Allows students to run diagnostic commands and see realistic output
 */

import React, { useState, useRef, useEffect } from 'react';
import type { TroubleshootingScenario } from '../osi-types';
import { executeCommand, parseCommand, NETWORK_TOOLS, type CommandOutput } from './network-tools';

interface TerminalSimulatorProps {
  scenario: TroubleshootingScenario;
  onCommandExecuted?: (output: CommandOutput) => void;
  disabled?: boolean;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  scenario,
  onCommandExecuted,
  disabled = false,
}) => {
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showToolReference, setShowToolReference] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || disabled) {
      return;
    }

    const { command, args } = parseCommand(currentInput);
    const output = executeCommand(command, args, scenario);

    const newHistory = [...commandHistory, output];
    setCommandHistory(newHistory);
    onCommandExecuted?.(output);

    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const previousCommands = commandHistory
      .map((h) => `${h.command} ${h.args.join(' ')}`)
      .filter(Boolean);

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (previousCommands.length > 0) {
        const newIndex =
          historyIndex < previousCommands.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(previousCommands[previousCommands.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(previousCommands[previousCommands.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete for common commands
      const partial = currentInput.toLowerCase();
      const match = NETWORK_TOOLS.find((t) => t.command.startsWith(partial));
      if (match && partial.length > 0) {
        setCurrentInput(match.command + ' ');
      }
    }
  };

  const clearTerminal = () => {
    setCommandHistory([]);
    setCurrentInput('');
  };

  const insertCommand = (cmd: string) => {
    setCurrentInput(cmd);
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Terminal Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#2d2d2d',
          borderBottom: '1px solid #444',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ff5f56',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#27c93f',
            }}
          />
          <span
            style={{
              marginLeft: '12px',
              color: '#ccc',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            Network Troubleshooting Terminal
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowToolReference(!showToolReference)}
            style={{
              padding: '4px 12px',
              backgroundColor: '#4a4a4a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {showToolReference ? 'Hide' : 'Show'} Tools
          </button>
          <button
            onClick={clearTerminal}
            style={{
              padding: '4px 12px',
              backgroundColor: '#4a4a4a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Tool Reference Panel */}
      {showToolReference && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#2d2d2d',
            borderBottom: '1px solid #444',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              color: '#61dafb',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Available Diagnostic Tools:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {NETWORK_TOOLS.map((tool) => (
              <div
                key={tool.command}
                onClick={() => insertCommand(tool.examples[0])}
                style={{
                  padding: '8px',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: '1px solid #444',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#61dafb';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#444';
                  e.currentTarget.style.backgroundColor = '#1e1e1e';
                }}
              >
                <div
                  style={{
                    color: '#61dafb',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                  }}
                >
                  {tool.command}
                </div>
                <div
                  style={{
                    color: '#888',
                    fontSize: '11px',
                    marginTop: '4px',
                  }}
                >
                  {tool.description}
                </div>
                <div
                  style={{
                    color: '#666',
                    fontSize: '10px',
                    marginTop: '2px',
                    fontFamily: 'monospace',
                  }}
                >
                  Layer {tool.layer} • {tool.examRelevance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Output */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#d4d4d4',
        }}
      >
        {commandHistory.length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            Network Troubleshooting Terminal - Ready
            <br />
            Type a command (e.g., "ping 192.168.1.1") or click "Show Tools" for help
            <br />
            <br />
          </div>
        )}

        {commandHistory.map((output, index) => (
          <div key={index} style={{ marginBottom: '16px' }}>
            {/* Command input echo */}
            <div style={{ color: '#4ec9b0' }}>
              C:\&gt; {output.command} {output.args.join(' ')}
            </div>

            {/* Command output */}
            <div
              style={{
                marginTop: '4px',
                whiteSpace: 'pre-wrap',
                color: output.exitCode === 0 ? '#d4d4d4' : '#f48771',
              }}
            >
              {output.output}
            </div>

            {/* Interpretation hint (if available) */}
            {output.interpretation && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#2d4a5a',
                  borderLeft: '3px solid #61dafb',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#d4d4d4',
                }}
              >
                <div style={{ color: '#61dafb', fontWeight: 'bold', marginBottom: '4px' }}>
                  💡 Analysis:
                </div>
                {output.interpretation}
              </div>
            )}

            {/* Hints (if available and enabled) */}
            {output.hints.length > 0 && (
              <details style={{ marginTop: '8px' }}>
                <summary
                  style={{
                    color: '#ffc107',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  💡 Show Hints ({output.hints.length})
                </summary>
                <div
                  style={{
                    marginTop: '4px',
                    paddingLeft: '16px',
                    color: '#ffc107',
                    fontSize: '12px',
                  }}
                >
                  {output.hints.map((hint, i) => (
                    <div key={i} style={{ marginTop: '4px' }}>
                      • {hint}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Command Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 16px',
          backgroundColor: '#2d2d2d',
          borderTop: '1px solid #444',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            color: '#4ec9b0',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '13px',
          }}
        >
          C:\&gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a command... (Tab to autocomplete, ↑↓ for history)"
          autoFocus
          style={{
            flex: 1,
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '8px 12px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#61dafb')}
          onBlur={(e) => (e.target.style.borderColor = '#444')}
        />
        <button
          type="submit"
          disabled={!currentInput.trim() || disabled}
          style={{
            padding: '8px 16px',
            backgroundColor: disabled || !currentInput.trim() ? '#4a4a4a' : '#61dafb',
            color: disabled || !currentInput.trim() ? '#888' : '#000',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: disabled || !currentInput.trim() ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Execute
        </button>
      </form>

      {/* Command Statistics */}
      {commandHistory.length > 0 && (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#252525',
            borderTop: '1px solid #444',
            fontSize: '11px',
            color: '#888',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Commands executed: {commandHistory.length}</span>
          <span>
            Last exit code:
            <span
              style={{
                color:
                  commandHistory[commandHistory.length - 1]?.exitCode === 0 ? '#27c93f' : '#ff5f56',
                marginLeft: '4px',
              }}
            >
              {commandHistory[commandHistory.length - 1]?.exitCode ?? '-'}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default TerminalSimulator;
