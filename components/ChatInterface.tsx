import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputForm } from './ChatInputForm';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-grow flex flex-col bg-[#262626] rounded-[8px] border border-[#666666] shadow-2xl overflow-hidden h-full">
      <div className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
        {messages.slice(1).map((msg) => ( // Hide the initial system message
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-transparent border-t border-[#666666] backdrop-blur-sm">
        <ChatInputForm onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};