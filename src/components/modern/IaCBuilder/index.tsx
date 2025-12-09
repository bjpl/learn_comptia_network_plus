import React from 'react';
import { useIaCBuilder } from './hooks/useIaCBuilder';
import {
  TabNavigation,
  ConceptsTab,
  TemplatesTab,
  BuilderTab,
  DriftTab,
  PipelineTab,
  ToolsTab,
  BestPractices,
} from './components';

/**
 * IaCBuilder - Interactive Infrastructure as Code learning component
 *
 * Main orchestrator for the IaC Builder component with 6 tabs:
 * - Concepts: IaC fundamentals and principles
 * - Templates: Pre-built templates for common tasks
 * - Builder: Interactive code editor with validation
 * - Drift: Configuration drift detection
 * - Pipeline: CI/CD pipeline visualization
 * - Tools: IaC tools comparison
 */
const IaCBuilder: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedTemplate,
    codeEditorContent,
    setCodeEditorContent,
    selectedLanguage,
    showValidation,
    setShowValidation,
    handleTemplateSelect,
    handleLanguageChange,
    sampleCode,
  } = useIaCBuilder();

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

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'concepts' && <ConceptsTab />}

      {activeTab === 'templates' && (
        <TemplatesTab
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          codeEditorContent={codeEditorContent}
        />
      )}

      {activeTab === 'builder' && (
        <BuilderTab
          selectedLanguage={selectedLanguage}
          codeEditorContent={codeEditorContent}
          sampleCode={sampleCode}
          onLanguageChange={handleLanguageChange}
          onCodeChange={setCodeEditorContent}
          onValidationToggle={setShowValidation}
        />
      )}

      {activeTab === 'drift' && <DriftTab />}

      {activeTab === 'pipeline' && <PipelineTab />}

      {activeTab === 'tools' && <ToolsTab />}

      <BestPractices />
    </div>
  );
};

export default IaCBuilder;
