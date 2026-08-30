'use client';

import type { ThreatFactor, RiskLevel } from '@/types';

interface Props {
  score: number;
  level: RiskLevel;
  factors: ThreatFactor[];
  threshold?: number;
}

const LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  'safe':       { label: 'SAFE',       color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', emoji: '🟢' },
  'caution':    { label: 'CAUTION',    color: '#d97706', bg: '#fef9c3', border: '#fde047', emoji: '🟡' },
  'suspicious': { label: 'SUSPICIOUS', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', emoji: '🟠' },
  'high-risk':  { label: 'HIGH RISK',  color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', emoji: '🔴' },
};

const BAR_COLOR: Record<RiskLevel, string> = {
  'safe':       'linear-gradient(90deg, #22c55e, #4ade80)',
  'caution':    'linear-gradient(90deg, #f59e0b, #fbbf24)',
  'suspicious': 'linear-gradient(90deg, #f97316, #fb923c)',
  'high-risk':  'linear-gradient(90deg, #dc2626, #ef4444)',
};

export default function RiskMeter({ score, level, factors, threshold = 80 }: Props) {
  const config = LEVEL_CONFIG[level];
  const detectedFactors = factors.filter(f => f.detected);

  return (
    <div
      className="card"
      style={{
        border: `2px solid ${config.border}`,
        background: `linear-gradient(135deg, white, ${config.bg}20)`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#374151' }}>
          📊 Risk Score
        </h3>
        <span
          style={{
            background: config.bg, color: config.color, border: `1px solid ${config.border}`,
            padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700,
          }}
        >
          {config.emoji} {config.label}
        </span>
      </div>

      {/* Score number */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{
          fontSize: '4rem', fontWeight: 900, color: config.color,
          lineHeight: 1, transition: 'color 0.4s ease',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {score}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>/ 100</div>
      </div>

      {/* Risk bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div className="risk-bar-track">
          <div
            className="risk-bar-fill"
            style={{
              width: `${score}%`,
              background: BAR_COLOR[level],
            }}
          />
          {/* Threshold marker */}
          {threshold && (
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${threshold}%`, width: '2px',
              background: '#dc2626', opacity: 0.7,
              borderRadius: '1px',
            }} />
          )}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px',
        }}>
          <span>0 — Safe</span>
          <span style={{ color: '#ea580c' }}>↑ Threshold: {threshold}</span>
          <span>100 — High Risk</span>
        </div>
      </div>

      {/* Risk levels legend */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '1rem', flexWrap: 'wrap',
      }}>
        {[
          { range: '0–30', label: 'Safe', color: '#16a34a', bg: '#dcfce7' },
          { range: '31–60', label: 'Caution', color: '#d97706', bg: '#fef9c3' },
          { range: '61–80', label: 'Suspicious', color: '#ea580c', bg: '#ffedd5' },
          { range: '81–100', label: 'High Risk', color: '#dc2626', bg: '#fee2e2' },
        ].map(r => (
          <div key={r.label} style={{
            background: r.bg, color: r.color,
            padding: '2px 8px', borderRadius: '999px',
            fontSize: '0.72rem', fontWeight: 600,
            flex: '1 1 auto', textAlign: 'center',
          }}>
            {r.range}
          </div>
        ))}
      </div>

      {/* Contributing factors */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: '6px' }}>
          Contributing Factors:
        </div>
        {factors.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No analysis yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {factors.map(f => (
              <div
                key={f.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 10px', borderRadius: '8px',
                  background: f.detected ? '#fee2e2' : '#f8fafc',
                  border: `1px solid ${f.detected ? '#fca5a5' : '#e2e8f0'}`,
                  opacity: f.detected ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{f.detected ? '✓' : '○'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: f.detected ? '#dc2626' : '#94a3b8' }}>
                    {f.label}
                  </div>
                </div>
                {f.detected && (
                  <span style={{
                    background: '#dc2626', color: 'white',
                    padding: '2px 8px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    +{f.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
