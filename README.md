# ROADGUARD — AI-Based Pothole Detection & Real-Time Warning System

> **Making roads safer with Computer Vision, GPS & intelligent risk prediction.**

ROADGUARD is a mobile-first, full-stack AI road-safety platform that detects potholes and road cavities from imagery, evaluates hazard severity, calculates a multi-factor Danger Score (0–100), GPS-tags hazards, maps them in real-time, and broadcasts proximity warnings to nearby drivers before impact.

---

## 1. Project Overview

Every year, thousands of road accidents and severe vehicular damage occur due to hidden potholes—particularly during night driving, rainstorms, and monsoon water accumulation.

ROADGUARD solves three fundamental problems:
1. **Poor Visibility:** Potholes concealed by darkness, rain, or murky water pooling.
2. **Untimely Warning:** Drivers discovering road craters only upon tire strike.
3. **Reactive Municipal Maintenance:** Citizen complaints scattered across fragmented channels.

### Core Workflow:
```text
CAPTURE → AI ANALYZE → SEVERITY → GPS TAG → VERIFY → STORE → MAP → WARN
```

---

## 2. Key Features

- 📸 **Multi-Source Image Ingestion:** Mobile dashcam upload or direct live camera capture.
- 🧠 **Computer Vision & YOLO Inference:** Deep learning crater detection with bounding boxes and confidence scores.
- 💧 **Water Accumulation Detection:** Evaluates specular reflectivity and flooded puddles concealing depth.
- 📊 **Composite Danger Score (0–100):** Weighted multi-variable index accounting for crater area, water presence, night lighting, precipitation, and traffic density.
- 📍 **Sub-Meter GPS Geotagging:** Precision coordinate tagging with automatic fallback to reference coordinates when GPS is denied.
- 🗺️ **Interactive Smart Spatial Map:** Real-time map with glowing severity markers, radar circles, and detailed hazard inspection popups.
- ⚠️ **Proximity Warning HUD:** Real-time distance alerts (`< 500m`, `< 250m`, `< 100m`) with audio chimes and radar pulse animations.
- 🏢 **Authority Command Dashboard:** Municipal priority queue sorted by Danger Score, dynamic KPI counters, CSV dispatch export, and 1-click Verify/Resolve actions.
- 🛡️ **Frictionless Demo Mode:** Completely runnable without requiring paid Google Maps or external GPU services.

---

## 3. Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT + VITE FRONTEND                    │
│   • Landing Page          • Driver Dashboard (HUD Radar)   │
│   • Smart Hazard Map      • Authority PWD Dashboard        │
└──────────────┬──────────────────────────────▲───────────────┘
               │ Multipart Image Upload       │ Real-time Alerts
               ▼                              │ & Heatmap Data
┌─────────────────────────────────────────────┴───────────────┐
│                    EXPRESS.JS BACKEND                       │
│   • /api/detect           • /api/reports                    │
│   • /api/reports/nearby   • /api/stats                      │
└──────┬──────────────────┬──────────────────────┬────────────┘
       │                  │                      │
       ▼                  ▼                      ▼
┌──────────────┐   ┌──────────────┐       ┌──────────────┐
│  AI Service  │   │ Danger Score │       │  Firebase /  │
│  & YOLO / CV │   │  Engine      │       │  Data Store  │
└──────┬───────┘   └──────────────┘       └──────────────┘
       │ (Optional)
       ▼
┌───────────────────────────┐
│ Python ML Microservice    │
│ (YOLOv8 best.pt + OpenCV) │
└───────────────────────────┘
```

---

## 4. Tech Stack

- **Frontend:** React 18, Vite 6, React Router v6, Leaflet / React-Leaflet, Lucide React Icons, Canvas Confetti.
- **Backend:** Node.js, Express.js, Multer, CORS, Dotenv.
- **AI / ML:** YOLOv8 / YOLOv11 (`ultralytics`), OpenCV (`cv2`), Flask, PIL, NumPy.
- **Database / Auth:** Firebase Firestore & Firebase Authentication (with robust in-memory seed store fallback in demo mode).
- **Mapping:** Leaflet Dark Theme CartoDB tiles + Google Maps API support.

---

## 5. Folder Structure

```text
roadguard/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── DangerScore.jsx       # 0-100 Circular SVG meter
│   │   │   ├── DemoBanner.jsx        # Demo Mode indicator
│   │   │   ├── DetectionResult.jsx   # AI bounding box canvas & specs
│   │   │   ├── FilterPanel.jsx       # Severity & status filters
│   │   │   ├── HotspotTable.jsx      # Priority repair queue table
│   │   │   ├── ImageUploader.jsx     # Upload, camera & sample presets
│   │   │   ├── Navbar.jsx            # Responsive navigation & role switcher
│   │   │   ├── PotholeMap.jsx        # Leaflet / Google Maps wrapper
│   │   │   ├── StatsCard.jsx         # Glowing KPI metric cards
│   │   │   └── WarningCard.jsx       # Driver proximity alert HUD
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Role-based auth (Driver vs Authority)
│   │   ├── pages/
│   │   │   ├── AuthorityDashboard.jsx# Municipal control center
│   │   │   ├── DriverDashboard.jsx   # Mobile-first detection & radar
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Login.jsx             # 1-Click quick demo authentication
│   │   │   └── SmartMap.jsx          # Live spatial hazard map
│   │   ├── services/
│   │   │   ├── api.js                # REST API calls
│   │   │   ├── firebase.js           # Firebase client connector
│   │   │   └── location.js           # GPS & Haversine distance
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── detectionController.js    # 8-stage AI hazard pipeline
│   │   └── reportController.js       # Reports, nearby & stats endpoints
│   ├── data/
│   │   └── samplePotholes.js         # Delhi NCR realistic initial hotspots
│   ├── middleware/
│   │   ├── auth.js                   # Role & token guard
│   │   └── upload.js                 # Multer image validation (10MB)
│   ├── routes/
│   │   ├── detectionRoutes.js        # POST /api/detect
│   │   └── reportRoutes.js           # /api/reports, /api/stats
│   ├── services/
│   │   ├── aiService.js              # YOLO microservice connector & mock AI
│   │   ├── dangerScoreService.js     # Weighted formula (0-100)
│   │   ├── firebaseService.js        # Firestore & clustering store
│   │   ├── locationService.js        # Haversine distance calculations
│   │   ├── severityService.js        # SMALL / MEDIUM / HIGH estimation
│   │   └── weatherService.js         # Contextual lighting & rain analysis
│   ├── package.json
│   └── server.js
│
├── ml/
│   ├── models/
│   │   └── .gitkeep                  # Drop your trained best.pt here
│   ├── inference.py                  # Flask YOLO microservice on port 5001
│   ├── requirements.txt
│   └── README.md
│
├── .env.example
├── package.json                      # Root concurrent script runner
└── README.md
```

---

## 6. Installation & Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 or higher, optional if using `MOCK_AI_MODE=true`)

### Step 1: Install Dependencies
From the repository root, install dependencies for root, server, and client:

```bash
npm install
npm run install:all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

---

## 7. Running the Application

### Running Both Backend and Frontend Concurrently
From the root directory:
```bash
npm run dev
```

This starts:
- **Express Backend:** `http://localhost:5000`
- **React Frontend:** `http://localhost:5173`

### Or Run Individually
In Terminal 1 (Backend):
```bash
cd server
npm run dev
```

In Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 8. Environment Variables

Create `.env` in the root directory (copied from `.env.example`):

```env
PORT=5000
NODE_ENV=development
DEMO_MODE=true
MOCK_AI_MODE=true

# Optional: Real ML YOLO microservice URL
YOLO_SERVICE_URL=http://localhost:5001

# Optional: Firebase production credentials
FIREBASE_PROJECT_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=

# Optional: Google Maps API Key (Leaflet Dark CartoDB active if blank)
VITE_GOOGLE_MAPS_API_KEY= AIzaSyBLonZyB6W13PRVwgxJ_Iki6fYPNeJJrCw
```

---

## 9. Demo Mode & Testing Without External Keys

The system is pre-configured with `DEMO_MODE=true` and `MOCK_AI_MODE=true`:
- **Sample Hotspots:** Seeded with realistic hotspots around New Delhi (NH-48, Ring Road, Connaught Place, DND Flyway).
- **1-Click Test Photos:** The Driver Dashboard contains 3 instant one-click test presets (`Monsoon Flooded Crater`, `Night Road Cavity`, `Dry Asphalt Depression`).
- **Interactive Map:** Interactive Dark CartoDB map works out of the box with zero API keys required.
- **Proximity Simulation:** Click **"Simulate Approaching Hazard"** in the Driver Dashboard to test live radar proximity alerts.
- **Role Switching:** Click the **Role: Driver / Authority** button in the top navbar to instantly test the municipal dispatch queue.

---

## 10. Plugging in Your Custom YOLO Model (`best.pt`)

1. Copy your trained YOLO model file to:
   ```
   ml/models/best.pt
   ```
2. Install Python dependencies:
   ```bash
   cd ml
   pip install -r requirements.txt
   ```
3. Start the ML inference microservice:
   ```bash
   python inference.py
   ```
   (Listens on `http://localhost:5001`)
4. In your `.env`, set:
   ```env
   MOCK_AI_MODE=false
   YOLO_SERVICE_URL=http://localhost:5001
   ```
5. Restart the Node.js backend. Any uploaded image will now be processed directly by your `best.pt` model!

---

## 11. API Documentation

### `POST /api/detect`
Analyzes a road surface photo.
- **Content-Type:** `multipart/form-data`
- **Field:** `image` (binary, JPEG/PNG/WebP, up to 10MB)
- **Optional body fields:** `latitude`, `longitude`, `isNight`, `isRaining`, `trafficLevel`
- **Response:**
  ```json
  {
    "success": true,
    "potholeDetected": true,
    "waterDetected": true,
    "confidence": 0.95,
    "severity": "HIGH",
    "dangerScore": 89,
    "riskLevel": "CRITICAL",
    "warningPriority": "IMMEDIATE",
    "detections": [{ "class": "pothole", "confidence": 0.95, "bbox": [140, 110, 380, 260] }],
    "location": { "latitude": 28.5398, "longitude": 77.1264 }
  }
  ```

### `GET /api/reports`
Retrieve road hazards with filters.
- **Query parameters:** `severity`, `status`, `waterPresent`, `minDangerScore`

### `GET /api/reports/nearby`
Find hazards near user's GPS position.
- **Query parameters:** `latitude`, `longitude`, `radius` (in meters)

### `POST /api/reports`
Register a new hazard report. Automatically deduplicates/clusters hazards within 35 meters.

### `PATCH /api/reports/:id/status`
Update hazard lifecycle status (`VERIFIED`, `RESOLVED`, `PENDING`).

### `GET /api/stats`
Returns aggregated municipal statistics for Authority KPI cards.

---

## 12. Danger Score Algorithm

The composite Danger Score (0–100) is calculated via:

$$\text{Score} = \left( W_{\text{severity}} + W_{\text{water}} + W_{\text{night}} + W_{\text{rain}} + W_{\text{traffic}} \right) \times C_{\text{confidence}}$$

- **Base Severity (35%):** High = 35 pts, Medium = 24 pts, Small = 12 pts
- **Water Presence (+20%):** Submerged crater obscuring depth
- **Night Condition (+10%):** Headlight latency & low ambient illumination
- **Rain Condition (+15%):** Wet asphalt & hydroplaning risk
- **Traffic Level (+7%):** Heavy congestion preventing lane maneuvers
- **Risk Bands:**
  - `81 – 100`: **CRITICAL** (Immediate warning `< 100m`)
  - `61 – 80`: **HIGH** (Warning `< 250m`)
  - `31 – 60`: **MEDIUM** (Caution `< 500m`)
  - `0 – 30`: **LOW** (Informational)

---

## 13. Future Improvements

1. **Edge On-Device Inference:** TensorFlow.js / ONNX Runtime running inside mobile PWA for zero-latency offline road scanning.
2. **Accelerometer Gyroscope Sensor Fusion:** Corroborating optical computer vision detections with smartphone vibration spikes.
3. **Automated Municipal Work Order Webhooks:** Direct integration with smart city municipal ERPs (e.g. SAP / Open311).
4. **Autonomous Drone Inspection:** Automated drone flight paths over high-priority arterial highways.
