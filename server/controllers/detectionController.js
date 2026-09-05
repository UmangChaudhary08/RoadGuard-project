import { detectPotholes } from "../services/aiService.js";
import { estimateSeverity } from "../services/severityService.js";
import { calculateDangerScore } from "../services/dangerScoreService.js";
import { analyzeEnvironmentalContext } from "../services/weatherService.js";
import { DEMO_DEFAULT_LOCATION } from "../services/locationService.js";

/**
 * Handles image upload and runs the complete AI road hazard pipeline
 */
export async function detectRoadHazards(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided. Please upload a road photograph."
      });
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Optional GPS and weather hints sent in request body
    const reqLat = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const reqLon = req.body.longitude ? parseFloat(req.body.longitude) : null;
    const isNightParam = req.body.isNight !== undefined ? req.body.isNight === "true" : undefined;
    const isRainingParam = req.body.isRaining !== undefined ? req.body.isRaining === "true" : undefined;

    // 1. AI Detection (YOLO / Computer Vision)
    let aiResult;
    try {
      aiResult = await detectPotholes(buffer, originalname, mimetype);
    } catch (aiErr) {
      return res.status(503).json({
        success: false,
        error: aiErr.message,
        pothole_detected: false,
        potholeDetected: false,
        confidence: 0,
        bounding_boxes: [],
        severity: "NONE",
        message: "Real YOLO inference failed. Ensure 'ml/models/best.pt' exists and the Python inference service is running."
      });
    }

    // 2. Weather & Environmental Context Analysis
    const envContext = analyzeEnvironmentalContext({
      isNight: isNightParam,
      isRaining: isRainingParam,
      trafficLevel: req.body.trafficLevel || "moderate"
    });

    const detections = aiResult.bounding_boxes || aiResult.detections || [];

    // 3. Severity Estimation (if not already computed by model)
    const severityResult = aiResult.severity
      ? { severity: aiResult.severity, explanation: `Classified as ${aiResult.severity} by model` }
      : estimateSeverity(detections, { width: 640, height: 480 }, aiResult.waterPresent);

    // Top detection confidence
    const topConfidence = detections.length > 0
      ? Math.max(...detections.map(d => d.confidence))
      : 0.0;

    // 4. Composite Danger Score Calculation
    const dangerResult = calculateDangerScore({
      severity: severityResult.severity,
      waterPresent: aiResult.waterPresent,
      isNight: envContext.isNight,
      isRaining: envContext.isRaining,
      trafficLevel: envContext.trafficLevel,
      confidence: topConfidence || 0.85
    });

    // 5. GPS Tagging (Use client GPS or fallback demo coordinates)
    const coordinates = (reqLat && reqLon && !isNaN(reqLat) && !isNaN(reqLon))
      ? { latitude: reqLat, longitude: reqLon, isDemoFallback: false }
      : {
          latitude: DEMO_DEFAULT_LOCATION.latitude + (Math.random() - 0.5) * 0.02,
          longitude: DEMO_DEFAULT_LOCATION.longitude + (Math.random() - 0.5) * 0.02,
          isDemoFallback: true,
          note: "GPS fallback coordinates applied (Delhi NCR)"
        };

    // Convert image buffer to base64 preview so frontend can display uploaded photo immediately
    const base64Preview = `data:${mimetype};base64,${buffer.toString("base64")}`;

    // Return structure satisfying both Requirement 5 and frontend compatibility
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      // Standard requested keys:
      pothole_detected: aiResult.pothole_detected ?? aiResult.potholeDetected,
      confidence: Math.round(topConfidence * 100) / 100,
      bounding_boxes: detections,
      severity: severityResult.severity,
      // Frontend backward-compatible keys:
      potholeDetected: aiResult.potholeDetected,
      waterDetected: aiResult.waterPresent,
      confidencePercent: `${Math.round(topConfidence * 100)}%`,
      severityDetails: severityResult,
      dangerScore: dangerResult.score,
      riskLevel: dangerResult.riskLevel,
      warningPriority: dangerResult.warningPriority,
      scoreBreakdown: dangerResult.breakdown,
      detections: detections,
      environmentalContext: envContext,
      location: coordinates,
      previewUrl: base64Preview,
      aiEngine: {
        model: aiResult.model,
        isMock: aiResult.isMock,
        inferenceTimeMs: aiResult.inferenceTimeMs
      }
    });
  } catch (err) {
    console.error("[Detection Controller Error]:", err);
    return res.status(500).json({
      success: false,
      error: "AI Detection pipeline failed: " + err.message
    });
  }
}
