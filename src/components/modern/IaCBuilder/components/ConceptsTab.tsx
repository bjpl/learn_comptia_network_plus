import React from 'react';

export const ConceptsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Infrastructure as Code Fundamentals
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Core concepts and principles for managing infrastructure through code
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Core Concepts */}
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-blue-900">What is IaC?</h4>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-200">Definition:</p>
              <p className="mt-1 text-gray-800 dark:text-gray-300">
                Infrastructure as Code (IaC) means managing and provisioning computing
                infrastructure using machine-readable definition files rather than interactive
                configuration tools.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-200">Key Principle:</p>
              <p className="mt-1 text-gray-800 dark:text-gray-300">
                Treat infrastructure the same as application code: version control, code review,
                testing, and automation.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-green-900">Key Benefits</h4>
          <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-600"></span>
              <span>
                <strong>Consistency:</strong> Identical deployments across environments
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-600"></span>
              <span>
                <strong>Speed:</strong> Automated provisioning reduces time-to-production
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-600"></span>
              <span>
                <strong>Reliability:</strong> Repeatable processes reduce human error
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-600"></span>
              <span>
                <strong>Auditability:</strong> Version control tracks all changes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-600"></span>
              <span>
                <strong>Scalability:</strong> Easily replicate configurations at scale
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* IaC Approaches */}
      <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6">
        <h4 className="mb-4 text-lg font-semibold text-purple-900">IaC Approaches</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border border-purple-300 bg-white p-4 dark:bg-gray-800">
            <div className="mb-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
              Declarative (Desired State)
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              Define the desired final state; the tool determines how to achieve it.
            </p>
            <p className="mt-2 text-xs font-semibold text-gray-900">
              Examples: Terraform, Puppet
            </p>
          </div>
          <div className="rounded border border-purple-300 bg-white p-4 dark:bg-gray-800">
            <div className="mb-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
              Imperative (Procedural)
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              Define specific commands to reach desired state; explicit step-by-step
              instructions.
            </p>
            <p className="mt-2 text-xs font-semibold text-gray-900">Examples: Ansible, Chef</p>
          </div>
        </div>
      </div>

      {/* Network Automation */}
      <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
        <h4 className="mb-4 text-lg font-semibold text-orange-900">
          Network Automation with IaC
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-200">
              Configuration Management:
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-300">
              Deploy router/switch configs, apply security policies, manage VLAN assignments
            </p>
          </div>
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-200">
              Service Deployment:
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-300">
              Automate provisioning of load balancers, firewalls, SD-WAN appliances
            </p>
          </div>
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-200">
              Compliance & Validation:
            </p>
            <p className="mt-1 text-gray-800 dark:text-gray-300">
              Enforce security baselines, validate configurations, generate compliance reports
            </p>
          </div>
        </div>
      </div>

      {/* Exam Tips */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <h4 className="mb-3 text-lg font-semibold text-red-900">
          CompTIA Network+ Exam Focus Areas
        </h4>
        <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-600">•</span>
            <span>Understand IaC benefits and differences from traditional management</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-600">•</span>
            <span>Know common IaC tools and their use cases (Ansible, Terraform, Puppet)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-600">•</span>
            <span>Understand version control integration and change management</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-600">•</span>
            <span>Configuration drift detection and remediation importance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-600">•</span>
            <span>CI/CD pipeline concepts for infrastructure deployment</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
