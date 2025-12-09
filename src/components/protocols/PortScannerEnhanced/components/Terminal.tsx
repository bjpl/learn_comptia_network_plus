/**
 * Terminal output component
 */

import React, { useRef, useEffect } from 'react';

interface TerminalProps {
  output: string[];
}

export const Terminal: React.FC<TerminalProps> = ({ output }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      className="terminal"
      ref={terminalRef}
      role="log"
      aria-label="Port scan terminal output"
      aria-live="polite"
      aria-atomic="false"
    >
      {output.map((line, idx) => (
        <div key={idx} className="terminal-line">
          {line}
        </div>
      ))}
    </div>
  );
};
