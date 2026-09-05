/**
 * Danger Score Service
 * Calculates composite danger score (0 - 100) based on:
 * - Severity (35%)
 * - Water presence (+20%)
 * - Night condition (+10%)
 * - Rain condition (+15%)
 * - Traffic level (+7%)
 * - AI confidence (calibration factor)
 */

export function calculateDangerScore({
  severity = "MEDIUM",
  waterPresent = false,
  isNight = false,
  isRaining = false,
  trafficLevel = "moderate",
  confidence = 0.9
}) {
  let rawScore = 0;

  // 1. Pothole Severity Weight (up to 35 points)
  if (severity === "HIGH") {
    rawScore += 35;
  } else if (severity === "MEDIUM") {
    rawScore += 24;
  } else if (severity === "SMALL") {
    rawScore += 12;
  } else {
    return {
      score: 0,
      riskLevel: "NONE",
      warningPriority: "NONE",
      breakdown: { baseSeverity: 0, water: 0, night: 0, rain: 0, traffic: 0, confidenceFactor: 1 }
    };
  }

  // 2. Water Presence (+20 points) - obscures depth, causes hydroplaning
  const waterPoints = waterPresent ? 20 : 0;
  rawScore += waterPoints;

  // 3. Night Condition (+10 points) - poor lighting, headlights late illumination
  const nightPoints = isNight ? 10 : 0;
  rawScore += nightPoints;

  // 4. Rain Condition (+15 points) - reduced tire traction and reflections
  const rainPoints = isRaining ? 15 : 0;
  rawScore += rainPoints;

  // 5. Traffic Level (+7 points max) - difficulty swerving to avoid hazard
  let trafficPoints = 2;
  if (trafficLevel === "heavy") trafficPoints = 7;
  else if (trafficLevel === "moderate") trafficPoints = 4;
  else if (trafficLevel === "low") trafficPoints = 1;
  rawScore += trafficPoints;

  // 6. AI Confidence Calibration
  // Normalize by confidence (0.5 to 1.0)
  const confFactor = Math.max(0.7, Math.min(1.0, confidence));
  let finalScore = Math.round(rawScore * (0.85 + 0.15 * confFactor));

  // Cap at 100 max, 5 min
  finalScore = Math.min(100, Math.max(5, finalScore));

  // Determine Risk Level
  // 0–30 = LOW, 31–60 = MEDIUM, 61–80 = HIGH, 81–100 = CRITICAL
  let riskLevel = "LOW";
  let warningPriority = "INFO";

  if (finalScore >= 81) {
    riskLevel = "CRITICAL";
    warningPriority = "IMMEDIATE";
  } else if (finalScore >= 61) {
    riskLevel = "HIGH";
    warningPriority = "HIGH";
  } else if (finalScore >= 31) {
    riskLevel = "MEDIUM";
    warningPriority = "CAUTION";
  } else {
    riskLevel = "LOW";
    warningPriority = "INFO";
  }

  return {
    score: finalScore,
    riskLevel,
    warningPriority,
    breakdown: {
      baseSeverity: severity === "HIGH" ? 35 : severity === "MEDIUM" ? 24 : 12,
      water: waterPoints,
      night: nightPoints,
      rain: rainPoints,
      traffic: trafficPoints,
      confidenceFactor: confFactor
    }
  };
}
