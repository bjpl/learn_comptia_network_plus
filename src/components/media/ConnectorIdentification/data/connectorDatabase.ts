/**
 * Connector database and quiz question generation
 */

import { CONNECTORS } from '../../media-data';
import type { ConnectorQuestion } from '../types';

export { CONNECTORS };

/**
 * Generate identification quiz questions
 */
export function generateQuestions(): ConnectorQuestion[] {
  return CONNECTORS.map((connector) => {
    const otherConnectors = CONNECTORS.filter((c) => c.id !== connector.id);
    const shuffled = [...otherConnectors].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3).map((c) => c.id);
    const options = [connector.id, ...wrongOptions].sort(() => Math.random() - 0.5);

    return {
      connectorId: connector.id,
      options,
    };
  });
}

/**
 * Get connector by ID
 */
export function getConnectorById(id: string) {
  return CONNECTORS.find((c) => c.id === id);
}
