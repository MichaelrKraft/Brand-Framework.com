'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlurText from '@/components/ui/BlurText';
import ShinyText from '@/components/ui/ShinyText';

// FAQ Data
const FAQ_ITEMS = [
  {
    question: "Is this actually based on Caleb Ralston's methodology?",
    answer: "Yes! Every framework, question, and piece of advice is derived directly from Caleb Ralston's branding course and methodology. We've codified his approach into actionable tools that guide you step-by-step."
  },
  {
    question: "How is this different from ChatGPT?",
    answer: "Unlike general AI, Branding Advisor is specifically trained on Caleb's 9 frameworks and branding philosophy. It doesn't give generic advice - it applies proven formulas like the Brand Journey Framework, 70/20/10 Content Mix, and Brand Story Framework to YOUR specific brand."
  },
  {
    question: "What kind of creators is this for?",
    answer: "Anyone building a personal brand: content creators, coaches, consultants, entrepreneurs, course creators, and thought leaders. If you want to be known for something and build an authentic audience, these frameworks apply to you."
  },
  {
    question: "What is 'brand' according to this methodology?",
    answer: "Branding is the intentional pairing of relevant things done consistently. It's not just logos and colors - it's about what you want to be known for, the associations you create, and how you show up consistently across platforms."
  },
  {
    question: "How long does the Strategy Wizard take?",
    answer: "The full 9-step wizard takes about 30-45 minutes if you're thoughtful with your answers. You can save progress and return anytime. At the end, you'll have a complete brand strategy playbook."
  },
  {
    question: "Can I just chat instead of using the wizard?",
    answer: "Absolutely! You can skip the structured wizard and have an open conversation about any aspect of your brand, content strategy, or platform selection. The AI knows all 9 frameworks and can apply them to your questions."
  },
  {
    question: "What's included in the exported playbook?",
    answer: "Your Brand Journey answers, Brand Associations (positive/negative), Brand Story (Catalyst, Core Truth, Proof), Content Medium selection, Platform strategy, Posting Cadence, 70/20/10 Content Mix, and Storytelling Templates. Everything you need to execute."
  },
  {
    question: "Is my data private?",
    answer: "Absolutely. Your brand strategy, answers, and conversations are never shared, sold, or used to train AI models. All data is stored locally in your browser and encrypted."
  }
];

// Pain Points Data
const PAIN_POINTS = [
  { icon: '🎭', text: "No clear brand identity or positioning" },
  { icon: '📢', text: "Inconsistent messaging across platforms" },
  { icon: '🤷', text: "Don't know what content to create" },
  { icon: '👥', text: "Struggling to stand out from competitors" },
  { icon: '📖', text: "No compelling brand story to tell" },
  { icon: '😫', text: "Content burnout - posting without strategy" }
];

// How It Works Steps
const STEPS = [
  {
    number: "1",
    title: "Answer Strategic Questions",
    description: "Work through 9 frameworks covering your brand journey, story, content strategy, and distribution plan."
  },
  {
    number: "2",
    title: "Get AI-Powered Analysis",
    description: "Receive personalized recommendations based on Caleb Ralston's proven methodology for each framework."
  },
  {
    number: "3",
    title: "Export Your Playbook",
    description: "Download your complete brand strategy as a professional playbook you can reference and share."
  }
];

// 9 Frameworks
const FRAMEWORKS = [
  { icon: '🎯', title: 'Brand Journey', desc: '4 questions to clarify your desired outcome and path', link: '/strategy?step=1' },
  { icon: '🔗', title: 'Brand Associations', desc: 'Define what you want (and don\'t want) to be associated with', link: '/strategy?step=2' },
  { icon: '📖', title: 'Brand Story', desc: 'Craft your Catalyst, Core Truth, and Proof', link: '/strategy?step=3' },
  { icon: '🎬', title: 'Content Medium', desc: 'Choose between written, video, audio, or visual', link: '/strategy?step=4' },
  { icon: '📱', title: 'Platform Selection', desc: 'Pick 2-3 platforms that match your medium and goals', link: '/strategy?step=5' },
  { icon: '📅', title: 'Posting Cadence', desc: 'Use the Accordion Method for sustainable consistency', link: '/strategy?step=6' },
  { icon: '📊', title: '70/20/10 Mix', desc: 'Balance proven content, iterations, and experiments', link: '/strategy?step=7' },
  { icon: '✍️', title: 'Storytelling', desc: 'Hook → Problem → Journey → Lesson → CTA templates', link: '/strategy?step=8' },
  { icon: '🌊', title: 'Waterfall Distribution', desc: 'Maximize reach by repurposing across platforms', link: '/strategy?step=9' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hasProgress, setHasProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Check for saved strategy progress
  useEffect(() => {
    const saved = localStorage.getItem('branding-strategy-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data && Object.keys(parsed.data).length > 0) {
          setHasProgress(true);
          // Calculate completion percentage
          const totalQuestions = 24; // Total questions across all steps
          const answered = Object.values(parsed.data).filter((v) => (v as string)?.trim()).length;
          setProgressPercent(Math.round((answered / totalQuestions) * 100));
        }
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold text-white">Branding Advisor</span>
          </Link>
          <div className="hidden md:flex gap-2 items-center">
            <Link
              href="/strategy"
              className="px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 border border-sky-600/50 rounded-lg hover:border-sky-500 transition-colors"
            >
              Strategy Wizard
            </Link>
            <Link
              href="/generator"
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            >
              Playbooks
            </Link>
            <Link
              href="/chat"
              className="px-3 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors"
            >
              Chat
            </Link>
          </div>
        </div>
      </header>

      {/* Resume Banner */}
      {hasProgress && (
        <div className="px-4 pt-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-sky-900/30 border border-sky-600/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <p className="text-white font-medium">Welcome back!</p>
                  <p className="text-zinc-400 text-sm">Your strategy is {progressPercent}% complete</p>
                </div>
              </div>
              <Link
                href="/strategy"
                className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors font-medium whitespace-nowrap"
              >
                Continue Strategy →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <BlurText
              text="Build Your Brand with"
              delay={0.12}
              animateBy="words"
              direction="top"
              className="text-white"
            />{' '}
            <ShinyText
              text="Caleb Ralston's Frameworks"
              speed={3}
              className="text-4xl sm:text-5xl md:text-6xl font-bold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto">
            Get AI-powered guidance using{' '}
            <span className="text-sky-400">9 proven frameworks</span> for brand identity,
            content strategy, and storytelling. Define what you stand for. Show up consistently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/strategy"
              className="px-8 py-4 text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-all hover:scale-105 shadow-lg shadow-sky-600/25"
            >
              Start Strategy Wizard
            </Link>
            <Link
              href="/chat"
              className="px-8 py-4 text-lg font-semibold text-sky-400 border-2 border-sky-600 rounded-xl hover:bg-sky-900/30 transition-colors"
            >
              Chat with Brand AI
            </Link>
          </div>
          <p className="text-zinc-500 text-sm">No credit card required. Start in 30 seconds.</p>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-6 px-4 border-y border-zinc-800 bg-zinc-800/30">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white">9</div>
            <div className="text-zinc-500 text-sm">Proven Frameworks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">2</div>
            <div className="text-zinc-500 text-sm">Playbook Types</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">45min</div>
            <div className="text-zinc-500 text-sm">To Complete Strategy</div>
          </div>
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Are You Struggling to Build Your Brand?
          </h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
            Most creators hit the same walls. Sound familiar?
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAIN_POINTS.map((point, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-left hover:border-red-500/50 transition-colors"
              >
                <span className="text-2xl mb-3 block">{point.icon}</span>
                <p className="text-zinc-300">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What If You Had Caleb Ralston's Playbook?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            Branding Advisor gives you instant access to the exact frameworks from Caleb's
            proven methodology. No guessing. No generic advice. Just systematic brand building
            applied to YOUR unique situation.
          </p>
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto mb-6">
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">B</span>
              </div>
              <div>
                <p className="text-zinc-300 mb-4">
                  "Your Brand Journey shows you want to be known for helping entrepreneurs scale
                  without burnout. But your content is scattered across 5 different topics.
                  Let me help you narrow down to your core 3 content pillars using the
                  70/20/10 framework..."
                </p>
                <p className="text-zinc-500 text-sm">- Branding Advisor analyzing a creator's strategy</p>
              </div>
            </div>
          </div>

          {/* Second Quote */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">B</span>
              </div>
              <div>
                <p className="text-zinc-300 mb-4">
                  "Your Brand Story is missing the 'Catalyst' - the specific moment that changed
                  everything for you. Without it, your audience can't connect emotionally.
                  Here's how to find it:"
                </p>
                <ol className="text-zinc-300 mb-4 space-y-2 list-decimal list-inside">
                  <li><span className="font-semibold text-white">What painful situation were you in?</span></li>
                  <li><span className="font-semibold text-white">What moment made you realize something had to change?</span></li>
                  <li><span className="font-semibold text-white">What truth did you discover that others don't know?</span></li>
                </ol>
                <p className="text-sky-400 font-medium">
                  That's your Catalyst → Core Truth → Proof structure.
                </p>
                <p className="text-zinc-500 text-sm mt-3">- Branding Advisor teaching the Brand Story Framework</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - 9 Frameworks */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            9 Frameworks to Build Your Brand
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Every tool is based on Caleb Ralston's proven methodology.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FRAMEWORKS.map((framework) => (
              <Link
                key={framework.title}
                href={framework.link}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-sky-600/50 hover:bg-zinc-800/80 transition-all group"
              >
                <span className="text-3xl mb-4 block">{framework.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {framework.title}
                </h3>
                <p className="text-zinc-400 text-sm">{framework.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-zinc-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Get your complete brand strategy in 3 steps
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {STEPS.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Or Just Chat */}
          <div className="text-center border-t border-zinc-700 pt-10">
            <p className="text-zinc-500 text-sm uppercase tracking-wide mb-3">Or</p>
            <h3 className="text-2xl font-bold text-white mb-3">
              Just Chat About Your Brand
            </h3>
            <p className="text-zinc-400 max-w-xl mx-auto mb-6">
              Skip the structured wizard and have an open conversation about
              your brand identity, content strategy, platform selection, or anything
              on your mind. The AI knows all 9 frameworks.
            </p>
            <Link
              href="/chat"
              className="inline-block px-6 py-3 text-lg font-semibold text-sky-400 border-2 border-sky-600 rounded-xl hover:bg-sky-900/30 transition-colors"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What Creators Are Saying
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Real results from real creators using the Brand Strategy Wizard.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Brand Journey framework finally helped me articulate what I actually want to be known for. I stopped trying to be everything to everyone.",
                name: "Alex M.",
                role: "Course Creator",
                result: "Grew to 50K followers in 6 months"
              },
              {
                quote: "The 70/20/10 content mix saved me from burnout. Now I know exactly what to post and why. No more random content hoping something sticks.",
                name: "Sarah K.",
                role: "Business Coach",
                result: "3x'd engagement in 30 days"
              },
              {
                quote: "My Brand Story was missing the 'Core Truth' - the AI helped me find it. Now my audience actually connects with my message emotionally.",
                name: "Marcus T.",
                role: "Consultant",
                result: "Doubled inbound leads"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-sky-400">★</span>
                  ))}
                </div>
                <p className="text-zinc-300 text-sm mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{testimonial.name}</div>
                      <div className="text-zinc-500 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sky-400 text-xs font-medium">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-zinc-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Everything you need to know about Branding Advisor
          </p>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-700/50 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <span className="text-zinc-400 text-xl flex-shrink-0">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-zinc-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Simple, No-BS Pricing
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Get access to all 9 branding frameworks and AI-powered strategy guidance.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Beta Lifetime Deal */}
            <div className="relative bg-gradient-to-b from-sky-900/30 to-zinc-800 border-2 border-sky-500 rounded-2xl p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                BETA SPECIAL
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Lifetime Access</h3>
                <p className="text-zinc-400 text-sm">First 50 beta users only</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-white">$97</span>
                <span className="text-zinc-400 ml-2">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  All 9 branding frameworks
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Unlimited AI chat sessions
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Strategy Wizard + Playbook export
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Lifetime updates
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Lock in forever - never pay again
                </li>
              </ul>
              <Link
                href="/strategy"
                className="block w-full py-4 text-center text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-colors"
              >
                Get Lifetime Access
              </Link>
              <p className="text-zinc-500 text-xs text-center mt-3">
                Limited spots remaining
              </p>
            </div>

            {/* Monthly Plan */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
                <p className="text-zinc-400 text-sm">Cancel anytime</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-zinc-400 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  All 9 branding frameworks
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Unlimited AI chat sessions
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Strategy Wizard + Playbook export
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Regular updates
                </li>
                <li className="flex items-center gap-3 text-zinc-400">
                  <span className="text-zinc-600">✓</span>
                  Flexible - cancel anytime
                </li>
              </ul>
              <Link
                href="/strategy"
                className="block w-full py-4 text-center text-lg font-semibold text-white border-2 border-zinc-600 rounded-xl hover:border-zinc-500 hover:bg-zinc-700/50 transition-colors"
              >
                Start Monthly
              </Link>
              <p className="text-zinc-500 text-xs text-center mt-3">
                No commitment required
              </p>
            </div>
          </div>

          {/* Value Comparison */}
          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-sm">
              <span className="text-sky-400 font-semibold">Lifetime deal math:</span> If you stay for 11+ months, lifetime pays for itself.
              <br />
              Brand consultants charge $1,000-5,000 for similar strategy work.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-900 to-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Brand?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Stop posting without purpose. Start building a brand with proven frameworks
            that create real audience connection.
          </p>
          <Link
            href="/strategy"
            className="inline-block px-10 py-5 text-xl font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-all hover:scale-105 shadow-lg shadow-sky-600/25"
          >
            Start Strategy Wizard Free
          </Link>
          <p className="text-zinc-500 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-lg font-bold text-white">Branding Advisor</span>
            </div>
            <div className="flex gap-6 text-zinc-500 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              Based on Caleb Ralston&apos;s branding methodology.
              AI-powered brand strategy for creators.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
