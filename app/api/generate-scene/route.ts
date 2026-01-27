import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { domData, subData } = await request.json();
    
    const prompt = `You are a creative BDSM scene designer. Based on these preferences, create a detailed, consensual scene.

DOM Preferences:
- Intensity: ${domData.intensity}/10
- Dynamic: ${domData.dynamic}
- Activities: ${domData.activities.join(', ')}
- Boundaries: ${domData.boundaries}
- Aftercare: ${domData.aftercare}
- Safeword: ${domData.safeword}

SUB Preferences:
- Intensity: ${subData.intensity}/10
- Experience: ${subData.experience}
- Activities: ${subData.activities.join(', ')}
- Boundaries: ${subData.boundaries}
- Aftercare: ${subData.aftercare}

Create a scene that:
1. Respects BOTH partners' boundaries
2. Balances their intensity preferences
3. Includes only mutually selected activities
4. Has clear setup, progression, and aftercare
5. Is safe, sane, and consensual

Format as: Scene Title, Setup, Activities (step-by-step), Aftercare, Safety Notes`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const sceneContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Unable to generate scene';

    return NextResponse.json({ scene: sceneContent });
  } catch (error) {
    console.error('Error generating scene:', error);
    return NextResponse.json(
      { error: 'Failed to generate scene' }, 
      { status: 500 }
    );
  }
}
