import type { IaCTemplate } from '../../modern-types';

/**
 * Generates code from IaC template
 */
export const generateTemplateCode = (template: IaCTemplate): string => {
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

  // Default fallback - would expand for other platforms
  return `# Generated template for ${template.name}\n# Platform: ${template.platform}`;
};
