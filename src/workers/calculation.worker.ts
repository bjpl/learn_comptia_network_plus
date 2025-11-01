// Web Worker for heavy computations
// This offloads CPU-intensive tasks from the main thread

export interface WorkerMessage {
  type: string;
  data: any;
}

export interface WorkerResponse {
  type: string;
  result: any;
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
const processLargeDataset = (data: any[]) => {
  return data.map((item, index) => ({
    ...item,
    processed: true,
    index,
    timestamp: Date.now(),
  }));
};

self.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  try {
    let result: any;

    switch (type) {
      case 'CALCULATE_SUBNET':
        result = calculateSubnet(data.ip, data.cidr);
        break;

      case 'CALCULATE_BINARY':
        result = calculateBinary(data.decimal);
        break;

      case 'PROCESS_DATA':
        result = processLargeDataset(data.items);
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
