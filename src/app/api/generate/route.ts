import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai/client';
import {
  BRAND_PLAYBOOK_PROMPT,
  CONTENT_STRATEGY_PROMPT,
  STORY_TEMPLATE_PROMPT,
} from '@/lib/prompts/generatorPrompts';

type PlaybookType = 'brand' | 'content' | 'story';

const PROMPTS: Record<PlaybookType, string> = {
  brand: BRAND_PLAYBOOK_PROMPT,
  content: CONTENT_STRATEGY_PROMPT,
  story: STORY_TEMPLATE_PROMPT,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    const systemPrompt = PROMPTS[type as PlaybookType];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: 'Invalid playbook type' },
        { status: 400 }
      );
    }

    // Format the user data into a prompt
    const userPrompt = formatUserData(type, data);

    const document = await generateDocument(userPrompt, systemPrompt);

    return NextResponse.json({ content: document });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}

function formatUserData(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case 'brand':
      return `Please create a Brand Foundation Playbook based on these answers:

Brand Name: ${data.brandName || 'My Brand'}

BRAND JOURNEY:
1. Desired Outcome: ${data.desiredOutcome || 'Not specified'}
2. What to be Known For: ${data.knownFor || 'Not specified'}
3. What Needs to be Done: ${data.needToDo || 'Not specified'}
4. What Needs to be Learned: ${data.needToLearn || 'Not specified'}

BRAND ASSOCIATIONS:
Positive (want to be associated with): ${data.positiveAssociations || 'Not specified'}
Negative (want to avoid): ${data.negativeAssociations || 'Not specified'}

BRAND STORY:
Catalyst (what triggered the journey): ${data.catalyst || 'Not specified'}
Core Truth (key insight discovered): ${data.coreTruth || 'Not specified'}
Proof (evidence it works): ${data.proof || 'Not specified'}

Additional Context: ${data.additionalContext || 'None'}`;

    case 'content':
      return `Please create a Content Strategy Playbook based on these answers:

Brand/Creator Name: ${data.brandName || 'My Brand'}

PRIMARY MEDIUM: ${data.primaryMedium || 'Not specified'}
Reason: ${data.mediumReason || 'Not specified'}

PLATFORMS: ${data.platforms || 'Not specified'}

TARGET AUDIENCE: ${data.targetAudience || 'Not specified'}

CURRENT POSTING: ${data.currentPosting || 'Not specified'}

CONTENT GOALS: ${data.contentGoals || 'Not specified'}

CONTENT THEMES/TOPICS: ${data.contentThemes || 'Not specified'}

TIME AVAILABLE: ${data.timeAvailable || 'Not specified'}

Additional Context: ${data.additionalContext || 'None'}`;

    case 'story':
      return `Please create Story Templates based on this brand story:

Brand Name: ${data.brandName || 'My Brand'}

Catalyst: ${data.catalyst || 'Not specified'}
Core Truth: ${data.coreTruth || 'Not specified'}
Proof: ${data.proof || 'Not specified'}

Target Platform: ${data.platform || 'Multiple platforms'}`;

    default:
      return JSON.stringify(data);
  }
}
