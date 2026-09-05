import { Router } from "express";
import {
  createReport,
  getReports,
  getNearbyReports,
  updateStatus,
  getStats
} from "../controllers/reportController.js";
import { authenticate, requireAuthority } from "../middleware/auth.js";

const router = Router();

// Public / Driver routes
router.post("/reports", authenticate, createReport);
router.get("/reports", getReports);
router.get("/reports/nearby", getNearbyReports);
router.get("/stats", getStats);

// Authority protected routes
router.patch("/reports/:id/status", authenticate, updateStatus);

export default router;
