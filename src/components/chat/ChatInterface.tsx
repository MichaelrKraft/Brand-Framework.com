'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';

const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce / Retail',
  'Coaching / Consulting',
  'Creator / Influencer',
  'Agency / Services',
  'Health / Wellness',
  'Finance / Fintech',
  'Education / Courses',
  'Real Estate',
  'Other',
];

const STORAGE_KEY = 'branding-advisor-chat';
const INDUSTRY_KEY = 'branding-advisor-industry';
const PLAYBOOK_KEY = 'branding-advisor-playbook';

interface SavedPlaybook {
  type: 'brand' | 'content';
  content: string;
  createdAt: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const [playbook, setPlaybook] = useState<SavedPlaybook | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation and industry from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedIndustry = localStorage.getItem(INDUSTRY_KEY);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }

    if (savedIndustry) {
      setIndustry(savedIndustry);
    }

    const savedPlaybook = localStorage.getItem(PLAYBOOK_KEY);
    if (savedPlaybook) {
      try {
        setPlaybook(JSON.parse(savedPlaybook));
      } catch (e) {
        console.error('Failed to parse saved playbook:', e);
      }
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Save industry to localStorage
  useEffect(() => {
    if (industry) {
      localStorage.setItem(INDUSTRY_KEY, industry);
    }
  }, [industry]);

  // Scroll to bottom when messages or streaming content change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Prepare messages for API (without ids and timestamps)
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, industry, playbook }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleIndustrySelect = (selectedIndustry: string) => {
    setIndustry(selectedIndustry);
    setShowIndustrySelector(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Industry Selector Modal */}
      {showIndustrySelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Select Your Industry</h3>
            <p className="text-zinc-400 text-sm mb-4">
              This helps me tailor advice with relevant examples and terminology.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  className="px-4 py-3 text-sm font-medium text-zinc-300 bg-zinc-700 rounded-lg hover:bg-sky-600/30 hover:text-sky-300 transition-colors text-left"
                >
                  {ind}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowIndustrySelector(false)}
              className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-300"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* Header with industry badge, playbook indicator, and controls */}
      {(industry || playbook || messages.length > 0) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-800/50">
          <div className="flex items-center gap-2">
            {industry && (
              <button
                onClick={() => setShowIndustrySelector(true)}
                className="px-3 py-1 text-xs font-medium text-sky-300 bg-sky-600/20 rounded-full hover:bg-sky-600/30 transition-colors"
              >
                {industry} ✎
              </button>
            )}
            {!industry && (
              <button
                onClick={() => setShowIndustrySelector(true)}
                className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors"
              >
                + Set Industry
              </button>
            )}
            {playbook && (
              <span className="px-3 py-1 text-xs font-medium text-emerald-300 bg-emerald-600/20 rounded-full flex items-center gap-1">
                <span>📋</span>
                {playbook.type === 'brand' ? 'Brand Playbook' : 'Content Playbook'} loaded
              </span>
            )}
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 -mt-20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Your Branding Advisor
            </h2>
            <p className="text-zinc-400 max-w-md mb-4">
              I&apos;m here to help you build an authentic brand and effective content
              strategy using proven frameworks.
            </p>
            {playbook && (
              <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-xl p-4 max-w-md mb-4">
                <p className="text-emerald-300 font-medium text-sm">
                  📋 Your {playbook.type === 'brand' ? 'Brand Foundation' : 'Content Strategy'} Playbook is loaded!
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Ask me anything about your playbook - I&apos;ll reference your specific brand story, associations, and strategy.
                </p>
              </div>
            )}
            {!industry && (
              <button
                onClick={() => setShowIndustrySelector(true)}
                className="mb-4 px-4 py-2 text-sm font-medium text-sky-400 border border-sky-600/50 rounded-lg hover:bg-sky-900/30 transition-colors"
              >
                Select Your Industry for Personalized Advice
              </button>
            )}
            <QuickActions onSelect={sendMessage} disabled={isLoading} />
            {/* Input Area - Centered in welcome state */}
            <div className="w-full max-w-2xl mt-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about branding, content strategy, or request a playbook..."
                  className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[48px] max-h-[200px]"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="self-end px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {/* Streaming content while loading */}
            {isLoading && streamingContent && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%] bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">{streamingContent}</p>
                  <span className="inline-block w-2 h-4 bg-sky-400 animate-pulse ml-1" />
                </div>
              </div>
            )}
            {/* Loading dots when waiting for first chunk */}
            {isLoading && !streamingContent && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Actions (shown after conversation starts) */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-800">
          <QuickActions onSelect={sendMessage} disabled={isLoading} />
        </div>
      )}

      {/* Input Area - Only show at bottom when conversation has started */}
      {messages.length > 0 && (
        <div className="border-t border-zinc-800 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about branding, content strategy, or request a playbook..."
              className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[48px] max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="self-end px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
