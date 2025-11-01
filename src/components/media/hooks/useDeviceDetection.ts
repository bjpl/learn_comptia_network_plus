/**
 * Hook for detecting device capabilities and adjusting 3D rendering quality
 */

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isLowEnd: boolean;
  pixelRatio: number;
  maxTextureSize: number;
  supportsWebGL2: boolean;
}

export function useDeviceDetection(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isLowEnd: false,
    pixelRatio: 1,
    maxTextureSize: 2048,
    supportsWebGL2: false
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Detect mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Detect tablet
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(
        navigator.userAgent
      );

      // Get pixel ratio
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      // Detect WebGL2 support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      const supportsWebGL2 = !!gl;

      // Detect GPU and determine if low-end
      let isLowEnd = false;
      let maxTextureSize = 2048;

      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          // Check for low-end GPUs
          isLowEnd = /Mali|Adreno 3|PowerVR|Tegra 3/i.test(renderer);
        }
        maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      }

      // Also consider low-end based on cores and memory
      if ('hardwareConcurrency' in navigator) {
        const cores = navigator.hardwareConcurrency;
        if (cores <= 2) {
          isLowEnd = true;
        }
      }

      // Check memory (if available)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        if (memory <= 2) {
          isLowEnd = true;
        }
      }

      setCapabilities({
        isMobile,
        isTablet,
        isLowEnd,
        pixelRatio,
        maxTextureSize,
        supportsWebGL2
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
}

/**
 * Get recommended render settings based on device capabilities
 */
export function getRenderSettings(capabilities: DeviceCapabilities) {
  const { isMobile, isLowEnd, pixelRatio } = capabilities;

  return {
    // Adjust pixel ratio for performance
    dpr: isLowEnd ? 1 : Math.min(pixelRatio, 2),

    // Shadow settings
    shadows: !isMobile && !isLowEnd,

    // Anti-aliasing
    antialias: !isLowEnd,

    // Texture quality
    textureQuality: isLowEnd ? 'low' : isMobile ? 'medium' : 'high',

    // Polygon count multiplier
    polygonMultiplier: isLowEnd ? 0.5 : isMobile ? 0.75 : 1,

    // Animation frame rate
    targetFPS: isLowEnd ? 30 : 60,

    // Post-processing effects
    postProcessing: !isMobile && !isLowEnd
  };
}
