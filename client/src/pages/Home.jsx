import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ScanSearch,
  MapPin,
  Building2,
  Cpu,
  Radio,
  Eye,
  ArrowRight,
  Droplets,
  Zap,
  CheckCircle2,
  Navigation,
  Sparkles,
  Layers,
  AlertTriangle
} from 'lucide-react';

export default function Home() {
  const steps = [
    { title: 'Capture', desc: 'Driver dashcam or citizen road photo upload', icon: ScanSearch, color: '#2563EB', bg: '#EFF6FF' },
    { title: 'AI Analyze', desc: 'Computer vision neural crater inference', icon: Cpu, color: '#7C3AED', bg: '#F5F3FF' },
    { title: 'Severity', desc: 'Classify crater depth, area & water pooling', icon: Eye, color: '#F59E0B', bg: '#FFFBEB' },
    { title: 'GPS Tag', desc: 'Sub-meter accurate telemetry geotagging', icon: MapPin, color: '#16A34A', bg: '#F0FDF4' },
    { title: 'Warn', desc: 'Sub-second audio & HUD proximity alerts', icon: Radio, color: '#DC2626', bg: '#FEF2F2' }
  ];

  const features = [
    {
      title: 'AI Pothole Detection',
      desc: 'High-precision computer vision pipeline identifying road surface craters, fissures, and edge disruptions.',
      icon: Cpu,
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      title: 'Real-Time Warnings',
      desc: 'Instant HUD proximity alerts notify drivers 500m to 100m before approaching hazardous craters.',
      icon: Radio,
      color: '#DC2626',
      bg: '#FEF2F2'
    },
    {
      title: 'Smart GPS Mapping',
      desc: 'Geospatial risk heatmap with dynamic markers, route warnings, and water accumulation tracking.',
      icon: MapPin,
      color: '#16A34A',
      bg: '#F0FDF4'
    },
    {
      title: 'Composite Risk Analysis',
      desc: 'Multi-factor Danger Score (0-100) combining crater depth, rainfall, nighttime lighting, and traffic levels.',
      icon: ShieldAlert,
      color: '#F59E0B',
      bg: '#FFFBEB'
    }
  ];

  return (
    <div className="page-enter" style={{ paddingBottom: '70px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '60px 24px 70px',
        maxWidth: '1320px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Hero Left: Copy & CTAs */}
          <div>
            {/* Small Badge */}
            <div style={{ display: 'inline-flex', marginBottom: '18px' }}>
              <span className="badge badge-info" style={{ fontSize: '0.78rem', padding: '6px 14px', fontWeight: 700 }}>
                <Sparkles size={14} color="#2563EB" /> AI-POWERED ROAD SAFETY
              </span>
            </div>

            {/* Large Heading */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#0F172A',
              marginBottom: '20px'
            }}>
              Detect Potholes.<br />
              <span style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Drive Safer.
              </span>
            </h1>

            {/* Supporting Text */}
            <p style={{
              fontSize: '1.1rem',
              color: '#64748B',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              ROADGUARD uses Computer Vision, precision GPS, and real-time risk prediction to identify dangerous road craters, water-filled hazards, and warn nearby drivers before impact.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/detect" className="btn-primary" style={{ padding: '13px 26px', fontSize: '1rem' }}>
                <ScanSearch size={18} /> Start Detection
              </Link>

              <Link to="/map" className="btn-secondary" style={{ padding: '13px 24px', fontSize: '1rem' }}>
                <MapPin size={18} color="#2563EB" /> Explore Smart Map
              </Link>
            </div>

            {/* Quick Micro Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div>
                <div className="metric-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB' }}>
                  &lt; 50ms
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Detection Latency</div>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: '#E2E8F0' }} />
              <div>
                <div className="metric-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16A34A' }}>
                  94.2%
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Model Precision</div>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: '#E2E8F0' }} />
              <div>
                <div className="metric-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DC2626' }}>
                  500 m
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Early Warning Horizon</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Modern Visual Dashboard Card */}
          <div style={{ position: 'relative' }}>
            {/* Subtle colorful background blur */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            <div className="card card-elevated" style={{
              padding: '28px',
              position: 'relative',
              zIndex: 1,
              backgroundColor: '#FFFFFF'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626', animation: 'warning-pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live AI Detection
                  </span>
                </div>
                <span className="badge badge-danger" style={{ fontSize: '0.74rem' }}>
                  High Risk
                </span>
              </div>

              {/* Sample Visual / Pothole Preview */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '18px',
                border: '1px solid #E2E8F0'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                  alt="Road Crater Sample"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                />

                {/* Simulated Bounding Box Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '28%',
                  width: '45%',
                  height: '42%',
                  border: '3px solid #DC2626',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(220, 38, 38, 0.18)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: '-3px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    POTHOLE 94%
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#0EA5E9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Droplets size={12} /> Water Pooling
                </div>
              </div>

              {/* Detection Specs Grid */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '0.84rem'
              }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem' }}>Pothole Status</div>
                  <strong style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> Detected
                  </strong>
                </div>

                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem' }}>AI Confidence</div>
                  <strong className="metric-mono" style={{ color: '#2563EB' }}>
                    94% Accuracy
                  </strong>
                </div>

                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem' }}>Danger Score</div>
                  <strong className="metric-mono" style={{ color: '#DC2626' }}>
                    87 / 100
                  </strong>
                </div>

                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem' }}>Location</div>
                  <strong style={{ color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    NH-48 Mahipalpur
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="app-container" style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-info" style={{ marginBottom: '8px' }}>POWERFUL CAPABILITIES</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
            Engineered for Modern Smart Cities
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.96rem', marginTop: '4px' }}>
            Comprehensive road safety tools for drivers and municipal infrastructure teams
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="card card-elevated"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: feat.bg,
                  color: feat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* "How ROADGUARD Works" Section */}
      <section className="app-container">
        <div className="card" style={{ padding: '36px 28px', backgroundColor: '#FFFFFF' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge badge-info" style={{ marginBottom: '8px' }}>END-TO-END WORKFLOW</span>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0F172A' }}>
              How ROADGUARD Works
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '4px' }}>
              From initial road capture to sub-meter driver proximity warnings
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
            position: 'relative'
          }}>
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 16px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: s.bg,
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <StepIcon size={20} strokeWidth={2.2} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    STEP 0{idx + 1}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                    {s.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
