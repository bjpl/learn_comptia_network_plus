/**
 * Export utilities
 */

export const exportDesignAsJSON = (design: any): void => {
  const exportData = JSON.stringify(design, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${design.name.replace(/\s+/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
