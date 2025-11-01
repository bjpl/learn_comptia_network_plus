// Worker manager to easily use web workers in components
import type {
  WorkerMessage,
  WorkerResponse,
  WorkerResultData,
  SubnetResult,
  ProcessedItem,
} from '../workers/calculation.worker';

class WorkerManager {
  private worker: Worker | null = null;
  private messageHandlers: Map<string, (result: WorkerResultData) => void> = new Map();
  private errorHandlers: Map<string, (error: string) => void> = new Map();

  initialize() {
    if (this.worker) {
      return;
    }

    try {
      this.worker = new Worker(new URL('../workers/calculation.worker.ts', import.meta.url), {
        type: 'module',
      });

      this.worker.addEventListener('message', (e: MessageEvent<WorkerResponse>) => {
        const { type, result, error } = e.data;

        if (type === 'ERROR' && error) {
          const errorHandler = this.errorHandlers.get('default');
          if (errorHandler) {
            errorHandler(error);
          }
          return;
        }

        const handler = this.messageHandlers.get(type);
        if (handler) {
          handler(result);
        }
      });

      this.worker.addEventListener('error', (error) => {
        console.error('Worker error:', error);
        const errorHandler = this.errorHandlers.get('default');
        if (errorHandler) {
          errorHandler(error.message);
        }
      });
    } catch (error) {
      console.warn('Web Workers not supported:', error);
    }
  }

  postMessage(
    message: WorkerMessage,
    onResult: (result: WorkerResultData) => void,
    onError?: (error: string) => void
  ) {
    if (!this.worker) {
      this.initialize();
    }

    if (!this.worker) {
      console.error('Worker not available');
      return;
    }

    this.messageHandlers.set('RESULT', onResult);
    if (onError) {
      this.errorHandlers.set('default', onError);
    }

    this.worker.postMessage(message);
  }

  calculateSubnet(
    ip: string,
    cidr: number,
    callback: (result: SubnetResult) => void,
    onError?: (error: string) => void
  ) {
    this.postMessage(
      { type: 'CALCULATE_SUBNET', data: { ip, cidr } },
      (result) => callback(result as SubnetResult),
      onError
    );
  }

  calculateBinary(
    decimal: number,
    callback: (result: string) => void,
    onError?: (error: string) => void
  ) {
    this.postMessage(
      { type: 'CALCULATE_BINARY', data: { decimal } },
      (result) => callback(result as string),
      onError
    );
  }

  processData(
    items: unknown[],
    callback: (result: ProcessedItem[]) => void,
    onError?: (error: string) => void
  ) {
    this.postMessage(
      { type: 'PROCESS_DATA', data: { items } },
      (result) => callback(result as ProcessedItem[]),
      onError
    );
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.messageHandlers.clear();
    this.errorHandlers.clear();
  }
}

export const workerManager = new WorkerManager();
