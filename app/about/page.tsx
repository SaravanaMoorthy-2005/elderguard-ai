'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { Shield, Brain, Lock, Mic, Globe, Phone, ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    icon: '🎯',
    title: 'The Problem',
    content: `Every year, millions of elderly people fall victim to voice-based financial scams. Scammers impersonate bank officials, government officers, delivery companies, or even family members to manipulate victims into revealing OTPs, PINs, passwords, and banking credentials — often under artificial urgency or fear.

Traditional solutions like spam call blockers only screen numbers. They cannot understand what is being said in a conversation. By the time the victim realizes something is wrong, it is often too late.`,
  },
  {
    icon: '💡',
    title: 'Our Solution',
    content: `ElderGuard AI is an AI-powered real-time scam call protection system. It listens to the conversation in real time, converts speech to text, detects suspicious intent and social-engineering patterns, calculates a dynamic scam-risk score, warns the elderly user in simple language, and provides an emergency intervention when risk crosses a configurable threshold.

Unlike keyword detectors, ElderGuard AI understands conversation context — distinguishing between "never share your OTP with anyone" (safe) and "tell me the OTP you received" (high risk).`,
  },
  {
    icon: '🧠',
    title: 'How the AI Works',
    content: `ElderGuard AI uses a multi-layer analysis pipeline:

1. Speech-to-Text: Browser Web Speech API converts audio to text in real time
2. Risk Engine: A weighted, contextual rule engine scores the conversation
3. Intent Classification: Identifies 12 scam intent categories
4. Context Window: Analyzes the last 3–5 statements for context
5. AI Enhancement: Optional API-powered deeper analysis
6. Fallback Engine: Local deterministic engine ensures demo always works

The local risk engine analyzes over 80 scam patterns across 14 threat categories, weighted by severity.`,
  },
  {
    icon: '📊',
    title: 'Risk Scoring System',
    content: `The risk score is transparent and explainable:

• OTP request: +30 points
• PIN / UPI PIN request: +35 points
• CVV request: +35 points
• Password request: +30 points
• Banking context: +20 points
• Payment/transfer request: +25 points
• Urgency/pressure: +15 points
• Threat/fear tactic: +20 points
• Impersonation: +20 points
• Remote access request: +35 points
• Suspicious link: +20 points
• User sensitive disclosure: +40 points
• Unknown caller: +10 points

Score is capped at 100. Threshold for intervention: 80 (configurable).`,
  },
  {
    icon: '🔒',
    title: 'Privacy Design',
    content: `Privacy is not an afterthought — it is a core design principle:

• No OTP, PIN, CVV, or password values are ever stored
• Sensitive values are automatically detected and replaced with [REDACTED]
• Audio is processed for scam detection only and not stored by default
• Processing happens locally in the browser where possible
• AI API keys remain server-side and are never exposed to the client
• No personal identifying information is required to use the service
• Guardian alerts contain only safe metadata — threat category, risk score, and timestamp`,
  },
  {
    icon: '♿',
    title: 'Accessibility',
    content: `ElderGuard AI is designed specifically for elderly users and those with low digital literacy:

• Minimum 18px body text size
• Large, clearly labeled buttons with icons
• Simple plain-language warnings
• Color-independent status indicators (emoji + text + color)
• Voice alerts using browser speech synthesis
• Regional language support: English, Tamil, Hindi
• Configurable high-contrast mode
• Simple mode for streamlined interface
• Guardian assistance for family oversight`,
  },
  {
    icon: '📱',
    title: 'Technology',
    content: `Current prototype (browser-based):
• Next.js 15 + TypeScript + Tailwind CSS
• Web Speech API for speech recognition
• SpeechSynthesis API for voice alerts
• localStorage for demo data persistence
• Local risk engine (no API dependency)
• Vercel-compatible deployment

Important note: This browser prototype uses simulated calls and microphone input. A website cannot intercept arbitrary cellular phone calls. Native telephony integration would be implemented in a dedicated mobile application using supported OS and telecom APIs.`,
  },
];

const FUTURE_SCOPE = [
  'Native Android app with call monitoring APIs',
  'Telephony integration using carrier APIs',
  'Bank fraud database integration',
  'Regional language expansion (Telugu, Kannada, Bengali, Marathi)',
  'Family guardian network with push notifications',
  'Telecom operator integration',
  'Wearable device support',
  'Community-reported scam pattern updates',
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af, #0d9488)',
        color: 'white', padding: '4rem 1.5rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
            How ElderGuard AI Works
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7 }}>
            An AI conversation safety layer that detects social-engineering intent and intervenes in real time — designed around elderly accessibility needs.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {SECTIONS.map(sec => (
            <div key={sec.title} className="card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }}>
                  {sec.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e40af' }}>
                    {sec.title}
                  </h2>
                  <div style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {sec.content}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Future Scope */}
          <div className="card" style={{ border: '2px dashed #bfdbfe', background: '#eff6ff' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
              }}>
                🚀
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e40af' }}>
                  Future Scope
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                  The following features are planned for future versions — they are not currently implemented.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {FUTURE_SCOPE.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#374151' }}>
                      <ChevronRight size={14} color="#1e40af" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Experience It Yourself</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/protection" className="btn-primary">
              <Shield size={18} /> Start Protection
            </Link>
            <Link href="/demo" className="btn-teal">
              <Phone size={18} /> Try Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
