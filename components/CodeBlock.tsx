
import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
  language: string;
  code: string;
  title: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-[8px] overflow-hidden border border-[#666666]">
      <div className="flex justify-between items-center p-3 bg-[#262626] border-b border-[#666666]">
        <p className="text-sm font-medium text-[#F0F0F0]">{title}</p>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-sm bg-[#2b2b2b] hover:bg-[#3c3c3c] text-[#F0F0F0] px-3 py-1 rounded-[4px] transition-colors"
        >
          {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto custom-scrollbar max-h-[55vh]">
        <code className="font-mono">
          {code}
        </code>
      </pre>
    </div>
  );
};