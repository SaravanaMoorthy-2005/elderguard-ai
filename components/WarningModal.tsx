'use client';

import type { Language } from '@/lib/translations';
import { getTranslations } from '@/lib/translations';

interface Props {
  onEndCall: () => void;
  onAlertGuardian: () => void;
  onReadAloud: () => void;
  onDismiss: () => void;
  guardianAlerted: boolean;
  language: Language;
  riskScore: number;
}

export default function WarningModal({
  onEndCall, onAlertGuardian, onReadAloud, onDismiss,
  guardianAlerted, language, riskScore,
}: Props) {
  const t = getTranslations(language);

  return (
    <div className="warning-overlay" onClick={onDismiss}>
      <div className="warning-card animate-pulse-red" onClick={e => e.stopPropagation()}>
        {/* Top alert emoji */}
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem', lineHeight: 1 }}>🚨</div>

        <div style={{
          background: '#dc2626', color: 'white', padding: '6px 20px',
          borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700,
          letterSpacing: '0.1em', display: 'inline-block', marginBottom: '1rem',
        }}>
          RISK SCORE: {riskScore}%
        </div>

        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 900, color: '#dc2626',
          marginBottom: '0.5rem', letterSpacing: '-0.02em',
        }}>
          POSSIBLE SCAM CALL
        </h1>

        <p style={{
          fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
          fontWeight: 800, color: '#0f172a',
          marginBottom: '0.5rem',
        }}>
          STOP.
        </p>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 700, color: '#dc2626',
          marginBottom: '1.5rem',
          background: '#fee2e2', padding: '12px 16px',
          borderRadius: '10px', border: '2px solid #fca5a5',
        }}>
          {t.warning.doNotShare}
        </p>

        {/* Tamil translation */}
        {language === 'en' && (
          <p style={{
            fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem',
            fontStyle: 'italic',
          }}>
            கவனம்! OTP, PIN அல்லது கடவுச்சொல்லை பகிர வேண்டாம்.
          </p>
        )}

        <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          This caller appears to be requesting confidential information.
          <br />
          <strong>Do not continue this call.</strong>
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onEndCall}
            className="btn-danger"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.15rem', padding: '1rem' }}
          >
            🛑 {t.warning.endCall}
          </button>

          <button
            onClick={onAlertGuardian}
            style={{
              width: '100%', padding: '1rem',
              background: guardianAlerted ? '#16a34a' : '#7c3aed',
              color: 'white', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {guardianAlerted ? '✓ Guardian Alerted!' : `👨‍👩‍👦 ${t.warning.alertGuardian}`}
          </button>

          <button
            onClick={onReadAloud}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}
          >
            {t.warning.readAloud}
          </button>

          <button
            onClick={onDismiss}
            style={{
              background: 'none', border: 'none', color: '#94a3b8',
              fontSize: '0.85rem', cursor: 'pointer', padding: '6px',
            }}
          >
            Dismiss warning (not recommended)
          </button>
        </div>
      </div>
    </div>
  );
}
