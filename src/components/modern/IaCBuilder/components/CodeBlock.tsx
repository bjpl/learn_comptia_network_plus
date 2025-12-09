import React, { useMemo } from 'react';
import type { IaCLanguage } from '../types';
import { highlightCode } from '../utils';

interface CodeBlockProps {
  code: string;
  language: IaCLanguage;
  showLineNumbers?: boolean;
  onCopy?: () => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = true,
  onCopy,
}) => {
  const lines = code.split('\n');
  const highlightedLines = useMemo(
    () => lines.map((line) => highlightCode(line, language)),
    [code, language]
  );

  return (
    <div className="code-block-container">
      {onCopy && (
        <button
          onClick={onCopy}
          className="copy-button absolute right-2 top-2 rounded bg-blue-600 px-3 py-1 text-sm text-white opacity-0 transition-opacity hover:bg-blue-700 group-hover:opacity-100"
        >
          Copy
        </button>
      )}
      <div className="code-block overflow-x-auto">
        <pre className="code-pre">
          {showLineNumbers && (
            <div className="line-numbers">
              {lines.map((_, idx) => (
                <div key={idx} className="line-number">
                  {idx + 1}
                </div>
              ))}
            </div>
          )}
          <div className="code-content">
            {highlightedLines.map((line, idx) => (
              <div key={idx} className="code-line" dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
        </pre>
      </div>
      <style>{`
        .code-block-container {
          position: relative;
          background: #1e1e1e;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .code-block-container:hover .copy-button {
          opacity: 1;
        }
        .code-block {
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .code-pre {
          margin: 0;
          padding: 1rem;
          display: flex;
          min-height: 100px;
        }
        .line-numbers {
          color: #858585;
          text-align: right;
          padding-right: 1rem;
          border-right: 1px solid #3e3e3e;
          margin-right: 1rem;
          user-select: none;
          min-width: 2.5rem;
        }
        .line-number {
          line-height: 1.5;
        }
        .code-content {
          flex: 1;
        }
        .code-line {
          line-height: 1.5;
          white-space: pre;
        }
        .syntax-comment { color: #6a9955; font-style: italic; }
        .syntax-keyword { color: #569cd6; font-weight: 600; }
        .syntax-property { color: #9cdcfe; }
        .syntax-string { color: #ce9178; }
        .syntax-number { color: #b5cea8; }
        .syntax-boolean { color: #569cd6; }
        .syntax-variable { color: #dcdcaa; font-weight: 500; }
        .syntax-function { color: #dcdcaa; }
      `}</style>
    </div>
  );
};
