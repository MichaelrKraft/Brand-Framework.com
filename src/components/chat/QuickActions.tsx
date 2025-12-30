'use client';

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    label: 'Brand Journey',
    prompt: 'Help me work through the Brand Journey Framework. Start with the first question about my desired outcome.',
    icon: '🎯',
  },
  {
    label: 'Brand Story',
    prompt: 'Help me craft my brand story using the Catalyst, Core Truth, and Proof framework.',
    icon: '📖',
  },
  {
    label: 'Associations',
    prompt: 'Help me define my brand associations - what I want to be associated with and what I want to avoid.',
    icon: '🔗',
  },
  {
    label: 'Platform Strategy',
    prompt: 'Help me choose the right platforms for my content. Walk me through the Platform Selection Framework.',
    icon: '📱',
  },
  {
    label: 'Content Mix',
    prompt: 'Help me plan my content using the 70/20/10 framework.',
    icon: '📊',
  },
  {
    label: 'Generate Playbook',
    prompt: 'I want to create a complete Brand Foundation Playbook. Please guide me through gathering the information needed.',
    icon: '📋',
  },
];

export default function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-zinc-500 mb-2">Quick Start:</p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => onSelect(action.prompt)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 hover:text-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
