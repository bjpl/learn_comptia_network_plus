/**
 * Traffic type information panel component
 */

import React from 'react';
import type { TrafficType } from '../../protocols-types';

interface TrafficInfoProps {
  selectedType: TrafficType;
}

export const TrafficInfo: React.FC<TrafficInfoProps> = ({ selectedType }) => {
  return (
    <div className="traffic-info">
      <h3>{selectedType.name}</h3>
      <p className="description">{selectedType.description}</p>

      <div className="characteristics">
        <h4>Characteristics:</h4>
        <ul>
          {selectedType.characteristics.map((char, idx) => (
            <li key={idx}>{char}</li>
          ))}
        </ul>
      </div>

      <div className="use-cases">
        <h4>Common Use Cases:</h4>
        <ul>
          {selectedType.useCases.map((useCase, idx) => (
            <li key={idx}>{useCase}</li>
          ))}
        </ul>
      </div>

      <div className="example">
        <h4>Real-World Example:</h4>
        <p>{selectedType.example}</p>
      </div>
    </div>
  );
};
