/**
 * Hook for managing terminal output
 */

import { useState, useEffect, useRef } from 'react';
import { getInitialOutput } from '../utils/terminalOutput';

export const useTerminalOutput = () => {
  const [output, setOutput] = useState<string[]>(getInitialOutput());
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = (lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setOutput((prev) => [...prev, ...newLines]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return { output, addOutput, clearOutput, terminalRef };
};
