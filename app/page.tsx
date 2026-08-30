'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import {
  Shield, Mic, AlertTriangle, Users, CheckCircle,
  ArrowRight, Zap, Lock, Globe, ChevronRight, Phone,
  Brain, Eye, Bell
} from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'Understands Context', desc: 'Not just keywords — analyzes full scam intent using conversation context.' },
  { icon: Eye, title: 'Prevents Disclosure', desc: 'Intervenes in real time before sensitive information is revealed.' },
  { icon: Users, title: 'Built for Elders', desc: 'Large UI, voice alerts, regional languages and simple warnings.' },
];

const COMPARISON = [
  { feature: 'Detection method', traditional: 'Caller number-based', elderguard: 'Conversation-context based' },
  { feature: 'When it acts', traditional: 'After the incident', elderguard: 'During the conversation' },
  { feature: 'Target users', traditional: 'General users', elderguard: 'Elderly-first accessibility' },
  { feature: 'OTP protection', traditional: 'None', elderguard: 'Real-time detection & redaction' },
  { feature: 'Voice alerts', traditional: 'No', elderguard: 'Yes — in regional languages' },
  { feature: 'Guardian alerts', traditional: 'No', elderguard: 'Instant family notification' },
];

const FLOW_STEPS = [
  { icon: '🎙️', label: 'Voice Input' },
  { icon: '📝', label: 'Speech-to-Text' },
  { icon: '🧠', label: 'AI Analysis' },
  { icon: '📊', label: 'Risk Score' },
  { icon: '⚠️', label: 'Real-time Warning' },
  { icon: '🛡️', label: 'Protection' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #eff6ff 0%, #f0fdf4 50%, #f0f9ff 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.06) 0, transparent 50%), radial-gradient(circle at 80% 20%, rgba(13,148,136,0.06) 0, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#dbeafe', color: '#1e40af', padding: '6px 16px',
            borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
            marginBottom: '1.5rem', border: '1px solid #bfdbfe',
          }}>
            <Shield size={14} />
            AI-Powered Scam Call Protection
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#0f172a',
            marginBottom: '0.5rem',
            lineHeight: 1.1,
          }}>
            ElderGuard{' '}
            <span style={{
              background: 'linear-gradient(135deg, #1e40af, #0d9488)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>AI</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: '#475569',
            fontWeight: 500,
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            Listen · Detect · Protect
          </p>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#64748b',
            maxWidth: '620px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            An AI-powered safety layer designed to protect elderly users from voice-based scams{' '}
            <strong style={{ color: '#1e40af' }}>before</strong> sensitive information is revealed.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/protection" className="btn-primary" style={{ fontSize: '1.15rem', padding: '1rem 2.5rem' }}>
              <Shield size={20} />
              START PROTECTION
            </Link>
            <Link href="/demo" className="btn-secondary" style={{ fontSize: '1.15rem', padding: '1rem 2.5rem' }}>
              <Phone size={20} />
              TRY LIVE DEMO
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex', gap: '2rem', justifyContent: 'center',
            marginTop: '2.5rem', flexWrap: 'wrap',
          }}>
            {[
              { icon: '🔒', text: 'Privacy First' },
              { icon: '🌍', text: 'Regional Languages' },
              { icon: '♿', text: 'Accessibility' },
              { icon: '⚡', text: 'Real-time Detection' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: '#64748b', fontSize: '0.9rem', fontWeight: 500,
              }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOW DIAGRAM ─────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem', color: '#0f172a' }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
            Six steps from voice input to complete protection
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', flexWrap: 'wrap',
          }}>
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px', padding: '1rem 1.25rem',
                  minWidth: '100px', textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(30,64,175,0.06)',
                }}>
                  <span style={{ fontSize: '1.75rem' }}>{step.icon}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e40af' }}>{step.label}</span>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <ChevronRight size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ELDERGUARD AI ─────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--eg-bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem' }}>
            Why ElderGuard AI?
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem' }}>
            Three pillars that make us different
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <f.icon size={28} color="white" />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem' }}>
            What Makes Us Different?
          </h2>
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(30,64,175,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white' }}>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Feature</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>Traditional</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem' }}>ElderGuard AI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{row.feature}</td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#f87171' }}>✗</span> {row.traditional}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>✓</span> {row.elderguard}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── IMPACT SECTION ────────────────────────────── */}
      <section style={{
        padding: '4rem 1.5rem',
        background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)',
        color: 'white',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Real Impact</h2>
          <p style={{ opacity: 0.85, marginBottom: '3rem', fontSize: '1.05rem' }}>
            Every year, millions of elderly people fall victim to voice-based financial scams. ElderGuard AI exists to change that.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '👴', label: 'Protecting', value: 'Elderly Users' },
              { icon: '🎙️', label: 'Against', value: 'Voice Social Engineering' },
              { icon: '🔐', label: 'Before', value: 'Info is Disclosed' },
              { icon: '🛡️', label: 'Outcome', value: 'Safer Communication' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '1.75rem 1rem',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.75, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY CARD ─────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card" style={{
            border: '2px solid #1e40af',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #eff6ff, white)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af' }}>Privacy First</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left' }}>
              {[
                '✓ No OTP storage',
                '✓ No PIN storage',
                '✓ No CVV storage',
                '✓ No audio stored',
                '✓ Sensitive values auto-redacted',
                '✓ Local processing where possible',
                '✓ AI API keys remain server-side',
                '✓ No unnecessary personal data',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', background: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Protect Your Loved Ones?</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Start protection now or try the demo to see ElderGuard AI in action.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/protection" className="btn-primary" style={{ fontSize: '1.1rem' }}>
              <Shield size={20} /> Start Protection
            </Link>
            <Link href="/demo" className="btn-teal" style={{ fontSize: '1.1rem' }}>
              <Phone size={20} /> Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <Shield size={16} color="#3b82f6" />
          <span style={{ color: 'white', fontWeight: 700 }}>ElderGuard AI</span>
          <span>— Listen. Detect. Protect.</span>
        </div>
        <p>Browser-based prototype · Hackathon submission · Designed for elderly safety</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.6 }}>
          Note: This browser prototype uses simulated calls and microphone input. Native telephony integration would be implemented in a dedicated mobile app.
        </p>
      </footer>
    </div>
  );
}
