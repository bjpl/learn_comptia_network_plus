/**
 * Enhanced OSI Model Learning Component
 * Main component that orchestrates all sub-components
 * Comprehensive CompTIA Network+ N10-008 Exam Preparation
 */

import React from 'react';
import { useOSIEnhancedState } from './hooks/useOSIEnhancedState';
import {
  Header,
  TabNavigation,
  OverviewTab,
  ProtocolsTab,
  TCPFlagsTab,
  EncapsulationTab,
  MnemonicsTab,
  ScenariosTab,
} from './components';

export const OSIEnhanced: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedLayer,
    toggleLayer,
    showPortNumbers,
    setShowPortNumbers,
  } = useOSIEnhancedState();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <Header />

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab selectedLayer={selectedLayer} onLayerSelect={toggleLayer} />
          )}

          {activeTab === 'protocols' && (
            <ProtocolsTab
              showPortNumbers={showPortNumbers}
              onTogglePortNumbers={setShowPortNumbers}
            />
          )}

          {activeTab === 'tcpFlags' && <TCPFlagsTab />}

          {activeTab === 'encapsulation' && <EncapsulationTab />}

          {activeTab === 'mnemonics' && <MnemonicsTab />}

          {activeTab === 'scenarios' && <ScenariosTab />}
        </div>
      </div>
    </div>
  );
};

export default OSIEnhanced;
