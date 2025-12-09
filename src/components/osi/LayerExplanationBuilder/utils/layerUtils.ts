import type { OSILayer, OSILayerNumber, CompletionStatus } from '../../osi-types';
import { LAYER_NAMES } from '../../osi-data';

export const calculateLayerCompletion = (layer: OSILayer): CompletionStatus => {
  let completedFields = 0;
  const totalFields = 4;

  if (layer.primaryFunction) {
    completedFields++;
  }
  if (layer.selectedProtocols.length >= 2) {
    completedFields++;
  }
  if (layer.pdu) {
    completedFields++;
  }
  if (layer.interactionExplanation.split(' ').length >= 20) {
    completedFields++;
  }

  if (completedFields === 0) {
    return 'empty';
  }
  if (completedFields === totalFields) {
    return 'complete';
  }
  return 'partial';
};

export const getStatusIcon = (status: CompletionStatus): string => {
  switch (status) {
    case 'complete':
      return '✓';
    case 'partial':
      return '◐';
    case 'empty':
      return '○';
  }
};

export const initializeLayers = (): OSILayer[] => {
  return [7, 6, 5, 4, 3, 2, 1].map((num) => ({
    number: num as OSILayerNumber,
    name: LAYER_NAMES[num as OSILayerNumber],
    status: 'empty' as CompletionStatus,
    primaryFunction: '',
    selectedProtocols: [],
    pdu: '',
    interactionExplanation: '',
  }));
};
