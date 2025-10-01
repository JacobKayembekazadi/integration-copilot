import React, { useState, useEffect } from 'react';
import { ApiType } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { LayoutSidebarLeftCollapseIcon } from './icons/LayoutSidebarLeftCollapseIcon';
import { LayoutSidebarLeftExpandIcon } from './icons/LayoutSidebarLeftExpandIcon';
import { LOGO_SRC, APP_TITLE } from '../constants';
import { PLATFORM_FIELD_SETS, INTEGRATION_STORAGE_KEY, IntegrationFieldSpec } from '../integrationFields';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onNewChat: () => void;
    apiType: ApiType;
    setApiType: (type: ApiType) => void;
    integrationConfig?: Record<string, string>;
    setIntegrationConfig?: (cfg: Record<string, string>) => void;
}

/* eslint-disable */ // Temporarily disable lint for production stripped sidebar
export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  onNewChat,
  apiType,
  setApiType,
  integrationConfig = {},
  setIntegrationConfig,
}) => {
    const [localIntegrationConfig, setLocalIntegrationConfig] = useState<Record<string, string>>(() => integrationConfig);

    useEffect(() => {
        // load integration config only (AI key handling removed for production)
        try {
            const raw = localStorage.getItem(INTEGRATION_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setLocalIntegrationConfig(parsed);
                setIntegrationConfig?.(parsed);
            }
        } catch { /* ignore */ }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const fieldSpecs: IntegrationFieldSpec[] = PLATFORM_FIELD_SETS[apiType] || [];

    const handleIntegrationFieldChange = (id: string, value: string) => {
        const updated = { ...localIntegrationConfig, [apiType + ':' + id]: value };
        setLocalIntegrationConfig(updated);
        setIntegrationConfig?.(updated);
        try { localStorage.setItem(INTEGRATION_STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
    };

    const getFieldValue = (id: string) => localIntegrationConfig[apiType + ':' + id] || '';

    return (
        <div className={`flex flex-col bg-[#262626] border-r border-[#666666] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-72'}`}>
                                    <div className={`border-b border-[#666666] px-3 ${isCollapsed ? 'h-16 flex items-center justify-center' : 'pt-4 pb-3'}`}>
                                                        {isCollapsed ? (
                                                                            <div className="flex items-center justify-center w-full">
                                                                                <img
                                                                                    src={LOGO_SRC}
                                                                                    alt={APP_TITLE + ' logo'}
                                                                                    className="h-5 w-5 select-none drop-shadow-sm"
                                                                                    draggable={false}
                                                                                />
                                                                <button onClick={onToggle} className="ml-2 text-[#F0F0F0] hover:text-white transition-colors" aria-label="Expand sidebar">
                                                                    <LayoutSidebarLeftExpandIcon className="w-6 h-6" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between h-16">
                                                                                    <button onClick={onNewChat} className="flex items-center" title={APP_TITLE} aria-label="New Chat / Home">
                                                                                        <img
                                                                                            src={LOGO_SRC}
                                                                                            alt={APP_TITLE + ' logo'}
                                                                                            className="h-6 w-auto select-none drop-shadow-sm"
                                                                                            draggable={false}
                                                                                        />
                                                                </button>
                                                                <button onClick={onToggle} className="text-[#F0F0F0] hover:text-white transition-colors" aria-label="Collapse sidebar">
                                                                    <LayoutSidebarLeftCollapseIcon className="w-6 h-6" />
                                                                </button>
                                                            </div>
                                                        )}
                                    </div>

            <div className="p-2">
                <button
                    onClick={onNewChat}
                    className={`flex items-center w-full h-10 px-3 rounded-[4px] text-sm font-medium transition-colors ${isCollapsed ? 'justify-center' : ''} bg-[#FF8C00] hover:bg-[#E67C00] text-white`}
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    {!isCollapsed && <span className="ml-3">New Chat</span>}
                </button>
            </div>

            <div className={`flex-grow p-4 border-t border-[#666666] mt-2 ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-opacity overflow-y-auto`}>
                {!isCollapsed && (
                    <>
                        <h3 className="text-xs font-semibold text-[#F0F0F0] uppercase tracking-wider mb-3">Integration Platform</h3>
                        <div className="mb-6">
                            <label htmlFor="platform" className="block text-xs font-medium text-[#BBBBBB] mb-1">Platform</label>
                            <select
                                id="platform"
                                value={apiType}
                                onChange={(e) => setApiType(e.target.value as ApiType)}
                                className="w-full bg-[#2b2b2b] border border-[#666666] rounded-[4px] py-2 px-3 text-sm text-white focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00]"
                            >
                                {Object.values(ApiType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <h3 className="text-xs font-semibold text-[#F0F0F0] uppercase tracking-wider mb-3">Integration Credentials</h3>
                        <p className="text-[11px] text-[#AAAAAA] mb-2 leading-relaxed">Stored locally only. Used to tailor generated code; replace with placeholders if you prefer.</p>
                        <div className="space-y-3">
                            {fieldSpecs.map(field => (
                                <div key={field.id}>
                                    <label className="block text-xs font-medium text-[#BBBBBB] mb-1" htmlFor={`field-${field.id}`}>{field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}</label>
                                    <input
                                        id={`field-${field.id}`}
                                        type={field.type === 'password' ? 'password' : 'text'}
                                        value={getFieldValue(field.id)}
                                        onChange={(e) => handleIntegrationFieldChange(field.id, e.target.value)}
                                        placeholder={field.placeholder || field.label}
                                        className="w-full bg-[#2b2b2b] border border-[#444444] focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] rounded-[4px] py-2 px-3 text-sm text-white placeholder-[#555555] transition"
                                    />
                                </div>
                            ))}
                            {fieldSpecs.length === 0 && (
                                <div className="text-[11px] text-[#888888] italic">No credential fields defined for this platform.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};