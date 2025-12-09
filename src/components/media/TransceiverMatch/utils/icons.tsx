import { Server, Zap, Wifi, Database } from 'lucide-react';
import type { TransceiverFormFactor, TransceiverProtocol } from '../types';

export const getFormFactorIcon = (formFactor: TransceiverFormFactor) => {
  switch (formFactor) {
    case 'QSFP':
    case 'QSFP+':
    case 'QSFP28':
      return <Server className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

export const getProtocolIcon = (protocol: TransceiverProtocol) => {
  return protocol === 'Ethernet' ? (
    <Wifi className="h-4 w-4" />
  ) : (
    <Database className="h-4 w-4" />
  );
};
