import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import detectionRoutes from "./routes/detectionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config({ path: "../.env" });
dotenv.config(); // fallback to local server .env if present

const app = express();
const PORT = process.env.PORT || 5000;
const DEMO_MODE = process.env.DEMO_MODE !== "false";
const MOCK_AI_MODE = process.env.MOCK_AI_MODE !== "false";

// Global Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-role"]
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (!req.url.startsWith("/api/health")) {
      console.log(`[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// System Status & Healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "ROADGUARD API Engine",
    timestamp: new Date().toISOString(),
    configuration: {
      demoMode: DEMO_MODE,
      mockAiMode: MOCK_AI_MODE,
      port: PORT,
      yoloEndpoint: process.env.YOLO_SERVICE_URL || "http://localhost:5001"
    }
  });
});

// API Routes
app.use("/api", detectionRoutes);
app.use("/api", reportRoutes);

// Root route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>ROADGUARD API</title></head>
      <body style="font-family: sans-serif; background: #0b0f19; color: #e2e8f0; padding: 40px;">
        <h1 style="color: #38bdf8;">ROADGUARD API Server</h1>
        <p>AI-Based Pothole Detection & Real-Time Warning System</p>
        <p>Status: <span style="color: #4ade80;">Active</span></p>
        <ul>
          <li><strong>Health:</strong> <a style="color:#38bdf8" href="/api/health">/api/health</a></li>
          <li><strong>Reports:</strong> <a style="color:#38bdf8" href="/api/reports">/api/reports</a></li>
          <li><strong>Stats:</strong> <a style="color:#38bdf8" href="/api/stats">/api/stats</a></li>
        </ul>
      </body>
    </html>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.url} not found on ROADGUARD server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Unhandled Server Error]:", err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error occurred in ROADGUARD pipeline"
  });
});

app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 ROADGUARD Server active on http://localhost:${PORT}`);
  console.log(`🛡️  Mode: DEMO_MODE=${DEMO_MODE} | MOCK_AI_MODE=${MOCK_AI_MODE}`);
  console.log(`📍 Ready to process road images and hazard alerts.`);
  console.log(`========================================================`);
});
