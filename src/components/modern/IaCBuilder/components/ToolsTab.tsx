import React from 'react';

export const ToolsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
          IaC Tools Comparison
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Understand the differences between popular IaC tools and their network automation
          capabilities
        </p>
      </div>

      {/* Tools Overview Table */}
      <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Tool
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Type
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Language
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Agent-based
              </th>
              <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Best For
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-blue-50">
              <td className="px-4 py-3 font-semibold text-red-600">Ansible</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Imperative/Procedural</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">YAML</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agentless (SSH)</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Multi-vendor network automation
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-purple-50">
              <td className="px-4 py-3 font-semibold text-purple-600">Terraform</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Declarative</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">HCL</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">No (cloud-based)</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Infrastructure provisioning
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-orange-50">
              <td className="px-4 py-3 font-semibold text-orange-600">Puppet</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Declarative</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Puppet DSL</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agent-based</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Enterprise configuration management
              </td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-blue-50">
              <td className="px-4 py-3 font-semibold text-blue-600">Chef</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Imperative/Declarative</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Ruby</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agent-based</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Application and infrastructure
              </td>
            </tr>
            <tr className="hover:bg-teal-50">
              <td className="px-4 py-3 font-semibold text-teal-600">SaltStack</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Imperative/Declarative</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">YAML</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agent-based (minion)</td>
              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                Event-driven automation
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detailed Tool Comparisons */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Ansible */}
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            <h5 className="text-lg font-semibold text-red-900">Ansible</h5>
          </div>
          <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold">Strengths:</p>
              <ul className="ml-3 list-disc space-y-1">
                <li>Agentless architecture (SSH)</li>
                <li>Simple YAML syntax</li>
                <li>Excellent for network devices</li>
                <li>Fast learning curve</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Use Case:</p>
              <p>Network device configuration, multi-vendor automation</p>
            </div>
          </div>
        </div>

        {/* Terraform */}
        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-600"></div>
            <h5 className="text-lg font-semibold text-purple-900">Terraform</h5>
          </div>
          <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold">Strengths:</p>
              <ul className="ml-3 list-disc space-y-1">
                <li>Declarative approach</li>
                <li>Multi-cloud support</li>
                <li>State management</li>
                <li>Strong modularity</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Use Case:</p>
              <p>Cloud infrastructure, hybrid environments</p>
            </div>
          </div>
        </div>

        {/* Puppet */}
        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-600"></div>
            <h5 className="text-lg font-semibold text-orange-900">Puppet</h5>
          </div>
          <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold">Strengths:</p>
              <ul className="ml-3 list-disc space-y-1">
                <li>Mature enterprise solution</li>
                <li>Declarative model</li>
                <li>Reporting and compliance</li>
                <li>Strong security</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Use Case:</p>
              <p>Enterprise infrastructure at scale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Version Control Integration */}
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
        <h4 className="mb-4 text-lg font-semibold text-green-900">
          Version Control for Network Configs
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 font-semibold text-green-800">Git Workflow:</p>
            <div className="space-y-1 text-sm">
              <div className="rounded bg-white p-3">
                <code className="font-mono text-xs">1. Create feature branch</code>
              </div>
              <div className="rounded bg-white p-3">
                <code className="font-mono text-xs">2. Commit IaC changes</code>
              </div>
              <div className="rounded bg-white p-3">
                <code className="font-mono text-xs">3. Create pull request</code>
              </div>
              <div className="rounded bg-white p-3">
                <code className="font-mono text-xs">4. Peer review & approval</code>
              </div>
              <div className="rounded bg-white p-3">
                <code className="font-mono text-xs">5. Merge to main/production</code>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-green-800">Repository Structure:</p>
            <div className="rounded bg-white p-3 text-xs">
              <pre className="font-mono text-xs">
                {`network-iac/
├── ansible/
│   ├── playbooks/
│   ├── roles/
│   └── inventory/
├── terraform/
│   ├── aws/
│   ├── azure/
│   └── modules/
├── tests/
└── docs/`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Criteria */}
      <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
        <h4 className="mb-4 text-lg font-semibold text-yellow-900">Choosing the Right Tool</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="font-bold text-yellow-700">Q:</span>
            <div>
              <p className="font-semibold">Managing network devices?</p>
              <p className="text-gray-700 dark:text-gray-300">
                Consider Ansible for agentless automation
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-yellow-700">Q:</span>
            <div>
              <p className="font-semibold">Provisioning cloud infrastructure?</p>
              <p className="text-gray-700 dark:text-gray-300">
                Terraform excels at multi-cloud orchestration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-yellow-700">Q:</span>
            <div>
              <p className="font-semibold">Enterprise-scale operations?</p>
              <p className="text-gray-700 dark:text-gray-300">
                Puppet provides mature management at scale
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-yellow-700">Q:</span>
            <div>
              <p className="font-semibold">Event-driven automation needs?</p>
              <p className="text-gray-700 dark:text-gray-300">
                SaltStack's real-time capabilities shine
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
