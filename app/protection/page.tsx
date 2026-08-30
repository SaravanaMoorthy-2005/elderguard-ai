'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import RiskMeter from '@/components/RiskMeter';
import WarningModal from '@/components/WarningModal';
import { useSettings } from '@/hooks/useSettings';
import { analyzeRisk } from '@/lib/risk-engine';
import { getTranslations } from '@/lib/translations';
import type { CallSession, TranscriptEntry, RiskAnalysis } from '@/types';
import {
  Phone, PhoneOff, Mic, MicOff, Shield, AlertTriangle,
  CheckCircle, Clock, Volume2
} from 'lucide-react';

type CallState = 'idle' | 'ringing' | 'active' | 'ended' | 'terminated';

const DEMO_SCRIPT = [
  { speaker: 'caller' as const, text: 'Hello sir, I am calling from SBI bank customer care department.', delay: 0 },
  { speaker: 'caller' as const, text: 'Your account requires urgent KYC verification. If not done, your account will be blocked.', delay: 3000 },
  { speaker: 'user' as const, text: 'Oh okay, what do I need to do?', delay: 6000 },
  { speaker: 'caller' as const, text: 'Don\'t worry. I have sent an OTP to your registered mobile number. Please tell me the six digit OTP immediately.', delay: 8500 },
  { speaker: 'user' as const, text: 'Yes I got an SMS. The OTP is...', delay: 12000 },
];

export default function ProtectionPage() {
  const { settings } = useSettings();
  const t = getTranslations(settings.language);

  const [callState, setCallState] = useState<CallState>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [riskHistory, setRiskHistory] = useState<number[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [guardianAlerted, setGuardianAlerted] = useState(false);
  const [incidentDone, setIncidentDone] = useState(false);
  const [autoTerminated, setAutoTerminated] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const demoTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const warningTriggeredRef = useRef(false);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Duration timer
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  // Risk evaluation
  const evaluateRisk = useCallback((entries: TranscriptEntry[]) => {
    const callerLines = entries.filter(e => e.speaker === 'caller').map(e => e.text).join(' ');
    const userLines = entries.filter(e => e.speaker === 'user').map(e => e.text).join(' ');
    const context = entries.slice(-5).map(e => e.text);
    const analysis = analyzeRisk(callerLines, userLines, context, true);

    setRiskAnalysis(analysis);
    setRiskHistory(prev => [...prev, analysis.score]);

    // Trigger voice alert
    if (analysis.score >= settings.riskThreshold && !warningTriggeredRef.current) {
      warningTriggeredRef.current = true;
      setShowWarning(true);

      if (settings.voiceAlerts) {
        const utter = new SpeechSynthesisUtterance(t.warning.voiceWarning);
        utter.lang = settings.language === 'ta' ? 'ta-IN' : settings.language === 'hi' ? 'hi-IN' : 'en-US';
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
      }

      if (settings.autoEnd) {
        setTimeout(() => {
          setAutoTerminated(true);
          terminateCall();
        }, 3500);
      }
    }
  }, [settings, t]);

  // Add transcript entry
  const addEntry = useCallback((speaker: TranscriptEntry['speaker'], text: string) => {
    const entry: TranscriptEntry = { speaker, text, timestamp: Date.now() };
    setTranscript(prev => {
      const next = [...prev, entry];
      evaluateRisk(next);
      return next;
    });
  }, [evaluateRisk]);

  // Start browser microphone
  const startMic = useCallback(async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge, or use Demo Mode.');
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'ta' ? 'ta-IN' : settings.language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const last = event.results[event.results.length - 1];
        if (last.isFinal) {
          const text = last[0].transcript.trim();
          if (text) addEntry('user', text);
        }
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (callState === 'active' && !usingDemo) {
          recognition.start(); // restart
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setMicEnabled(true);
      setIsListening(true);
    } catch (e) {
      console.error(e);
      alert('Microphone access denied. Please allow microphone and try again, or use Demo Mode.');
    }
  }, [settings.language, callState, usingDemo, addEntry]);

  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setMicEnabled(false);
  }, []);

  // Play demo script
  const startDemoScript = useCallback(() => {
    setUsingDemo(true);
    warningTriggeredRef.current = false;
    DEMO_SCRIPT.forEach(line => {
      const timeout = setTimeout(() => {
        addEntry(line.speaker, line.text);
      }, line.delay);
      demoTimeoutsRef.current.push(timeout);
    });
  }, [addEntry]);

  const clearDemoTimeouts = useCallback(() => {
    demoTimeoutsRef.current.forEach(clearTimeout);
    demoTimeoutsRef.current = [];
  }, []);

  const acceptCall = useCallback(() => {
    setCallState('active');
    setTranscript([]);
    setRiskHistory([]);
    setRiskAnalysis(null);
    setGuardianAlerted(false);
    setIncidentDone(false);
    setAutoTerminated(false);
    warningTriggeredRef.current = false;
    setShowWarning(false);
    setCallDuration(0);
  }, []);

  const startLiveCall = useCallback(async () => {
    acceptCall();
    await startMic();
  }, [acceptCall, startMic]);

  const terminateCall = useCallback(() => {
    stopMic();
    clearDemoTimeouts();
    setCallState('terminated');
    setShowWarning(false);
    setIsListening(false);
    setIncidentDone(true);
  }, [stopMic, clearDemoTimeouts]);

  const endCall = useCallback(() => {
    stopMic();
    clearDemoTimeouts();
    setCallState('ended');
    setShowWarning(false);
    setIsListening(false);
    setIncidentDone(true);
  }, [stopMic, clearDemoTimeouts]);

  const alertGuardian = useCallback(() => {
    setGuardianAlerted(true);
    // Persist to localStorage for guardian dashboard
    const alert = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      riskScore: riskAnalysis?.score ?? 0,
      riskLevel: riskAnalysis?.level ?? 'high-risk',
      threatCategories: riskAnalysis?.factors.filter(f => f.detected).map(f => f.label) ?? [],
      action: 'Manual alert by user',
      resolved: false,
    };
    try {
      const existing = JSON.parse(localStorage.getItem('elderguard-alerts') ?? '[]');
      localStorage.setItem('elderguard-alerts', JSON.stringify([alert, ...existing]));
    } catch {}
  }, [riskAnalysis]);

  const readWarning = useCallback(() => {
    const utter = new SpeechSynthesisUtterance(t.warning.voiceWarning);
    utter.lang = settings.language === 'ta' ? 'ta-IN' : settings.language === 'hi' ? 'hi-IN' : 'en-US';
    utter.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [settings.language, t]);

  const formatDuration = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const riskColor = (score: number) =>
    score <= 30 ? '#16a34a' : score <= 60 ? '#d97706' : score <= 80 ? '#ea580c' : '#dc2626';

  const riskLabel = (score: number) =>
    score <= 30 ? '🟢 SAFE' : score <= 60 ? '🟡 CAUTION' : score <= 80 ? '🟠 SUSPICIOUS' : '🔴 HIGH RISK';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      {/* Warning Modal */}
      {showWarning && (
        <WarningModal
          onEndCall={terminateCall}
          onAlertGuardian={alertGuardian}
          onReadAloud={readWarning}
          onDismiss={() => setShowWarning(false)}
          guardianAlerted={guardianAlerted}
          language={settings.language}
          riskScore={riskAnalysis?.score ?? 0}
        />
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            🛡️ Live Call Protection
          </h1>
          <p style={{ color: '#64748b' }}>Real-time scam detection using your microphone or demo conversation</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* LEFT: Call Interface */}
          <div>
            {/* IDLE */}
            {callState === 'idle' && (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', border: '3px solid #bfdbfe',
                }}>
                  <Phone size={44} color="#1e40af" />
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Active Call</h2>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Simulate an incoming call or wait for a real one to begin protection.
                </p>
                <button
                  onClick={() => setCallState('ringing')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', marginBottom: '0.75rem' }}
                >
                  <Phone size={18} /> Simulate Incoming Call
                </button>
                <button
                  onClick={startLiveCall}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
                >
                  <Mic size={18} /> Start Live Protection (Speakerphone)
                </button>
              </div>
            )}

            {/* RINGING */}
            {callState === 'ringing' && (
              <div className="card animate-slide-up" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    background: '#dbeafe', color: '#1e40af', padding: '4px 14px',
                    borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}>📞 {t.call.incoming}</span>
                </div>
                <div
                  style={{
                    width: 110, height: 110, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                  className="animate-pulse-green"
                >
                  <Phone size={48} color="white" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t.call.unknown}</h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '0.5rem' }}>+91 XXXXX XXXXX</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.75rem' }}>
                  🛡️ ElderGuard AI will analyze this call for scam activity
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={acceptCall} className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                    ✓ {t.call.accept}
                  </button>
                  <button onClick={() => setCallState('idle')} className="btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                    ✗ {t.call.reject}
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE */}
            {callState === 'active' && (
              <div className="card animate-slide-up">
                {/* Call header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '1.25rem', padding: '0.875rem 1rem',
                  background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                  borderRadius: '12px', border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{t.call.unknown}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span className="animate-blink" style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>⬤</span>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{t.call.inProgress}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>· {formatDuration(callDuration)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="status-badge status-active">🛡️ Protection: ACTIVE</div>
                  </div>
                </div>

                {/* Mic status */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: isListening ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${isListening ? '#bbf7d0' : '#e2e8f0'}`,
                  borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
                  fontSize: '0.85rem', fontWeight: 500, color: isListening ? '#16a34a' : '#64748b',
                }}>
                  {isListening ? (
                    <><Mic size={16} className="animate-blink" /> Microphone: Listening</>
                  ) : (
                    <><MicOff size={16} /> Microphone: Not active</>
                  )}
                  {usingDemo && <span style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 600 }}>🎬 DEMO MODE</span>}
                </div>

                {/* Transcript */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '6px' }}>
                    📝 Live Transcript
                  </div>
                  <div className="transcript-panel" ref={transcriptRef}>
                    {transcript.length === 0 && (
                      <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem', fontSize: '0.9rem' }}>
                        Transcript will appear here when speaking starts...
                      </div>
                    )}
                    {transcript.map((entry, i) => (
                      <div key={i} className={
                        entry.speaker === 'caller' ? 'transcript-caller' :
                        entry.speaker === 'user' ? 'transcript-user' : 'transcript-system'
                      }>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '2px' }}>
                          {entry.speaker === 'caller' ? '📞 Caller' : entry.speaker === 'user' ? '🧑 You' : '⚙️ System'}
                        </div>
                        <div style={{ color: entry.text.includes('[REDACTED]') ? '#dc2626' : 'inherit' }}>
                          {entry.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    🔒 Audio processed for scam detection only. Not stored.
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {!micEnabled && !usingDemo && (
                    <button onClick={startMic} className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 16px', minHeight: 'auto', flex: 1 }}>
                      <Mic size={16} /> Enable Mic
                    </button>
                  )}
                  {micEnabled && (
                    <button onClick={stopMic} className="btn-secondary" style={{ fontSize: '0.9rem', padding: '10px 16px', minHeight: 'auto', flex: 1 }}>
                      <MicOff size={16} /> Mute
                    </button>
                  )}
                  {!usingDemo && (
                    <button onClick={startDemoScript} className="btn-teal" style={{ fontSize: '0.9rem', padding: '10px 16px', minHeight: 'auto', flex: 1 }}>
                      🎬 {t.buttons.useDemo}
                    </button>
                  )}
                  <button onClick={endCall} className="btn-danger" style={{ fontSize: '0.9rem', padding: '10px 16px', minHeight: 'auto', flex: 1 }}>
                    <PhoneOff size={16} /> {t.call.end}
                  </button>
                </div>
              </div>
            )}

            {/* TERMINATED */}
            {(callState === 'terminated' || callState === 'ended') && (
              <div className="card animate-slide-up" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {callState === 'terminated' ? '🛑' : '📵'}
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: callState === 'terminated' ? '#dc2626' : '#374151' }}>
                  {callState === 'terminated' ? t.call.terminated : t.call.ended}
                </h2>
                {autoTerminated && (
                  <div style={{
                    background: '#fee2e2', border: '1px solid #fca5a5',
                    borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
                    fontSize: '0.85rem', color: '#dc2626', fontWeight: 600,
                  }}>
                    ⚡ Auto-End Protection triggered (Prototype Simulation)
                  </div>
                )}

                {/* Incident summary */}
                {riskAnalysis && (
                  <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>📋 Incident Summary</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Risk Score</span>
                        <span style={{ fontWeight: 700, color: riskColor(riskAnalysis.score) }}>{riskAnalysis.score}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Risk Level</span>
                        <span style={{ fontWeight: 700 }}>{riskLabel(riskAnalysis.score)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Call Duration</span>
                        <span style={{ fontWeight: 600 }}>{formatDuration(callDuration)}</span>
                      </div>
                      {riskAnalysis.sensitiveDetected && (
                        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '8px 12px' }}>
                          <span style={{ color: '#ea580c', fontSize: '0.9rem', fontWeight: 600 }}>
                            🔒 Sensitive information detected — REDACTED from records
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Detected threats */}
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Detected Threats:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {riskAnalysis.factors.filter(f => f.detected).map(f => (
                          <span key={f.id} style={{
                            background: '#fee2e2', color: '#dc2626', padding: '4px 10px',
                            borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                          }}>
                            ✓ {f.label}
                          </span>
                        ))}
                        {!riskAnalysis.factors.some(f => f.detected) && (
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>None detected</span>
                        )}
                      </div>
                    </div>

                    {guardianAlerted && (
                      <div style={{
                        marginTop: '0.75rem', background: '#f0fdf4',
                        border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 12px',
                        fontSize: '0.9rem', color: '#16a34a', fontWeight: 600,
                      }}>
                        👨‍👩‍👦 Guardian Alert Sent
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    setCallState('idle');
                    setTranscript([]);
                    setRiskAnalysis(null);
                    setRiskHistory([]);
                    setUsingDemo(false);
                    setGuardianAlerted(false);
                    setAutoTerminated(false);
                    setIncidentDone(false);
                    warningTriggeredRef.current = false;
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  New Call
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Risk Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <RiskMeter
              score={riskAnalysis?.score ?? 0}
              level={riskAnalysis?.level ?? 'safe'}
              factors={riskAnalysis?.factors ?? []}
              threshold={settings.riskThreshold}
            />

            {/* Guardian alert button */}
            {callState === 'active' && riskAnalysis && riskAnalysis.score > 40 && (
              <div className="card" style={{ borderColor: '#fca5a5', background: '#fff7ed' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.75rem' }}>
                  ⚠️ High Risk Detected
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowWarning(true)} className="btn-danger" style={{ flex: 1, fontSize: '0.9rem', padding: '10px', minHeight: 'auto', justifyContent: 'center' }}>
                    🚨 View Warning
                  </button>
                  <button
                    onClick={alertGuardian}
                    style={{
                      flex: 1, background: guardianAlerted ? '#16a34a' : '#7c3aed',
                      color: 'white', border: 'none', borderRadius: '12px',
                      padding: '10px', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.9rem', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '6px', transition: 'all 0.2s',
                    }}
                  >
                    {guardianAlerted ? '✓ Guardian Alerted' : '👨‍👩‍👦 Alert Guardian'}
                  </button>
                </div>
              </div>
            )}

            {/* Intents */}
            {riskAnalysis && riskAnalysis.intents.length > 0 && (
              <div className="card">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#374151' }}>
                  🧠 Detected Intents
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {riskAnalysis.intents.map(intent => (
                    <span key={intent} style={{
                      background: intent === 'SAFE_CONVERSATION' ? '#dcfce7' : '#fee2e2',
                      color: intent === 'SAFE_CONVERSATION' ? '#16a34a' : '#dc2626',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      {intent.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy notice */}
            <div className="card" style={{ border: '1px solid #bfdbfe', background: '#eff6ff' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>🔒</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e40af', marginBottom: '4px' }}>Privacy Notice</div>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', lineHeight: 1.6 }}>
                    Audio is processed locally for scam detection. OTPs, PINs, and CVVs are automatically redacted. No audio is stored by default.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
