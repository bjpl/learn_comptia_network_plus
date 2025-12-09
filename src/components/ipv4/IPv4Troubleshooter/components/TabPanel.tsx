/**
 * TabPanel component for managing tab content
 */
import React from 'react';
import type { TabPanelProps } from '../types';

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '20px 0' }}>
    {value === index && children}
  </div>
);
