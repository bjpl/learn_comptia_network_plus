/**
 * Memory Palace component with visual mnemonics organized by port ranges
 */

import React from 'react';
import { EXAM_CRITICAL_PORTS } from '../data/examCriticalPorts';

export const MemoryPalace: React.FC = () => {
  const portGroups = {
    '20-30': EXAM_CRITICAL_PORTS.filter((c) => c.port >= 20 && c.port < 30),
    '50-100': EXAM_CRITICAL_PORTS.filter((c) => c.port >= 50 && c.port < 100),
    '100-200': EXAM_CRITICAL_PORTS.filter((c) => c.port >= 100 && c.port < 200),
    '300-500': EXAM_CRITICAL_PORTS.filter((c) => c.port >= 300 && c.port < 500),
    '500+': EXAM_CRITICAL_PORTS.filter((c) => c.port >= 500),
  };

  return (
    <div className="memory-palace">
      <h2>🏰 Port Memory Palace</h2>
      <p className="subtitle">Visual mnemonics organized by port ranges</p>

      {Object.entries(portGroups).map(([range, cards]) => (
        <div key={range} className="memory-room">
          <h3>Ports {range}</h3>
          <div className="memory-cards">
            {cards.map((card) => (
              <div key={card.id} className="memory-card">
                <div className="memory-port">{card.port}</div>
                <div className="memory-protocol">{card.protocol}</div>
                <div className="memory-mnemonic">💡 {card.mnemonic}</div>
                <div className={`memory-security ${card.security.toLowerCase()}`}>
                  {card.security}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
