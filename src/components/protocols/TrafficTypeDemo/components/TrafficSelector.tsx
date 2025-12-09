/**
 * Traffic type selector component
 */

import React from 'react';
import type { TrafficType } from '../../protocols-types';
import { TRAFFIC_TYPES } from '../../protocols-data';
import { getPacketColor } from '../utils/colorHelpers';

interface TrafficSelectorProps {
  selectedType: TrafficType;
  onSelectType: (type: TrafficType) => void;
}

export const TrafficSelector: React.FC<TrafficSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="traffic-selector">
      <h3>Select Traffic Type:</h3>
      <div className="traffic-buttons">
        {TRAFFIC_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type)}
            className={`traffic-btn ${selectedType.id === type.id ? 'active' : ''}`}
            style={{
              borderColor: getPacketColor(type.id),
            }}
            aria-pressed={selectedType.id === type.id}
            aria-label={`Select ${type.name} traffic type`}
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
};
