/**
 * Type definitions for OSIEnhanced component
 */

export type TabType = 'overview' | 'protocols' | 'tcpFlags' | 'encapsulation' | 'mnemonics' | 'scenarios';

export interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

export interface OSIEnhancedState {
  activeTab: TabType;
  selectedLayer: import('../../osi-types').OSILayerNumber | null;
  showPortNumbers: boolean;
}
