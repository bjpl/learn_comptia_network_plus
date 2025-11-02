/**
 * Enhanced OSI Model Learning Component
 * Comprehensive CompTIA Network+ N10-008 Exam Preparation
 */

import React, { useState } from 'react';
import {
  PROTOCOLS,
  TCP_FLAGS,
  TCP_HANDSHAKE,
  MNEMONICS,
  MTU_VALUES,
  ENCAPSULATION_EXAMPLE,
  REAL_WORLD_SCENARIOS,
  LAYER_COLORS,
  LAYER_NAMES,
} from './osi-data';
import type { OSILayerNumber } from './osi-types';

export const OSIEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'protocols' | 'tcpFlags' | 'encapsulation' | 'mnemonics' | 'scenarios'
  >('overview');
  const [selectedLayer, setSelectedLayer] = useState<OSILayerNumber | null>(null);
  const [showPortNumbers, setShowPortNumbers] = useState(true);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <h1 className="mb-2 text-4xl font-bold">OSI Model Master Class</h1>
        <p className="text-lg text-blue-100">
          Complete CompTIA Network+ N10-008 OSI Model Coverage
        </p>
        <div className="mt-4 flex gap-2 text-sm">
          <span className="rounded-full bg-white/20 px-3 py-1">60+ Protocols</span>
          <span className="rounded-full bg-white/20 px-3 py-1">TCP Flags</span>
          <span className="rounded-full bg-white/20 px-3 py-1">Data Encapsulation</span>
          <span className="rounded-full bg-white/20 px-3 py-1">50 Scenarios</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex overflow-x-auto">
            {[
              { id: 'overview', label: 'OSI Overview', icon: '📚' },
              { id: 'protocols', label: 'Protocols & Ports', icon: '🔌' },
              { id: 'tcpFlags', label: 'TCP Flags', icon: '🚩' },
              { id: 'encapsulation', label: 'Encapsulation', icon: '📦' },
              { id: 'mnemonics', label: 'Memory Aids', icon: '🧠' },
              { id: 'scenarios', label: 'Real-World', icon: '🌍' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                } `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* OSI Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                OSI Model 7 Layers
              </h2>

              {/* Layer Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
                  const layer = layerNum as OSILayerNumber;
                  const protocols = PROTOCOLS.filter((p) => p.layer === layer);

                  return (
                    <button
                      key={layer}
                      onClick={() => setSelectedLayer(layer === selectedLayer ? null : layer)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedLayer === layer
                          ? 'scale-105 border-blue-600 shadow-lg'
                          : 'border-gray-200 hover:border-blue-400 dark:border-gray-700'
                      } `}
                      style={{
                        backgroundColor:
                          selectedLayer === layer ? `${LAYER_COLORS[layer]}20` : undefined,
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-2xl font-bold" style={{ color: LAYER_COLORS[layer] }}>
                          Layer {layer}
                        </span>
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: LAYER_COLORS[layer] }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {LAYER_NAMES[layer]}
                      </h3>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {protocols.length} protocols
                      </p>

                      {selectedLayer === layer && (
                        <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                          <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Key Protocols:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {protocols.slice(0, 5).map((p) => (
                              <span
                                key={p.name}
                                className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {p.name}
                              </span>
                            ))}
                            {protocols.length > 5 && (
                              <span className="px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300">
                                +{protocols.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Layer Details */}
              {selectedLayer && (
                <div className="mt-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                    Layer {selectedLayer}: {LAYER_NAMES[selectedLayer]}
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                        Protocols:
                      </h4>
                      <div className="space-y-2">
                        {PROTOCOLS.filter((p) => p.layer === selectedLayer).map((protocol) => (
                          <div
                            key={protocol.name}
                            className="rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {protocol.name}
                              </span>
                              {protocol.port && (
                                <span className="rounded bg-blue-100 px-2 py-1 font-mono text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Port {protocol.port}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                              {protocol.description}
                            </p>
                            {protocol.transport && (
                              <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                                {protocol.transport}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                        Real-World Example:
                      </h4>
                      <div className="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-2 text-3xl">
                          {REAL_WORLD_SCENARIOS[selectedLayer].icon}
                        </div>
                        <h5 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                          {REAL_WORLD_SCENARIOS[selectedLayer].title}
                        </h5>
                        <ul className="space-y-2 text-sm text-gray-900 dark:text-gray-100">
                          {REAL_WORLD_SCENARIOS[selectedLayer].steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600 dark:text-blue-400">→</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 rounded bg-blue-50 p-3 dark:bg-blue-900/20">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>Exam Tip:</strong> {REAL_WORLD_SCENARIOS[selectedLayer].examTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Protocols & Ports Tab */}
          {activeTab === 'protocols' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Protocols & Port Numbers
                </h2>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPortNumbers}
                    onChange={(e) => setShowPortNumbers(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    Show Port Numbers
                  </span>
                </label>
              </div>

              {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
                const layer = layerNum as OSILayerNumber;
                const protocols = PROTOCOLS.filter((p) => p.layer === layer);

                return (
                  <div key={layer} className="space-y-3">
                    <h3
                      className="flex items-center gap-3 text-lg font-bold"
                      style={{ color: LAYER_COLORS[layer] }}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded font-bold text-white"
                        style={{ backgroundColor: LAYER_COLORS[layer] }}
                      >
                        {layer}
                      </div>
                      {LAYER_NAMES[layer]} Layer
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        ({protocols.length} protocols)
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {protocols.map((protocol) => (
                        <div
                          key={protocol.name}
                          className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold text-gray-900 dark:text-gray-100">
                                {protocol.name}
                              </div>
                              {showPortNumbers && protocol.port && (
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    :{protocol.port}
                                  </span>
                                  {protocol.transport && (
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                                      {protocol.transport}
                                    </span>
                                  )}
                                </div>
                              )}
                              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                                {protocol.description}
                              </p>
                            </div>
                            {protocol.examImportance && (
                              <span
                                className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${protocol.examImportance === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''} ${protocol.examImportance === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''} ${protocol.examImportance === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''} ${protocol.examImportance === 'low' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : ''} `}
                              >
                                {protocol.examImportance}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TCP Flags Tab */}
          {activeTab === 'tcpFlags' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                TCP Control Flags - EXAM CRITICAL
              </h2>

              {/* TCP Flags Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {TCP_FLAGS.map((flag) => (
                  <div
                    key={flag.abbreviation}
                    className="rounded-lg border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                        <span className="text-lg font-bold text-white">{flag.abbreviation}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{flag.name}</h3>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          Bit {flag.bitPosition}
                        </span>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-gray-900 dark:text-gray-100">
                      {flag.description}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="rounded bg-blue-50 p-2 dark:bg-blue-900/20">
                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                          Common Use:
                        </span>
                        <p className="mt-1 text-blue-900 dark:text-blue-100">{flag.commonUse}</p>
                      </div>
                      <div className="rounded bg-orange-50 p-2 dark:bg-orange-900/20">
                        <span className="font-semibold text-orange-900 dark:text-orange-100">
                          Exam Scenario:
                        </span>
                        <p className="mt-1 text-orange-900 dark:text-orange-100">
                          {flag.examScenario}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TCP 3-Way Handshake */}
              <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-blue-900/20">
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  TCP 3-Way Handshake (Connection Establishment)
                </h3>
                <div className="space-y-3">
                  {TCP_HANDSHAKE.establishment.map((step) => (
                    <div key={step.step} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                        {step.step}
                      </div>
                      <div className="flex-1 rounded-lg bg-white p-3 dark:bg-gray-800">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {step.from} → {step.to}
                          </span>
                          <div className="flex gap-1">
                            {step.flags.map((flag) => (
                              <span
                                key={flag}
                                className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {step.description}
                        </p>
                        {step.seqNum && (
                          <span className="mt-1 inline-block text-xs text-gray-700 dark:text-gray-400">
                            Seq: {step.seqNum} {step.ackNum && `| Ack: ${step.ackNum}`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TCP Connection Termination */}
              <div className="rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 dark:border-red-800 dark:from-red-900/20 dark:to-orange-900/20">
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  TCP 4-Way Termination (Connection Close)
                </h3>
                <div className="space-y-3">
                  {TCP_HANDSHAKE.termination.map((step) => (
                    <div key={step.step} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                        {step.step}
                      </div>
                      <div className="flex-1 rounded-lg bg-white p-3 dark:bg-gray-800">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {step.from} → {step.to}
                          </span>
                          <div className="flex gap-1">
                            {step.flags.map((flag) => (
                              <span
                                key={flag}
                                className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Encapsulation Tab */}
          {activeTab === 'encapsulation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Data Encapsulation Process
              </h2>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-950 dark:text-blue-100">
                  <strong>Original Data:</strong>{' '}
                  <span className="font-mono">{ENCAPSULATION_EXAMPLE.originalData}</span>
                </p>
              </div>

              <div className="space-y-4">
                {ENCAPSULATION_EXAMPLE.steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white"
                        style={{ backgroundColor: LAYER_COLORS[step.layer as OSILayerNumber] }}
                      >
                        L{step.layer}
                      </div>
                      <div className="flex-1 rounded-lg border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100">
                            {step.layerName} Layer
                          </h3>
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {step.pdu}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Action:
                          </span>
                          <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            {step.action}
                          </span>
                        </div>
                        <div className="break-all rounded bg-gray-50 p-3 font-mono text-sm dark:bg-gray-900">
                          {step.content}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {step.description}
                          </p>
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                            {step.size} bytes
                          </span>
                        </div>
                      </div>
                    </div>
                    {idx < ENCAPSULATION_EXAMPLE.steps.length - 1 && (
                      <div className="my-2 ml-6 flex items-center gap-2">
                        <div className="h-6 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          ↓ Encapsulation
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* MTU Values */}
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                  Common MTU Values (Exam Knowledge)
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {Object.entries(MTU_VALUES).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {value.size}
                      </div>
                      <div className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                        {value.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mnemonics Tab */}
          {activeTab === 'mnemonics' && (
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
                            <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                              {pdu}
                            </div>
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
                <h3 className="mb-2 font-bold text-yellow-900 dark:text-yellow-100">
                  💡 Exam Tips
                </h3>
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
          )}

          {/* Real-World Scenarios Tab */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Real-World Scenarios by Layer
              </h2>

              {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
                const layer = layerNum as OSILayerNumber;
                const scenario = REAL_WORLD_SCENARIOS[layer];

                return (
                  <div
                    key={layer}
                    className="rounded-lg border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white"
                        style={{ backgroundColor: LAYER_COLORS[layer] }}
                      >
                        {scenario.icon}
                      </div>
                      <div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Layer {layer} - {LAYER_NAMES[layer]}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {scenario.title}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                          Process Flow:
                        </h4>
                        <ol className="space-y-2">
                          {scenario.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                          Key Protocols:
                        </h4>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {scenario.protocols.map((protocol) => (
                            <span
                              key={protocol}
                              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {protocol}
                            </span>
                          ))}
                        </div>
                        <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-red-900/20">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">🎯</span>
                            <div>
                              <div className="mb-1 font-semibold text-orange-900 dark:text-orange-100">
                                Exam Tip:
                              </div>
                              <p className="text-sm text-orange-950 dark:text-orange-100">
                                {scenario.examTip}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OSIEnhanced;
