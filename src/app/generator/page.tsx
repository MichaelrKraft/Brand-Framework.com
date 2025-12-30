'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PlaybookWizard from '@/components/generator/PlaybookWizard';

type PlaybookType = 'brand' | 'content';

interface SavedPlaybook {
  type: PlaybookType;
  content: string;
  createdAt: string;
}

export default function GeneratorPage() {
  const [selectedType, setSelectedType] = useState<PlaybookType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [savedPlaybook, setSavedPlaybook] = useState<SavedPlaybook | null>(null);
  const [showSavedPlaybook, setShowSavedPlaybook] = useState(false);

  // Load saved playbook on mount
  useEffect(() => {
    const saved = localStorage.getItem('branding-advisor-playbook');
    if (saved) {
      try {
        setSavedPlaybook(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved playbook:', e);
      }
    }
  }, []);

  const handleGenerate = async (data: Record<string, string>) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, data }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedContent(result.content);
      // Save playbook to localStorage for chat reference
      const newPlaybook = {
        type: selectedType,
        content: result.content,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('branding-advisor-playbook', JSON.stringify(newPlaybook));
      setSavedPlaybook(newPlaybook as SavedPlaybook);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate playbook. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: 'markdown' | 'copy') => {
    if (!generatedContent) return;

    if (format === 'copy') {
      navigator.clipboard.writeText(generatedContent);
      alert('Copied to clipboard!');
    } else {
      const blob = new Blob([generatedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedType}-playbook.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setGeneratedContent(null);
  };

  const handleDeleteSaved = () => {
    if (confirm('Are you sure you want to delete your saved playbook? This cannot be undone.')) {
      localStorage.removeItem('branding-advisor-playbook');
      setSavedPlaybook(null);
      setShowSavedPlaybook(false);
    }
  };

  const handleExportSaved = (format: 'markdown' | 'copy') => {
    if (!savedPlaybook) return;

    if (format === 'copy') {
      navigator.clipboard.writeText(savedPlaybook.content);
      alert('Copied to clipboard!');
    } else {
      const blob = new Blob([savedPlaybook.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${savedPlaybook.type}-playbook.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="font-semibold text-white">Branding Advisor</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/strategy"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Strategy
            </Link>
            <Link
              href="/chat"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/generator"
              className="text-sm font-medium text-sky-400"
            >
              Playbooks
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Saved Playbook Banner */}
        {savedPlaybook && !generatedContent && !selectedType && (
          <div className="mb-8 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{savedPlaybook.type === 'brand' ? '🎯' : '📊'}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {savedPlaybook.type === 'brand' ? 'Brand Foundation' : 'Content Strategy'} Playbook
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Created {formatDate(savedPlaybook.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSavedPlaybook(!showSavedPlaybook)}
                  className="px-4 py-2 text-sm font-medium text-sky-400 border border-sky-600/50 rounded-lg hover:bg-sky-900/30 transition-colors"
                >
                  {showSavedPlaybook ? 'Hide' : 'View'}
                </button>
                <button
                  onClick={() => handleExportSaved('copy')}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleExportSaved('markdown')}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={handleDeleteSaved}
                  className="px-3 py-2 text-sm text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete playbook"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Playbook Content */}
            {showSavedPlaybook && (
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <div className="bg-zinc-900 rounded-lg p-6 max-h-96 overflow-y-auto prose prose-invert prose-sm max-w-none">
                  {savedPlaybook.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-2xl font-bold mt-6 mb-3 text-white">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-white">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-semibold mt-3 mb-2 text-white">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <li key={i} className="ml-4 my-1 text-zinc-300">{line.replace(/^[-*]\s/, '')}</li>;
                    }
                    if (line.trim() === '') {
                      return <br key={i} />;
                    }
                    if (line.includes('**')) {
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={i} className="my-1 text-zinc-300">
                          {parts.map((part, j) =>
                            j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : <span key={j}>{part}</span>
                          )}
                        </p>
                      );
                    }
                    return <p key={i} className="my-1 text-zinc-300">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generated Content View */}
        {generatedContent ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                Your {selectedType === 'brand' ? 'Brand Foundation' : 'Content Strategy'} Playbook
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('copy')}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => handleExport('markdown')}
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors"
                >
                  Download Markdown
                </button>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700 prose prose-invert max-w-none">
              {/* Render markdown content */}
              {generatedContent.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={i} className="text-3xl font-bold mt-8 mb-4 text-white">
                      {line.replace('# ', '')}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-white">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={i} className="text-xl font-semibold mt-4 mb-2 text-white">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return (
                    <li key={i} className="ml-6 my-1 text-zinc-300">
                      {line.replace(/^[-*]\s/, '')}
                    </li>
                  );
                }
                if (/^\d+\.\s/.test(line)) {
                  return (
                    <li key={i} className="ml-6 my-1 list-decimal text-zinc-300">
                      {line.replace(/^\d+\.\s/, '')}
                    </li>
                  );
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={i} className="font-bold my-2 text-white">
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (line.trim() === '') {
                  return <br key={i} />;
                }
                // Handle inline bold
                if (line.includes('**')) {
                  const parts = line.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={i} className="my-2 text-zinc-300">
                      {parts.map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-white">{part}</strong>
                        ) : (
                          <span key={j}>{part}</span>
                        )
                      )}
                    </p>
                  );
                }
                return (
                  <p key={i} className="my-2 text-zinc-300">
                    {line}
                  </p>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="text-sky-400 hover:underline font-medium"
              >
                ← Create another playbook
              </button>
            </div>
          </div>
        ) : selectedType ? (
          /* Wizard View */
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {selectedType === 'brand'
                  ? 'Brand Foundation Playbook'
                  : 'Content Strategy Playbook'}
              </h1>
              <p className="text-zinc-400">
                Answer the questions below to generate your personalized playbook.
              </p>
              <button
                onClick={() => setSelectedType(null)}
                className="text-sm text-zinc-500 hover:text-zinc-300 mt-2"
              >
                ← Choose different type
              </button>
            </div>
            <PlaybookWizard
              type={selectedType}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        ) : (
          /* Type Selection View */
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Generate Your Playbook
            </h1>
            <p className="text-zinc-400 mb-12 max-w-lg mx-auto">
              Answer a series of guided questions and we&apos;ll generate a
              professional playbook you can reference and share.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Brand Foundation */}
              <button
                onClick={() => setSelectedType('brand')}
                className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700 hover:border-sky-600/50 hover:bg-zinc-800/80 transition-all text-left group"
              >
                <div className="w-14 h-14 bg-sky-600/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  Brand Foundation Playbook
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Define your brand journey, associations, and story in one
                  comprehensive document.
                </p>
                <ul className="text-sm text-zinc-500 space-y-1">
                  <li>• Brand Journey (4 questions)</li>
                  <li>• Positive & Negative Associations</li>
                  <li>• Brand Story (Catalyst, Truth, Proof)</li>
                </ul>
              </button>

              {/* Content Strategy */}
              <button
                onClick={() => setSelectedType('content')}
                className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700 hover:border-sky-600/50 hover:bg-zinc-800/80 transition-all text-left group"
              >
                <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  Content Strategy Playbook
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Plan your content medium, platforms, cadence, and content mix
                  in one actionable document.
                </p>
                <ul className="text-sm text-zinc-500 space-y-1">
                  <li>• Medium & Platform Selection</li>
                  <li>• Posting Cadence Plan</li>
                  <li>• 70/20/10 Content Mix</li>
                </ul>
              </button>
            </div>

            {/* Link to Strategy Wizard */}
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm mb-4">
                Want a more comprehensive approach?
              </p>
              <Link
                href="/strategy"
                className="inline-block px-6 py-3 text-sky-400 border border-sky-600/50 rounded-xl hover:bg-sky-900/30 transition-colors font-medium"
              >
                Try the Full Strategy Wizard →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
