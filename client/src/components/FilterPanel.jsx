import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  return (
    <div className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.96rem', fontWeight: 700, color: '#0F172A' }}>
          <Filter size={16} color="#2563EB" /> Filter Hazards
        </h4>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            color: '#64748B',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500
          }}
          title="Reset all filters"
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {/* Severity Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
            SEVERITY TIER
          </label>
          <select
            value={filters.severity || 'ALL'}
            onChange={(e) => onFilterChange({ severity: e.target.value })}
            className="select-control"
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High (Craters)</option>
            <option value="MEDIUM">Medium (Disruptions)</option>
            <option value="SMALL">Small (Fissures)</option>
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
            STATUS
          </label>
          <select
            value={filters.status || 'ALL'}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="select-control"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified Hazards</option>
            <option value="PENDING">Pending Verification</option>
            <option value="RESOLVED">Resolved / Repaired</option>
            <option value="DETECTED">Newly Detected</option>
          </select>
        </div>

        {/* Water Presence */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
            WATER ACCUMULATION
          </label>
          <select
            value={filters.waterPresent ?? 'ALL'}
            onChange={(e) => onFilterChange({ waterPresent: e.target.value })}
            className="select-control"
          >
            <option value="ALL">All Conditions</option>
            <option value="true">Flooded / Water Present</option>
            <option value="false">Dry Surface Only</option>
          </select>
        </div>

        {/* Min Danger Score Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              MIN DANGER SCORE
            </label>
            <span className="metric-mono" style={{ fontSize: '0.84rem', color: '#2563EB', fontWeight: 700 }}>
              ≥ {filters.minDangerScore || 0}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={filters.minDangerScore || 0}
            onChange={(e) => onFilterChange({ minDangerScore: e.target.value })}
            style={{
              width: '100%',
              accentColor: '#2563EB',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
}
