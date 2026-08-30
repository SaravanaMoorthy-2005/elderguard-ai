import { NextRequest, NextResponse } from 'next/server';
import { analyzeRisk } from '@/lib/risk-engine';

// Rate limiting (basic in-memory, per Vercel instance)
const requestCounts = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60000; // 1 minute
  const limit = 30;

  const record = requestCounts.get(ip);
  if (!record || now > record.reset) {
    requestCounts.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { callerText = '', userText = '', context = [] } = body;

    // Sanitize inputs
    const sanitizedCaller = String(callerText).slice(0, 2000);
    const sanitizedUser = String(userText).slice(0, 500);
    const sanitizedContext = Array.isArray(context)
      ? context.slice(0, 10).map(c => String(c).slice(0, 500))
      : [];

    // Attempt AI analysis if API key is available
    const apiKey = process.env.AI_API_KEY;
    if (apiKey) {
      try {
        // Placeholder: integrate with AI API here
        // e.g., OpenAI, Gemini, etc.
        // For now falls through to local engine
      } catch (aiError) {
        console.warn('AI API unavailable, using local engine:', aiError);
      }
    }

    // Local risk engine (always available)
    const result = analyzeRisk(sanitizedCaller, sanitizedUser, sanitizedContext, true);

    // Never return sensitive transcript values
    return NextResponse.json({
      score: result.score,
      level: result.level,
      intents: result.intents,
      factors: result.factors.map(f => ({
        id: f.id,
        label: f.label,
        score: f.score,
        detected: f.detected,
      })),
      sensitiveDetected: result.sensitiveDetected,
      // Never return redactedTranscript to client — sensitive data stays server-side
    });
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ElderGuard AI Analysis API', version: '1.0.0' });
}
