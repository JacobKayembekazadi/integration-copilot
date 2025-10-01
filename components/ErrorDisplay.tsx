
import React from 'react';

interface ErrorDisplayProps {
    message: string | null;
    onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
    return (
        <div className="bg-[#DC143C]/20 border border-[#DC143C] text-[#f0a0a0] p-6 rounded-xl flex flex-col items-center space-y-4">
            <div className="w-12 h-12 flex items-center justify-center bg-[#DC143C]/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-xl font-['Montserrat'] font-bold text-white">Generation Failed</h3>
            <p className="text-center">{message || 'An unexpected error occurred.'}</p>
            <button
                onClick={onReset}
                className="bg-[#DC143C] text-white font-bold py-2 px-6 rounded-[4px] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all duration-200"
            >
                Try Again
            </button>
        </div>
    );
};