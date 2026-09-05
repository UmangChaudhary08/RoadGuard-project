import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import DemoBanner from './components/DemoBanner';
import Home from './pages/Home';
import DriverDashboard from './pages/DriverDashboard';
import SmartMap from './pages/SmartMap';
import AuthorityDashboard from './pages/AuthorityDashboard';
import Login from './pages/Login';
import { Shield, Heart } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        {/* Demo Mode Notice Banner */}
        <DemoBanner />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<DriverDashboard />} />
            <Route path="/map" element={<SmartMap />} />
            <Route path="/authority" element={<AuthorityDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Clean Light Smart City Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#FFFFFF',
          padding: '24px 24px',
          color: '#64748B',
          fontSize: '0.82rem'
        }}>
          <div style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Shield size={13} strokeWidth={2.4} />
              </div>
              <span style={{ color: '#0F172A', fontWeight: 700 }}>ROADGUARD</span>
              <span>— AI Pothole Detection & Real-Time Warning System</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Built with <Heart size={12} color="#DC2626" fill="#DC2626" /> for Smart City Road Safety
              </span>
              <span>•</span>
              <span className="metric-mono" style={{ color: '#2563EB', fontWeight: 600 }}>v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
