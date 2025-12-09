import type { HeaderInfo, OSILayerNumber } from '../../osi-types';
import { LAYER_COLORS, LAYER_NAMES } from '../../osi-data';
import type { Protocol } from '../types';
import { getHeaderDataForLayer } from './headerData';

export const buildPacketHeaders = (
  targetLayer: OSILayerNumber,
  direction: 'encapsulation' | 'decapsulation',
  protocol: Protocol
): HeaderInfo[] => {
  const headers: HeaderInfo[] = [];

  if (direction === 'encapsulation') {
    // Going down the stack, add headers from current to Layer 1
    for (let layer = 7; layer >= targetLayer; layer--) {
      headers.push({
        layer: layer as OSILayerNumber,
        layerName: LAYER_NAMES[layer as OSILayerNumber],
        data: getHeaderDataForLayer(layer as OSILayerNumber, protocol),
        color: LAYER_COLORS[layer as OSILayerNumber],
      });
    }
  } else {
    // Going up the stack, remove headers from Layer 1 to current
    for (let layer = targetLayer; layer <= 7; layer++) {
      headers.push({
        layer: layer,
        layerName: LAYER_NAMES[layer],
        data: getHeaderDataForLayer(layer, protocol),
        color: LAYER_COLORS[layer],
      });
    }
  }

  return headers;
};
