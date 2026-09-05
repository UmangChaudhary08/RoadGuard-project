import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle,
  AlertOctagon,
  Droplets,
  MapPin,
  Clock,
  Send,
  Cpu,
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import DangerScore from './DangerScore';

export default function DetectionResult({ result, onSaveReport, isSaving }) {
  const canvasRef = useRef(null);
  const [reportSaved, setReportSaved] = useState(false);

  useEffect(() => {
    if (!result || !canvasRef.current || !result.previewUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width || 640;
      canvas.height = image.height || 480;

      // Draw base road image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw bounding box detections
      if (result.detections && result.detections.length > 0) {
        result.detections.forEach((det) => {
          const [x, y, w, h] = det.bbox;
          const isHigh = result.severity === 'HIGH';
          const strokeColor = isHigh ? '#DC2626' : result.severity === 'MEDIUM' ? '#F59E0B' : '#2563EB';

          // Bounding Box
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, w, h);

          // Box highlight fill
          ctx.fillStyle = isHigh ? 'rgba(220, 38, 38, 0.18)' : 'rgba(37, 99, 235, 0.15)';
          ctx.fillRect(x, y, w, h);

          // Detection Label Badge
          const label = `${det.class.toUpperCase()} ${Math.round(det.confidence * 100)}%`;
          ctx.font = 'bold 16px "Inter", sans-serif';
          const textWidth = ctx.measureText(label).width;

          ctx.fillStyle = strokeColor;
          ctx.fillRect(x, y - 28 > 0 ? y - 28 : y, textWidth + 14, 26);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(label, x + 7, (y - 28 > 0 ? y - 28 : y) + 18);
        });
      }

      // Water pooling overlay indicator
      if (result.waterDetected) {
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(14, 165, 233, 0.95)';
        ctx.fillRect(16, 16, 160, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('💧 WATER DETECTED', 24, 36);
      }

      // Model badge
      const isMock = result.aiEngine?.isMock;
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = isMock ? 'rgba(15, 23, 42, 0.85)' : 'rgba(22, 163, 74, 0.9)';
      ctx.fillRect(16, canvas.height - 34, isMock ? 190 : 230, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        isMock ? 'DEMO AI SIMULATION' : `YOLO (${result.aiEngine?.model})`,
        22,
        canvas.height - 18
      );
    };

    image.src = result.previewUrl;
  }, [result]);

  if (!result) return null;

  const handleSave = async () => {
    if (onSaveReport) {
      await onSaveReport();
      setReportSaved(true);
    }
  };

  const isHighSeverity = result.severity === 'HIGH';
  const isMediumSeverity = result.severity === 'MEDIUM';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Status Ribbon */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {result.potholeDetected ? (
              <span className="badge badge-danger" style={{ fontSize: '0.84rem', padding: '5px 12px' }}>
                <AlertOctagon size={15} /> Pothole: Detected
              </span>
            ) : (
              <span className="badge badge-success" style={{ fontSize: '0.84rem', padding: '5px 12px' }}>
                <CheckCircle size={15} /> Road Clear
              </span>
            )}

            <span className={result.waterDetected ? 'badge badge-info' : 'badge badge-neutral'} style={{ fontSize: '0.84rem', padding: '5px 12px' }}>
              <Droplets size={14} color="#0EA5E9" /> Water: {result.waterDetected ? 'Detected' : 'Dry'}
            </span>

            <span className={
              isHighSeverity ? 'badge badge-danger' :
              isMediumSeverity ? 'badge badge-warning' : 'badge badge-success'
            } style={{ fontSize: '0.84rem', padding: '5px 12px' }}>
              Severity: {result.severity}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748B' }}>
            <Cpu size={15} color="#2563EB" />
            <span>Inference: <strong style={{ color: '#0F172A' }}>{result.aiEngine?.inferenceTimeMs || 38}ms</strong></span>
            {result.aiEngine?.isMock && (
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                Simulated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Canvas Image on Left, Danger Score & Telemetry on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Visual Canvas Card */}
        <div className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#2563EB" /> AI Bounding Box Overlay
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {result.detections?.length || 0} box(es) detected
            </span>
          </div>

          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '380px', objectFit: 'contain' }}
            />
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#64748B' }}>
            <strong style={{ color: '#0F172A' }}>Assessment:</strong> {result.severityDetails?.explanation || 'Hazard analyzed with multi-criteria computer vision.'}
          </div>
        </div>

        {/* Right Column: Danger Score Meter & GPS Geotag */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <DangerScore
            score={result.dangerScore}
            riskLevel={result.riskLevel}
            warningPriority={result.warningPriority}
            breakdown={result.scoreBreakdown}
          />

          {/* Location & Details Card */}
          <div className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#2563EB" /> Location & Telemetry
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Latitude:</span>
                <span className="metric-mono" style={{ color: '#0F172A' }}>
                  {result.location?.latitude?.toFixed(5)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Longitude:</span>
                <span className="metric-mono" style={{ color: '#0F172A' }}>
                  {result.location?.longitude?.toFixed(5)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>AI Confidence:</span>
                <span className="metric-mono" style={{ color: '#2563EB', fontWeight: 700 }}>
                  {result.confidencePercent}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Detection Time:</span>
                <span style={{ color: '#0F172A', fontSize: '0.8rem' }}>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {result.location?.isDemoFallback && (
                <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#D97706', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '6px 10px', borderRadius: '6px' }}>
                  📍 {result.location.note || 'Using Delhi NCR reference coordinates'}
                </div>
              )}
            </div>

            {/* Broadcast to Cloud Button */}
            <div style={{ marginTop: '16px' }}>
              {reportSaved ? (
                <div className="badge badge-success" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.86rem' }}>
                  <CheckCircle size={16} /> Broadcasted to Cloud Smart Map!
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Send size={16} /> Broadcast to Smart Map & Driver Radar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
