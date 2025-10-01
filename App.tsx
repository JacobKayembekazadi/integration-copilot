import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateIntegrationCode } from './services/geminiService';
import type { ChatMessage, IntegrationConfigMap } from './types';
import { ApiType } from './types';
import { Welcome } from './components/Welcome';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // AI key removal for production: key now assumed provisioned elsewhere or server-side
  const [apiKey] = useState<string>('');
  const [apiType, setApiType] = useState<ApiType>(ApiType.SHOPIFY);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [preferredModel] = useState<string | undefined>(undefined); // model override removed from UI
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfigMap>({});

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const setInitialMessage = () => {
     setMessages([
      {
        id: generateId(),
        role: 'model',
        content: "Hello! I'm your Logistics Integration Co-pilot. How can I help you generate integration code today?"
      }
    ]);
  }

  useEffect(() => {
    // Welcome message
    setInitialMessage();
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const chatHistoryForApi = messages
        .filter(m => typeof m.content === 'string')
        .map(m => ({
          role: m.role,
          content: m.content as string,
        }));

  const result = await generateIntegrationCode(text, chatHistoryForApi, apiKey, apiType, preferredModel, integrationConfig);
      
      const modelMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        content: result,
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      const errorResponseMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        error: true,
      };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearChat = () => {
    setError(null);
    setInitialMessage();
  }

  const isChatActive = messages.length > 1;

  return (
    <div className="flex h-screen bg-[#1A1A1A] text-white font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(prev => !prev)}
        onNewChat={handleClearChat}
        apiType={apiType}
        setApiType={setApiType}
        integrationConfig={integrationConfig}
        setIntegrationConfig={setIntegrationConfig}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-grow flex flex-col min-h-0 p-4 sm:p-6 space-y-4">
          {error && (
            <ErrorDisplay 
              message={error} 
              onReset={() => { setError(null); }}
            />
          )}
          {isChatActive ? (
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Welcome onSendMessage={handleSendMessage} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;