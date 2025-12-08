/**
 * IPv6 Address Input Component
 * Handles IPv6 fundamentals display including address formats and types
 */

import React from 'react';

const AddressInput: React.FC = () => {
  return (
    <div className="space-y-6" role="tabpanel" id="fundamentals-panel">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* IPv6 Format */}
        <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-blue-900 dark:text-blue-100">
            IPv6 Address Format
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <div className="font-semibold">Standard Notation</div>
              <div className="font-mono text-blue-600">
                2001:0db8:85a3:0000:0000:8a2e:0370:7334
              </div>
            </div>
            <div>
              <div className="font-semibold">Compressed (Leading Zeros)</div>
              <div className="font-mono text-blue-600">2001:db8:85a3:0:0:8a2e:370:7334</div>
            </div>
            <div>
              <div className="font-semibold">Full Zero Compression (::)</div>
              <div className="font-mono text-blue-600">2001:db8:85a3::8a2e:370:7334</div>
            </div>
            <div className="border-t border-blue-300 pt-3">
              <div className="font-semibold text-blue-900 dark:text-blue-100">Key Points</div>
              <ul className="mt-2 space-y-1">
                <li>128 bits total (8 groups of 16 bits)</li>
                <li>Hexadecimal notation (0-9, a-f)</li>
                <li>:: used once to compress zeros</li>
                <li>Case-insensitive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Address Types */}
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-green-900 dark:text-green-100">
            IPv6 Address Types
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-green-700 dark:text-green-300">
                Unicast (2000::/3)
              </div>
              <div className="text-gray-800 dark:text-gray-300">One-to-one communication</div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-orange-700 dark:text-orange-300">
                Multicast (ff00::/8)
              </div>
              <div className="text-gray-800 dark:text-gray-300">One-to-many communication</div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-purple-700 dark:text-purple-300">
                Anycast (within Global)
              </div>
              <div className="text-gray-800 dark:text-gray-300">
                One-to-nearest communication
              </div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-blue-700 dark:text-blue-300">
                Link-Local (fe80::/10)
              </div>
              <div className="text-gray-800 dark:text-gray-300">
                Auto-configured, on-link only
              </div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-red-700 dark:text-red-300">
                Unique Local (fc00::/7)
              </div>
              <div className="text-gray-800 dark:text-gray-300">
                Private, equivalent to RFC 1918
              </div>
            </div>
          </div>
        </div>

        {/* Subnetting Reference */}
        <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-purple-900 dark:text-purple-100">
            Subnetting Reference
          </h3>
          <div className="space-y-2 font-mono text-sm text-gray-800 dark:text-gray-300">
            <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
              <span>/32</span>
              <span className="text-purple-600 dark:text-purple-300">
                Typical ISP allocation
              </span>
            </div>
            <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
              <span>/48</span>
              <span className="text-purple-600 dark:text-purple-300">
                Organization allocation
              </span>
            </div>
            <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
              <span>/56</span>
              <span className="text-purple-600 dark:text-purple-300">
                Subnet allocation (256 /64s)
              </span>
            </div>
            <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
              <span>/64</span>
              <span className="text-purple-600 dark:text-purple-300">Standard LAN/subnet</span>
            </div>
            <div className="mt-3 border-t border-purple-300 pt-3 text-xs text-purple-900 dark:text-purple-100">
              <div className="font-semibold">
                Formula: Subnets = 2^(new_prefix - old_prefix)
              </div>
            </div>
          </div>
        </div>

        {/* Transition Methods */}
        <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-orange-900 dark:text-orange-100">
            Transition Methods
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-orange-700 dark:text-orange-300">
                Dual Stack
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Run IPv4 and IPv6 simultaneously
              </div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-orange-700 dark:text-orange-300">
                6to4 Tunneling
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                IPv6 over IPv4, address-based
              </div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-orange-700 dark:text-orange-300">Teredo</div>
              <div className="text-gray-700 dark:text-gray-300">
                IPv6 through NAT and firewalls
              </div>
            </div>
            <div className="rounded bg-white p-2 dark:bg-gray-700">
              <div className="font-semibold text-orange-700 dark:text-orange-300">
                NAT64/DNS64
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Address/protocol translation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInput;
