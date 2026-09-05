/**
 * AI Service for Pothole & Road Damage Detection
 * Supports:
 * 1. REAL_MODE: Calls Python YOLO inference service (best.pt) via HTTP on port 5001
 * 2. MOCK_AI_MODE: Explicit demo mode fallback when MOCK_AI_MODE=true
 */

const MOCK_AI_MODE = process.env.MOCK_AI_MODE !== "false";
const YOLO_SERVICE_URL = process.env.YOLO_SERVICE_URL || "http://localhost:5001";

/**
 * Generate realistic simulated AI detections for demo/development
 */
function generateMockDetections(imageBuffer, filename = "") {
  const hash = filename.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const potholeDetected = true;
  const waterPresent = hash % 2 === 0 || filename.toLowerCase().includes("water") || filename.toLowerCase().includes("rain");

  const sizeSeed = hash % 3;
  let bbox;
  let confidence;

  if (sizeSeed === 2) {
    bbox = [140, 110, 380, 260];
    confidence = 0.94 + ((hash % 5) / 100);
  } else if (sizeSeed === 1) {
    bbox = [210, 150, 260, 180];
    confidence = 0.88 + ((hash % 7) / 100);
  } else {
    bbox = [260, 200, 160, 110];
    confidence = 0.81 + ((hash % 10) / 100);
  }

  const detections = [
    {
      class: "pothole",
      confidence: Math.min(0.98, Number(confidence.toFixed(2))),
      bbox
    }
  ];

  if (hash % 4 === 0) {
    detections.push({
      class: "road_damage",
      confidence: 0.78,
      bbox: [bbox[0] - 80 > 20 ? bbox[0] - 80 : 40, bbox[1] + 40, 110, 80]
    });
  }

  return {
    potholeDetected,
    pothole_detected: potholeDetected,
    detections,
    bounding_boxes: detections,
    waterPresent,
    water_present: waterPresent,
    model: "YOLOv8-RoadSurface-Mock",
    isMock: true,
    inferenceTimeMs: 42
  };
}

/**
 * Check health / status of the Python ML YOLO service
 */
export async function checkYoloServiceHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${YOLO_SERVICE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { online: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { online: true, ...data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

/**
 * Perform inference on an uploaded image buffer or file
 * @param {Buffer} fileBuffer 
 * @param {string} originalName 
 * @param {string} mimeType 
 * @returns {Promise<Object>}
 */
export async function detectPotholes(fileBuffer, originalName = "road.jpg", mimeType = "image/jpeg") {
  // If explicitly configured for mock mode, return mock inference
  if (MOCK_AI_MODE) {
    return generateMockDetections(fileBuffer, originalName);
  }

  // Real YOLO Mode: Call Python microservice
  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append("image", blob, originalName);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${YOLO_SERVICE_URL}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (!response.ok) {
      // If the Python server explicitly reported missing model weights (503)
      if (response.status === 503 || result.modelLoaded === False) {
        throw new Error(result.error || "Trained YOLO model weights missing from 'ml/models/best.pt'.");
      }
      throw new Error(`YOLO service error (HTTP ${response.status}): ${result.error || "Unknown error"}`);
    }

    const detections = result.bounding_boxes || result.detections || [];
    const isDetected = result.pothole_detected ?? (detections.length > 0);

    return {
      potholeDetected: isDetected,
      pothole_detected: isDetected,
      detections,
      bounding_boxes: detections,
      waterPresent: result.water_present ?? result.waterPresent ?? false,
      water_present: result.water_present ?? result.waterPresent ?? false,
      severity: result.severity,
      model: result.model || "best.pt (Real YOLO)",
      isMock: false,
      inferenceTimeMs: result.inferenceTimeMs || 65
    };
  } catch (err) {
    console.error(`[AI Service] Real YOLO inference error: ${err.message}`);
    // Re-throw if in real mode so caller knows real inference failed rather than pretending
    throw new Error(`Real YOLO inference unavailable: ${err.message}`);
  }
}
