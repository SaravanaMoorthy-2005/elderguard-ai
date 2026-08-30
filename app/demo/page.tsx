'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import RiskMeter from '@/components/RiskMeter';
import WarningModal from '@/components/WarningModal';
import { analyzeRisk } from '@/lib/risk-engine';
import { DEMO_SCENARIOS } from '@/lib/demo-scenarios';
import { useSettings } from '@/hooks/useSettings';
import type { DemoScenario, TranscriptEntry, RiskAnalysis } from '@/types';
import { Play, RotateCcw, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const RISK_COLOR: Record<string, string> = {
  'safe': '#16a34a',
  'caution': '#d97706',
  'suspicious': '#ea580c',
  'high-risk': '#dc2626',
};
const RISK_BG: Record<string, string> = {
  'safe': '#dcfce7',
  'caution': '#fef9c3',
  'suspicious': '#ffedd5',
  'high-risk': '#fee2e2',
};

export default function DemoPage() {
  const { settings } = useSettings();
  const [selected, setSelected] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [playing, setPlaying] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [done, setDone] = useState(false);
  const [guardianAlerted, setGuardianAlerted] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const warningShownRef = useRef(false);

  const scrollTranscript = useCallback(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, []);

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setTranscript([]);
    setAnalysis(null);
    setPlaying(false);
    setDone(false);
    setShowWarning(false);
    setGuardianAlerted(false);
    warningShownRef.current = false;
    window.speechSynthesis?.cancel();
  }, []);

  const play = useCallback(() => {
    reset();
    setPlaying(true);
    warningShownRef.current = false;

    let accumulated: TranscriptEntry[] = [];

    selected.conversation.forEach(line => {
      const t = setTimeout(() => {
        const entry: TranscriptEntry = { speaker: line.speaker, text: line.text, timestamp: Date.now() };
        accumulated = [...accumulated, entry];
        setTranscript([...accumulated]);
        scrollTranscript();

        const callerText = accumulated.filter(e => e.speaker === 'caller').map(e => e.text).join(' ');
        const userText = accumulated.filter(e => e.speaker === 'user').map(e => e.text).join(' ');
        const ctx = accumulated.slice(-5).map(e => e.text);
        const result = analyzeRisk(callerText, userText, ctx, true);
        setAnalysis(result);

        if (result.score >= settings.riskThreshold && !warningShownRef.current) {
          warningShownRef.current = true;
          const warnTimeout = setTimeout(() => {
            setShowWarning(true);
            if (settings.voiceAlerts) {
              const utter = new SpeechSynthesisUtterance(
                'Warning! This may be a scam call. Do not share your OTP or password.'
              );
              utter.rate = 0.85;
              window.speechSynthesis.speak(utter);
            }
          }, 600);
          timeoutsRef.current.push(warnTimeout);
        }
      }, line.delay);

      timeoutsRef.current.push(t);
    });

    // Finish
    const maxDelay = Math.max(...selected.conversation.map(l => l.delay)) + 1500;
    const doneTimeout = setTimeout(() => {
      setPlaying(false);
      setDone(true);
    }, maxDelay);
    timeoutsRef.current.push(doneTimeout);
  }, [selected, settings, reset, scrollTranscript]);

  const alertGuardian = () => setGuardianAlerted(true);
  const readAloud = () => {
    const utter = new SpeechSynthesisUtterance('Warning! This may be a scam call. Do not share your OTP or password.');
    utter.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      {showWarning && (
        <WarningModal
          onEndCall={() => { setShowWarning(false); setDone(true); }}
          onAlertGuardian={alertGuardian}
          onReadAloud={readAloud}
          onDismiss={() => setShowWarning(false)}
          guardianAlerted={guardianAlerted}
          language={settings.language}
          riskScore={analysis?.score ?? 0}
        />
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#7c3aed20', color: '#7c3aed', padding: '4px 14px',
            borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            🎬 DEMO MODE — No API key required
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Scam Call Simulator
          </h1>
          <p style={{ color: '#64748b' }}>
            Select a scenario, press Play, and watch ElderGuard AI detect the scam in real time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>

          {/* Scenario selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              📋 Scenarios
            </h2>
            {DEMO_SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => { setSelected(scenario); reset(); }}
                style={{
                  textAlign: 'left', padding: '1rem 1.1rem',
                  borderRadius: '12px', border: `2px solid ${selected.id === scenario.id ? '#1e40af' : '#e2e8f0'}`,
                  background: selected.id === scenario.id ? '#eff6ff' : 'white',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: selected.id === scenario.id ? '0 4px 12px rgba(30,64,175,0.12)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    background: RISK_BG[scenario.expectedRisk],
                    color: RISK_COLOR[scenario.expectedRisk],
                    padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                  }}>
                    {scenario.expectedScore}% {scenario.expectedRisk.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>
                  {scenario.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{scenario.description}</div>
              </button>
            ))}
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Controls */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                    {selected.name}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{selected.description}</p>
                </div>
                <div style={{
                  background: RISK_BG[selected.expectedRisk],
                  color: RISK_COLOR[selected.expectedRisk],
                  padding: '4px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700,
                }}>
                  Expected: {selected.expectedScore}%
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={play}
                  disabled={playing}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', opacity: playing ? 0.7 : 1 }}
                >
                  <Play size={18} />
                  {playing ? 'Playing...' : '▶ Play Scenario'}
                </button>
                <button onClick={reset} className="btn-secondary" style={{ justifyContent: 'center', padding: '10px 20px', minHeight: 'auto' }}>
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              {playing && (
                <div style={{
                  marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
                  padding: '10px 14px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600,
                }}>
                  <span className="animate-blink">⬤</span>
                  Simulated conversation in progress...
                </div>
              )}
              {done && (
                <div style={{
                  marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                  padding: '10px 14px', fontSize: '0.85rem', color: '#374151', fontWeight: 600,
                }}>
                  <CheckCircle size={16} color="#16a34a" />
                  Scenario complete. Analysis shown on the right.
                </div>
              )}
            </div>

            {/* Transcript + Risk meter side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

              {/* Transcript */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#374151' }}>
                  📝 Simulated Transcript
                </h3>
                <div className="transcript-panel" ref={transcriptRef} style={{ flex: 1, minHeight: '280px' }}>
                  {transcript.length === 0 && (
                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
                      Press Play to start simulation
                    </div>
                  )}
                  {transcript.map((entry, i) => (
                    <div
                      key={i}
                      className={`transcript-${entry.speaker} animate-slide-up`}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '2px' }}>
                        {entry.speaker === 'caller' ? '📞 Caller' : '🧑 User'}
                      </div>
                      <div style={{ color: entry.text.includes('[REDACTED]') ? '#dc2626' : 'inherit', fontWeight: entry.text.includes('[REDACTED]') ? 700 : 400 }}>
                        {entry.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk meter */}
              <RiskMeter
                score={analysis?.score ?? 0}
                level={analysis?.level ?? 'safe'}
                factors={analysis?.factors ?? []}
                threshold={settings.riskThreshold}
              />
            </div>

            {/* Sensitive disclosure alert */}
            {analysis?.sensitiveDetected && (
              <div className="card animate-bounce-in" style={{
                border: '3px solid #dc2626', background: '#fff7f7',
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2.5rem' }}>🚨</div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626', marginBottom: '4px' }}>
                      SENSITIVE DISCLOSURE DETECTED
                    </h3>
                    <p style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      STOP! You are about to share confidential information.{' '}
                      <strong>DO NOT CONTINUE.</strong>
                    </p>
                    <div style={{
                      background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px',
                      padding: '8px 12px', fontSize: '0.9rem', color: '#dc2626', fontWeight: 600,
                    }}>
                      🔒 The detected sensitive information has been redacted and will not be stored.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Intents */}
            {analysis && analysis.intents.length > 0 && (
              <div className="card">
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  🧠 Detected Intents
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.intents.map(intent => (
                    <span key={intent} style={{
                      background: intent === 'SAFE_CONVERSATION' ? '#dcfce7' : '#fee2e2',
                      color: intent === 'SAFE_CONVERSATION' ? '#16a34a' : '#dc2626',
                      padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700,
                    }}>
                      {intent.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 340px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
