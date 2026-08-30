'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import type { GuardianAlert } from '@/types';

const DEMO_STATS = {
  callsProtected: 24,
  threatsDetected: 7,
  threatsPrevented: 6,
  highRiskCalls: 4,
  guardianAlerts: 3,
};

const DEMO_INCIDENTS = [
  { id: '1', time: 'Today, 10:32 AM', risk: 94, level: 'high-risk', category: 'OTP Scam', action: 'Call terminated' },
  { id: '2', time: 'Today, 09:15 AM', risk: 76, level: 'suspicious', category: 'KYC Scam', action: 'User warned' },
  { id: '3', time: 'Yesterday, 3:22 PM', risk: 88, level: 'high-risk', category: 'Remote Access', action: 'Call terminated' },
  { id: '4', time: 'Yesterday, 11:05 AM', risk: 12, level: 'safe', category: 'Normal Call', action: 'No action' },
  { id: '5', time: '2 days ago', risk: 71, level: 'suspicious', category: 'Family Scam', action: 'User warned' },
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
const LEVEL_LABEL: Record<string, string> = {
  'high-risk': '🔴 HIGH RISK',
  'suspicious': '🟠 SUSPICIOUS',
  'caution': '🟡 CAUTION',
  'safe': '🟢 SAFE',
};

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<GuardianAlert[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('elderguard-alerts') ?? '[]');
      setAlerts(stored);
    } catch {}
  }, []);

  // Combine demo + real alerts for incidents
  const stats = { ...DEMO_STATS, guardianAlerts: DEMO_STATS.guardianAlerts + alerts.length };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--eg-bg)' }}>
      <Header />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              📊 Security Dashboard
            </h1>
            <p style={{ color: '#64748b' }}>Your ElderGuard AI protection overview</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/protection" className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 18px', minHeight: 'auto' }}>
              <Shield size={16} /> Start Protection
            </Link>
            <Link href="/demo" className="btn-secondary" style={{ fontSize: '0.9rem', padding: '10px 18px', minHeight: 'auto' }}>
              🎬 Demo
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Calls Protected', value: stats.callsProtected, color: '#1e40af', bg: '#eff6ff', icon: '📞' },
            { label: 'Threats Detected', value: stats.threatsDetected, color: '#dc2626', bg: '#fee2e2', icon: '⚠️' },
            { label: 'Threats Prevented', value: stats.threatsPrevented, color: '#16a34a', bg: '#dcfce7', icon: '🛡️' },
            { label: 'High Risk Calls', value: stats.highRiskCalls, color: '#ea580c', bg: '#ffedd5', icon: '🔴' },
            { label: 'Guardian Alerts', value: stats.guardianAlerts, color: '#7c3aed', bg: '#f3e8ff', icon: '🔔' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background: `linear-gradient(135deg, white, ${s.bg}40)`, border: `1px solid ${s.bg}` }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Risk Distribution Visual */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            📈 Risk Distribution (Demo Data)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Safe (0–30)', count: 17, pct: 71, color: '#16a34a', bg: '#dcfce7' },
              { label: 'Caution (31–60)', count: 3, pct: 12, color: '#d97706', bg: '#fef9c3' },
              { label: 'Suspicious (61–80)', count: 2, pct: 8, color: '#ea580c', bg: '#ffedd5' },
              { label: 'High Risk (81–100)', count: 2, pct: 8, color: '#dc2626', bg: '#fee2e2' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '160px', fontSize: '0.85rem', fontWeight: 600, color: '#374151', flexShrink: 0 }}>
                  {r.label}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${r.pct}%`, height: '100%',
                      background: r.color, borderRadius: '999px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
                <div style={{
                  background: r.bg, color: r.color,
                  padding: '2px 10px', borderRadius: '999px',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {r.count} calls
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            🕒 Recent Incidents
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEMO_INCIDENTS.map(inc => (
              <div key={inc.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px',
                background: `${LEVEL_BG[inc.level]}50`,
                border: `1px solid ${LEVEL_BG[inc.level]}`,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: LEVEL_BG[inc.level], border: `2px solid ${LEVEL_COLOR[inc.level]}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>
                  {inc.level === 'safe' ? '✓' : '⚠'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{inc.category}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{inc.time} · {inc.action}</div>
                </div>
                <div style={{
                  background: LEVEL_BG[inc.level], color: LEVEL_COLOR[inc.level],
                  padding: '4px 12px', borderRadius: '999px',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {inc.risk}%
                </div>
              </div>
            ))}

            {/* Real session alerts */}
            {alerts.map(alert => (
              <div key={alert.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px',
                background: '#fff7f7', border: '1px solid #fca5a5',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: '#fee2e2', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.25rem',
                }}>
                  🔴
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Live Session Alert</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(alert.timestamp).toLocaleTimeString()} · Risk: {alert.riskScore}%
                  </div>
                </div>
                <div style={{
                  background: '#fee2e2', color: '#dc2626',
                  padding: '4px 12px', borderRadius: '999px',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                }}>
                  LIVE
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
