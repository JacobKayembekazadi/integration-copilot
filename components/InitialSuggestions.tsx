import React from 'react';

interface InitialSuggestionsProps {
    onSendMessage: (suggestion: string) => void;
}

const appSuggestions = [
    "Generate Shopify code for fetching products",
    "Create Node.js code for ShipStation",
    "Explain OAuth 2.0 simply",
    "Python boilerplate for Stripe API"
];


export const InitialSuggestions: React.FC<InitialSuggestionsProps> = ({ onSendMessage }) => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {appSuggestions.map((text) => (
                <button 
                    key={text} 
                    onClick={() => onSendMessage(text)}
                    className="px-4 py-2 bg-transparent border border-[#666666] rounded-[4px] text-sm text-[#F0F0F0] hover:bg-[#2b2b2b] transition-colors duration-200"
                >
                    {text}
                </button>
            ))}
        </div>
    );
};