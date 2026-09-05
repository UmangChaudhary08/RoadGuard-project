import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Droplets, ShieldCheck, CheckCircle2, Navigation, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Recenter map helper
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Generate clean glowing HTML/SVG markers
function createHazardIcon(severity, dangerScore, waterPresent, isSelected) {
  let color = '#16A34A'; // Green for Low
  let bgColor = '#F0FDF4';

  if (dangerScore >= 81 || severity === 'HIGH') {
    color = '#DC2626'; // Red for High
    bgColor = '#FEF2F2';
  } else if (dangerScore >= 61) {
    color = '#EA580C'; // Dark Orange
    bgColor = '#FFF7ED';
  } else if (dangerScore >= 31 || severity === 'MEDIUM') {
    color = '#D97706'; // Orange for Medium
    bgColor = '#FFFBEB';
  }

  const svgHtml = `
    <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
      ${dangerScore >= 81 ? `
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${color}; opacity: 0.25; animation: ping 1.8s infinite;"></div>
      ` : ''}
      <div style="
        width: ${isSelected ? '32px' : '28px'};
        height: ${isSelected ? '32px' : '28px'};
        border-radius: 50%;
        background: #FFFFFF;
        border: 3px solid ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.18);
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 11px;
        color: ${color};
        transition: all 0.2s ease;
      ">
        ${dangerScore}
      </div>
      ${waterPresent ? `
        <div style="position: absolute; top: -2px; right: -2px; width: 11px; height: 11px; border-radius: 50%; background: #0EA5E9; border: 2px solid #FFFFFF; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-hazard-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
}

// User location blue pulse marker
function createUserIcon() {
  const svgHtml = `
    <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #2563EB; opacity: 0.3; animation: ping 2s infinite;"></div>
      <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);"></div>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-user-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function PotholeMap({
  potholes = [],
  userLocation,
  selectedPothole,
  onSelectPothole,
  height = '560px'
}) {
  const defaultCenter = useMemo(() => {
    if (selectedPothole?.latitude) {
      return [selectedPothole.latitude, selectedPothole.longitude];
    }
    if (userLocation?.latitude) {
      return [userLocation.latitude, userLocation.longitude];
    }
    if (potholes.length > 0 && potholes[0].latitude) {
      return [potholes[0].latitude, potholes[0].longitude];
    }
    return [28.6139, 77.2090]; // Delhi center default
  }, [userLocation, potholes, selectedPothole]);

  return (
    <div className="card" style={{ height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={defaultCenter} zoom={selectedPothole ? 15 : 12} />

      <ChangeView center={defaultCenter} zoom={selectedPothole ? 15 : 12} />

{/* OpenStreetMap - No API Key Required */}
<TileLayer
  attribution='&copy; OpenStreetMap contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

        {/* User GPS Location Marker */}
        {userLocation?.latitude && userLocation?.longitude && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createUserIcon()}
            >
              <Popup>
                <div style={{ padding: '6px' }}>
                  <strong style={{ color: '#2563EB', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem' }}>
                    <Navigation size={14} /> Your Vehicle Location
                  </strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    {userLocation.isFallback ? 'Simulated Route Position (Delhi NCR)' : 'Live Driver GPS'}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Proximity Warning Ring (500m) */}
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={500}
              pathOptions={{
                color: '#2563EB',
                fillColor: '#2563EB',
                fillOpacity: 0.05,
                weight: 1.5,
                dashArray: '5, 8'
              }}
            />
          </>
        )}

        {/* Pothole Hazard Markers */}
        {potholes.map((pothole) => {
          const isSelected = selectedPothole?.id === pothole.id;
          const isHighRisk = pothole.dangerScore >= 81;

          return (
            <React.Fragment key={pothole.id}>
              <Marker
                position={[pothole.latitude, pothole.longitude]}
                icon={createHazardIcon(pothole.severity, pothole.dangerScore, pothole.waterPresent, isSelected)}
                eventHandlers={{
                  click: () => onSelectPothole && onSelectPothole(pothole)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '220px', padding: '6px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`badge ${
                        pothole.dangerScore >= 81 ? 'badge-danger' :
                        pothole.dangerScore >= 31 ? 'badge-warning' : 'badge-success'
                      }`} style={{ fontSize: '0.72rem' }}>
                        {pothole.severity} SEVERITY
                      </span>

                      <span className="metric-mono" style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: pothole.dangerScore >= 81 ? '#DC2626' : '#D97706'
                      }}>
                        {pothole.dangerScore}/100
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      {pothole.locationName || `Hazard #${pothole.id.slice(-4)}`}
                    </h4>

                    {/* Metadata summary */}
                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div>
                        Water: <strong style={{ color: pothole.waterPresent ? '#0EA5E9' : '#0F172A' }}>
                          {pothole.waterPresent ? '💧 Present (Pooling)' : 'Dry Surface'}
                        </strong>
                      </div>
                      <div>
                        AI Confidence: <strong style={{ color: '#0F172A' }}>
                          {Math.round((pothole.confidence || 0.9) * 100)}%
                        </strong>
                      </div>
                      {pothole.distanceMeters && (
                        <div>
                          Distance: <strong style={{ color: '#2563EB' }}>{pothole.distanceMeters}m away</strong>
                        </div>
                      )}
                      <div>
                        Status: <strong style={{ color: pothole.status === 'VERIFIED' ? '#16A34A' : '#D97706' }}>
                          {pothole.status}
                        </strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* High risk warning ring */}
              {isHighRisk && (
                <Circle
                  center={[pothole.latitude, pothole.longitude]}
                  radius={120}
                  pathOptions={{
                    color: '#DC2626',
                    fillColor: '#DC2626',
                    fillOpacity: 0.1,
                    weight: 1.2
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Clean White Floating Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          fontSize: '0.78rem',
          zIndex: 1000,
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Map Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DC2626' }}></span>
          <span style={{ color: '#475569' }}>🔴 High Risk (81-100)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D97706' }}></span>
          <span style={{ color: '#475569' }}>🟠 Medium Risk (31-80)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16A34A' }}></span>
          <span style={{ color: '#475569' }}>🟢 Low Risk (0-30)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0EA5E9' }}></span>
          <span style={{ color: '#475569' }}>🔵 Water Pooling</span>
        </div>
      </div>
    </div>
  );
}
