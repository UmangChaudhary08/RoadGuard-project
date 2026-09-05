import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/StatsCard';
import HotspotTable from '../components/HotspotTable';
import PotholeMap from '../components/PotholeMap';
import FilterPanel from '../components/FilterPanel';
import { fetchReports, fetchDashboardStats, updateReportStatus } from '../services/api';
import {
  ShieldAlert,
  Flame,
  Droplets,
  CheckCircle2,
  Building2,
  Download,
  RefreshCw,
  Map as MapIcon,
  ListOrdered,
  Sparkles,
  SlidersHorizontal,
  X,
  ScanSearch
} from 'lucide-react';

export default function AuthorityDashboard() {
  const { user, isAuthority, loginAs } = useAuth();

  const [stats, setStats] = useState({
    totalPotholes: 2488,
    activeHotspots: 191,
    waterFilledPotholes: 76,
    verifiedConfidence: '93%'
  });

  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInspectHazard, setSelectedInspectHazard] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'map'
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const [filters, setFilters] = useState({
    severity: 'ALL',
    status: 'ALL',
    waterPresent: 'ALL',
    minDangerScore: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetchDashboardStats().catch(() => ({ stats: null })),
        fetchReports(filters).catch(() => ({ reports: [] }))
      ]);

      if (statsRes.stats) {
        setStats(statsRes.stats);
      }
      if (reportsRes.reports) {
        setHotspots(reportsRes.reports);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateReportStatus(id, newStatus);
      loadDashboardData();
    } catch (err) {
      alert(`Failed to update hazard status: ${err.message}`);
    }
  };

  // CSV export for municipal road repair dispatch teams
  const exportRepairCSV = () => {
    const headers = ['ID', 'Location', 'Latitude', 'Longitude', 'DangerScore', 'Severity', 'Water', 'Status', 'Reports'];
    const rows = hotspots.map(h => [
      h.id,
      `"${h.locationName || 'Road Sector'}"`,
      h.latitude,
      h.longitude,
      h.dangerScore,
      h.severity,
      h.waterPresent ? 'YES' : 'NO',
      h.status,
      h.reportCount || 1
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roadguard_dispatch_queue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container page-enter" style={{ paddingBottom: '70px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
              <Building2 size={13} /> SMART CITY CONTROL CENTER
            </span>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Public Works Department (PWD)
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            Authority Dashboard
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748B', marginTop: '2px' }}>
            Monitor and prioritize road hazards across the city.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <SlidersHorizontal size={15} color="#2563EB" /> Filters
          </button>

          <button
            onClick={exportRepairCSV}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            title="Export priority repair queue as CSV"
          >
            <Download size={15} color="#16A34A" /> Export Queue
          </button>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Role Notice Banner if viewing in driver role */}
      {!isAuthority && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#92400E' }}>
            <ShieldAlert size={18} color="#D97706" />
            <span>You are currently viewing in <strong>Driver mode</strong>. Switch to Authority privileges to approve repairs.</span>
          </div>
          <button
            onClick={() => loginAs('authority')}
            className="btn-danger"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Switch to Authority Privileges
          </button>
        </div>
      )}

      {/* 4 Required Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatsCard
          title="Total Detected"
          value={stats.totalPotholes?.toLocaleString() || '2,480'}
          subtitle="Cumulatively identified across city corridors"
          icon={ScanSearch}
          color="#2563EB"
          bgColor="#EFF6FF"
          trend="up"
          trendText="+12 today"
        />

        <StatsCard
          title="High Risk"
          value={stats.activeHotspots?.toLocaleString() || '186'}
          subtitle="Danger Score ≥ 61 requiring urgent repair"
          icon={Flame}
          color="#DC2626"
          bgColor="#FEF2F2"
          trend="down"
          trendText="-8 repaired"
        />

        <StatsCard
          title="Water Filled"
          value={stats.waterFilledPotholes?.toLocaleString() || '73'}
          subtitle="Submerged hazards with high hydroplane risk"
          icon={Droplets}
          color="#0EA5E9"
          bgColor="#F0F9FF"
          trend="up"
          trendText="Monsoon alert"
        />

        <StatsCard
          title="Verified"
          value={stats.verifiedConfidence || '91%'}
          subtitle="Multi-detection consensus accuracy"
          icon={CheckCircle2}
          color="#16A34A"
          bgColor="#F0FDF4"
          trend="up"
          trendText="+2.4% model accuracy"
        />
      </div>

      {/* Filter Drawer */}
      {showFilterDrawer && (
        <div style={{ marginBottom: '20px' }}>
          <FilterPanel
            filters={filters}
            onFilterChange={(newF) => setFilters(prev => ({ ...prev, ...newF }))}
            onReset={() => setFilters({ severity: 'ALL', status: 'ALL', waterPresent: 'ALL', minDangerScore: 0 })}
          />
        </div>
      )}

      {/* View Switcher: Priority Queue vs Spatial Map */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('queue')}
            className={activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <ListOrdered size={16} /> Priority Queue ({hotspots.length})
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <MapIcon size={16} /> Spatial Map View
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
          Synced with Citizen Sensor Network
        </span>
      </div>

      {/* Tab 1: Priority Queue Table */}
      {activeTab === 'queue' && (
        <HotspotTable
          hotspots={hotspots}
          onStatusUpdate={handleStatusUpdate}
          onInspect={(hazard) => setSelectedInspectHazard(hazard)}
        />
      )}

      {/* Tab 2: Authority Map View */}
      {activeTab === 'map' && (
        <PotholeMap
          potholes={hotspots}
          selectedPothole={selectedInspectHazard}
          onSelectPothole={(h) => setSelectedInspectHazard(h)}
          height="620px"
        />
      )}

      {/* Inspect Hazard Modal Dialog (Clean Light Theme) */}
      {selectedInspectHazard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card" style={{
            maxWidth: '580px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            position: 'relative',
            backgroundColor: '#FFFFFF',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <button
              onClick={() => setSelectedInspectHazard(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            <span className={`badge ${
              selectedInspectHazard.dangerScore >= 81 ? 'badge-danger' : 'badge-warning'
            }`}>
              {selectedInspectHazard.severity} SEVERITY • DANGER {selectedInspectHazard.dangerScore}/100
            </span>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '10px' }}>
              {selectedInspectHazard.locationName}
            </h3>

            {selectedInspectHazard.imageUrl && (
              <div style={{ marginTop: '16px', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '240px', border: '1px solid #E2E8F0' }}>
                <img
                  src={selectedInspectHazard.imageUrl}
                  alt="Road Inspection"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.86rem'
            }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Coordinates:</span>
                <div className="metric-mono" style={{ color: '#0F172A' }}>
                  {selectedInspectHazard.latitude.toFixed(5)}, {selectedInspectHazard.longitude.toFixed(5)}
                </div>
              </div>

              <div>
                <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Water Presence:</span>
                <div style={{ color: selectedInspectHazard.waterPresent ? '#0EA5E9' : '#0F172A', fontWeight: 600 }}>
                  {selectedInspectHazard.waterPresent ? '💧 Flooded (Hydroplane Risk)' : 'Dry'}
                </div>
              </div>

              <div>
                <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Detection Confidence:</span>
                <div className="metric-mono" style={{ color: '#2563EB', fontWeight: 700 }}>
                  {Math.round((selectedInspectHazard.confidence || 0.92) * 100)}%
                </div>
              </div>

              <div>
                <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Citizen Reports:</span>
                <div style={{ color: '#0F172A', fontWeight: 600 }}>
                  {selectedInspectHazard.reportCount || 1} corroboration(s)
                </div>
              </div>
            </div>

            {/* Actions in Dialog */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {selectedInspectHazard.status !== 'VERIFIED' && selectedInspectHazard.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedInspectHazard.id, 'VERIFIED');
                    setSelectedInspectHazard(null);
                  }}
                  className="btn-outline-blue"
                >
                  <CheckCircle2 size={16} /> Mark as Verified
                </button>
              )}

              {selectedInspectHazard.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedInspectHazard.id, 'RESOLVED');
                    setSelectedInspectHazard(null);
                  }}
                  className="btn-success"
                >
                  <CheckCircle2 size={16} /> Mark Repaired & Resolved
                </button>
              )}

              <button
                onClick={() => setSelectedInspectHazard(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
