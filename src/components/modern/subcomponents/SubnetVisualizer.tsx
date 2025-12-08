/**
 * SubnetVisualizer Component
 * Visual display of IPv6 fundamentals, address types, and transition methods
 */

import React, { memo } from 'react';

const SubnetVisualizer: React.FC = memo(() => {
  return (
    <div className="space-y-6" role="tabpanel" id="fundamentals-panel">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* IPv6 Format */}
        <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-blue-900 dark:text-blue-100">
            IPv6 Address Format
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <FormatExample
              label="Standard Notation"
              value="2001:0db8:85a3:0000:0000:8a2e:0370:7334"
            />
            <FormatExample
              label="Compressed (Leading Zeros)"
              value="2001:db8:85a3:0:0:8a2e:370:7334"
            />
            <FormatExample
              label="Full Zero Compression (::)"
              value="2001:db8:85a3::8a2e:370:7334"
            />
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
        <AddressTypes />

        {/* Subnetting Reference */}
        <SubnettingReference />

        {/* Transition Methods */}
        <TransitionMethods />
      </div>
    </div>
  );
});

SubnetVisualizer.displayName = 'SubnetVisualizer';

const FormatExample: React.FC<{ label: string; value: string }> = memo(({ label, value }) => (
  <div>
    <div className="font-semibold">{label}</div>
    <div className="font-mono text-blue-600">{value}</div>
  </div>
));

FormatExample.displayName = 'FormatExample';

const AddressTypes: React.FC = memo(() => (
  <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
    <h3 className="mb-4 text-xl font-bold text-green-900 dark:text-green-100">
      IPv6 Address Types
    </h3>
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      <AddressType
        type="Unicast (2000::/3)"
        description="One-to-one communication"
        color="green"
      />
      <AddressType
        type="Multicast (ff00::/8)"
        description="One-to-many communication"
        color="orange"
      />
      <AddressType
        type="Anycast (within Global)"
        description="One-to-nearest communication"
        color="purple"
      />
      <AddressType
        type="Link-Local (fe80::/10)"
        description="Auto-configured, on-link only"
        color="blue"
      />
      <AddressType
        type="Unique Local (fc00::/7)"
        description="Private, equivalent to RFC 1918"
        color="red"
      />
    </div>
  </div>
));

AddressTypes.displayName = 'AddressTypes';

const AddressType: React.FC<{ type: string; description: string; color: string }> = memo(
  ({ type, description, color }) => (
    <div className="rounded bg-white p-2 dark:bg-gray-700">
      <div className={`font-semibold text-${color}-700 dark:text-${color}-300`}>
        {type}
      </div>
      <div className="text-gray-800 dark:text-gray-300">{description}</div>
    </div>
  )
);

AddressType.displayName = 'AddressType';

const SubnettingReference: React.FC = memo(() => (
  <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6">
    <h3 className="mb-4 text-xl font-bold text-purple-900 dark:text-purple-100">
      Subnetting Reference
    </h3>
    <div className="space-y-2 font-mono text-sm text-gray-800 dark:text-gray-300">
      <SubnetRow prefix="/32" description="Typical ISP allocation" />
      <SubnetRow prefix="/48" description="Organization allocation" />
      <SubnetRow prefix="/56" description="Subnet allocation (256 /64s)" />
      <SubnetRow prefix="/64" description="Standard LAN/subnet" />
      <div className="mt-3 border-t border-purple-300 pt-3 text-xs text-purple-900 dark:text-purple-100">
        <div className="font-semibold">
          Formula: Subnets = 2^(new_prefix - old_prefix)
        </div>
      </div>
    </div>
  </div>
));

SubnettingReference.displayName = 'SubnettingReference';

const SubnetRow: React.FC<{ prefix: string; description: string }> = memo(
  ({ prefix, description }) => (
    <div className="flex justify-between rounded bg-white p-2 dark:bg-gray-700">
      <span>{prefix}</span>
      <span className="text-purple-600 dark:text-purple-300">{description}</span>
    </div>
  )
);

SubnetRow.displayName = 'SubnetRow';

const TransitionMethods: React.FC = memo(() => (
  <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
    <h3 className="mb-4 text-xl font-bold text-orange-900 dark:text-orange-100">
      Transition Methods
    </h3>
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      <TransitionMethod
        name="Dual Stack"
        description="Run IPv4 and IPv6 simultaneously"
      />
      <TransitionMethod
        name="6to4 Tunneling"
        description="IPv6 over IPv4, address-based"
      />
      <TransitionMethod
        name="Teredo"
        description="IPv6 through NAT and firewalls"
      />
      <TransitionMethod
        name="NAT64/DNS64"
        description="Address/protocol translation"
      />
    </div>
  </div>
));

TransitionMethods.displayName = 'TransitionMethods';

const TransitionMethod: React.FC<{ name: string; description: string }> = memo(
  ({ name, description }) => (
    <div className="rounded bg-white p-2 dark:bg-gray-700">
      <div className="font-semibold text-orange-700 dark:text-orange-300">{name}</div>
      <div className="text-gray-700 dark:text-gray-300">{description}</div>
    </div>
  )
);

TransitionMethod.displayName = 'TransitionMethod';

export default SubnetVisualizer;
