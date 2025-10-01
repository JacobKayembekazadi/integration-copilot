
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Contacting AI integration expert...",
    "Generating boilerplate code...",
    "Mocking API endpoints...",
    "Crafting sample data payloads...",
    "Finalizing integration package..."
];

export const LoadingIndicator: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#262626] rounded-[8px] border border-[#666666]">
            <div className="w-12 h-12 border-4 border-t-[#FF8C00] border-r-[#FF8C00] border-b-[#FF8C00] border-[#666666] rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-[#F0F0F0] transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};