import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ApiKeyManagerProps {
    onSetApiKey: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onSetApiKey }) => {
    const [isKeySet, setIsKeySet] = useState(false);
    const [localKey, setLocalKey] = useState('');

    const handleSaveKey = () => {
        if (localKey.trim()) {
            onSetApiKey(localKey.trim());
            setIsKeySet(true);
        }
    };

    const handleClearKey = () => {
        setLocalKey('');
        onSetApiKey('');
        setIsKeySet(false);
    }

    return (
        <div className="flex items-center space-x-2">
            <div className="flex-shrink-0" aria-hidden="true">
                 {isKeySet 
                    ? <CheckCircleIcon className="w-5 h-5 text-green-400" title="API Key is set" /> 
                    : <KeyIcon className="w-5 h-5 text-slate-400" title="API Key is not set" />}
            </div>
            <input
                type="password"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder={isKeySet ? "API key is set for this session" : "Optional: Enter API key to use in code..."}
                className="flex-grow bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="API Key Input"
                disabled={isKeySet}
            />
             {isKeySet ? (
                <button onClick={handleClearKey} className="bg-slate-600 text-white font-semibold text-sm py-2 px-3 rounded-md hover:bg-slate-500 transition whitespace-nowrap">
                    Clear Key
                </button>
            ) : (
                <button 
                    onClick={handleSaveKey} 
                    disabled={!localKey.trim()}
                    className="bg-indigo-600 text-white font-semibold text-sm py-2 px-3 rounded-md hover:bg-indigo-500 transition whitespace-nowrap disabled:bg-slate-600 disabled:cursor-not-allowed">
                    Save Key
                </button>
            )}
        </div>
    );
};

export default ApiKeyManager;