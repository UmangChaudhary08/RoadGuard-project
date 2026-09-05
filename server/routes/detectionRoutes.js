import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { detectRoadHazards } from "../controllers/detectionController.js";

const router = Router();

// POST /api/detect - Multipart road image upload & AI inference
router.post("/detect", upload.single("image"), detectRoadHazards);

export default router;
