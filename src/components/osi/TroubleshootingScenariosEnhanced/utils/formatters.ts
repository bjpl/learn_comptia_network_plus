/**
 * Formatting utilities
 */

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function navButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '12px 24px',
    backgroundColor: disabled ? '#ccc' : '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
  };
}
