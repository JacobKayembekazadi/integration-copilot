import React from 'react';
import type { ChatMessage as ChatMessageProps } from '../types';
import { ResultsDisplay } from './ResultsDisplay';

export const ChatMessage: React.FC<{ message: ChatMessageProps }> = ({ message }) => {
  const { role, content, error } = message;
  const isUser = role === 'user';
  
  const baseClasses = "max-w-xl lg:max-w-2xl px-4 py-3 rounded-[8px]";
  const userClasses = "bg-[#FF8C00] text-white self-end";
  const modelClasses = "bg-[#2b2b2b] text-[#F0F0F0] self-start";
  const errorClasses = "bg-[#DC143C]/20 border border-[#DC143C] text-[#f0a0a0] self-start";

  const renderContent = () => {
    if (typeof content === 'string') {
      // Basic markdown for bold and code blocks
      const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-[#1A1A1A] text-[#00BFFF] rounded px-1 py-0.5 font-mono text-sm">$1</code>')
        .replace(/\n/g, '<br />');
      return <p dangerouslySetInnerHTML={{ __html: formattedContent }} />;
    }
    // It's an IntegrationResult
    return <ResultsDisplay results={content} />;
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`${baseClasses} ${error ? errorClasses : (isUser ? userClasses : modelClasses)}`}
        role={role === 'model' ? 'log' : 'status'}
      >
        {renderContent()}
      </div>
    </div>
  );
};