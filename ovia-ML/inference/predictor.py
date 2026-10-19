import os
import json
import time
import base64
import joblib
import numpy as np
from typing import List, Optional, Tuple, Dict, Any

from app.core.config import settings
from app.schemas.recognition import LandmarkPoint

# Try importing cv2 and mediapipe if available
try:
    import cv2
    import mediapipe as mp
    mp_hands = mp.solutions.hands
    MEDIAPIPE_AVAILABLE = True
except Exception:
    MEDIAPIPE_AVAILABLE = False

class ISLSignPredictor:
    def __init__(self, model_path: Optional[str] = None, classes_path: Optional[str] = None):
        # Resolve model path relative to project
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_path = model_path or os.path.join(base_dir, "models", "isl_baseline_model.pkl")
        self.classes_path = classes_path or os.path.join(base_dir, "models", "isl_classes.json")
        self.model = None
        self.classes = []
        self.hands_detector = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.classes_path):
                self.model = joblib.load(self.model_path)
                with open(self.classes_path, "r") as f:
                    self.classes = json.load(f)
                print(f"[ISLSignPredictor] Loaded model with {len(self.classes)} classes from {self.model_path}")
            else:
                print(f"[ISLSignPredictor] Model files not found at {self.model_path}. Predictor will run in unconfigured mode.")
        except Exception as e:
            print(f"[ISLSignPredictor] Error loading model: {e}")
            self.model = None

    def is_configured(self) -> bool:
        return self.model is not None and len(self.classes) > 0

    def extract_landmarks_from_image(self, base64_image: str) -> Tuple[Optional[List[Dict[str, float]]], str]:
        """Extracts 21 landmarks from a base64 encoded image frame."""
        if not MEDIAPIPE_AVAILABLE:
            return None, "MediaPipe not available for server-side frame processing."
        
        try:
            # Strip data url prefix if present
            if "," in base64_image:
                base64_image = base64_image.split(",")[1]
            img_bytes = base64.b64decode(base64_image)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None:
                return None, "Failed to decode image frame."

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            with mp_hands.Hands(
                static_image_mode=True,
                max_num_hands=1,
                min_detection_confidence=0.5
            ) as hands:
                results = hands.process(rgb_frame)
                if not results.multi_hand_landmarks:
                    return None, "No hand detected in the frame. Please position your hand clearly within the camera view."
                
                hand_landmarks = results.multi_hand_landmarks[0]
                landmarks_list = [
                    {"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_landmarks.landmark
                ]
                return landmarks_list, "success"
        except Exception as e:
            return None, f"Image processing error: {str(e)}"

    def normalize_landmarks(self, landmarks: List[Any]) -> np.ndarray:
        """Normalizes 21 3D points relative to wrist."""
        if hasattr(landmarks[0], 'x'):
            coords = np.array([[lm.x, lm.y, lm.z] for lm in landmarks], dtype=np.float32)
        elif isinstance(landmarks[0], dict):
            coords = np.array([[lm['x'], lm['y'], lm.get('z', 0.0)] for lm in landmarks], dtype=np.float32)
        else:
            coords = np.array(landmarks, dtype=np.float32)

        if coords.shape != (21, 3):
            raise ValueError(f"Expected landmark shape (21, 3), got {coords.shape}")

        wrist = coords[0]
        translated = coords - wrist
        max_dist = np.max(np.linalg.norm(translated, axis=1))
        scale = max_dist if max_dist > 1e-6 else 1.0
        normalized = (translated / scale).flatten()
        return normalized

    def predict(
        self,
        target_sign: str,
        landmarks: Optional[List[Any]] = None,
        image_base64: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        target_sign_norm = target_sign.strip().upper()

        if not self.is_configured():
            return {
                "predicted_sign": None,
                "confidence": 0.0,
                "is_correct": False,
                "status": "model_not_configured",
                "feedback": "Sign recognition model is not yet configured or loaded. Check model paths.",
                "target_sign": target_sign_norm,
                "top_candidates": [],
                "inference_time_ms": 0.0,
            }

        # If image provided, extract landmarks
        if not landmarks and image_base64:
            extracted_landmarks, error_msg = self.extract_landmarks_from_image(image_base64)
            if not extracted_landmarks:
                return {
                    "predicted_sign": None,
                    "confidence": 0.0,
                    "is_correct": False,
                    "status": "no_hand_detected",
                    "feedback": error_msg,
                    "target_sign": target_sign_norm,
                    "top_candidates": [],
                    "inference_time_ms": round((time.time() - start_time) * 1000, 2),
                }
            landmarks = extracted_landmarks

        if not landmarks or len(landmarks) != 21:
            return {
                "predicted_sign": None,
                "confidence": 0.0,
                "is_correct": False,
                "status": "invalid_input",
                "feedback": "21 valid hand landmark keypoints are required for static sign recognition.",
                "target_sign": target_sign_norm,
                "top_candidates": [],
                "inference_time_ms": round((time.time() - start_time) * 1000, 2),
            }

        try:
            feat_vector = self.normalize_landmarks(landmarks).reshape(1, -1)
            probabilities = self.model.predict_proba(feat_vector)[0]
            top_indices = np.argsort(probabilities)[::-1][:3]
            
            predicted_class = self.classes[top_indices[0]]
            confidence = float(probabilities[top_indices[0]])

            top_candidates = [
                {"label": self.classes[idx], "confidence": round(float(probabilities[idx]), 3)}
                for idx in top_indices
            ]

            is_correct = (predicted_class == target_sign_norm) and (confidence >= 0.50)

            if is_correct:
                feedback = f"Great work! Correct sign '{predicted_sign_label(target_sign_norm)}' recognized with {confidence*100:.1f}% confidence."
                status_code = "success"
            elif confidence < 0.40:
                feedback = "Hand shape uncertain. Ensure adequate lighting, steady hand orientation, and finger visibility."
                status_code = "low_confidence"
            else:
                feedback = f"Recognized as '{predicted_class}' instead of target '{target_sign_norm}'. Check finger extension and hand angle."
                status_code = "incorrect_sign"

            elapsed_ms = round((time.time() - start_time) * 1000, 2)
            return {
                "predicted_sign": predicted_class,
                "confidence": round(confidence, 4),
                "is_correct": is_correct,
                "status": status_code,
                "feedback": feedback,
                "target_sign": target_sign_norm,
                "top_candidates": top_candidates,
                "inference_time_ms": elapsed_ms,
            }

        except Exception as e:
            return {
                "predicted_sign": None,
                "confidence": 0.0,
                "is_correct": False,
                "status": "error",
                "feedback": f"Recognition pipeline error: {str(e)}",
                "target_sign": target_sign_norm,
                "top_candidates": [],
                "inference_time_ms": round((time.time() - start_time) * 1000, 2),
            }

def predicted_sign_label(label: str) -> str:
    return label

# Global singleton predictor instance
global_predictor = ISLSignPredictor()
