import React from 'react';
import type { IaCTemplate, IaCPlatform } from '../../modern-types';
import { iacTemplates } from '../../modern-data';
import { CodeBlock } from './CodeBlock';

interface TemplatesTabProps {
  selectedTemplate: IaCTemplate | null;
  onTemplateSelect: (template: IaCTemplate) => void;
  codeEditorContent: string;
}

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

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  selectedTemplate,
  onTemplateSelect,
  codeEditorContent,
}) => {
  return (
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
            onClick={() => onTemplateSelect(template)}
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
            </div>
            <CodeBlock
              code={codeEditorContent}
              language="yaml"
              onCopy={() => navigator.clipboard.writeText(codeEditorContent)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
