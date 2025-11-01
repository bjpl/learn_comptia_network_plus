// Web Worker for heavy computations
// This offloads CPU-intensive tasks from the main thread

// Worker message data types
export interface SubnetData {
  ip: string;
  cidr: number;
}

export interface BinaryData {
  decimal: number;
}

export interface ProcessData {
  items: unknown[];
}

export type WorkerMessageData = SubnetData | BinaryData | ProcessData;

export interface WorkerMessage {
  type: string;
  data: WorkerMessageData;
}

// Worker result types
export interface SubnetResult {
  network: string;
  broadcast: string;
  mask: string;
  hosts: number;
  cidr: number;
}

export type ProcessedItem = Record<string, unknown> & {
  processed: boolean;
  index: number;
  timestamp: number;
};

export type WorkerResultData = SubnetResult | string | ProcessedItem[] | null;

export interface WorkerResponse {
  type: string;
  result: WorkerResultData;
  error?: string;
}

// Subnet calculation helper
const calculateSubnet = (ip: string, cidr: number) => {
  const ipParts = ip.split('.').map(Number);
  const ipBinary = ipParts.reduce((acc, octet) => acc * 256 + octet, 0);

  const mask = -1 << (32 - cidr);
  const network = ipBinary & mask;
  const broadcast = network | ~mask;
  const hosts = broadcast - network - 1;

  const networkAddress = [
    (network >>> 24) & 255,
    (network >>> 16) & 255,
    (network >>> 8) & 255,
    network & 255,
  ].join('.');

  const broadcastAddress = [
    (broadcast >>> 24) & 255,
    (broadcast >>> 16) & 255,
    (broadcast >>> 8) & 255,
    broadcast & 255,
  ].join('.');

  const subnetMask = [
    (mask >>> 24) & 255,
    (mask >>> 16) & 255,
    (mask >>> 8) & 255,
    mask & 255,
  ].join('.');

  return {
    network: networkAddress,
    broadcast: broadcastAddress,
    mask: subnetMask,
    hosts,
    cidr,
  };
};

// Binary conversion helper
const calculateBinary = (decimal: number): string => {
  return decimal.toString(2).padStart(8, '0');
};

// Complex data processing
const processLargeDataset = (data: unknown[]): ProcessedItem[] => {
  return data.map((item, index) => ({
    ...(typeof item === 'object' && item !== null ? item : {}),
    processed: true,
    index,
    timestamp: Date.now(),
  }));
};

self.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  try {
    let result: WorkerResultData;

    switch (type) {
      case 'CALCULATE_SUBNET':
        result = calculateSubnet((data as SubnetData).ip, (data as SubnetData).cidr);
        break;

      case 'CALCULATE_BINARY':
        result = calculateBinary((data as BinaryData).decimal);
        break;

      case 'PROCESS_DATA':
        result = processLargeDataset((data as ProcessData).items);
        break;

      default:
        throw new Error(`Unknown worker task type: ${type}`);
    }

    const response: WorkerResponse = { type: 'RESULT', result };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      type: 'ERROR',
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    self.postMessage(response);
  }
});

// Export empty object to make this a module
export {};
