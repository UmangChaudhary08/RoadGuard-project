import React, { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Navigation, Volume2, VolumeX, X, ShieldAlert } from 'lucide-react';

export default function WarningCard({ hazard, onDismiss }) {
  const [muted, setMuted] = useState(false);

  if (!hazard) return null;

  const distance = hazard.distanceMeters ?? 150;
  const isImmediate = distance < 100;
  const isHighRisk = hazard.dangerScore >= 81 || hazard.severity === 'HIGH';
  const isMediumRisk = hazard.dangerScore >= 31 && hazard.dangerScore < 81;

  // Colors based on risk level
  let themeColor = '#16A34A';
  let bgColor = '#F0FDF4';
  let borderColor = '#BBF7D0';
  let badgeStyle = 'badge-success';

  if (isHighRisk) {
    themeColor = '#DC2626';
    bgColor = '#FEF2F2';
    borderColor = '#FECACA';
    badgeStyle = 'badge-danger';
  } else if (isMediumRisk) {
    themeColor = '#D97706';
    bgColor = '#FFFBEB';
    borderColor = '#FDE68A';
    badgeStyle = 'badge-warning';
  }

  // Beep alert using Web Audio API on critical warning appearance if not muted
  useEffect(() => {
    if (!muted && isImmediate) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {
        // audio context prevented by browser autoplay policy
      }
    }
  }, [hazard?.id, isImmediate, muted]);

  return (
    <div
      className={isImmediate ? 'pulse-hazard' : ''}
      style={{
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        zIndex: 50,
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: themeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: `0 4px 10px ${isHighRisk ? 'rgba(220, 38, 38, 0.3)' : 'rgba(217, 119, 6, 0.25)'}`,
            flexShrink: 0
          }}>
            <AlertTriangle size={22} strokeWidth={2.4} />
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: themeColor,
              textTransform: 'uppercase'
            }}>
              <span>{isImmediate ? '⚠ IMMEDIATE HAZARD' : isHighRisk ? '⚠ HIGH-RISK POTHOLE AHEAD' : 'CAUTION: ROAD DISRUPTION'}</span>
              <span className={`badge ${badgeStyle}`} style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                {hazard.dangerScore || 87}/100 Risk
              </span>
            </div>

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              {hazard.locationName || 'Hazard on Approaching Lane'}
            </h4>
          </div>
        </div>

        {/* Action icons: Mute & Dismiss */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setMuted(!muted)}
            style={{
              backgroundColor: '#FFFFFF',
              border: `1px solid ${borderColor}`,
              color: muted ? '#94A3B8' : '#2563EB',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={muted ? 'Unmute Audio Alert' : 'Mute Audio Alert'}
            aria-label="Toggle audio alert"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${borderColor}`,
                color: '#64748B',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Dismiss warning"
              aria-label="Dismiss warning"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Highlights & Telemetry bar */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem' }}>
            <Navigation size={15} color="#2563EB" />
            <span style={{ color: '#64748B' }}>Distance:</span>
            <strong className="metric-mono" style={{ color: '#0F172A', fontSize: '1rem' }}>
              {distance} m Ahead
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem' }}>
            <span style={{ color: '#64748B' }}>AI Confidence:</span>
            <strong className="metric-mono" style={{ color: '#2563EB' }}>
              {Math.round((hazard.confidence || 0.94) * 100)}%
            </strong>
          </div>
        </div>

        {hazard.waterPresent && (
          <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
            <Droplets size={12} color="#0EA5E9" /> WATER PRESENT
          </span>
        )}
      </div>
    </div>
  );
}
