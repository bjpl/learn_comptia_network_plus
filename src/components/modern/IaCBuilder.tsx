import React, { useState } from 'react';
import type { IaCTemplate, IaCPlatform } from './modern-types';
import { iacTemplates, driftExamples, validationChecks } from './modern-data';

const IaCBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'concepts' | 'templates' | 'builder' | 'drift' | 'pipeline' | 'tools'
  >('concepts');
  const [selectedTemplate, setSelectedTemplate] = useState<IaCTemplate | null>(null);
  const [codeEditorContent, setCodeEditorContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'yaml' | 'json' | 'hcl'>('yaml');
  const [, setShowValidation] = useState(false);

  const platformInfo: Record<IaCPlatform, { description: string; color: string }> = {
    ansible: { description: 'Agentless automation with YAML', color: 'bg-red-100 text-red-700' },
    terraform: {
      description: 'Infrastructure as Code with HCL',
      color: 'bg-purple-100 text-purple-700',
    },
    puppet: {
      description: 'Declarative configuration management',
      color: 'bg-orange-100 text-orange-700',
    },
    chef: {
      description: 'Ruby-based infrastructure automation',
      color: 'bg-blue-100 text-blue-700',
    },
    saltstack: {
      description: 'Event-driven automation platform',
      color: 'bg-teal-100 text-teal-700',
    },
    cloudformation: { description: 'AWS native IaC', color: 'bg-yellow-100 text-yellow-700' },
  };

  const sampleCode = {
    yaml: `---
# Ansible Playbook Example
- name: Configure Network Devices
  hosts: routers
  gather_facts: no

  tasks:
    - name: Set hostname
      cisco.ios.ios_config:
        lines:
          - hostname {{ inventory_hostname }}

    - name: Configure interfaces
      cisco.ios.ios_interfaces:
        config:
          - name: GigabitEthernet0/1
            description: Uplink to Core
            enabled: true
        state: merged

    - name: Save configuration
      cisco.ios.ios_config:
        save_when: changed`,

    json: `{
  "variables": {
    "hostname": {
      "type": "string",
      "description": "Device hostname",
      "required": true
    },
    "management_ip": {
      "type": "string",
      "description": "Management interface IP"
    }
  },
  "tasks": [
    {
      "name": "Configure hostname",
      "module": "ios_config",
      "parameters": {
        "lines": ["hostname {{ hostname }}"]
      }
    },
    {
      "name": "Configure management interface",
      "module": "ios_interface",
      "parameters": {
        "name": "GigabitEthernet0/0",
        "ipv4": "{{ management_ip }}"
      }
    }
  ]
}`,

    hcl: `# Terraform Configuration Example
variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "main-vpc"
    Environment = "production"
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "public-subnet-\${count.index + 1}"
  }
}`,
  };

  const handleTemplateSelect = (template: IaCTemplate) => {
    setSelectedTemplate(template);
    setCodeEditorContent(generateTemplateCode(template));
  };

  const generateTemplateCode = (template: IaCTemplate): string => {
    if (template.platform === 'ansible') {
      return `---
# ${template.name}
# ${template.description}

- name: ${template.name}
  hosts: all
  gather_facts: no

  vars:
${template.parameters.map((p) => `    ${p.name}: ${p.default !== undefined ? JSON.stringify(p.default) : '""'}`).join('\n')}

  tasks:
${template.tasks
  .map(
    (task, idx) => `    - name: ${task.name}
      # ${task.description}
      debug:
        msg: "Task ${idx + 1}: {{ ${template.parameters[0]?.name || 'variable'} }}"
`
  )
  .join('\n')}`;
    }
    return sampleCode.yaml;
  };

  const validateCode = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (codeEditorContent.trim().length === 0) {
      errors.push('Code editor is empty');
      return { isValid: false, errors };
    }

    // Basic syntax validation
    if (selectedLanguage === 'yaml') {
      if (!codeEditorContent.includes('---')) {
        errors.push('YAML should start with ---');
      }
      if (!codeEditorContent.includes('tasks:') && !codeEditorContent.includes('resource')) {
        errors.push('No tasks or resources defined');
      }
    } else if (selectedLanguage === 'json') {
      try {
        JSON.parse(codeEditorContent);
      } catch {
        errors.push('Invalid JSON syntax');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const getDriftSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Component 20: Infrastructure as Code (IaC) Builder
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Master network automation with IaC tools: learn Terraform, Ansible, and Puppet. Manage
          configuration drift, build CI/CD pipelines, and implement version control for
          infrastructure.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 overflow-x-auto border-b-2 border-gray-200">
        {(['concepts', 'templates', 'builder', 'drift', 'pipeline', 'tools'] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-800 hover:text-blue-500 dark:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* IaC Concepts Tab */}
      {activeTab === 'concepts' && (
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
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              IaC Template Library
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Pre-built templates for common network automation tasks
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {iacTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {template.name}
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${platformInfo[template.platform].color}`}
                  >
                    {template.platform}
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                  {template.description}
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="rounded bg-gray-100 px-2 py-1">{template.difficulty}</span>
                  <span className="rounded bg-gray-100 px-2 py-1">
                    {template.tasks.length} tasks
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedTemplate && (
            <div className="mt-6 rounded-lg border-2 border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Template Details: {selectedTemplate.name}
              </h4>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h5 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Parameters
                  </h5>
                  <div className="space-y-2">
                    {selectedTemplate.parameters.map((param) => (
                      <div
                        key={param.name}
                        className="rounded border bg-white p-3 dark:bg-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {param.name}
                          </span>
                          <span className="text-xs text-gray-800 dark:text-gray-200">
                            {param.type}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                          {param.description}
                        </p>
                        {param.required && <span className="text-xs text-red-600">* Required</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Tasks</h5>
                  <div className="space-y-2">
                    {selectedTemplate.tasks.map((task) => (
                      <div key={task.id} className="rounded border bg-white p-3 dark:bg-gray-700">
                        <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {task.name}
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {task.description}
                        </p>
                        <div className="mt-2 flex gap-2 text-xs">
                          <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                            {task.validation.length} validation checks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100">Generated Code</h5>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeEditorContent)}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100">
                  {codeEditorContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Builder Tab */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Code Editor
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Write and validate IaC configurations with syntax highlighting
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex gap-2">
            {(['yaml', 'json', 'hcl'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setCodeEditorContent(sampleCode[lang]);
                }}
                className={`rounded-lg px-4 py-2 font-semibold ${
                  selectedLanguage === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Code Editor */}
          <div className="rounded-lg border-2 border-gray-300">
            <div className="flex items-center justify-between border-b-2 border-gray-300 bg-gray-100 px-4 py-2">
              <span className="font-semibold">config.{selectedLanguage}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const validation = validateCode();
                    setShowValidation(true);
                    alert(
                      validation.isValid
                        ? 'Code is valid!'
                        : `Errors:\n${validation.errors.join('\n')}`
                    );
                  }}
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                >
                  Validate
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(codeEditorContent)}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
            <textarea
              value={codeEditorContent}
              onChange={(e) => setCodeEditorContent(e.target.value)}
              className="h-96 w-full resize-none bg-gray-900 p-4 font-mono text-sm text-gray-100 focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Validation Checks Panel */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
            <h4 className="mb-3 text-lg font-semibold">Validation Checks</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {validationChecks.map((check, idx) => (
                <div key={idx} className="rounded border bg-white p-3">
                  <div className="mb-1 flex items-start justify-between">
                    <span className="text-sm font-semibold">{check.name}</span>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      {check.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <div>
                      Command: <code className="bg-gray-100 px-1">{check.command}</code>
                    </div>
                    <div className="mt-1">Timeout: {check.timeout}s</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Drift Tab */}
      {activeTab === 'drift' && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Configuration Drift Detection</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Identify unauthorized changes and maintain configuration compliance
            </p>
          </div>

          <div className="space-y-4">
            {driftExamples.map((drift) => (
              <div
                key={drift.hostId}
                className={`rounded-lg border-2 p-6 ${getDriftSeverityColor(drift.severity)}`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{drift.hostname}</h4>
                    <p className="text-sm">Detected: {drift.detectedAt.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        drift.severity === 'critical'
                          ? 'bg-red-200'
                          : drift.severity === 'high'
                            ? 'bg-orange-200'
                            : drift.severity === 'medium'
                              ? 'bg-yellow-200'
                              : 'bg-blue-200'
                      }`}
                    >
                      {drift.severity.toUpperCase()}
                    </span>
                    {drift.autoFixable && (
                      <div className="mt-1 text-xs">
                        <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                          Auto-fixable
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {drift.drifts.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-white bg-opacity-50 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="font-semibold">{item.parameter}</span>
                        <span className="rounded bg-white px-2 py-1 text-xs">{item.category}</span>
                      </div>
                      <div className="mb-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-900">Expected:</span>{' '}
                          <code className="rounded bg-white px-2 py-1">
                            {String(item.expected)}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-900">Actual:</span>{' '}
                          <code className="rounded bg-white px-2 py-1">{String(item.actual)}</code>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="font-semibold">Impact:</span> {item.impact}
                        </div>
                        <div>
                          <span className="font-semibold">Recommendation:</span>{' '}
                          {item.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {drift.autoFixable && (
                  <div className="mt-4 flex gap-2">
                    <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                      Auto-Fix All
                    </button>
                    <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                      Generate Remediation Playbook
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">NetOps CI/CD Pipeline</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Automated workflow for network configuration deployment
            </p>
          </div>

          {/* Pipeline Visualization */}
          <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Pipeline Stages</h4>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Active
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: 'Validate',
                  description: 'Syntax and schema validation',
                  status: 'success',
                  duration: '12s',
                },
                {
                  name: 'Test',
                  description: 'Unit and integration tests',
                  status: 'success',
                  duration: '45s',
                },
                {
                  name: 'Deploy (Staging)',
                  description: 'Deploy to staging environment',
                  status: 'success',
                  duration: '2m 15s',
                },
                {
                  name: 'Verify',
                  description: 'Connectivity and configuration checks',
                  status: 'running',
                  duration: '1m 30s',
                },
                {
                  name: 'Deploy (Production)',
                  description: 'Production deployment',
                  status: 'pending',
                  duration: '-',
                },
              ].map((stage, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                      stage.status === 'success'
                        ? 'bg-green-500 text-white'
                        : stage.status === 'running'
                          ? 'animate-pulse bg-blue-500 text-white'
                          : stage.status === 'failed'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {stage.status === 'success'
                      ? '✓'
                      : stage.status === 'running'
                        ? '⟳'
                        : stage.status === 'failed'
                          ? '✗'
                          : idx + 1}
                  </div>
                  <div className="flex-1 rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{stage.name}</div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{stage.description}</p>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{stage.duration}</span>
                    </div>
                  </div>
                  {idx < 4 && <div className="ml-6 h-8 w-px bg-gray-300"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Configuration */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
              <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Triggers</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Git push to main branch
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Pull request merge
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Scheduled: Daily at 2:00 AM
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Manual trigger
                </li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
              <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Notifications</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Email: ops-team@example.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Slack: #network-ops
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  PagerDuty: On failure
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Dashboard: Real-time updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tools Comparison Tab */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">IaC Tools Comparison</h3>
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
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Multi-vendor network automation</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-purple-50">
                  <td className="px-4 py-3 font-semibold text-purple-600">Terraform</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Declarative</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">HCL</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">No (cloud-based)</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Infrastructure provisioning</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-orange-50">
                  <td className="px-4 py-3 font-semibold text-orange-600">Puppet</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Declarative</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Puppet DSL</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agent-based</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Enterprise configuration management</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-blue-50">
                  <td className="px-4 py-3 font-semibold text-blue-600">Chef</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Imperative/Declarative</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Ruby</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agent-based</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Application and infrastructure</td>
                </tr>
                <tr className="hover:bg-teal-50">
                  <td className="px-4 py-3 font-semibold text-teal-600">SaltStack</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Imperative/Declarative</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">YAML</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Agent-based (minion)</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Event-driven automation</td>
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
                  <p className="text-gray-700 dark:text-gray-300">Consider Ansible for agentless automation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-yellow-700">Q:</span>
                <div>
                  <p className="font-semibold">Provisioning cloud infrastructure?</p>
                  <p className="text-gray-700 dark:text-gray-300">Terraform excels at multi-cloud orchestration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-yellow-700">Q:</span>
                <div>
                  <p className="font-semibold">Enterprise-scale operations?</p>
                  <p className="text-gray-700 dark:text-gray-300">Puppet provides mature management at scale</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-yellow-700">Q:</span>
                <div>
                  <p className="font-semibold">Event-driven automation needs?</p>
                  <p className="text-gray-700 dark:text-gray-300">SaltStack's real-time capabilities shine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Infrastructure as Code Best Practices:</h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Core Principles:</h4>
            <ul className="list-inside list-disc space-y-1 text-gray-900 dark:text-gray-100">
              <li>Version control all infrastructure definitions</li>
              <li>Treat code and infrastructure the same</li>
              <li>Implement code reviews and testing</li>
              <li>Monitor and detect configuration drift</li>
              <li>Automate compliance checking</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Implementation Strategy:</h4>
            <ul className="list-inside list-disc space-y-1 text-gray-900 dark:text-gray-100">
              <li>Start with non-production environments</li>
              <li>Build reusable templates and modules</li>
              <li>Implement CI/CD pipelines for deployment</li>
              <li>Use consistent naming and documentation</li>
              <li>Enable audit logging and rollback capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IaCBuilder;
