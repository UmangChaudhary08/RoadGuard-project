import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  ScanSearch,
  MapPin,
  LayoutDashboard,
  Building2,
  Menu,
  X,
  ArrowRightLeft,
  Radio,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const { role, switchRole, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Detection', path: '/detect', icon: ScanSearch },
    { name: 'Smart Map', path: '/map', icon: MapPin },
    { name: 'Authority Portal', path: '/authority', icon: Building2 },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            color: '#FFFFFF'
          }}>
            <Shield size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: '#0F172A'
              }}>
                ROAD<span style={{ color: '#2563EB' }}>GUARD</span>
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                AI
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
              Smart City Road Safety
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '4px'
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#2563EB' : '#64748B',
                  backgroundColor: active ? 'var(--light-blue)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }
                }}
              >
                <Icon size={17} color={active ? '#2563EB' : '#64748B'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Role Switcher & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={switchRole}
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            title="Switch between Citizen Driver and City Authority views"
          >
            <ArrowRightLeft size={13} color="#2563EB" />
            <span style={{ color: '#64748B' }}>Role:</span>
            <span style={{
              fontWeight: 700,
              color: role === 'authority' ? '#DC2626' : '#2563EB',
              textTransform: 'uppercase'
            }}>
              {role}
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F1F5F9',
              color: '#0F172A',
              padding: '8px',
              borderRadius: '8px'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#2563EB' : '#0F172A',
                  backgroundColor: active ? 'var(--light-blue)' : 'transparent'
                }}
              >
                <Icon size={18} color={active ? '#2563EB' : '#64748B'} />
                {link.name}
              </Link>
            );
          })}

          <div style={{
            marginTop: '8px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Active Account:</span>
            <button
              onClick={() => { switchRole(); setMobileMenuOpen(false); }}
              className="badge badge-info"
              style={{ padding: '6px 12px' }}
            >
              Switch to {role === 'driver' ? 'Authority' : 'Driver'}
            </button>
          </div>
        </div>
      )}

      {/* Breakpoint styling */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
