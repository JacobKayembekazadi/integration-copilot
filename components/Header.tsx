import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { APP_TITLE } from '../constants';

interface HeaderProps {
    onGoHome: () => void;
    isChatActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, isChatActive }) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between w-full h-16 px-6 border-b border-[#666666]">
      <h1 className="text-lg font-['Montserrat'] font-bold text-white tracking-tight">
        {APP_TITLE}
      </h1>
      {isChatActive && (
        <button
          onClick={onGoHome}
          className="flex items-center space-x-2 text-sm font-medium text-[#F0F0F0] hover:bg-[#2b2b2b] rounded-[4px] px-3 py-2 transition-colors"
          aria-label="Go to home screen"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>
      )}
    </header>
  );
};