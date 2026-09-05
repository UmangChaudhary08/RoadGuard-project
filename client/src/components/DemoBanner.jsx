import React, { useState } from 'react';
import { Info, X, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      backgroundColor: 'var(--light-blue)',
      borderBottom: '1px solid #BFDBFE',
      padding: '7px 16px',
      fontSize: '0.82rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className="badge badge-info" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
          <Cpu size={12} /> DEMO MODE
        </span>
        <span style={{ color: '#1E40AF', fontWeight: 500 }}>
          Interactive Demo Active with Preloaded Delhi NCR Hotspots & Simulated AI Fallback
        </span>
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            background: 'none',
            color: '#2563EB',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'underline',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0
          }}
        >
          <Info size={12} /> System details
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', color: '#64748B', padding: '2px', display: 'flex' }}
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>

      {showInfo && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '16px',
          right: '16px',
          maxWidth: '540px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 18px',
          marginTop: '6px',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1100,
          color: '#334155',
          fontSize: '0.82rem',
          lineHeight: '1.5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <ShieldAlert size={16} color="#2563EB" /> ROADGUARD Demo & Production Setup
            </strong>
            <button onClick={() => setShowInfo(false)} style={{ background: 'none', color: '#64748B' }}>
              <X size={14} />
            </button>
          </div>
          <p style={{ marginBottom: '8px', color: '#475569' }}>
            The application is operating in fully functional <strong>Demo Mode</strong>:
          </p>
          <ul style={{ paddingLeft: '18px', marginBottom: '10px', color: '#475569' }}>
            <li><strong>AI Detection:</strong> Simulated YOLO bounding boxes & water pooling inference.</li>
            <li><strong>Smart Map:</strong> Powered by clean CartoDB Voyager light tiles (no Google API key required).</li>
            <li><strong>Production Switch:</strong> Add your trained <code>best.pt</code> to <code>ml/models/</code> and set <code>MOCK_AI_MODE=false</code> in <code>.env</code>.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
