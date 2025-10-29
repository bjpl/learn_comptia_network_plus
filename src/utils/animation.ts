/**
 * CompTIA Network+ Learning Platform - Animation Utilities
 * Helper functions for creating smooth animations and visualizations
 */

import type { ParticleConfig, PacketAnimation } from '../types';

// ============================================================================
// Easing Functions
// ============================================================================

/**
 * Easing functions for smooth animations
 * All functions take t (0-1) and return interpolated value (0-1)
 */
export const easingFunctions = {
  linear: (t: number): number => t,

  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  easeInQuint: (t: number): number => t * t * t * t * t,
  easeOutQuint: (t: number): number => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number): number =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,

  easeInExpo: (t: number): number => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo: (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t: number): number => {
    if (t === 0) {return 0;}
    if (t === 1) {return 1;}
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  easeInCirc: (t: number): number => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t: number): number => Math.sqrt(1 - (--t) * t),
  easeInOutCirc: (t: number): number =>
    t < 0.5
      ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
      : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2,

  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInOutElastic: (t: number): number => {
    const c5 = (2 * Math.PI) / 4.5;
    if (t === 0) {return 0;}
    if (t === 1) {return 1;}
    return t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },

  easeInBounce: (t: number): number => 1 - easingFunctions.easeOutBounce(1 - t),
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: (t: number): number =>
    t < 0.5
      ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2,
};

// ============================================================================
// Animation Helpers
// ============================================================================

/**
 * Get easing function by name
 *
 * @param name - Easing function name
 * @returns Easing function
 */
export function getEasingFunction(
  name: keyof typeof easingFunctions = 'linear'
): (t: number) => number {
  return easingFunctions[name] || easingFunctions.linear;
}

/**
 * Interpolate between two values with easing
 *
 * @param start - Start value
 * @param end - End value
 * @param progress - Progress (0-1)
 * @param easing - Easing function name
 * @returns Interpolated value
 *
 * @example
 * ```typescript
 * const value = interpolate(0, 100, 0.5, 'easeInOutQuad');
 * console.log(value); // 50 (approximately)
 * ```
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easing: keyof typeof easingFunctions = 'linear'
): number {
  const easingFn = getEasingFunction(easing);
  const t = Math.max(0, Math.min(1, progress)); // Clamp to 0-1
  return start + (end - start) * easingFn(t);
}

/**
 * Interpolate between two points (2D)
 *
 * @param start - Start point {x, y}
 * @param end - End point {x, y}
 * @param progress - Progress (0-1)
 * @param easing - Easing function name
 * @returns Interpolated point
 */
export function interpolatePoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  progress: number,
  easing: keyof typeof easingFunctions = 'linear'
): { x: number; y: number } {
  return {
    x: interpolate(start.x, end.x, progress, easing),
    y: interpolate(start.y, end.y, progress, easing),
  };
}

/**
 * Create a bezier curve interpolation
 *
 * @param start - Start point
 * @param controlPoint1 - First control point
 * @param controlPoint2 - Second control point
 * @param end - End point
 * @param progress - Progress (0-1)
 * @returns Point on bezier curve
 */
export function bezierInterpolate(
  start: { x: number; y: number },
  controlPoint1: { x: number; y: number },
  controlPoint2: { x: number; y: number },
  end: { x: number; y: number },
  progress: number
): { x: number; y: number } {
  const t = Math.max(0, Math.min(1, progress));
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  return {
    x: mt3 * start.x + 3 * mt2 * t * controlPoint1.x + 3 * mt * t2 * controlPoint2.x + t3 * end.x,
    y: mt3 * start.y + 3 * mt2 * t * controlPoint1.y + 3 * mt * t2 * controlPoint2.y + t3 * end.y,
  };
}

// ============================================================================
// Particle System
// ============================================================================

/**
 * Create particle system for effects
 *
 * @param config - Particle configuration
 * @returns Array of particle objects
 *
 * @example
 * ```typescript
 * const particles = createParticles({
 *   count: 50,
 *   color: ['#ff0000', '#00ff00', '#0000ff'],
 *   size: { min: 2, max: 8 },
 *   velocity: { min: 1, max: 5 },
 *   lifetime: 2000
 * });
 * ```
 */
export function createParticles(config: ParticleConfig) {
  const particles = [];
  const colors = Array.isArray(config.color) ? config.color : [config.color];

  for (let i = 0; i < config.count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min);
    const size = config.size.min + Math.random() * (config.size.max - config.size.min);

    particles.push({
      id: `particle-${i}`,
      x: 0,
      y: 0,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      lifetime: config.lifetime,
      age: 0,
      opacity: 1,
    });
  }

  return particles;
}

/**
 * Update particle positions and properties
 *
 * @param particles - Array of particles
 * @param deltaTime - Time elapsed since last update (ms)
 * @param gravity - Gravity strength
 * @param friction - Friction coefficient
 * @returns Updated particles array (filters out dead particles)
 */
export function updateParticles(
  particles: any[],
  deltaTime: number,
  gravity: number = 0,
  friction: number = 0.99
) {
  return particles
    .map(particle => {
      const newParticle = { ...particle };

      // Update physics
      newParticle.vy += gravity * (deltaTime / 1000);
      newParticle.vx *= friction;
      newParticle.vy *= friction;

      newParticle.x += newParticle.vx * (deltaTime / 1000);
      newParticle.y += newParticle.vy * (deltaTime / 1000);

      // Update lifetime
      newParticle.age += deltaTime;
      newParticle.opacity = 1 - (newParticle.age / newParticle.lifetime);

      return newParticle;
    })
    .filter(p => p.age < p.lifetime);
}

// ============================================================================
// Network Packet Animation
// ============================================================================

/**
 * Create network packet animation
 *
 * @param source - Source point {x, y}
 * @param destination - Destination point {x, y}
 * @param protocol - Network protocol
 * @param data - Packet data
 * @returns Packet animation object
 */
export function createPacketAnimation(
  source: { x: number; y: number },
  destination: { x: number; y: number },
  protocol: string,
  data: string = ''
): PacketAnimation {
  return {
    id: `packet-${Date.now()}-${Math.random()}`,
    source,
    destination,
    protocol: protocol as any,
    data,
    progress: 0,
    status: 'pending',
  };
}

/**
 * Update packet animation progress
 *
 * @param packet - Packet animation object
 * @param deltaTime - Time elapsed (ms)
 * @param speed - Animation speed (0-1 per second)
 * @returns Updated packet
 */
export function updatePacketAnimation(
  packet: PacketAnimation,
  deltaTime: number,
  speed: number = 0.5
): PacketAnimation {
  const newPacket = { ...packet };

  if (newPacket.status === 'pending') {
    newPacket.status = 'in-transit';
  }

  if (newPacket.status === 'in-transit') {
    newPacket.progress += speed * (deltaTime / 1000);

    if (newPacket.progress >= 1) {
      newPacket.progress = 1;
      newPacket.status = 'delivered';
    }
  }

  return newPacket;
}

/**
 * Get current packet position based on progress
 *
 * @param packet - Packet animation object
 * @param easing - Easing function
 * @returns Current position {x, y}
 */
export function getPacketPosition(
  packet: PacketAnimation,
  easing: keyof typeof easingFunctions = 'easeInOutQuad'
): { x: number; y: number } {
  return interpolatePoint(
    packet.source,
    packet.destination,
    packet.progress,
    easing
  );
}

// ============================================================================
// Animation Frame Utilities
// ============================================================================

/**
 * Request animation frame with fallback
 */
export const requestAnimFrame =
  typeof window !== 'undefined'
    ? window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      ((callback: FrameRequestCallback) => window.setTimeout(callback, 1000 / 60))
    : (callback: FrameRequestCallback) => setTimeout(callback, 1000 / 60);

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimFrame =
  typeof window !== 'undefined'
    ? window.cancelAnimationFrame ||
      (window as any).webkitCancelAnimationFrame ||
      (window as any).mozCancelAnimationFrame ||
      clearTimeout
    : clearTimeout;

/**
 * Create animation loop
 *
 * @param callback - Function to call each frame (receives deltaTime in ms)
 * @returns Function to stop the animation loop
 *
 * @example
 * ```typescript
 * let x = 0;
 * const stop = createAnimationLoop((deltaTime) => {
 *   x += 0.1 * deltaTime;
 *   if (x >= 100) stop();
 * });
 * ```
 */
export function createAnimationLoop(
  callback: (deltaTime: number) => void
): () => void {
  let lastTime = performance.now();
  let animationId: number;
  let running = true;

  function animate(currentTime: number) {
    if (!running) {return;}

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    callback(deltaTime);

    animationId = requestAnimFrame(animate);
  }

  animationId = requestAnimFrame(animate);

  return () => {
    running = false;
    cancelAnimFrame(animationId);
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate distance between two points
 */
export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculate angle between two points (in radians)
 */
export function angle(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation (lerp)
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// ============================================================================
// Exports
// ============================================================================

export default {
  easingFunctions,
  getEasingFunction,
  interpolate,
  interpolatePoint,
  bezierInterpolate,
  createParticles,
  updateParticles,
  createPacketAnimation,
  updatePacketAnimation,
  getPacketPosition,
  createAnimationLoop,
  distance,
  angle,
  clamp,
  lerp,
  mapRange,
};
