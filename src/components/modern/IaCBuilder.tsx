import React, { useState } from 'react';
import type {
  IaCTemplate,
  IaCPlatform,
  Playbook} from './modern-types';
import {
  AutomationTask,
  ConfigurationDrift,
  DriftItem,
} from './modern-types';
import { iacTemplates, samplePlaybooks, driftExamples, validationChecks } from './modern-data';

const IaCBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'drift' | 'pipeline'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<IaCTemplate | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [codeEditorContent, setCodeEditorContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'yaml' | 'json' | 'hcl'>('yaml');
  const [showValidation, setShowValidation] = useState(false);

  const platformInfo: Record<IaCPlatform, { description: string; color: string }> = {
    ansible: { description: 'Agentless automation with YAML', color: 'bg-red-100 text-red-700' },
    terraform: { description: 'Infrastructure as Code with HCL', color: 'bg-purple-100 text-purple-700' },
    puppet: { description: 'Declarative configuration management', color: 'bg-orange-100 text-orange-700' },
    chef: { description: 'Ruby-based infrastructure automation', color: 'bg-blue-100 text-blue-700' },
    saltstack: { description: 'Event-driven automation platform', color: 'bg-teal-100 text-teal-700' },
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
}`
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
${template.parameters.map(p => `    ${p.name}: ${p.default !== undefined ? JSON.stringify(p.default) : '""'}`).join('\n')}

  tasks:
${template.tasks.map((task, idx) => `    - name: ${task.name}
      # ${task.description}
      debug:
        msg: "Task ${idx + 1}: {{ ${template.parameters[0]?.name || 'variable'} }}"
`).join('\n')}`;
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
      } catch (e) {
        errors.push('Invalid JSON syntax');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const getDriftSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Component 21: Infrastructure as Code (IaC) Automation Builder
        </h2>
        <p className="text-gray-600">
          Build network automation playbooks, manage configuration drift, and create CI/CD pipelines for network operations.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
        {(['templates', 'builder', 'drift', 'pipeline'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === tab
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">IaC Template Library</h3>
            <p className="text-gray-600 mb-4">
              Pre-built templates for common network automation tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {iacTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-800">{template.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${platformInfo[template.platform].color}`}>
                    {template.platform}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded">{template.difficulty}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">{template.tasks.length} tasks</span>
                </div>
              </button>
            ))}
          </div>

          {selectedTemplate && (
            <div className="mt-6 border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">Template Details: {selectedTemplate.name}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-semibold mb-2">Parameters</h5>
                  <div className="space-y-2">
                    {selectedTemplate.parameters.map((param) => (
                      <div key={param.name} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-sm">{param.name}</span>
                          <span className="text-xs text-gray-500">{param.type}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{param.description}</p>
                        {param.required && (
                          <span className="text-xs text-red-600">* Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Tasks</h5>
                  <div className="space-y-2">
                    {selectedTemplate.tasks.map((task) => (
                      <div key={task.id} className="bg-white p-3 rounded border">
                        <div className="font-semibold text-sm mb-1">{task.name}</div>
                        <p className="text-xs text-gray-600">{task.description}</p>
                        <div className="mt-2 flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {task.validation.length} validation checks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">Generated Code</h5>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeEditorContent)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
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
            <h3 className="text-xl font-semibold mb-3">Code Editor</h3>
            <p className="text-gray-600 mb-4">
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
                className={`px-4 py-2 rounded-lg font-semibold ${
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
          <div className="border-2 border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-300 flex justify-between items-center">
              <span className="font-semibold">config.{selectedLanguage}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const validation = validateCode();
                    setShowValidation(true);
                    alert(validation.isValid ? 'Code is valid!' : `Errors:\n${validation.errors.join('\n')}`);
                  }}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Validate
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(codeEditorContent)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
            <textarea
              value={codeEditorContent}
              onChange={(e) => setCodeEditorContent(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* Validation Checks Panel */}
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h4 className="text-lg font-semibold mb-3">Validation Checks</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {validationChecks.map((check, idx) => (
                <div key={idx} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{check.name}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {check.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Command: <code className="bg-gray-100 px-1">{check.command}</code></div>
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
            <h3 className="text-xl font-semibold mb-3">Configuration Drift Detection</h3>
            <p className="text-gray-600 mb-4">
              Identify unauthorized changes and maintain configuration compliance
            </p>
          </div>

          <div className="space-y-4">
            {driftExamples.map((drift) => (
              <div
                key={drift.hostId}
                className={`border-2 rounded-lg p-6 ${getDriftSeverityColor(drift.severity)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{drift.hostname}</h4>
                    <p className="text-sm">
                      Detected: {drift.detectedAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      drift.severity === 'critical' ? 'bg-red-200' :
                      drift.severity === 'high' ? 'bg-orange-200' :
                      drift.severity === 'medium' ? 'bg-yellow-200' :
                      'bg-blue-200'
                    }`}>
                      {drift.severity.toUpperCase()}
                    </span>
                    {drift.autoFixable && (
                      <div className="text-xs mt-1">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          Auto-fixable
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {drift.drifts.map((item, idx) => (
                    <div key={idx} className="bg-white bg-opacity-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">{item.parameter}</span>
                        <span className="text-xs px-2 py-1 bg-white rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <span className="text-gray-700">Expected:</span>{' '}
                          <code className="bg-white px-2 py-1 rounded">{String(item.expected)}</code>
                        </div>
                        <div>
                          <span className="text-gray-700">Actual:</span>{' '}
                          <code className="bg-white px-2 py-1 rounded">{String(item.actual)}</code>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="font-semibold">Impact:</span> {item.impact}
                        </div>
                        <div>
                          <span className="font-semibold">Recommendation:</span> {item.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {drift.autoFixable && (
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      Auto-Fix All
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
            <h3 className="text-xl font-semibold mb-3">NetOps CI/CD Pipeline</h3>
            <p className="text-gray-600 mb-4">
              Automated workflow for network configuration deployment
            </p>
          </div>

          {/* Pipeline Visualization */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">Pipeline Stages</h4>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Validate', description: 'Syntax and schema validation', status: 'success', duration: '12s' },
                { name: 'Test', description: 'Unit and integration tests', status: 'success', duration: '45s' },
                { name: 'Deploy (Staging)', description: 'Deploy to staging environment', status: 'success', duration: '2m 15s' },
                { name: 'Verify', description: 'Connectivity and configuration checks', status: 'running', duration: '1m 30s' },
                { name: 'Deploy (Production)', description: 'Production deployment', status: 'pending', duration: '-' },
              ].map((stage, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    stage.status === 'success' ? 'bg-green-500 text-white' :
                    stage.status === 'running' ? 'bg-blue-500 text-white animate-pulse' :
                    stage.status === 'failed' ? 'bg-red-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {stage.status === 'success' ? '✓' :
                     stage.status === 'running' ? '⟳' :
                     stage.status === 'failed' ? '✗' : idx + 1}
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">{stage.name}</div>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">{stage.duration}</span>
                    </div>
                  </div>
                  {idx < 4 && (
                    <div className="w-px h-8 bg-gray-300 ml-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h4 className="text-lg font-semibold mb-3">Triggers</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Git push to main branch
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Pull request merge
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Scheduled: Daily at 2:00 AM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Manual trigger
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h4 className="text-lg font-semibold mb-3">Notifications</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Email: ops-team@example.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Slack: #network-ops
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  PagerDuty: On failure
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Dashboard: Real-time updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Infrastructure as Code Concepts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Version control for infrastructure</li>
              <li>Repeatable deployments</li>
              <li>Automated compliance checking</li>
              <li>Reduced human error</li>
              <li>Self-documenting infrastructure</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Best Practices:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Use version control (Git)</li>
              <li>Implement code reviews</li>
              <li>Test in non-production first</li>
              <li>Monitor configuration drift</li>
              <li>Automate deployment pipelines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IaCBuilder;
