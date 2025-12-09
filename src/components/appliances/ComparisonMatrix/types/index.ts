export interface ComparisonMatrixProps {
  initialDevices?: string[];
}

export type SortField = 'name' | 'throughput' | 'cost1yr' | 'cost5yr' | 'maxConnections';
export type SortDirection = 'asc' | 'desc';
export type FilterCategory = 'all' | 'physical' | 'virtual' | 'cloud';
