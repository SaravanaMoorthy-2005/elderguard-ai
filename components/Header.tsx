'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/protection', label: 'Protection' },
  { href: '/demo', label: 'Demo' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/guardian', label: 'Guardian' },
  { href: '/settings', label: 'Settings' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 16px rgba(30,64,175,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: '#1e40af',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span>ElderGuard AI</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 500, color: '#64748b', letterSpacing: '0.05em' }}>
              LISTEN · DETECT · PROTECT
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/protection" className="btn-primary" style={{ marginLeft: '8px', fontSize: '0.9rem', padding: '8px 16px', minHeight: 'auto' }}>
            🛡 Protect Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1e40af',
            padding: '8px',
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? ' active' : ''}`}
              style={{ display: 'block', padding: '12px 16px' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/protection"
            className="btn-primary"
            style={{ marginTop: '8px', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            🛡 Start Protection
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
