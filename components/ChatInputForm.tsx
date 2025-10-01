import React, { useState } from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface ChatInputFormProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSendMessage, isLoading, placeholder = "Ask me anything..." }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#2b2b2b] border border-[#666666] rounded-[4px] py-3 pl-4 pr-14 text-white placeholder-[#666666] focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] transition-all duration-300 disabled:opacity-50"
        disabled={isLoading}
        aria-label="Chat input"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#FF8C00] text-white rounded-[4px] hover:bg-[#E67C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2b2b2b] focus:ring-[#FF8C00] transition disabled:bg-slate-600 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>
    </form>
  );
};