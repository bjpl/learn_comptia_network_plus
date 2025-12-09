import type { OSILayerNumber } from '../../osi-types';
import { PROTOCOLS } from '../../osi-data';

export const getLayerProtocols = (layerNumber: OSILayerNumber) => {
  return PROTOCOLS.filter((p) => p.layer === layerNumber);
};

export const getDecoyProtocols = (layerNumber: OSILayerNumber) => {
  return PROTOCOLS.filter((p) => p.layer !== layerNumber).slice(0, 10);
};
