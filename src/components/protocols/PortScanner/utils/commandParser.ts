/**
 * Command parsing utilities
 */

export const parseCommand = (cmd: string) => {
  const trimmed = cmd.trim().toLowerCase();
  const parts = trimmed.split(' ');
  const command = parts[0];
  const args = parts.slice(1);

  return { command, args, raw: trimmed };
};

export const extractPort = (cmd: string): number | null => {
  const parts = cmd.split(' ');
  if (parts.length < 2) return null;

  const port = parseInt(parts[1]);
  return isNaN(port) ? null : port;
};
