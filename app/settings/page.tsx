'use client';

import Header from '@/components/Header';
import { useSettings } from '@/hooks/useSettings';
import type { AppSettings } from '@/types';
import { Volume2, VolumeX, Shield, Eye, Globe, Type } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSetting } = useSettings();

  const testVoice = (lang: AppSettings['language']) => {
    const msgs: Record<typeof lang, string> = {
      en: 'Warning! This may be a scam call. Do not share your OTP or password.',
      ta: 'கவனம். இது மோசடி அழைப்பாக இருக்கலாம். உங்கள் OTP அல்லது கடவுச்சொல்லை பகிர வேண்டாம்.',
      hi: 'चेतावनी! यह एक धोखाधड़ी कॉल हो सकती है। अपना OTP या पासवर्ड साझा न करें।',
    };
    const utter = new SpeechSynthesisUtterance(msgs[lang]);
    utter.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    utter.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          ⚙️ Accessibility & Safety Settings
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Customize ElderGuard AI to suit your needs and accessibility requirements
        </p>

        {/* Language */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Globe size={20} color="#1e40af" />
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Language</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(['en', 'ta', 'hi'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => updateSetting('language', lang)}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  border: `2px solid ${settings.language === lang ? '#1e40af' : '#e2e8f0'}`,
                  background: settings.language === lang ? '#eff6ff' : 'white',
                  color: settings.language === lang ? '#1e40af' : '#374151',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: '0.95rem',
                }}
              >
                {lang === 'en' ? '🇬🇧 English' : lang === 'ta' ? '🇮🇳 Tamil' : '🇮🇳 Hindi'}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Type size={20} color="#1e40af" />
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Text Size</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {([
              { value: 'small', label: 'Small', size: '14px' },
              { value: 'medium', label: 'Medium', size: '16px' },
              { value: 'large', label: 'Large', size: '18px' },
              { value: 'extra-large', label: 'Extra Large', size: '22px' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => updateSetting('textSize', opt.value)}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  border: `2px solid ${settings.textSize === opt.value ? '#1e40af' : '#e2e8f0'}`,
                  background: settings.textSize === opt.value ? '#eff6ff' : 'white',
                  color: settings.textSize === opt.value ? '#1e40af' : '#374151',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: opt.size,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Eye size={20} color="#1e40af" />
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Display & Accessibility</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'highContrast' as const, label: 'High Contrast Mode', desc: 'Increases contrast for better visibility' },
              { key: 'simpleMode' as const, label: 'Simple Mode', desc: 'Streamlined interface for easier navigation' },
            ].map(opt => (
              <div key={opt.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{opt.desc}</div>
                </div>
                <button
                  onClick={() => updateSetting(opt.key, !settings[opt.key])}
                  style={{
                    width: 56, height: 28, borderRadius: '999px',
                    background: settings[opt.key] ? '#1e40af' : '#e2e8f0',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: 'background 0.2s', flexShrink: 0,
                  }}
                  aria-label={opt.label}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 3,
                    left: settings[opt.key] ? 30 : 4,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Alerts */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Volume2 size={20} color="#1e40af" />
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Voice Alerts</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Enable Voice Alerts</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Read warnings aloud when scam is detected</div>
            </div>
            <button
              onClick={() => updateSetting('voiceAlerts', !settings.voiceAlerts)}
              style={{
                width: 56, height: 28, borderRadius: '999px',
                background: settings.voiceAlerts ? '#1e40af' : '#e2e8f0',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3,
                left: settings.voiceAlerts ? 30 : 4,
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
          <button
            onClick={() => testVoice(settings.language)}
            className="btn-secondary"
            style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: 'auto' }}
          >
            <Volume2 size={16} /> Test Voice Alert
          </button>
        </div>

        {/* Auto-End */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Shield size={20} color="#1e40af" />
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Auto-End Protection</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Auto-End Call</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Automatically end simulated call when risk threshold is crossed</div>
            </div>
            <button
              onClick={() => updateSetting('autoEnd', !settings.autoEnd)}
              style={{
                width: 56, height: 28, borderRadius: '999px',
                background: settings.autoEnd ? '#1e40af' : '#e2e8f0',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3,
                left: settings.autoEnd ? 30 : 4,
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
          {settings.autoEnd && (
            <div style={{ fontSize: '0.8rem', color: '#16a34a', background: '#dcfce7', padding: '6px 12px', borderRadius: '8px' }}>
              ✓ Auto-End Protection is ON (Prototype Simulation)
            </div>
          )}
        </div>

        {/* Risk Threshold */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>🎯 Risk Threshold</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Trigger intervention when risk score reaches:
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[60, 70, 80, 90].map(val => (
              <button
                key={val}
                onClick={() => updateSetting('riskThreshold', val)}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  border: `2px solid ${settings.riskThreshold === val ? '#1e40af' : '#e2e8f0'}`,
                  background: settings.riskThreshold === val ? '#eff6ff' : 'white',
                  color: settings.riskThreshold === val ? '#1e40af' : '#374151',
                  fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  fontSize: '1rem',
                }}
              >
                {val}%
              </button>
            ))}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
            Current threshold: <strong style={{ color: '#1e40af' }}>{settings.riskThreshold}%</strong>
            {settings.riskThreshold <= 60 && ' — Sensitive: triggers earlier'}
            {settings.riskThreshold >= 90 && ' — Relaxed: only extreme risk triggers'}
          </div>
        </div>

        {/* Current settings summary */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #bfdbfe' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: '#1e40af' }}>
            ✓ Current Settings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
            <div><span style={{ color: '#64748b' }}>Language:</span> <strong>{settings.language.toUpperCase()}</strong></div>
            <div><span style={{ color: '#64748b' }}>Text Size:</span> <strong>{settings.textSize}</strong></div>
            <div><span style={{ color: '#64748b' }}>High Contrast:</span> <strong>{settings.highContrast ? 'ON' : 'OFF'}</strong></div>
            <div><span style={{ color: '#64748b' }}>Voice Alerts:</span> <strong>{settings.voiceAlerts ? 'ON' : 'OFF'}</strong></div>
            <div><span style={{ color: '#64748b' }}>Auto-End:</span> <strong>{settings.autoEnd ? 'ON' : 'OFF'}</strong></div>
            <div><span style={{ color: '#64748b' }}>Threshold:</span> <strong>{settings.riskThreshold}%</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
