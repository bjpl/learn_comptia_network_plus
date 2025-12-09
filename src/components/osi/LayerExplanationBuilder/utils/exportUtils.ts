import type { OSILayer } from '../../osi-types';

export const generateStudyNotes = (layers: OSILayer[], score: number, hintsUsed: number): string => {
  const notes: string[] = [
    '=== OSI MODEL STUDY NOTES ===\n',
    new Date().toLocaleDateString(),
    '\n---\n',
  ];

  layers.forEach((layer) => {
    notes.push(`LAYER ${layer.number}: ${layer.name}`);
    notes.push(`Status: ${layer.status}`);
    if (layer.primaryFunction) {
      notes.push(`Primary Function: ${layer.primaryFunction}`);
    }
    if (layer.selectedProtocols.length > 0) {
      notes.push(`Protocols: ${layer.selectedProtocols.join(', ')}`);
    }
    if (layer.pdu) {
      notes.push(`PDU: ${layer.pdu}`);
    }
    if (layer.interactionExplanation) {
      notes.push(`Notes: ${layer.interactionExplanation}`);
    }
    notes.push('---\n');
  });

  notes.push(`\nScore: ${score}%`);
  notes.push(`Hints Used: ${hintsUsed}`);

  return notes.join('\n');
};

export const exportAsText = (content: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', 'OSI_Layer_Study_Notes.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
