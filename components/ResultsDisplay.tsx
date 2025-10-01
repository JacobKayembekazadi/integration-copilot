import React, { useState } from 'react';
import type { IntegrationResult } from '../types';
import { Tabs } from './Tabs';
import { CodeBlock } from './CodeBlock';

interface ResultsDisplayProps {
  results: IntegrationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('Connection Code');

  const tabItems = ['Connection Code', 'Example Data', 'Next Steps'];

  return (
    <div className="bg-[#262626] p-4 sm:p-6 rounded-[8px] shadow-2xl border border-[#666666] backdrop-blur-sm">
      <Tabs items={tabItems} activeItem={activeTab} setActiveItem={setActiveTab} />
      <div className="mt-4 min-h-[400px]">
        {activeTab === 'Connection Code' && (
          <CodeTabs pythonCode={results.pythonCode} nodeCode={results.nodeCode} />
        )}
        {activeTab === 'Example Data' && (
          <CodeBlock
            language="json"
            code={JSON.stringify(results.sampleData, null, 2)}
            title="Sample API Response (JSON)"
          />
        )}
        {activeTab === 'Next Steps' && (
            <div className="p-4 bg-[#1A1A1A] rounded-lg h-full max-h-[60vh] overflow-y-auto custom-scrollbar">
                <article className="prose prose-invert prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: results.nextSteps.replace(/\n/g, '<br />') }} />
            </div>
        )}
      </div>
    </div>
  );
};

interface CodeTabsProps {
    pythonCode: string;
    nodeCode: string;
}

const CodeTabs: React.FC<CodeTabsProps> = ({ pythonCode, nodeCode }) => {
    const [activeCodeTab, setActiveCodeTab] = useState('Python');
    const codeTabItems = ['Python', 'Node.js'];

    return (
        <div>
            <Tabs items={codeTabItems} activeItem={activeCodeTab} setActiveItem={setActiveCodeTab} isSubTab={true} />
             <div className="mt-2">
                {activeCodeTab === 'Python' && (
                    <CodeBlock language="python" code={pythonCode} title="Python (requests)" />
                )}
                {activeCodeTab === 'Node.js' && (
                    <CodeBlock language="javascript" code={nodeCode} title="Node.js (axios)" />
                )}
            </div>
        </div>
    )
}