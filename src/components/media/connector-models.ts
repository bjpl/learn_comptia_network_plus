/**
 * 3D connector models and geometry data
 * Using procedural geometry for connectors
 */

import * as THREE from 'three';

export interface ConnectorGeometry {
  id: string;
  createGeometry: () => THREE.Group;
  createXRayGeometry?: () => THREE.Group;
  color: string;
  metalColor: string;
}

// SC Connector Geometry
function createSCConnector(): THREE.Group {
  const group = new THREE.Group();

  // Main body (square)
  const bodyGeometry = new THREE.BoxGeometry(2.5, 2.5, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Ferrule
  const ferruleGeometry = new THREE.CylinderGeometry(0.125, 0.125, 1, 32);
  const ferruleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const ferrule = new THREE.Mesh(ferruleGeometry, ferruleMaterial);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.z = 2.5;
  group.add(ferrule);

  // Latch
  const latchGeometry = new THREE.BoxGeometry(1.5, 0.5, 3);
  const latchMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const latch = new THREE.Mesh(latchGeometry, latchMaterial);
  latch.position.y = 1.5;
  group.add(latch);

  return group;
}

// LC Connector Geometry
function createLCConnector(): THREE.Group {
  const group = new THREE.Group();

  // Main body (smaller, rectangular)
  const bodyGeometry = new THREE.BoxGeometry(1.25, 1.8, 3.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Ferrule
  const ferruleGeometry = new THREE.CylinderGeometry(0.125, 0.125, 0.8, 32);
  const ferruleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const ferrule = new THREE.Mesh(ferruleGeometry, ferruleMaterial);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.z = 2;
  group.add(ferrule);

  // Latch mechanism
  const latchGeometry = new THREE.BoxGeometry(0.8, 0.3, 2.5);
  const latchMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const latch = new THREE.Mesh(latchGeometry, latchMaterial);
  latch.position.y = 1;
  group.add(latch);

  return group;
}

// ST Connector Geometry
function createSTConnector(): THREE.Group {
  const group = new THREE.Group();

  // Main body (cylindrical)
  const bodyGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  group.add(body);

  // Bayonet pins
  const pinGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
  const pinMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

  const pin1 = new THREE.Mesh(pinGeometry, pinMaterial);
  pin1.position.set(0, 1.8, 1);
  group.add(pin1);

  const pin2 = new THREE.Mesh(pinGeometry, pinMaterial);
  pin2.position.set(0, 1.8, -1);
  group.add(pin2);

  // Ferrule
  const ferruleGeometry = new THREE.CylinderGeometry(0.125, 0.125, 1, 32);
  const ferruleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const ferrule = new THREE.Mesh(ferruleGeometry, ferruleMaterial);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.x = 2.5;
  group.add(ferrule);

  return group;
}

// MPO Connector Geometry
function createMPOConnector(): THREE.Group {
  const group = new THREE.Group();

  // Main body (rectangular, wider)
  const bodyGeometry = new THREE.BoxGeometry(3.5, 2, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Multiple ferrules (12 fibers)
  const ferruleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
  const ferruleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });

  for (let i = 0; i < 12; i++) {
    const ferrule = new THREE.Mesh(ferruleGeometry, ferruleMaterial);
    ferrule.rotation.z = Math.PI / 2;
    ferrule.position.set(2.5, -0.9 + (i * 0.15), 0);
    group.add(ferrule);
  }

  // Key pin
  const keyGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.8);
  const keyMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const key = new THREE.Mesh(keyGeometry, keyMaterial);
  key.position.set(0, -1.2, 0);
  group.add(key);

  return group;
}

// RJ45 Connector Geometry
function createRJ45Connector(): THREE.Group {
  const group = new THREE.Group();

  // Main body
  const bodyGeometry = new THREE.BoxGeometry(1.5, 2.2, 2.8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.8
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // 8 pins
  const pinGeometry = new THREE.BoxGeometry(0.15, 1.5, 0.1);
  const pinColors = [
    0xffa500, // orange-white
    0xff8c00, // orange
    0x90ee90, // green-white
    0x0000ff, // blue
    0x87ceeb, // blue-white
    0x00ff00, // green
    0xd2691e, // brown-white
    0x8b4513  // brown
  ];

  for (let i = 0; i < 8; i++) {
    const pinMaterial = new THREE.MeshStandardMaterial({ color: pinColors[i] });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(-0.525 + (i * 0.15), -0.8, 0);
    group.add(pin);
  }

  // Latch
  const latchGeometry = new THREE.BoxGeometry(1.2, 0.3, 1.5);
  const latchMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const latch = new THREE.Mesh(latchGeometry, latchMaterial);
  latch.position.y = 1.25;
  group.add(latch);

  return group;
}

// RJ11 Connector Geometry
function createRJ11Connector(): THREE.Group {
  const group = new THREE.Group();

  // Main body (smaller than RJ45)
  const bodyGeometry = new THREE.BoxGeometry(1.2, 1.8, 2.2);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.8
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // 6 positions, but only 2 or 4 wires typically used
  const pinGeometry = new THREE.BoxGeometry(0.12, 1.2, 0.08);
  const pinColors = [
    0x888888, // unused
    0x888888, // unused
    0xff0000, // red
    0x00ff00, // green
    0x888888, // unused
    0x888888  // unused
  ];

  for (let i = 0; i < 6; i++) {
    const pinMaterial = new THREE.MeshStandardMaterial({ color: pinColors[i] });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(-0.3 + (i * 0.12), -0.7, 0);
    group.add(pin);
  }

  // Latch
  const latchGeometry = new THREE.BoxGeometry(1.0, 0.25, 1.2);
  const latchMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const latch = new THREE.Mesh(latchGeometry, latchMaterial);
  latch.position.y = 1.0;
  group.add(latch);

  return group;
}

// F-type Connector Geometry
function createFTypeConnector(): THREE.Group {
  const group = new THREE.Group();

  // Main body (cylindrical with threads)
  const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  group.add(body);

  // Threads (simplified)
  for (let i = 0; i < 8; i++) {
    const threadGeometry = new THREE.TorusGeometry(0.85, 0.08, 8, 32);
    const threadMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
    const thread = new THREE.Mesh(threadGeometry, threadMaterial);
    thread.rotation.y = Math.PI / 2;
    thread.position.x = -1.2 + (i * 0.3);
    group.add(thread);
  }

  // Center pin
  const pinGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
  const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const pin = new THREE.Mesh(pinGeometry, pinMaterial);
  pin.rotation.z = Math.PI / 2;
  pin.position.x = 2;
  group.add(pin);

  return group;
}

// BNC Connector Geometry
function createBNCConnector(): THREE.Group {
  const group = new THREE.Group();

  // Main body
  const bodyGeometry = new THREE.CylinderGeometry(0.9, 0.9, 3.5, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  group.add(body);

  // Bayonet pins
  const pinGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
  const pinMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

  const pin1 = new THREE.Mesh(pinGeometry, pinMaterial);
  pin1.position.set(1.2, 1.1, 0);
  group.add(pin1);

  const pin2 = new THREE.Mesh(pinGeometry, pinMaterial);
  pin2.position.set(1.2, -1.1, 0);
  group.add(pin2);

  // Center pin
  const centerPinGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
  const centerPinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const centerPin = new THREE.Mesh(centerPinGeometry, centerPinMaterial);
  centerPin.rotation.z = Math.PI / 2;
  centerPin.position.x = 2.3;
  group.add(centerPin);

  return group;
}

// Export connector geometries
export const CONNECTOR_GEOMETRIES: Record<string, ConnectorGeometry> = {
  SC: {
    id: 'SC',
    createGeometry: createSCConnector,
    color: '#4a90e2',
    metalColor: '#cccccc'
  },
  LC: {
    id: 'LC',
    createGeometry: createLCConnector,
    color: '#4a90e2',
    metalColor: '#cccccc'
  },
  ST: {
    id: 'ST',
    createGeometry: createSTConnector,
    color: '#4a90e2',
    metalColor: '#cccccc'
  },
  MPO: {
    id: 'MPO',
    createGeometry: createMPOConnector,
    color: '#2c3e50',
    metalColor: '#cccccc'
  },
  RJ45: {
    id: 'RJ45',
    createGeometry: createRJ45Connector,
    color: '#cccccc',
    metalColor: '#ffd700'
  },
  RJ11: {
    id: 'RJ11',
    createGeometry: createRJ11Connector,
    color: '#cccccc',
    metalColor: '#ffd700'
  },
  'F-type': {
    id: 'F-type',
    createGeometry: createFTypeConnector,
    color: '#c0c0c0',
    metalColor: '#ffd700'
  },
  BNC: {
    id: 'BNC',
    createGeometry: createBNCConnector,
    color: '#404040',
    metalColor: '#ffd700'
  }
};
