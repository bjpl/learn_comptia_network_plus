import React from 'react';
import SearchBox from './SearchBox';
import Statistics from './Statistics';
import OsiLayerFilter from '../../OsiLayerFilter';
import type { DeviceCounts } from '../types';

interface SidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedLayers: number[];
  onLayerToggle: (layer: number) => void;
  deviceCounts: DeviceCounts;
  totalDevices: number;
  filteredCount: number;
  selectedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  onSearchChange,
  selectedLayers,
  onLayerToggle,
  deviceCounts,
  totalDevices,
  filteredCount,
  selectedCount,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="space-y-4">
        <SearchBox searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <OsiLayerFilter
          selectedLayers={selectedLayers}
          onLayerToggle={onLayerToggle}
          deviceCounts={deviceCounts}
        />
        <Statistics
          totalDevices={totalDevices}
          filteredCount={filteredCount}
          selectedCount={selectedCount}
        />
      </div>
    </div>
  );
};

export default Sidebar;
