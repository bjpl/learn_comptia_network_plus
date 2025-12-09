/**
 * Mnemonics tab component
 */

import React from 'react';
import type { OSILayerNumber } from '../../osi-types';
import { MNEMONICS, LAYER_COLORS } from '../../osi-data';

export const MnemonicsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Memory Aids & Mnemonics
      </h2>

      {/* Layer Name Mnemonics */}
      <div className="space-y-4">
        {[
          MNEMONICS.bottomToTop,
          MNEMONICS.topToBottom,
          MNEMONICS.alternative1,
          MNEMONICS.alternative2,
        ].map((mnemonic, mnemonicIdx) => (
          <div
            key={mnemonicIdx}
            className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6 dark:border-purple-800 dark:from-purple-900/20 dark:to-blue-900/20"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {mnemonic.type}
              </h3>
            </div>
            <div className="mb-4 text-2xl font-bold text-purple-900 dark:text-purple-100">
              "{mnemonic.phrase}"
            </div>
            <div className="grid grid-cols-7 gap-2">
              {mnemonic.layers.map((layer, idx) => {
                const layerNum = mnemonic.type.includes('Bottom')
                  ? ((idx + 1) as OSILayerNumber)
                  : ((7 - idx) as OSILayerNumber);
                return (
                  <div key={idx} className="text-center">
                    <div
                      className="mb-2 flex aspect-square w-full items-center justify-center rounded-lg"
                      style={{ backgroundColor: LAYER_COLORS[layerNum] }}
                    >
                      <span className="text-xl font-bold text-white">{layerNum}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {layer}
                    </div>
                    <div className="mt-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                      {mnemonic.phrase.split(' ')[idx]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* PDU Mnemonic */}
        <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-teal-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-teal-900/20">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              PDU Names Mnemonic
            </h3>
          </div>
          <div className="mb-4 text-2xl font-bold text-green-900 dark:text-green-100">
            "{MNEMONICS.pduMnemonic.phrase}"
          </div>
          <div className="grid grid-cols-7 gap-2">
            {MNEMONICS.pduMnemonic.items.map((pdu, idx) => {
              const layerNum = (idx + 1) as OSILayerNumber;
              return (
                <div key={idx} className="text-center">
                  <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Layer {layerNum}
                  </div>
                  <div className="rounded border border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-800">
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{pdu}</div>
                  </div>
                  <div className="mt-1 text-xs font-bold text-green-600 dark:text-green-400">
                    {MNEMONICS.pduMnemonic.phrase.split(' ')[idx]}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-gray-900 dark:text-gray-100">
            {MNEMONICS.pduMnemonic.description}
          </p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <h3 className="mb-2 font-bold text-yellow-900 dark:text-yellow-100">💡 Exam Tips</h3>
        <ul className="space-y-2 text-sm text-yellow-950 dark:text-yellow-100">
          <li>• Use mnemonics to quickly recall layer order under exam pressure</li>
          <li>• Practice writing layers both top-down and bottom-up</li>
          <li>
            • Remember: "Data" is used for layers 5-7, then Segment, Packet, Frame, Bits
          </li>
          <li>• Layer numbers are testable - memorize 1-7 associations</li>
        </ul>
      </div>
    </div>
  );
};
