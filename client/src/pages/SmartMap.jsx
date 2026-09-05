import React, { useState, useEffect } from 'react';
import PotholeMap from '../components/PotholeMap';
import WarningCard from '../components/WarningCard';
import { fetchReports } from '../services/api';
import { getCurrentCoordinates } from '../services/location';
import {
  MapPin,
  Filter,
  Layers,
  Radio,
  LocateFixed,
  AlertTriangle,
  Droplets,
  ShieldCheck,
  Navigation,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export default function SmartMap() {
  const [potholes, setPotholes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [activeWarning, setActiveWarning] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('ALL');

  const [filters, setFilters] = useState({
    severity: 'ALL',
    status: 'ALL',
    waterPresent: 'ALL',
    minDangerScore: 0
  });

  useEffect(() => {
    initMapData();
  }, []);

  useEffect(() => {
    loadPotholes();
  }, [filters]);

  const initMapData = async () => {
    const coords = await getCurrentCoordinates();
    setUserLocation(coords);
    await loadPotholes();
  };

  const loadPotholes = async () => {
    try {
      const res = await fetchReports(filters);
      if (res.reports) {
        setPotholes(res.reports);
        if (userLocation) {
          const nearest = res.reports.find(p => p.dangerScore >= 80 && p.status !== 'RESOLVED');
          if (nearest && !activeWarning) {
            setActiveWarning({
              ...nearest,
              distanceMeters: 180
            });
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load map potholes:', err);
    }
  };

  // Quick Filter handlers
  const handleQuickFilter = (type) => {
    setActiveQuickFilter(type);
    if (type === 'ALL') {
      setFilters({ severity: 'ALL', status: 'ALL', waterPresent: 'ALL', minDangerScore: 0 });
    } else if (type === 'HIGH') {
      setFilters({ severity: 'HIGH', status: 'ALL', waterPresent: 'ALL', minDangerScore: 61 });
    } else if (type === 'MEDIUM') {
      setFilters({ severity: 'MEDIUM', status: 'ALL', waterPresent: 'ALL', minDangerScore: 31 });
    } else if (type === 'LOW') {
      setFilters({ severity: 'SMALL', status: 'ALL', waterPresent: 'ALL', minDangerScore: 0 });
    } else if (type === 'WATER') {
      setFilters({ severity: 'ALL', status: 'ALL', waterPresent: 'true', minDangerScore: 0 });
    } else if (type === 'VERIFIED') {
      setFilters({ severity: 'ALL', status: 'VERIFIED', waterPresent: 'ALL', minDangerScore: 0 });
    }
  };

  // Filter by search query
  const filteredPotholes = potholes.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.locationName && p.locationName.toLowerCase().includes(q)) ||
      (p.severity && p.severity.toLowerCase().includes(q)) ||
      (p.roadType && p.roadType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app-container page-enter" style={{ paddingBottom: '60px' }}>
      {/* Approaching Hazard Warning Alert */}
      {activeWarning && (
        <div style={{ marginBottom: '20px' }}>
          <WarningCard
            hazard={activeWarning}
            onDismiss={() => setActiveWarning(null)}
          />
        </div>
      )}

      {/* Main Layout: Left Sidebar + Large Map Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* LEFT SIDEBAR: "Road Safety Map" */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                Road Safety Map
              </h2>
              <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
                {filteredPotholes.length} Hazards
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '18px' }}>
              Spatial geospatial telemetry and hazard heat mapping
            </p>

            {/* Location Search Input */}
            <div style={{ position: 'relative', marginBottom: '18px' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                placeholder="Search road, sector, or highway..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', color: '#94A3B8' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category Quick Filter Chips */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>
                QUICK FILTERS
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { label: 'All', id: 'ALL' },
                  { label: '🔴 High Risk', id: 'HIGH' },
                  { label: '🟠 Medium Risk', id: 'MEDIUM' },
                  { label: '🟢 Low Risk', id: 'LOW' },
                  { label: '💧 Water Filled', id: 'WATER' },
                  { label: '🔵 Verified', id: 'VERIFIED' }
                ].map((chip) => {
                  const active = activeQuickFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleQuickFilter(chip.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: active ? 700 : 500,
                        backgroundColor: active ? 'var(--primary-blue)' : '#F1F5F9',
                        color: active ? '#FFFFFF' : '#475569',
                        border: '1px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Map Legend */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              fontSize: '0.8rem'
            }}>
              <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Legend & Severity Levels:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                  <span>High Risk (81-100)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D97706' }} />
                  <span>Medium Risk (31-80)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                  <span>Low Risk (0-30)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0EA5E9' }} />
                  <span>Water Pooling</span>
                </div>
              </div>
            </div>

            {/* Recenter Location Action */}
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={initMapData}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.86rem' }}
              >
                <LocateFixed size={16} color="#2563EB" /> Recenter on My Location
              </button>
            </div>
          </div>

          {/* Selected Pothole Info Card (When a marker is selected) */}
          {selectedPothole && (
            <div className="card card-elevated" style={{ padding: '22px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className={`badge ${
                    selectedPothole.dangerScore >= 81 ? 'badge-danger' :
                    selectedPothole.dangerScore >= 31 ? 'badge-warning' : 'badge-success'
                  }`}>
                    {selectedPothole.severity} SEVERITY
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
                    {selectedPothole.locationName || 'Hazard Marker'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPothole(null)}
                  style={{ background: 'none', color: '#64748B', padding: '4px' }}
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Snapshot photo */}
              {selectedPothole.imageUrl && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '170px', marginBottom: '14px', border: '1px solid #E2E8F0' }}>
                  <img
                    src={selectedPothole.imageUrl}
                    alt="Road Hazard Snapshot"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Information Rows */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.84rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Danger Score:</span>
                  <strong className="metric-mono" style={{ color: selectedPothole.dangerScore >= 81 ? '#DC2626' : '#D97706', fontSize: '0.98rem' }}>
                    {selectedPothole.dangerScore} / 100
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Water Presence:</span>
                  <span style={{ color: selectedPothole.waterPresent ? '#0EA5E9' : '#0F172A', fontWeight: 600 }}>
                    {selectedPothole.waterPresent ? '💧 Present (Pooling)' : 'Dry Surface'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>AI Confidence:</span>
                  <strong className="metric-mono" style={{ color: '#2563EB' }}>
                    {Math.round((selectedPothole.confidence || 0.9) * 100)}%
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>GPS Position:</span>
                  <span className="metric-mono" style={{ color: '#0F172A' }}>
                    {selectedPothole.latitude.toFixed(4)}, {selectedPothole.longitude.toFixed(4)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Status:</span>
                  <strong style={{ color: selectedPothole.status === 'VERIFIED' ? '#16A34A' : '#D97706' }}>
                    {selectedPothole.status}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Detected:</span>
                  <span style={{ color: '#0F172A' }}>
                    {selectedPothole.detectedAt ? new Date(selectedPothole.detectedAt).toLocaleTimeString() : 'Recently'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setActiveWarning(selectedPothole)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.86rem', marginTop: '14px' }}
              >
                <Navigation size={15} /> Simulate Route Alert For This Pothole
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Large Map Area with Floating Controls */}
        <div style={{ minHeight: '640px' }}>
          <PotholeMap
            potholes={filteredPotholes}
            userLocation={userLocation}
            selectedPothole={selectedPothole}
            onSelectPothole={(p) => setSelectedPothole(p)}
            height="640px"
          />
        </div>
      </div>
    </div>
  );
}
