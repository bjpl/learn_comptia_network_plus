/**
 * TCP Flags tab component
 */

import React from 'react';
import { TCP_FLAGS, TCP_HANDSHAKE } from '../../osi-data';

export const TCPFlagsTab: React.FC = () => {
  return (
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
            <p className="mb-2 text-sm text-gray-900 dark:text-gray-100">{flag.description}</p>
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
                <p className="mt-1 text-orange-900 dark:text-orange-100">{flag.examScenario}</p>
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
                <p className="text-sm text-gray-900 dark:text-gray-100">{step.description}</p>
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
                <p className="text-sm text-gray-900 dark:text-gray-100">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
