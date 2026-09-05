import React from 'react';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#2563EB',
  bgColor = '#EFF6FF',
  trend,
  trendText
}) {
  return (
    <div
      className="card card-elevated"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      {/* Header: Title and Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.01em' }}>
          {title}
        </span>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: bgColor || '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}
        >
          {Icon && <Icon size={20} strokeWidth={2.2} />}
        </div>
      </div>

      {/* Main Metric Value */}
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '6px' }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Footer / Trend Indicator */}
      {trendText && (
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            color: trend === 'down' ? '#16A34A' : '#DC2626',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            {trendText}
          </span>
          <span style={{ color: '#94A3B8' }}>vs last week</span>
        </div>
      )}
    </div>
  );
}
