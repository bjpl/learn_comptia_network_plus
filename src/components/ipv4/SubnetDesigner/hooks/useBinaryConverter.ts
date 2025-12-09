/**
 * Custom hook for binary converter state
 */

import { useState } from 'react';
import type { BinaryConverterState } from '../types';

export const useBinaryConverter = (
  initialIP: string = '192.168.1.0',
  initialMask: string = '255.255.255.0'
) => {
  const [binaryConverter, setBinaryConverter] = useState<BinaryConverterState>({
    ipInput: initialIP,
    maskInput: initialMask,
  });

  return {
    binaryConverter,
    setBinaryConverter,
  };
};
