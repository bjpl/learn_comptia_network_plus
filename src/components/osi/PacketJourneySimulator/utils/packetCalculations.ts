import type { HeaderInfo, OSILayerNumber, FragmentationInfo } from '../types';
import { LAYER_COLORS, LAYER_NAMES, HEADER_SIZES } from '../constants';
import { getHeaderDataForLayer } from '../data/osiLayers';
import type { ProtocolType, TCPFlagState } from '../types';

export const buildPacketHeaders = (
  targetLayer: OSILayerNumber,
  direction: 'encapsulation' | 'decapsulation',
  protocol: 'TCP' | 'UDP',
  selectedProtocol: ProtocolType,
  tcpFlags: TCPFlagState,
  selectedMTU: number
): HeaderInfo[] => {
  const headers: HeaderInfo[] = [];

  if (direction === 'encapsulation') {
    for (let layer = 7; layer >= targetLayer; layer--) {
      headers.push({
        layer: layer as OSILayerNumber,
        layerName: LAYER_NAMES[layer as OSILayerNumber],
        data: getHeaderDataForLayer(
          layer as OSILayerNumber,
          protocol,
          selectedProtocol,
          tcpFlags,
          selectedMTU
        ),
        color: LAYER_COLORS[layer as OSILayerNumber],
      });
    }
  } else {
    for (let layer = targetLayer; layer <= 7; layer++) {
      headers.push({
        layer: layer,
        layerName: LAYER_NAMES[layer],
        data: getHeaderDataForLayer(layer, protocol, selectedProtocol, tcpFlags, selectedMTU),
        color: LAYER_COLORS[layer],
      });
    }
  }

  return headers;
};

export const calculateFragmentation = (
  payloadSize: number,
  selectedMTU: number
): FragmentationInfo => {
  const { ipHeader, tcpHeader, ethernetHeader } = HEADER_SIZES;
  const totalPacketSize = payloadSize + ipHeader + tcpHeader;
  const totalFrameSize = totalPacketSize + ethernetHeader;

  const needsFragmentation = totalFrameSize > selectedMTU;
  const fragmentCount = needsFragmentation
    ? Math.ceil(totalPacketSize / (selectedMTU - ipHeader))
    : 1;

  return {
    needsFragmentation,
    fragmentCount,
    totalPacketSize,
    totalFrameSize,
    mtu: selectedMTU,
  };
};
