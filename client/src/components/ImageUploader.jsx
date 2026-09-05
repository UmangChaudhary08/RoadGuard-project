import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  RefreshCw,
  Sparkles,
  CloudRain,
  Moon,
  Car,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

// Sample road test photos for instant 1-click evaluation
const SAMPLE_TEST_IMAGES = [
  {
    name: 'Monsoon Flooded Crater',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    isNight: false,
    isRaining: true,
    traffic: 'heavy'
  },
  {
    name: 'Night Urban Road Cavity',
    url: 'https://images.unsplash.com/photo-1584463699039-3d149024f0a0?auto=format&fit=crop&w=800&q=80',
    isNight: true,
    isRaining: false,
    traffic: 'moderate'
  },
  {
    name: 'Dry Asphalt Depression',
    url: 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?auto=format&fit=crop&w=800&q=80',
    isNight: false,
    isRaining: false,
    traffic: 'low'
  }
];

export default function ImageUploader({ onAnalyze, isAnalyzing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Environmental context overrides
  const [isNight, setIsNight] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [trafficLevel, setTrafficLevel] = useState('moderate');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a road image (JPEG, PNG, or WebP).');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    stopCamera();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const selectSampleImage = async (sample) => {
    try {
      setIsNight(sample.isNight);
      setIsRaining(sample.isRaining);
      setTrafficLevel(sample.traffic);

      const res = await fetch(sample.url);
      const blob = await res.blob();
      const file = new File([blob], `${sample.name.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(sample.url);
      stopCamera();
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err) {
      setCameraError('Camera unavailable or permission denied. Please upload a file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-pothole-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  };

  const triggerAnalyze = () => {
    if (!selectedFile) return;
    onAnalyze(selectedFile, {
      isNight,
      isRaining,
      trafficLevel
    });
  };

  return (
    <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
      {/* Title & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
            AI Pothole Detection
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
            Upload or capture road surface image for neural network crater analysis
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <UploadCloud size={16} color="#2563EB" /> Upload Image
          </button>
          <button
            onClick={cameraActive ? capturePhoto : startCamera}
            className={cameraActive ? 'btn-danger' : 'btn-outline-blue'}
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Camera size={16} /> {cameraActive ? 'Snap Frame' : 'Capture Image'}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Main Upload / Camera Viewport (Dashed border) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #CBD5E1',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#F8FAFC',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px',
          transition: 'all 0.2s ease'
        }}
      >
        {cameraActive ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '280px', display: 'flex', justifyContent: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
            />
            <div style={{ position: 'absolute', bottom: '16px', display: 'flex', gap: '12px' }}>
              <button onClick={capturePhoto} className="btn-primary">
                <Camera size={18} /> Capture Photo
              </button>
              <button onClick={stopCamera} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          <div style={{ position: 'relative', width: '100%', padding: '12px', textAlign: 'center' }}>
            <img
              src={previewUrl}
              alt="Road Surface Preview"
              style={{ maxHeight: '320px', maxWidth: '100%', borderRadius: '12px', objectFit: 'contain', boxShadow: 'var(--shadow-sm)' }}
            />
            <button
              onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
              className="btn-secondary"
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '6px 12px', fontSize: '0.78rem', boxShadow: 'var(--shadow-md)' }}
            >
              Change Image
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ textAlign: 'center', padding: '40px 20px', cursor: 'pointer', width: '100%' }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--light-blue)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: 'var(--primary-blue)'
            }}>
              <UploadCloud size={28} strokeWidth={2.2} />
            </div>
            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '1.05rem', marginBottom: '4px' }}>
              📷 Upload Road Image or Drag & Drop
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Supports asphalt road photos, highway dashcams (JPEG, PNG, WebP)
            </div>
          </div>
        )}

        {cameraError && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            backgroundColor: 'var(--light-red)',
            color: 'var(--danger-red)',
            border: '1px solid #FECACA',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} /> {cameraError}
          </div>
        )}
      </div>

      {/* 1-Click Quick Demo Presets */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#2563EB" /> 1-Click Test Photos:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          {SAMPLE_TEST_IMAGES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectSampleImage(sample)}
              className="btn-secondary"
              style={{
                padding: '8px 12px',
                fontSize: '0.78rem',
                justifyContent: 'flex-start',
                textAlign: 'left'
              }}
            >
              <ImageIcon size={14} color="#2563EB" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Environmental Context Modifiers */}
      <div style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.84rem'
      }}>
        <span style={{ color: '#475569', fontWeight: 600 }}>
          Environmental Modifiers:
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: isNight ? '#7C3AED' : '#64748B', fontWeight: isNight ? 600 : 500 }}>
            <input
              type="checkbox"
              checked={isNight}
              onChange={(e) => setIsNight(e.target.checked)}
              style={{ accentColor: '#7C3AED' }}
            />
            <Moon size={14} /> Night (+10% Risk)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: isRaining ? '#0EA5E9' : '#64748B', fontWeight: isRaining ? 600 : 500 }}>
            <input
              type="checkbox"
              checked={isRaining}
              onChange={(e) => setIsRaining(e.target.checked)}
              style={{ accentColor: '#0EA5E9' }}
            />
            <CloudRain size={14} /> Rain (+15% Risk)
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Car size={14} color="#F59E0B" />
            <select
              value={trafficLevel}
              onChange={(e) => setTrafficLevel(e.target.value)}
              className="select-control"
              style={{ padding: '4px 8px', fontSize: '0.78rem', width: 'auto' }}
            >
              <option value="low">Light Traffic</option>
              <option value="moderate">Moderate Traffic</option>
              <option value="heavy">Heavy Congestion (+7%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={triggerAnalyze}
        disabled={!selectedFile || isAnalyzing}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '13px',
          fontSize: '0.98rem',
          opacity: !selectedFile || isAnalyzing ? 0.6 : 1,
          cursor: !selectedFile || isAnalyzing ? 'not-allowed' : 'pointer'
        }}
      >
        {isAnalyzing ? (
          <>
            <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Analyzing Road Image with AI...
          </>
        ) : (
          <>
            <Sparkles size={18} /> Run AI Pothole Detection
          </>
        )}
      </button>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
