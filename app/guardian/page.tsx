'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import type { GuardianAlert } from '@/types';
import { CheckCircle, Bell, Clock, Shield } from 'lucide-react';

const DEMO_ALERTS: GuardianAlert[] = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 120000,
    riskScore: 92,
    riskLevel: 'high-risk',
    threatCategories: ['OTP Request', 'Banking Context', 'Urgency'],
    action: 'Call terminated automatically',
    resolved: false,
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 4 * 3600000,
    riskScore: 76,
    riskLevel: 'suspicious',
    threatCategories: ['KYC Scam', 'Threat/Fear Tactic'],
    action: 'User warned',
    resolved: true,
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 24 * 3600000,
    riskScore: 88,
    riskLevel: 'high-risk',
    threatCategories: ['Remote Access Request', 'Impersonation'],
    action: 'Call terminated automatically',
    resolved: true,
  },
];

const LEVEL_COLOR: Record<string, string> = {
  'high-risk': '#dc2626',
  'suspicious': '#ea580c',
  'caution': '#d97706',
  'safe': '#16a34a',
};
const LEVEL_BG: Record<string, string> = {
  'high-risk': '#fee2e2',
  'suspicious': '#ffedd5',
  'caution': '#fef9c3',
  'safe': '#dcfce7',
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function GuardianPage() {
  const [alerts, setAlerts] = useState<GuardianAlert[]>(DEMO_ALERTS);

  useEffect(() => {
    try {
      const stored: GuardianAlert[] = JSON.parse(localStorage.getItem('elderguard-alerts') ?? '[]');
      setAlerts([...stored, ...DEMO_ALERTS]);
    } catch {}
  }, []);

  const markResolved = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const unresolved = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a => a.resolved);
  const lastEvent = alerts[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            👨‍👩‍👦 Guardian Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>Monitor your protected user's safety in real time</p>
        </div>

        {/* Protected user status */}
        <div className="card" style={{ marginBottom: '1.5rem', border: '2px solid #bbf7d0', background: 'linear-gradient(135deg, #f0fdf4, white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', flexShrink: 0,
            }}>
              👴
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>
                Protected User Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-badge status-safe animate-pulse-green">🟢 SAFE</span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>· ElderGuard AI Active</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '2px' }}>Last protection event</div>
              <div style={{ fontWeight: 700, color: '#374151', fontSize: '0.95rem' }}>
                {lastEvent ? timeAgo(lastEvent.timestamp) : 'No events yet'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Alerts', value: alerts.length, color: '#dc2626', icon: '🚨' },
            { label: 'Unresolved', value: unresolved.length, color: '#ea580c', icon: '⚠️' },
            { label: 'Resolved', value: resolved.length, color: '#16a34a', icon: '✓' },
            { label: 'High Risk', value: alerts.filter(a => a.riskLevel === 'high-risk').length, color: '#7c3aed', icon: '🔴' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
              <div className="stat-number" style={{ color: s.color, fontSize: '2rem' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Unresolved alerts */}
        {unresolved.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem', border: '2px solid #fca5a5' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#dc2626', marginBottom: '1rem' }}>
              🚨 Active Alerts ({unresolved.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {unresolved.map(alert => (
                <div key={alert.id} style={{
                  background: LEVEL_BG[alert.riskLevel],
                  border: `1px solid ${LEVEL_COLOR[alert.riskLevel]}40`,
                  borderLeft: `4px solid ${LEVEL_COLOR[alert.riskLevel]}`,
                  borderRadius: '10px', padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: LEVEL_COLOR[alert.riskLevel], marginBottom: '2px' }}>
                        🚨 HIGH RISK CALL DETECTED
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {timeAgo(alert.timestamp)}
                      </div>
                    </div>
                    <div style={{
                      background: LEVEL_COLOR[alert.riskLevel], color: 'white',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {alert.riskScore}%
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Threat Categories:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {alert.threatCategories.map(c => (
                        <span key={c} style={{
                          background: 'white', color: LEVEL_COLOR[alert.riskLevel],
                          padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                          border: `1px solid ${LEVEL_COLOR[alert.riskLevel]}30`,
                        }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '10px' }}>
                    <strong>Action taken:</strong> {alert.action}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => markResolved(alert.id)}
                      style={{
                        background: '#16a34a', color: 'white', border: 'none',
                        borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                        fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <CheckCircle size={14} /> Mark Resolved
                    </button>
                    <div style={{
                      background: '#fef9c3', color: '#a16207',
                      padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      🔒 No sensitive data in this record
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved alerts */}
        {resolved.length > 0 && (
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#374151', marginBottom: '1rem' }}>
              ✓ Resolved Alerts ({resolved.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resolved.map(alert => (
                <div key={alert.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: '#f8fafc', border: '1px solid #e2e8f0', opacity: 0.8,
                }}>
                  <CheckCircle size={18} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                      {alert.riskLevel.toUpperCase()} · {alert.riskScore}%
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {timeAgo(alert.timestamp)} · {alert.action}
                    </div>
                  </div>
                  <span style={{
                    background: '#dcfce7', color: '#16a34a',
                    padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                  }}>
                    Resolved
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>All Clear</h2>
            <p style={{ color: '#64748b' }}>No alerts have been triggered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
