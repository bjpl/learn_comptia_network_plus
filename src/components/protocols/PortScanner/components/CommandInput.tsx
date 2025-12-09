/**
 * Command input component
 */

import React from 'react';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
  disabled: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <div className="command-input">
      <span className="prompt">scanner@network+:~$</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSubmit(value);
            onChange('');
          }
        }}
        placeholder="Enter command... (type 'help' for commands)"
        disabled={disabled}
      />
    </div>
  );
};
