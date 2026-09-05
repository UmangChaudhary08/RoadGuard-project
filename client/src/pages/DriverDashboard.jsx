import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ImageUploader from '../components/ImageUploader';
import DetectionResult from '../components/DetectionResult';
import WarningCard from '../components/WarningCard';
import StatsCard from '../components/StatsCard';
import { detectRoadImage, submitPotholeReport, fetchNearbyReports } from '../services/api';
import { getCurrentCoordinates } from '../services/location';
import {
  Navigation,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Compass,
  CheckCircle,
  RefreshCw,
  LocateFixed,
  Flame,
  Droplets,
  ShieldAlert,
  Sparkles,
  ScanSearch
} from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();

  // State
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(null);

  // Approaching hazard state
  const [nearbyHazards, setNearbyHazards] = useState([]);
  const [activeWarning, setActiveWarning] = useState(null);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  // Initialize GPS & nearby on load
  useEffect(() => {
    loadLocationAndNearby();
  }, []);

  const loadLocationAndNearby = async () => {
    setIsLocating(true);
    const coords = await getCurrentCoordinates();
    setUserLocation(coords);
    setIsLocating(false);

    try {
      const res = await fetchNearbyReports(coords.latitude, coords.longitude, 5000);
      if (res.reports && res.reports.length > 0) {
        setNearbyHazards(res.reports);
        const nearestWarning = res.reports.find(h => h.distanceMeters <= 500 && h.status !== 'RESOLVED');
        if (nearestWarning) {
          setActiveWarning(nearestWarning);
        }
      }
    } catch (err) {
      console.warn('Failed to load nearby hazards:', err);
    }
  };

  // Run AI Detection Pipeline
  const handleAnalyzeImage = async (file, metadata) => {
    setIsAnalyzing(true);
    setDetectionResult(null);
    setSaveSuccessMessage(null);

    try {
      const payloadMeta = {
        ...metadata,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude
      };

      const result = await detectRoadImage(file, payloadMeta);
      setDetectionResult(result);
    } catch (err) {
      console.error('Detection error:', err);
      alert(`AI detection failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit hazard to live cloud database
  const handleSaveToCloud = async () => {
    if (!detectionResult) return;
    setIsSaving(true);
    try {
      const reportPayload = {
        latitude: detectionResult.location.latitude,
        longitude: detectionResult.location.longitude,
        severity: detectionResult.severity,
        dangerScore: detectionResult.dangerScore,
        confidence: detectionResult.confidence,
        waterPresent: detectionResult.waterDetected,
        imageUrl: detectionResult.previewUrl,
        locationName: userLocation?.isFallback
          ? 'Connaught Place Outer Radial (Simulated)'
          : 'Geotagged Mobile Dashcam Sector'
      };

      const res = await submitPotholeReport(reportPayload);
      setSaveSuccessMessage(res.message || 'Report submitted and verified!');
      if (userLocation) {
        loadLocationAndNearby();
      }
    } catch (err) {
      alert(`Failed to save report: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Demo simulator: trigger high-risk approaching hazard
  const simulateApproachingHazard = () => {
    const mockHazard = {
      id: 'demo-warning-live',
      locationName: 'NH-48 Approaching Overpass (Lane 2)',
      dangerScore: 89,
      severity: 'HIGH',
      waterPresent: true,
      confidence: 0.96,
      distanceMeters: 150,
      status: 'VERIFIED'
    };
    setActiveWarning(mockHazard);
  };

  // Quick stats calculations for top row
  const highRiskCount = nearbyHazards.filter(h => h.dangerScore >= 81).length;
  const waterCount = nearbyHazards.filter(h => h.waterPresent).length;
  const verifiedCount = nearbyHazards.filter(h => h.status === 'VERIFIED').length;

  return (
    <div className="app-container page-enter" style={{ paddingBottom: '70px' }}>
      {/* Top Greeting & Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getGreeting()}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748B', marginTop: '4px' }}>
            Monitor road conditions and stay safe. Real-time hazard detection & HUD warning active.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={loadLocationAndNearby}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            title="Recenter GPS location"
          >
            <LocateFixed size={15} color="#2563EB" />
            <span className="metric-mono" style={{ color: '#0F172A' }}>
              {isLocating ? 'Locating...' : `${userLocation?.latitude?.toFixed(4)}, ${userLocation?.longitude?.toFixed(4)}`}
            </span>
          </button>

          <button
            onClick={simulateApproachingHazard}
            className="btn-danger"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            title="Simulate approaching a high-risk pothole to test radar alerts"
          >
            <AlertTriangle size={15} /> Simulate Hazard Warning
          </button>
        </div>
      </div>

      {/* Top 4 Required Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatsCard
          title="Detected Potholes"
          value={nearbyHazards.length > 0 ? `${nearbyHazards.length} Active` : "128 In City"}
          subtitle="Monitored in current urban sector"
          icon={ScanSearch}
          color="#2563EB"
          bgColor="#EFF6FF"
          trend="up"
          trendText="↑ 12% this week"
        />

        <StatsCard
          title="High Risk Hotspots"
          value={highRiskCount > 0 ? `${highRiskCount} Hazards` : "24 Critical"}
          subtitle="Requires immediate lane awareness"
          icon={Flame}
          color="#DC2626"
          bgColor="#FEF2F2"
          trend="down"
          trendText="↓ 5% repaired"
        />

        <StatsCard
          title="Water Filled Potholes"
          value={waterCount > 0 ? `${waterCount} Puddles` : "14 Flooded"}
          subtitle="Submerged craters with high hydroplaning risk"
          icon={Droplets}
          color="#0EA5E9"
          bgColor="#F0F9FF"
          trend="up"
          trendText="Monsoon alert"
        />

        <StatsCard
          title="Verified Road Hazards"
          value={verifiedCount > 0 ? `${verifiedCount} Verified` : "94% Precision"}
          subtitle="Corroborated by sensor consensus"
          icon={ShieldCheck}
          color="#16A34A"
          bgColor="#F0FDF4"
          trend="up"
          trendText="+2.4% accuracy"
        />
      </div>

      {/* Active Approaching Hazard Warning Alert */}
      {activeWarning && (
        <div style={{ marginBottom: '24px' }}>
          <WarningCard
            hazard={activeWarning}
            onDismiss={() => setActiveWarning(null)}
          />
        </div>
      )}

      {/* Success Notification */}
      {saveSuccessMessage && (
        <div className="badge badge-success" style={{
          width: '100%',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.9rem',
          justifyContent: 'center'
        }}>
          <CheckCircle size={18} /> {saveSuccessMessage}
        </div>
      )}

      {/* Main Section: Two-Column Layout (Upload on Left, Result on Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: detectionResult ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Left: AI Pothole Detection Upload */}
        <div>
          <ImageUploader
            onAnalyze={handleAnalyzeImage}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Right: Detection Result Preview or Standby Card */}
        {!detectionResult ? (
          <div className="card" style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            minHeight: '360px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <ScanSearch size={32} strokeWidth={2} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Detection Result Standby
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '340px', marginBottom: '20px' }}>
              Upload a road surface photo or pick a sample above to view computer vision bounding boxes, severity assessment, and Danger Score.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.78rem',
              color: '#94A3B8'
            }}>
              <span>• Bounding Box Extraction</span>
              <span>• Water Detection</span>
              <span>• 0-100 Danger Score</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* When Detection Result exists, show full detailed inspection */}
      {detectionResult && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="#2563EB" /> Neural Vision Analysis
            </h3>
            <button
              onClick={() => setDetectionResult(null)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Clear & Scan New Image
            </button>
          </div>

          <DetectionResult
            result={detectionResult}
            onSaveReport={handleSaveToCloud}
            isSaving={isSaving}
          />
        </div>
      )}

      {/* Nearby Detected Hazards on Current Route */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="#2563EB" /> Hazards Within 5 km Radius ({nearbyHazards.length})
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Sorted by vehicle distance • Click any card to preview real-time HUD alert
            </p>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
            Live Proximity Radar
          </span>
        </div>

        {nearbyHazards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#64748B', fontSize: '0.88rem' }}>
            No dangerous potholes reported within 5 km. Drive safely!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {nearbyHazards.slice(0, 4).map((h) => {
              const isCrit = h.dangerScore >= 81;
              const isHigh = h.dangerScore >= 61 && h.dangerScore < 81;
              return (
                <div
                  key={h.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => setActiveWarning(h)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className={`badge ${
                      isCrit ? 'badge-danger' : isHigh ? 'badge-warning' : 'badge-success'
                    }`} style={{ fontSize: '0.72rem' }}>
                      {h.severity}
                    </span>
                    <span className="metric-mono" style={{ fontSize: '0.9rem', color: isCrit ? '#DC2626' : '#D97706', fontWeight: 800 }}>
                      {h.dangerScore}/100
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.locationName}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Distance: <strong style={{ color: '#2563EB' }}>{h.distanceText}</strong></span>
                    <span>Water: <strong style={{ color: h.waterPresent ? '#0EA5E9' : '#64748B' }}>{h.waterPresent ? '💧 Yes' : 'No'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
