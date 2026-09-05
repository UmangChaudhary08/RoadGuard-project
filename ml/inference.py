"""
ROADGUARD — Computer Vision & YOLO Inference Microservice
Runs on port 5001.
Accepts an image via POST /predict and returns bounding boxes, confidence, severity, and water detection.
Strictly adheres to:
1. Load real YOLO model if 'ml/models/best.pt' exists.
2. If 'best.pt' is missing, report that weights are missing. Do NOT synthesize fake inference.
"""

import os
import time
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np

# Optional imports for OpenCV & Ultralytics
try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False

try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best.pt")
loaded_model = None

def load_yolo_model():
    global loaded_model
    if not os.path.exists(MODEL_PATH):
        print(f"[ML Service] Trained model file NOT FOUND at: {MODEL_PATH}")
        loaded_model = None
        return None

    if not YOLO_AVAILABLE:
        print("[ML Service] Ultralytics package is not installed. Cannot load best.pt.")
        loaded_model = None
        return None

    try:
        print(f"[ML Service] Loading custom trained YOLO model from {MODEL_PATH}...")
        loaded_model = YOLO(MODEL_PATH)
        print("[ML Service] Custom YOLO model successfully loaded and ready for inference.")
        return loaded_model
    except Exception as e:
        print(f"[ML Service] Failed to load YOLO model: {e}")
        loaded_model = None
        return None

# Attempt initial model load
load_yolo_model()

def detect_water_opencv(image_np):
    """
    Heuristic water/puddle detection using OpenCV color & reflection analysis
    Checks for high specular reflection and dark/turbid water tones in road depressions
    """
    if not OPENCV_AVAILABLE:
        return False
    try:
        hsv = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
        h, w, _ = image_np.shape
        road_roi = hsv[int(h * 0.4):, :]
        
        # Water/puddle mask (specular highlights or muddy reflectivity)
        lower_specular = np.array([0, 0, 180])
        upper_specular = np.array([180, 50, 255])
        mask = cv2.inRange(road_roi, lower_specular, upper_specular)
        
        water_pixel_ratio = np.sum(mask > 0) / (mask.shape[0] * mask.shape[1])
        return bool(water_pixel_ratio > 0.05)
    except Exception as e:
        print(f"[Water Detection Error]: {e}")
        return False

def calculate_severity(detections, img_width, img_height, water_present=False):
    """
    Calculates severity based on bounding box relative area and water pooling
    """
    if not detections:
        return "NONE"
    
    img_area = max(1, img_width * img_height)
    max_area = 0
    for d in detections:
        bbox = d.get("bbox", [0, 0, 0, 0])
        area = bbox[2] * bbox[3]
        if area > max_area:
            max_area = area

    ratio = max_area / img_area
    if ratio > 0.12 or max_area > 45000:
        severity = "HIGH"
    elif ratio > 0.04 or max_area > 15000:
        severity = "MEDIUM"
    else:
        severity = "SMALL"

    if water_present and severity == "SMALL" and ratio > 0.02:
        severity = "MEDIUM"
    elif water_present and severity == "MEDIUM":
        severity = "HIGH"

    return severity

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ready" if loaded_model is not None else "weights_missing",
        "service": "ROADGUARD ML Inference Service",
        "modelLoaded": loaded_model is not None,
        "customModelPath": MODEL_PATH,
        "customModelExists": os.path.exists(MODEL_PATH),
        "opencvAvailable": OPENCV_AVAILABLE,
        "yoloAvailable": YOLO_AVAILABLE,
        "message": "Real YOLO model active" if loaded_model is not None else "Trained weights 'best.pt' missing in ml/models/"
    })

@app.route("/predict", methods=["POST"])
def predict():
    global loaded_model
    start_time = time.time()

    # Attempt dynamic load if model was placed recently
    if loaded_model is None:
        load_yolo_model()

    # Verify model is loaded
    if loaded_model is None:
        model_exists = os.path.exists(MODEL_PATH)
        error_msg = (
            "Trained YOLO model weights missing. 'ml/models/best.pt' does not exist."
            if not model_exists
            else "Trained YOLO model weights exist, but 'ultralytics' is not installed or model failed to load."
        )
        return jsonify({
            "success": False,
            "error": error_msg,
            "pothole_detected": False,
            "potholeDetected": False,
            "modelLoaded": False,
            "modelPath": MODEL_PATH,
            "modelExists": model_exists,
            "yoloAvailable": YOLO_AVAILABLE
        }), 503

    if "image" not in request.files:
        return jsonify({"error": "No 'image' file field provided"}), 400

    file = request.files["image"]
    try:
        image_bytes = file.read()
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(pil_img)
        h, w, _ = img_np.shape
    except Exception as e:
        return jsonify({"error": f"Failed to decode image: {str(e)}"}), 400

    detections = []
    water_detected = detect_water_opencv(img_np)

    try:
        # Run real YOLO inference
        results = loaded_model(pil_img)
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                cls_name = loaded_model.names.get(cls_id, "pothole")

                detections.append({
                    "class": cls_name,
                    "confidence": round(conf, 2),
                    "bbox": [int(x1), int(y1), int(x2 - x1), int(y2 - y1)]
                })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"YOLO inference error: {str(e)}"
        }), 500

    pothole_detected = len(detections) > 0
    top_confidence = max([d["confidence"] for d in detections], default=0.0)
    severity = calculate_severity(detections, w, h, water_detected)
    duration_ms = int((time.time() - start_time) * 1000)

    # Return both snake_case and camelCase for full compatibility
    return jsonify({
        "success": True,
        "pothole_detected": pothole_detected,
        "potholeDetected": pothole_detected,
        "confidence": top_confidence,
        "bounding_boxes": detections,
        "detections": detections,
        "severity": severity,
        "water_present": water_detected,
        "waterPresent": water_detected,
        "model": "best.pt (Real YOLO)",
        "inferenceTimeMs": max(10, duration_ms)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"============================================================")
    print(f"[ML Service] ROADGUARD ML Microservice starting on port {port}")
    print(f"[ML Service] Model path: {MODEL_PATH}")
    print(f"[ML Service] Model exists: {os.path.exists(MODEL_PATH)}")
    print(f"============================================================")
    app.run(host="0.0.0.0", port=port, debug=False)
