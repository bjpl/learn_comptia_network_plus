import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5174,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          'state-vendor': ['zustand'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],

          // Feature chunks - OSI Module
          'osi-features': [
            './src/components/osi/TroubleshootingScenarios',
            './src/components/osi/PacketJourneySimulator',
            './src/components/osi/LayerExplanationBuilder',
          ],

          // Feature chunks - Cloud
          'cloud-features': [
            './src/components/cloud/CloudArchitectureDesigner',
            './src/components/cloud/CloudSummaryBuilder',
          ],

          // Feature chunks - Assessment
          'assessment-features': [
            './src/components/assessment/ScenarioSimulator',
            './src/components/assessment/ProgressDashboard',
          ],

          // Feature chunks - Media & Connectors
          'media-features': [
            './src/components/media/Connector3DViewer',
            './src/components/media/ConnectorIdentification',
            './src/components/media/ConnectorLab',
            './src/components/media/MediaSelectionMatrix',
          ],

          // Feature chunks - Protocols
          'protocol-features': [
            './src/components/protocols/PortProtocolTrainer',
            './src/components/protocols/PortScanner',
            './src/components/protocols/TrafficTypeDemo',
          ],

          // Feature chunks - Network Appliances
          'appliance-features': [
            './src/components/appliances/NetworkSimulator',
            './src/components/appliances/ComparisonMatrix',
            './src/components/appliances/DecisionTree',
          ],

          // Feature chunks - IPv4 & Subnetting
          'ipv4-features': [
            './src/components/ipv4/SubnetDesigner',
            './src/components/ipv4/IPv4Troubleshooter',
            './src/components/ipv4/IPv4Troubleshooting',
          ],

          // Feature chunks - Modern Technologies
          'modern-features': [
            './src/components/modern/IPv6Planner',
            './src/components/modern/TechnologySummarizer',
            './src/components/modern/IaCBuilder',
          ],

          // Feature chunks - Topologies
          'topology-features': [
            './src/components/topologies/TopologyAnalyzer',
            './src/components/topologies/TopologyTransformer',
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        '*.config.js',
        'dist/',
        'build/',
        '.claude-flow/',
      ],
    },
  },
});
