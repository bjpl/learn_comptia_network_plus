import React from 'react';
import type { IaCLanguage, SampleCode } from '../types';
import { CodeBlock } from './CodeBlock';
import { validateCode } from '../utils';
import { validationChecks } from '../../modern-data';

interface BuilderTabProps {
  selectedLanguage: IaCLanguage;
  codeEditorContent: string;
  sampleCode: SampleCode;
  onLanguageChange: (lang: IaCLanguage) => void;
  onCodeChange: (code: string) => void;
  onValidationToggle: (show: boolean) => void;
}

export const BuilderTab: React.FC<BuilderTabProps> = ({
  selectedLanguage,
  codeEditorContent,
  sampleCode,
  onLanguageChange,
  onCodeChange,
  onValidationToggle,
}) => {
  const handleValidate = () => {
    const validation = validateCode(codeEditorContent, selectedLanguage);
    onValidationToggle(true);
    alert(
      validation.isValid
        ? 'Code is valid!'
        : `Errors:\n${validation.errors.join('\n')}`
    );
  };

  return (
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
            onClick={() => onLanguageChange(lang)}
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
              onClick={handleValidate}
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
        <div className="h-96 overflow-auto">
          <CodeBlock
            code={codeEditorContent || sampleCode[selectedLanguage]}
            language={selectedLanguage}
            showLineNumbers={true}
            onCopy={() => {}}
          />
        </div>
        <div className="mt-4 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
          <h5 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Edit Mode (Plain Text)
          </h5>
          <textarea
            value={codeEditorContent}
            onChange={(e) => onCodeChange(e.target.value)}
            className="h-64 w-full resize-none rounded border-2 border-gray-300 bg-gray-900 p-4 font-mono text-sm text-gray-100 focus:border-blue-500 focus:outline-none"
            placeholder={`Enter your ${selectedLanguage.toUpperCase()} code here...`}
            spellCheck={false}
          />
        </div>
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
  );
};
