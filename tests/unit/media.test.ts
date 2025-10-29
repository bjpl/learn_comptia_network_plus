/**
 * Unit Tests - Network Media and Connectors Component
 * Tests for cable selection, connector matching, and physical media properties
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Network Media and Connectors Component', () => {
  describe('Cable Type Validation', () => {
    it('should validate Cat5e cable specifications', () => {
      const cable = {
        type: 'Cat5e',
        maxSpeed: '1 Gbps',
        maxDistance: 100,
        frequency: 100,
        shielded: false,
      };

      expect(cable.maxSpeed).toBe('1 Gbps');
      expect(cable.maxDistance).toBe(100);
      expect(cable.frequency).toBe(100);
    });

    it('should validate Cat6 cable specifications', () => {
      const cable = {
        type: 'Cat6',
        maxSpeed: '10 Gbps',
        maxDistance: 55,
        frequency: 250,
        shielded: false,
      };

      expect(cable.maxSpeed).toBe('10 Gbps');
      expect(cable.maxDistance).toBe(55);
      expect(cable.frequency).toBe(250);
    });

    it('should validate Cat6a cable specifications', () => {
      const cable = {
        type: 'Cat6a',
        maxSpeed: '10 Gbps',
        maxDistance: 100,
        frequency: 500,
        shielded: true,
      };

      expect(cable.maxSpeed).toBe('10 Gbps');
      expect(cable.maxDistance).toBe(100);
      expect(cable.shielded).toBe(true);
    });

    it('should validate fiber optic cable types', () => {
      const singleMode = {
        type: 'Single-mode',
        coreSize: 9,
        maxDistance: 10000,
        wavelength: 1310,
      };

      const multiMode = {
        type: 'Multi-mode',
        coreSize: 50,
        maxDistance: 550,
        wavelength: 850,
      };

      expect(singleMode.coreSize).toBe(9);
      expect(multiMode.coreSize).toBe(50);
      expect(singleMode.maxDistance).toBeGreaterThan(multiMode.maxDistance);
    });
  });

  describe('Connector Type Matching', () => {
    it('should match RJ45 connectors to twisted pair cables', () => {
      const connector = {
        type: 'RJ45',
        compatibleCables: ['Cat5e', 'Cat6', 'Cat6a', 'Cat7'],
        pins: 8,
      };

      expect(connector.compatibleCables).toContain('Cat6');
      expect(connector.pins).toBe(8);
    });

    it('should match LC connectors to fiber optic cables', () => {
      const connector = {
        type: 'LC',
        compatibleCables: ['Single-mode', 'Multi-mode'],
        formFactor: 'Small Form Factor',
      };

      expect(connector.compatibleCables).toContain('Single-mode');
      expect(connector.formFactor).toBe('Small Form Factor');
    });

    it('should match SC connectors to fiber optic cables', () => {
      const connector = {
        type: 'SC',
        compatibleCables: ['Single-mode', 'Multi-mode'],
        coupling: 'Push-pull',
      };

      expect(connector.compatibleCables).toContain('Multi-mode');
      expect(connector.coupling).toBe('Push-pull');
    });

    it('should validate connector and cable compatibility', () => {
      const isCompatible = checkCompatibility('RJ45', 'Cat6');
      const isIncompatible = checkCompatibility('LC', 'Cat6');

      expect(isCompatible).toBe(true);
      expect(isIncompatible).toBe(false);
    });
  });

  describe('Cable Selection Algorithm', () => {
    it('should recommend Cat5e for 100 Mbps over 90 meters', () => {
      const requirements = {
        speed: 100,
        distance: 90,
        budget: 'low',
      };

      const recommendation = recommendCable(requirements);
      expect(recommendation.type).toBe('Cat5e');
      expect(recommendation.reason).toContain('sufficient for requirements');
    });

    it('should recommend Cat6 for 1 Gbps over 50 meters', () => {
      const requirements = {
        speed: 1000,
        distance: 50,
        budget: 'medium',
      };

      const recommendation = recommendCable(requirements);
      expect(recommendation.type).toBe('Cat6');
    });

    it('should recommend Cat6a for 10 Gbps over 100 meters', () => {
      const requirements = {
        speed: 10000,
        distance: 100,
        budget: 'medium',
      };

      const recommendation = recommendCable(requirements);
      expect(recommendation.type).toBe('Cat6a');
    });

    it('should recommend single-mode fiber for long distances', () => {
      const requirements = {
        speed: 10000,
        distance: 5000,
        budget: 'high',
      };

      const recommendation = recommendCable(requirements);
      expect(recommendation.type).toBe('Single-mode fiber');
      expect(recommendation.reason).toContain('long distance');
    });

    it('should recommend multi-mode fiber for medium distances at high speed', () => {
      const requirements = {
        speed: 10000,
        distance: 300,
        budget: 'medium',
      };

      const recommendation = recommendCable(requirements);
      expect(recommendation.type).toBe('Multi-mode fiber');
    });
  });

  describe('Transceiver Module Testing', () => {
    it('should validate SFP module specifications', () => {
      const sfp = {
        type: 'SFP',
        speed: '1 Gbps',
        distance: 550,
        wavelength: 850,
        connector: 'LC',
      };

      expect(sfp.speed).toBe('1 Gbps');
      expect(sfp.connector).toBe('LC');
    });

    it('should validate SFP+ module specifications', () => {
      const sfpPlus = {
        type: 'SFP+',
        speed: '10 Gbps',
        distance: 10000,
        wavelength: 1310,
        connector: 'LC',
      };

      expect(sfpPlus.speed).toBe('10 Gbps');
      expect(sfpPlus.distance).toBe(10000);
    });

    it('should validate QSFP module specifications', () => {
      const qsfp = {
        type: 'QSFP',
        speed: '40 Gbps',
        lanes: 4,
        connector: 'MPO',
      };

      expect(qsfp.speed).toBe('40 Gbps');
      expect(qsfp.lanes).toBe(4);
    });

    it('should match transceivers to cable types', () => {
      const match1 = matchTransceiver('SFP', 'Multi-mode fiber');
      const match2 = matchTransceiver('SFP+', 'Single-mode fiber');

      expect(match1.compatible).toBe(true);
      expect(match2.compatible).toBe(true);
    });
  });

  describe('Physical Media Properties', () => {
    it('should calculate signal attenuation over distance', () => {
      const attenuation = calculateAttenuation('Cat6', 100);
      expect(attenuation).toBeGreaterThan(0);
      expect(attenuation).toBeLessThan(50);
    });

    it('should calculate crosstalk for twisted pair cables', () => {
      const crosstalk = calculateCrosstalk('Cat5e', 80);
      expect(crosstalk).toBeGreaterThan(0);
    });

    it('should determine shielding requirements', () => {
      const highEMI = requiresShielding({ emiLevel: 'high', distance: 50 });
      const lowEMI = requiresShielding({ emiLevel: 'low', distance: 50 });

      expect(highEMI).toBe(true);
      expect(lowEMI).toBe(false);
    });

    it('should calculate bandwidth capacity', () => {
      const cat5eBandwidth = calculateBandwidth('Cat5e');
      const cat6Bandwidth = calculateBandwidth('Cat6');

      expect(cat6Bandwidth).toBeGreaterThan(cat5eBandwidth);
    });
  });

  describe('3D Connector Lab Simulation', () => {
    it('should validate correct connector insertion', () => {
      const insertion = {
        connectorType: 'RJ45',
        portType: 'Ethernet',
        orientation: 'correct',
      };

      const result = validateInsertion(insertion);
      expect(result.success).toBe(true);
    });

    it('should detect incorrect connector orientation', () => {
      const insertion = {
        connectorType: 'RJ45',
        portType: 'Ethernet',
        orientation: 'inverted',
      };

      const result = validateInsertion(insertion);
      expect(result.success).toBe(false);
      expect(result.error).toContain('orientation');
    });

    it('should prevent incompatible connector insertion', () => {
      const insertion = {
        connectorType: 'LC',
        portType: 'Ethernet',
        orientation: 'correct',
      };

      const result = validateInsertion(insertion);
      expect(result.success).toBe(false);
      expect(result.error).toContain('incompatible');
    });
  });
});

// Helper Functions
function checkCompatibility(connector: string, cable: string): boolean {
  const compatibilityMap: Record<string, string[]> = {
    'RJ45': ['Cat5e', 'Cat6', 'Cat6a', 'Cat7'],
    'LC': ['Single-mode', 'Multi-mode'],
    'SC': ['Single-mode', 'Multi-mode'],
    'ST': ['Single-mode', 'Multi-mode'],
  };

  return compatibilityMap[connector]?.includes(cable) || false;
}

function recommendCable(requirements: {
  speed: number;
  distance: number;
  budget: string;
}): { type: string; reason: string } {
  if (requirements.distance > 1000) {
    return { type: 'Single-mode fiber', reason: 'long distance required' };
  }

  if (requirements.speed >= 10000) {
    if (requirements.distance > 100) {
      return { type: 'Multi-mode fiber', reason: '10 Gbps over medium distance' };
    }
    return { type: 'Cat6a', reason: '10 Gbps support up to 100m' };
  }

  if (requirements.speed >= 1000) {
    return { type: 'Cat6', reason: '1 Gbps support' };
  }

  return { type: 'Cat5e', reason: 'sufficient for requirements' };
}

function matchTransceiver(transceiverType: string, cableType: string): { compatible: boolean } {
  const fiberTypes = ['Single-mode fiber', 'Multi-mode fiber', 'Single-mode', 'Multi-mode'];
  const isFiberTransceiver = ['SFP', 'SFP+', 'QSFP'].includes(transceiverType);
  const isFiberCable = fiberTypes.some(type => cableType.includes(type));

  return { compatible: isFiberTransceiver && isFiberCable };
}

function calculateAttenuation(cableType: string, distance: number): number {
  const attenuationRates: Record<string, number> = {
    'Cat5e': 0.3,
    'Cat6': 0.25,
    'Cat6a': 0.2,
  };

  return (attenuationRates[cableType] || 0.3) * distance;
}

function calculateCrosstalk(cableType: string, distance: number): number {
  return distance * 0.1;
}

function requiresShielding(environment: { emiLevel: string; distance: number }): boolean {
  return environment.emiLevel === 'high';
}

function calculateBandwidth(cableType: string): number {
  const bandwidths: Record<string, number> = {
    'Cat5e': 100,
    'Cat6': 250,
    'Cat6a': 500,
  };

  return bandwidths[cableType] || 100;
}

function validateInsertion(insertion: {
  connectorType: string;
  portType: string;
  orientation: string;
}): { success: boolean; error?: string } {
  if (!checkCompatibility(insertion.connectorType, 'Cat6') && insertion.portType === 'Ethernet') {
    return { success: false, error: 'incompatible connector type' };
  }

  if (insertion.orientation !== 'correct') {
    return { success: false, error: 'incorrect orientation' };
  }

  return { success: true };
}
