import React from 'react';
import { FeatureCard } from './FeatureCard';
import { InitialSuggestions } from './InitialSuggestions';
import { CodeIcon } from './icons/CodeIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { ShieldAlertIcon } from './icons/ShieldAlertIcon';
import { ChatInputForm } from './ChatInputForm';

interface WelcomeProps {
    onSendMessage: (suggestion: string) => void;
}

const features = [
    {
        icon: <CodeIcon className="w-8 h-8" />,
        title: "Code Generation",
        description: "Generate Python & Node.js code for any logistics API.",
        prompt: "Tell me more about your code generation capabilities for logistics APIs."
    },
    {
        icon: <FileTextIcon className="w-8 h-8" />,
        title: "API Documentation",
        description: "Get quick explanations for API endpoints and parameters.",
         prompt: "How can you help me understand API documentation?"
    },
    {
        icon: <DatabaseIcon className="w-8 h-8" />,
        title: "Sample Data",
        description: "Fetch sample API responses to build your integrations.",
         prompt: "Show me how to get sample data for an integration."
    },
    {
        icon: <ShieldAlertIcon className="w-8 h-8" />,
        title: "Debug & Refactor",
        description: "Paste your code to get help with errors and improvements.",
         prompt: "Can you help me debug and refactor my code?"
    }
];

export const Welcome: React.FC<WelcomeProps> = ({ onSendMessage }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 overflow-y-auto custom-scrollbar">
                 <div className="max-w-4xl w-full my-auto">
                    <h1 className="text-4xl sm:text-6xl font-['Montserrat'] font-bold text-white tracking-tight leading-tight">
                        Logistics Integration Co-pilot
                    </h1>
                    <p className="mt-4 text-lg text-[#F0F0F0] max-w-2xl mx-auto">
                        Use AI to generate code, understand APIs, and build connections faster than ever.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                        {features.map(feature => (
                           <FeatureCard 
                                key={feature.title} 
                                {...feature} 
                                onClick={() => onSendMessage(feature.prompt)} 
                            />
                        ))}
                    </div>

                    <div className="mt-12">
                       <InitialSuggestions onSendMessage={onSendMessage} />
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 pt-2 pb-4 px-4 w-full max-w-3xl mx-auto">
                <ChatInputForm onSendMessage={onSendMessage} isLoading={false} />
            </div>
        </div>
    );
};