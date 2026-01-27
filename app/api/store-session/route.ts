import { NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
const sessions = new Map();

export async function POST(request: Request) {
  try {
    const { sessionId, role, data } = await request.json();
    
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {});
    }
    
    const session = sessions.get(sessionId);
    session[role] = data;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store session' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId || !sessions.has(sessionId)) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    return NextResponse.json(sessions.get(sessionId));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
