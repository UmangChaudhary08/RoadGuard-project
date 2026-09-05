import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, Building2, Car, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('driver');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    loginAs(selectedRole, email || undefined);
    navigate(selectedRole === 'authority' ? '/authority' : '/detect');
  };

  const handleQuickDemo = (role) => {
    loginAs(role);
    navigate(role === 'authority' ? '/authority' : '/detect');
  };

  return (
    <div className="app-container page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card card-elevated" style={{ maxWidth: '460px', width: '100%', padding: '36px 32px', backgroundColor: '#FFFFFF' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}>
            <Shield size={24} strokeWidth={2.4} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            ROADGUARD Portal
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: '4px' }}>
            Role-Based Access for Drivers & Municipal Authorities
          </p>
        </div>

        {/* 1-Click Quick Demo Access */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> 1-CLICK DEMO AUTHENTICATION:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => handleQuickDemo('driver')}
              className="card"
              style={{
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                backgroundColor: '#EFF6FF',
                borderColor: '#BFDBFE',
                cursor: 'pointer'
              }}
            >
              <Car size={22} color="#2563EB" />
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1E40AF' }}>Citizen Driver</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Upload & HUD Radar</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('authority')}
              className="card"
              style={{
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                backgroundColor: '#FEF2F2',
                borderColor: '#FECACA',
                cursor: 'pointer'
              }}
            >
              <Building2 size={22} color="#DC2626" />
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#991B1B' }}>City Authority</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Dispatch & Resolve</div>
              </div>
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '20px 0',
          color: '#94A3B8',
          fontSize: '0.78rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span>OR SIGN IN WITH CREDENTIALS</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
              ACCESS ROLE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedRole('driver')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: selectedRole === 'driver' ? '#EFF6FF' : '#FFFFFF',
                  color: selectedRole === 'driver' ? '#2563EB' : '#64748B',
                  border: `1.5px solid ${selectedRole === 'driver' ? '#2563EB' : '#E2E8F0'}`
                }}
              >
                Driver
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('authority')}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: selectedRole === 'authority' ? '#FEF2F2' : '#FFFFFF',
                  color: selectedRole === 'authority' ? '#DC2626' : '#64748B',
                  border: `1.5px solid ${selectedRole === 'authority' ? '#DC2626' : '#E2E8F0'}`
                }}
              >
                Authority / Admin
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                placeholder={selectedRole === 'authority' ? 'inspector@smartcity.gov.in' : 'driver@roadguard.io'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}
          >
            Enter Dashboard <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
