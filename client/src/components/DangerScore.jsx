import React from 'react';
import { AlertCircle, Droplets, Moon, CloudRain, Car } from 'lucide-react';

export default function DangerScore({ score = 0, riskLevel = "MEDIUM", warningPriority = "CAUTION", breakdown }) {
  // Determine color theme based on score
  let strokeColor = '#16A34A';
  let badgeClass = 'badge-success';
  let lightBg = '#F0FDF4';

  if (score >= 81) {
    strokeColor = '#DC2626';
    badgeClass = 'badge-danger';
    lightBg = '#FEF2F2';
  } else if (score >= 61) {
    strokeColor = '#EA580C';
    badgeClass = 'badge-warning';
    lightBg = '#FFFBEB';
  } else if (score >= 31) {
    strokeColor = '#F59E0B';
    badgeClass = 'badge-warning';
    lightBg = '#FFFBEB';
  } else {
    strokeColor = '#16A34A';
    badgeClass = 'badge-success';
    lightBg = '#F0FDF4';
  }

  // Circular SVG gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card" style={{ padding: '22px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
      <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
        AI Composite Danger Score
      </div>

      {/* Circular Progress Gauge */}
      <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 14px' }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Active Score Arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out'
            }}
          />
        </svg>

        {/* Center Readout */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="metric-mono" style={{ fontSize: '2.4rem', lineHeight: 1, color: '#0F172A', fontWeight: 800 }}>
            {score}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginTop: '2px' }}>/ 100</span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div style={{ marginBottom: '14px' }}>
        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.84rem', padding: '5px 14px' }}>
          <AlertCircle size={14} />
          {riskLevel} RISK • {warningPriority}
        </span>
      </div>

      {/* Contributing Factors Breakdown */}
      {breakdown && (
        <div style={{
          marginTop: '14px',
          paddingTop: '14px',
          borderTop: '1px solid #F1F5F9',
          textAlign: 'left',
          fontSize: '0.8rem'
        }}>
          <div style={{ color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            Risk Factor Contribution:
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Base Cavity Size (35%):</span>
            <span className="metric-mono" style={{ color: strokeColor, fontWeight: 700 }}>
              +{breakdown.baseSeverity} pts
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={12} color="#0EA5E9" /> Water Pooling (+20%):
            </span>
            <span className="metric-mono" style={{ color: breakdown.water > 0 ? '#0EA5E9' : '#94A3B8', fontWeight: 700 }}>
              +{breakdown.water} pts
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Moon size={12} color="#7C3AED" /> Night Visibility (+10%):
            </span>
            <span className="metric-mono" style={{ color: breakdown.night > 0 ? '#7C3AED' : '#94A3B8', fontWeight: 700 }}>
              +{breakdown.night} pts
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudRain size={12} color="#0EA5E9" /> Rain Slip Surface (+15%):
            </span>
            <span className="metric-mono" style={{ color: breakdown.rain > 0 ? '#0EA5E9' : '#94A3B8', fontWeight: 700 }}>
              +{breakdown.rain} pts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
