/**
 * Terminal display component
 */

import React from 'react';

interface TerminalProps {
  output: string[];
  scanning: boolean;
  currentPort: number;
  terminalRef: React.RefObject<HTMLDivElement>;
}

export const Terminal: React.FC<TerminalProps> = ({ output, scanning, currentPort, terminalRef }) => {
  return (
    <div className="terminal" ref={terminalRef}>
      {output.map((line, index) => (
        <div key={index} className="terminal-line">
          {line}
        </div>
      ))}
      {scanning && (
        <div className="terminal-line scanning">
          <span className="spinner">⟳</span> Scanning port {currentPort}...
        </div>
      )}
    </div>
  );
};
