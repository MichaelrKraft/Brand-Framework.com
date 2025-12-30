import ChatInterface from '@/components/chat/ChatInterface';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-zinc-900">
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
              className="text-sm font-medium text-sky-400"
            >
              Chat
            </Link>
            <Link
              href="/generator"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Playbooks
            </Link>
          </nav>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
