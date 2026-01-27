import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    const story = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Story generated...';

    return NextResponse.json({ story });
  } catch (error) {
    return NextResponse.json(
      { story: 'A personalized story awaits...' },
      { status: 200 }
    );
  }
}
