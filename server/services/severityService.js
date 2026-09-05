/**
 * Severity Estimation Service
 * Classifies pothole severity: SMALL | MEDIUM | HIGH
 * Based on bounding box relative size, confidence, water presence, and environmental factors.
 */

export function estimateSeverity(detections = [], imageMeta = { width: 640, height: 480 }, waterPresent = false) {
  if (!detections || detections.length === 0) {
    return {
      severity: "NONE",
      areaRatio: 0,
      description: "No pothole detected"
    };
  }

  const imageArea = (imageMeta.width || 640) * (imageMeta.height || 480);
  
  // Find maximum pothole bounding box area
  let maxPotholeArea = 0;
  let maxConfidence = 0;

  for (const det of detections) {
    if (det.class === "pothole" || det.class === "road_damage") {
      const bbox = det.bbox || [0, 0, 100, 100]; // [x, y, w, h] or [x1, y1, x2, y2]
      let w = bbox[2];
      let h = bbox[3];
      // In case bbox is [x1, y1, x2, y2]
      if (w > bbox[0] && bbox[2] > 100 && bbox[0] < bbox[2]) {
        w = bbox[2] - bbox[0];
        h = bbox[3] - bbox[1];
      }
      const area = Math.abs(w * h);
      if (area > maxPotholeArea) {
        maxPotholeArea = area;
      }
      if (det.confidence > maxConfidence) {
        maxConfidence = det.confidence;
      }
    }
  }

  const areaRatio = maxPotholeArea / imageArea;

  // Baseline severity classification based on relative area occupied
  let severity = "SMALL";
  let explanation = "Small surface depression detected";

  if (areaRatio > 0.12 || maxPotholeArea > 45000) {
    severity = "HIGH";
    explanation = "Severe structural crater / deep cavity detected";
  } else if (areaRatio > 0.04 || maxPotholeArea > 15000) {
    severity = "MEDIUM";
    explanation = "Moderate road surface disruption";
  }

  // Water presence escalates SMALL to MEDIUM, or MEDIUM to HIGH
  if (waterPresent) {
    if (severity === "SMALL" && areaRatio > 0.02) {
      severity = "MEDIUM";
      explanation += " (Escalated due to water pooling obscuring depth)";
    } else if (severity === "MEDIUM") {
      severity = "HIGH";
      explanation += " (Escalated to HIGH: water-filled submerged crater)";
    }
  }

  return {
    severity,
    areaRatio: Number(areaRatio.toFixed(3)),
    maxConfidence: Number(maxConfidence.toFixed(2)),
    explanation
  };
}
