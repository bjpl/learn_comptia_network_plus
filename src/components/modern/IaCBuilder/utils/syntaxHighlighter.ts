import type { IaCLanguage } from '../types';

/**
 * Highlights code syntax based on language type
 */
export const highlightCode = (code: string, language: IaCLanguage): string => {
  let highlighted = code;

  // Escape HTML
  highlighted = highlighted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (language === 'yaml') {
    // YAML syntax highlighting
    highlighted = highlighted
      .replace(/^(\s*#.*)$/gm, '<span class="syntax-comment">$1</span>') // Comments
      .replace(/^(\s*-\s+name:)/gm, '<span class="syntax-keyword">$1</span>') // Task markers
      .replace(/^(\s*)([\w_]+)(:)/gm, '$1<span class="syntax-property">$2</span>$3') // Properties
      .replace(/(['"])(.*?)(['"])/g, '<span class="syntax-string">$1$2$3</span>') // Strings
      .replace(/(\{\{[^}]+\}\})/g, '<span class="syntax-variable">$1</span>') // Variables
      .replace(/\b(true|false|yes|no|null)\b/gi, '<span class="syntax-boolean">$1</span>') // Booleans
      .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>'); // Numbers
  } else if (language === 'json') {
    // JSON syntax highlighting
    highlighted = highlighted
      .replace(/"([^"]+)":/g, '<span class="syntax-property">"$1"</span>:') // Property names
      .replace(/:\s*"([^"]*)"/g, ': <span class="syntax-string">"$1"</span>') // String values
      .replace(/\b(true|false|null)\b/g, '<span class="syntax-boolean">$1</span>') // Booleans
      .replace(/:\s*(\d+)/g, ': <span class="syntax-number">$1</span>'); // Numbers
  } else if (language === 'hcl') {
    // HCL/Terraform syntax highlighting
    highlighted = highlighted
      .replace(/^(\s*#.*)$/gm, '<span class="syntax-comment">$1</span>') // Comments
      .replace(
        /\b(variable|resource|data|output|locals|module|provider)\b/g,
        '<span class="syntax-keyword">$1</span>'
      ) // Keywords
      .replace(
        /\b(type|description|default|required|tags|name|cidr_block|vpc_id|count)\b/g,
        '<span class="syntax-property">$1</span>'
      ) // Properties
      .replace(/(['"])(.*?)(['"])/g, '<span class="syntax-string">$1$2$3</span>') // Strings
      .replace(/\b(true|false)\b/g, '<span class="syntax-boolean">$1</span>') // Booleans
      .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>') // Numbers
      .replace(/(var\.|aws_|cidr\w+|data\.)/g, '<span class="syntax-function">$1</span>'); // Functions/references
  }

  return highlighted;
};
