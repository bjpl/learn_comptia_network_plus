/**
 * Network Status Monitoring
 * Online/offline detection, reconnection logic, and request queuing
 */

type NetworkStatusCallback = (isOnline: boolean) => void;
type RequestQueueItem = {
  id: string;
  request: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timestamp: number;
};

class NetworkStatusManager {
  private isOnline: boolean = navigator.onLine;
  private callbacks: Set<NetworkStatusCallback> = new Set();
  private requestQueue: RequestQueueItem[] = [];
  // Removed unused _reconnectAttempts property

  constructor() {
    this.setupListeners();
  }

  /**
   * Setup online/offline event listeners
   */
  private setupListeners(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Periodic connectivity check
    this.startConnectivityCheck();
  }

  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    console.warn('🟢 Network connection restored');
    this.isOnline = true;
    // Reconnect logic reset would go here
    this.notifyCallbacks(true);
    this.processQueue();
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    console.warn('🔴 Network connection lost');
    this.isOnline = false;
    this.notifyCallbacks(false);
  };

  /**
   * Notify all callbacks of status change
   */
  private notifyCallbacks(isOnline: boolean): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(isOnline);
      } catch (error) {
        console.error('Error in network status callback:', error);
      }
    });
  }

  /**
   * Start periodic connectivity check
   */
  private startConnectivityCheck(): void {
    setInterval(() => {
      this.checkConnectivity();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check actual connectivity by making a request
   */
  private async checkConnectivity(): Promise<boolean> {
    if (!navigator.onLine) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/health', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);

      const connected = response.ok;

      if (connected !== this.isOnline) {
        if (connected) {
          this.handleOnline();
        } else {
          this.handleOffline();
        }
      }

      return connected;
    } catch {
      if (this.isOnline) {
        this.handleOffline();
      }
      return false;
    }
  }

  /**
   * Subscribe to network status changes
   */
  public subscribe(callback: NetworkStatusCallback): () => void {
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current online status
   */
  public getStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Queue a request to be executed when online
   */
  public queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.requestQueue.push({
        id,
        request: request as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
        timestamp: Date.now(),
      });

      // If online, process immediately
      if (this.isOnline) {
        this.processQueue();
      } else {
        console.warn(`📦 Request queued (offline): ${id}`);
      }
    });
  }

  /**
   * Process queued requests
   */
  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.requestQueue.length === 0) {
      return;
    }

    console.warn(`📤 Processing ${this.requestQueue.length} queued requests`);

    const queue = [...this.requestQueue];
    this.requestQueue = [];

    for (const item of queue) {
      try {
        const result = await item.request();
        item.resolve(result);
        console.warn(`✅ Queued request completed: ${item.id}`);
      } catch (error) {
        // Re-queue if still offline
        if (!this.isOnline) {
          this.requestQueue.push(item);
        } else {
          item.reject(error);
          console.error(`❌ Queued request failed: ${item.id}`, error);
        }
      }
    }
  }

  /**
   * Clear old queued requests
   */
  public clearOldRequests(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now();
    const before = this.requestQueue.length;

    this.requestQueue = this.requestQueue.filter((item) => {
      const age = now - item.timestamp;
      if (age > maxAge) {
        item.reject(new Error('Request expired'));
        return false;
      }
      return true;
    });

    const removed = before - this.requestQueue.length;
    if (removed > 0) {
      console.warn(`🧹 Cleared ${removed} expired requests`);
    }
  }

  /**
   * Get queue size
   */
  public getQueueSize(): number {
    return this.requestQueue.length;
  }

  /**
   * Wait for online status
   */
  public async waitForOnline(timeout: number = 30000): Promise<boolean> {
    if (this.isOnline) {
      return true;
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeout);

      const unsubscribe = this.subscribe((isOnline) => {
        if (isOnline) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.callbacks.clear();
    this.requestQueue = [];
  }
}

// Singleton instance
export const networkStatusManager = new NetworkStatusManager();

// Convenience hooks
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(networkStatusManager.getStatus());

  React.useEffect(() => {
    const unsubscribe = networkStatusManager.subscribe(setIsOnline);
    return unsubscribe;
  }, []);

  return isOnline;
};

// Import React for hooks
import React from 'react';
