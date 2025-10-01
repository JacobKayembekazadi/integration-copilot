
import React from 'react';

interface TabsProps {
  items: string[];
  activeItem: string;
  setActiveItem: (item: string) => void;
  isSubTab?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeItem, setActiveItem, isSubTab = false }) => {
  const baseClasses = "font-medium text-sm sm:text-base py-2 px-4 transition-colors duration-200 ease-in-out focus:outline-none";
  const activeClasses = isSubTab 
    ? "bg-[#FF8C00] text-white rounded-[4px]" 
    : "border-b-2 border-[#FF8C00] text-[#FF8C00]";
  const inactiveClasses = isSubTab 
    ? "text-[#F0F0F0] hover:bg-[#2b2b2b] rounded-[4px]" 
    : "border-b-2 border-transparent text-[#F0F0F0] hover:border-[#666666]";
  
  const containerClasses = isSubTab
    ? "flex space-x-2 bg-[#1A1A1A] p-1 rounded-lg"
    : "flex space-x-2 sm:space-x-4 border-b border-[#666666]";

  return (
    <div className={containerClasses}>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setActiveItem(item)}
          className={`${baseClasses} ${activeItem === item ? activeClasses : inactiveClasses}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};