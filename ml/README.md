# ROADGUARD — Machine Learning & YOLO Module

This directory contains the Computer Vision / YOLO inference microservice for the ROADGUARD platform.

## Model Setup

To use your own trained pothole detection model:
1. Train a model with [Ultralytics YOLOv8 or YOLOv11](https://docs.ultralytics.com/).
2. Export your best weights file as `best.pt`.
3. Place `best.pt` inside this directory:
   ```
   ml/models/best.pt
   ```
4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the inference service:
   ```bash
   python inference.py
   ```
   The service will listen on `http://localhost:5001`.

## Features
- Modular design: seamlessly hot-reloads `best.pt` when placed in `models/`
- OpenCV-based water puddle detection analyzing specular reflection and water sheen
- Standard JSON output contract:
  ```json
  {
    "potholeDetected": true,
    "detections": [
      {
        "class": "pothole",
        "confidence": 0.94,
        "bbox": [120, 80, 350, 240]
      }
    ],
    "waterPresent": true,
    "model": "best.pt (Custom YOLO)",
    "inferenceTimeMs": 42
  }
  ```
- Graceful heuristic fallback if `best.pt` is not yet available, ensuring zero pipeline interruptions.
