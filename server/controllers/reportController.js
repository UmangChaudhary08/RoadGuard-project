import {
  getAllPotholes,
  getPotholeById,
  createPotholeReport,
  updatePotholeStatus,
  getDashboardStats
} from "../services/firebaseService.js";
import { getNearbyPotholes } from "../services/locationService.js";

/**
 * Create a new pothole report
 */
export async function createReport(req, res) {
  try {
    const {
      latitude,
      longitude,
      severity,
      dangerScore,
      confidence,
      waterPresent,
      imageUrl,
      roadType,
      locationName
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "GPS coordinates (latitude, longitude) are mandatory."
      });
    }

    const result = await createPotholeReport({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      severity: severity || "MEDIUM",
      dangerScore: parseInt(dangerScore, 10) || 50,
      confidence: parseFloat(confidence) || 0.88,
      waterPresent: Boolean(waterPresent),
      imageUrl,
      roadType,
      locationName
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      isNew: result.isNew,
      report: result.pothole
    });
  } catch (err) {
    console.error("[Create Report Error]:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to submit pothole report: " + err.message
    });
  }
}

/**
 * Get all pothole reports with filters
 */
export async function getReports(req, res) {
  try {
    const { severity, status, waterPresent, minDangerScore } = req.query;

    const reports = await getAllPotholes({
      severity,
      status,
      waterPresent,
      minDangerScore
    });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (err) {
    console.error("[Get Reports Error]:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve reports: " + err.message
    });
  }
}

/**
 * Get pothole hazards nearby a specific GPS coordinate
 */
export async function getNearbyReports(req, res) {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude query parameters are required."
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const radiusMeters = parseFloat(radius);

    const allReports = await getAllPotholes();
    const nearby = getNearbyPotholes(allReports, userLat, userLon, radiusMeters);

    return res.status(200).json({
      success: true,
      userLocation: { latitude: userLat, longitude: userLon },
      radiusMeters,
      count: nearby.length,
      reports: nearby
    });
  } catch (err) {
    console.error("[Get Nearby Error]:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch nearby hazards: " + err.message
    });
  }
}

/**
 * Update pothole status (VERIFIED, RESOLVED, PENDING, DETECTED)
 */
export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["DETECTED", "PENDING", "VERIFIED", "RESOLVED"];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const updated = await updatePotholeStatus(id, status.toUpperCase());

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Pothole report with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status.toUpperCase()}`,
      report: updated
    });
  } catch (err) {
    console.error("[Update Status Error]:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update report status: " + err.message
    });
  }
}

/**
 * Fetch Authority statistics
 */
export async function getStats(req, res) {
  try {
    const stats = await getDashboardStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (err) {
    console.error("[Get Stats Error]:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard stats: " + err.message
    });
  }
}
