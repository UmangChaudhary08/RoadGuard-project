import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Droplets,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HotspotTable({ hotspots = [], onStatusUpdate, onInspect }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleResolve = async (id) => {
    setUpdatingId(id);
    try {
      await onStatusUpdate(id, 'RESOLVED');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerify = async (id) => {
    setUpdatingId(id);
    try {
      await onStatusUpdate(id, 'VERIFIED');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!hotspots || hotspots.length === 0) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748B', backgroundColor: '#FFFFFF' }}>
        No road hazards match current filter criteria.
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {/* Table Header Ribbon */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
            Hotspot Priority Repair Queue
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Ranked by AI Danger Score • Prioritize municipal dispatch to immediate hazard zones
          </p>
        </div>
        <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
          {hotspots.length} Active Records
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', color: '#64748B', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Location / Sector</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Risk & Danger</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Water</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Confidence</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right' }}>Authority Action</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((item) => {
              const isResolved = item.status === 'RESOLVED';
              const isVerified = item.status === 'VERIFIED';
              const isCrit = item.dangerScore >= 81;
              const isHigh = item.dangerScore >= 61 && item.dangerScore < 81;

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color 0.15s ease',
                    backgroundColor: isResolved ? '#F0FDF4' : '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    if (!isResolved) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isResolved) e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {/* Location Column */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, color: isResolved ? '#64748B' : '#0F172A' }}>
                      {item.locationName || `Road Zone #${item.id.slice(-4)}`}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94A3B8', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span>Lat: {item.latitude.toFixed(4)}</span>
                      <span>Lng: {item.longitude.toFixed(4)}</span>
                      {item.roadType && <span>• {item.roadType}</span>}
                    </div>
                  </td>

                  {/* Risk & Danger Score */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${
                        isCrit ? 'badge-danger' : isHigh ? 'badge-warning' : item.dangerScore >= 31 ? 'badge-warning' : 'badge-success'
                      }`}>
                        {item.riskLevel || (isCrit ? 'CRITICAL' : isHigh ? 'HIGH' : 'MEDIUM')}
                      </span>
                      <span className="metric-mono" style={{
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: isCrit ? '#DC2626' : isHigh ? '#EA580C' : '#D97706'
                      }}>
                        {item.dangerScore}/100
                      </span>
                    </div>
                  </td>

                  {/* Water Status */}
                  <td style={{ padding: '14px 16px' }}>
                    {item.waterPresent ? (
                      <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                        <Droplets size={12} color="#0EA5E9" /> Flooded
                      </span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Dry</span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td style={{ padding: '14px 16px' }}>
                    <div className="metric-mono" style={{ color: '#0F172A' }}>
                      {Math.round((item.confidence || 0.9) * 100)}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {item.reportCount || 1} report{(item.reportCount || 1) > 1 ? 's' : ''}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 16px' }}>
                    {isResolved ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Resolved
                      </span>
                    ) : isVerified ? (
                      <span className="badge badge-info">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        <AlertTriangle size={12} /> Pending
                      </span>
                    )}
                  </td>

                  {/* Authority Actions */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      {onInspect && (
                        <button
                          onClick={() => onInspect(item)}
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                          title="Inspect hazard details"
                        >
                          <Eye size={13} /> View
                        </button>
                      )}

                      {!isVerified && !isResolved && (
                        <button
                          onClick={() => handleVerify(item.id)}
                          disabled={updatingId === item.id}
                          className="btn-outline-blue"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        >
                          <ShieldCheck size={13} /> Verify
                        </button>
                      )}

                      {!isResolved ? (
                        <button
                          onClick={() => handleResolve(item.id)}
                          disabled={updatingId === item.id}
                          className="btn-success"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                        >
                          <CheckCircle2 size={13} /> Resolve
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
                          Repaired
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
