'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Framework steps configuration
const STEPS = [
  {
    id: 1,
    name: 'Brand Journey',
    icon: '🎯',
    description: 'Define your desired outcome and what you want to be known for',
    questions: [
      { id: 'desired_outcome', label: 'What is your desired outcome?', placeholder: 'e.g., Build a 7-figure coaching business, become a recognized thought leader in my industry...' },
      { id: 'known_for', label: 'What do you want to be known for?', placeholder: 'e.g., Helping busy professionals achieve work-life balance, teaching no-code app development...' },
      { id: 'need_to_do', label: 'What do you need to do to achieve this?', placeholder: 'e.g., Create consistent content, build an email list, launch a signature program...' },
      { id: 'need_to_learn', label: 'What do you need to learn?', placeholder: 'e.g., Video editing, sales funnels, public speaking...' },
    ]
  },
  {
    id: 2,
    name: 'Brand Associations',
    icon: '🔗',
    description: 'Define what you want to be associated with - and what you don\'t',
    questions: [
      { id: 'positive_associations', label: 'Positive Associations (what you WANT to be associated with)', placeholder: 'e.g., Innovation, authenticity, results-driven, empathy, expertise, approachability...' },
      { id: 'negative_associations', label: 'Negative Associations (what you DON\'T want to be associated with)', placeholder: 'e.g., Get-rich-quick schemes, hype without substance, corporate jargon, exclusivity...' },
    ]
  },
  {
    id: 3,
    name: 'Brand Story',
    icon: '📖',
    description: 'Craft your compelling brand narrative using the Catalyst → Core Truth → Proof structure',
    questions: [
      { id: 'catalyst', label: 'The Catalyst - What triggered your journey? What painful situation were you in?', placeholder: 'e.g., I was burnt out working 80-hour weeks at my corporate job, missing my kids grow up...' },
      { id: 'core_truth', label: 'The Core Truth - What insight did you discover that others don\'t know?', placeholder: 'e.g., Success doesn\'t require sacrifice - the most successful people work less but with more intention...' },
      { id: 'proof', label: 'The Proof - What evidence validates your core truth?', placeholder: 'e.g., I now work 4-day weeks while my business generates $500K/year. I\'ve helped 200+ clients achieve similar results...' },
    ]
  },
  {
    id: 4,
    name: 'Content Medium',
    icon: '🎬',
    description: 'Choose your primary content format based on your strengths and preferences',
    questions: [
      { id: 'primary_medium', label: 'What is your primary content medium?', type: 'select', options: [
        { value: 'written', label: 'Written (blogs, newsletters, threads)' },
        { value: 'video', label: 'Video (YouTube, TikTok, Reels)' },
        { value: 'audio', label: 'Audio (podcasts, audio notes)' },
        { value: 'visual', label: 'Visual (graphics, carousels, infographics)' },
      ]},
      { id: 'medium_reasoning', label: 'Why does this medium suit you best?', placeholder: 'e.g., I\'m a natural writer and can produce content quickly. Video feels unnatural to me...' },
    ]
  },
  {
    id: 5,
    name: 'Platform Selection',
    icon: '📱',
    description: 'Choose 2-3 platforms that align with your medium and target audience',
    questions: [
      { id: 'primary_platform', label: 'Primary Platform (where you\'ll focus most effort)', type: 'select', options: [
        { value: 'twitter', label: 'X (Twitter)' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'newsletter', label: 'Newsletter/Substack' },
        { value: 'podcast', label: 'Podcast' },
      ]},
      { id: 'secondary_platform', label: 'Secondary Platform (for repurposing)', type: 'select', options: [
        { value: 'none', label: 'None yet' },
        { value: 'twitter', label: 'X (Twitter)' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'newsletter', label: 'Newsletter/Substack' },
      ]},
      { id: 'platform_strategy', label: 'Why these platforms? Who is your audience there?', placeholder: 'e.g., My target audience of B2B founders is most active on LinkedIn. I\'ll repurpose threads to Twitter...' },
    ]
  },
  {
    id: 6,
    name: 'Posting Cadence',
    icon: '📅',
    description: 'Use the Accordion Method to find a sustainable posting frequency',
    questions: [
      { id: 'max_cadence', label: 'Maximum Cadence - What\'s the most you could sustain if everything was perfect?', placeholder: 'e.g., Daily posts on LinkedIn, 3 YouTube videos per week...' },
      { id: 'min_cadence', label: 'Minimum Cadence - What\'s the least you\'d be okay with during tough times?', placeholder: 'e.g., 2 posts per week, 1 YouTube video per month...' },
      { id: 'target_cadence', label: 'Target Cadence - What will you actually commit to? (Start closer to minimum)', placeholder: 'e.g., 3 posts per week on LinkedIn, 1 YouTube video every 2 weeks...' },
    ]
  },
  {
    id: 7,
    name: '70/20/10 Content Mix',
    icon: '📊',
    description: 'Balance proven content, iterations, and experiments',
    questions: [
      { id: 'proven_70', label: '70% Proven Content - What topics/formats consistently work for you?', placeholder: 'e.g., How-to tutorials, client success stories, industry hot takes, behind-the-scenes...' },
      { id: 'iterations_20', label: '20% Iterations - How will you improve on what\'s working?', placeholder: 'e.g., Deeper dives into popular topics, series expansions, different angles on proven themes...' },
      { id: 'experiments_10', label: '10% Experiments - What new things will you try?', placeholder: 'e.g., New video formats, collaborations, controversial takes, different content styles...' },
    ]
  },
  {
    id: 8,
    name: 'Storytelling Templates',
    icon: '✍️',
    description: 'Create reusable story templates using Hook → Problem → Journey → Lesson → CTA',
    questions: [
      { id: 'hook_templates', label: 'Hook Templates - How will you grab attention?', placeholder: 'e.g., "I lost $50K learning this lesson...", "The #1 mistake I see [audience] make...", "Nobody talks about this, but..."' },
      { id: 'problem_examples', label: 'Problem Examples - What problems does your audience face?', placeholder: 'e.g., Overwhelmed by too many tactics, stuck at a revenue plateau, burnout from hustle culture...' },
      { id: 'lesson_themes', label: 'Lesson Themes - What core lessons do you teach repeatedly?', placeholder: 'e.g., Simplicity beats complexity, consistency compounds, relationships matter more than tactics...' },
      { id: 'cta_variations', label: 'CTA Variations - How will you end your content?', placeholder: 'e.g., "DM me [word] for...", "Follow for more...", "Save this for later...", "Link in bio for..."' },
    ]
  },
  {
    id: 9,
    name: 'Waterfall Distribution',
    icon: '🌊',
    description: 'Maximize reach by repurposing content across platforms',
    questions: [
      { id: 'hero_content', label: 'Hero Content - What\'s your primary "big" content piece?', placeholder: 'e.g., Weekly YouTube video, monthly newsletter deep-dive, flagship podcast episode...' },
      { id: 'micro_content', label: 'Micro Content - How will you break it into smaller pieces?', placeholder: 'e.g., Extract 3-5 key quotes for tweets, create carousel from main points, clip 30-sec video highlights...' },
      { id: 'distribution_flow', label: 'Distribution Flow - What\'s your repurposing workflow?', placeholder: 'e.g., YouTube → Extract quotes for Twitter → Create LinkedIn article → Repurpose clips for TikTok → Newsletter recap...' },
    ]
  },
];

// Types
interface StrategyData {
  [key: string]: string;
}

function StrategyWizardContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');

  const [currentStep, setCurrentStep] = useState(1);
  const [strategyData, setStrategyData] = useState<StrategyData>({});
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('branding-strategy-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStrategyData(parsed.data || {});
        if (!stepParam) {
          setCurrentStep(parsed.currentStep || 1);
        }
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, [stepParam]);

  // Handle step param from URL
  useEffect(() => {
    if (stepParam) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= STEPS.length + 1) {
        setCurrentStep(step);
      }
    }
  }, [stepParam]);

  // Save to localStorage on change with toast
  useEffect(() => {
    localStorage.setItem('branding-strategy-progress', JSON.stringify({
      currentStep,
      data: strategyData,
      lastUpdated: new Date().toISOString()
    }));
  }, [currentStep, strategyData]);

  // Show save toast when data changes (debounced)
  useEffect(() => {
    if (Object.keys(strategyData).length === 0) return;

    const timeout = setTimeout(() => {
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    }, 500);

    return () => clearTimeout(timeout);
  }, [strategyData]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't navigate if user is typing in an input
    if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
      return;
    }

    if (e.key === 'ArrowLeft' && currentStep > 1) {
      goToStep(currentStep - 1);
    } else if (e.key === 'ArrowRight' && currentStep <= STEPS.length) {
      goToStep(currentStep + 1);
    }
  }, [currentStep]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleInputChange = (questionId: string, value: string) => {
    setStrategyData(prev => ({ ...prev, [questionId]: value }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length + 1) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const exportPlaybook = () => {
    setIsExporting(true);

    let markdown = `# Brand Strategy Playbook\n\n`;
    markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;
    markdown += `---\n\n`;

    STEPS.forEach(step => {
      markdown += `## ${step.icon} ${step.name}\n\n`;
      step.questions.forEach(q => {
        const value = strategyData[q.id] || '_Not completed_';
        markdown += `### ${q.label}\n\n${value}\n\n`;
      });
      markdown += `---\n\n`;
    });

    markdown += `\n\n*Generated by Branding Advisor - Based on Caleb Ralston's methodology*`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-strategy-playbook.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
  };

  const clearProgress = () => {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      setStrategyData({});
      setCurrentStep(1);
      localStorage.removeItem('branding-strategy-progress');
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const isReviewStep = currentStep > STEPS.length;
  const progress = Math.min((currentStep / (STEPS.length + 1)) * 100, 100);

  // Calculate completion percentage
  const totalQuestions = STEPS.reduce((acc, step) => acc + step.questions.length, 0);
  const answeredQuestions = Object.keys(strategyData).filter(key => strategyData[key]?.trim()).length;
  const completionPercent = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <main className="min-h-screen bg-zinc-900">
      {/* Auto-save Toast */}
      <div
        className={`fixed bottom-6 right-6 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg transition-all duration-300 z-50 ${
          showSaveToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm text-zinc-300">Saved</span>
      </div>
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold text-white">Branding Advisor</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              {completionPercent}% complete
            </span>
            <button
              onClick={clearProgress}
              className="text-sm text-zinc-500 hover:text-red-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-zinc-800">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Step Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              {STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = step.questions.every(q => strategyData[q.id]?.trim());

                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(stepNumber)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-sky-600/20 border border-sky-600/50 text-white'
                        : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {/* Completion dot */}
                    <div className="relative">
                      <span className="text-lg">{step.icon}</span>
                      {isCompleted && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{step.name}</div>
                    </div>
                  </button>
                );
              })}

              {/* Review Step */}
              <button
                onClick={() => goToStep(STEPS.length + 1)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  isReviewStep
                    ? 'bg-sky-600/20 border border-sky-600/50 text-white'
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-lg">📋</span>
                <div className="text-sm font-medium">Review & Export</div>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Step Indicator */}
            <div className="lg:hidden mb-6">
              <select
                value={currentStep}
                onChange={(e) => goToStep(parseInt(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
              >
                {STEPS.map((step, index) => (
                  <option key={step.id} value={index + 1}>
                    {step.icon} {step.name}
                  </option>
                ))}
                <option value={STEPS.length + 1}>📋 Review & Export</option>
              </select>
            </div>

            {isReviewStep ? (
              /* Review Step */
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Review Your Brand Strategy
                  </h1>
                  <p className="text-zinc-400">
                    Review your answers and export your complete brand playbook.
                  </p>
                </div>

                {/* Completion Stats */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Completion Status</h2>
                    <span className="text-2xl font-bold text-sky-400">{completionPercent}%</span>
                  </div>
                  <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 transition-all"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">
                    {answeredQuestions} of {totalQuestions} questions answered
                  </p>
                </div>

                {/* Summary Cards */}
                {STEPS.map((step) => {
                  const isStepComplete = step.questions.every(q => strategyData[q.id]?.trim());

                  return (
                    <div
                      key={step.id}
                      className={`bg-zinc-800 border rounded-xl p-6 ${
                        isStepComplete ? 'border-green-600/30' : 'border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <span>{step.icon}</span>
                          {step.name}
                          {isStepComplete && <span className="text-green-400 text-sm">✓</span>}
                        </h3>
                        <button
                          onClick={() => goToStep(step.id)}
                          className="text-sm text-sky-400 hover:text-sky-300"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-3">
                        {step.questions.map(q => (
                          <div key={q.id}>
                            <div className="text-xs text-zinc-500 mb-1">{q.label}</div>
                            <div className="text-sm text-zinc-300">
                              {strategyData[q.id] || <span className="text-zinc-600 italic">Not answered</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Export Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={exportPlaybook}
                    disabled={isExporting}
                    className="flex-1 py-4 text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-colors disabled:opacity-50"
                  >
                    {isExporting ? 'Exporting...' : 'Export as Markdown'}
                  </button>
                  <Link
                    href="/chat"
                    className="flex-1 py-4 text-lg font-semibold text-center text-sky-400 border-2 border-sky-600 rounded-xl hover:bg-sky-900/30 transition-colors"
                  >
                    Discuss with AI
                  </Link>
                </div>
              </div>
            ) : currentStepData ? (
              /* Framework Step */
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{currentStepData.icon}</span>
                    <div>
                      <div className="text-sm text-sky-400 font-medium">
                        Step {currentStep} of {STEPS.length}
                      </div>
                      <h1 className="text-3xl font-bold text-white">
                        {currentStepData.name}
                      </h1>
                    </div>
                  </div>
                  <p className="text-zinc-400 mt-2">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {currentStepData.questions.map((question) => (
                    <div key={question.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                      <label className="block text-white font-medium mb-3">
                        {question.label}
                      </label>
                      {question.type === 'select' && question.options ? (
                        <select
                          value={strategyData[question.id] || ''}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="">Select an option...</option>
                          {question.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <textarea
                          value={strategyData[question.id] || ''}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          placeholder={question.placeholder}
                          rows={4}
                          className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => goToStep(currentStep - 1)}
                    disabled={currentStep === 1}
                    className="px-6 py-3 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-zinc-600 hidden sm:block">
                    Use ← → arrow keys to navigate
                  </span>
                  <button
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-8 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-colors font-semibold"
                  >
                    {currentStep === STEPS.length ? 'Review Strategy' : 'Next Step →'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrap in Suspense boundary for useSearchParams (required for Next.js static generation)
export default function StrategyWizard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Loading strategy wizard...</div>
      </div>
    }>
      <StrategyWizardContent />
    </Suspense>
  );
}
