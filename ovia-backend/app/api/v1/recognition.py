import os
import json
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_optional_user
from app.models.user import User
from app.schemas.recognition import PredictRequest, PredictResponse
from app.services import recognition_service
import sys

ml_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ovia-ML"))
if ml_dir not in sys.path:
    sys.path.insert(0, ml_dir)
from inference.predictor import global_predictor

router = APIRouter(prefix="/recognition", tags=["Sign Recognition"])

@router.post("/predict", response_model=PredictResponse)
def predict_sign(
    request: PredictRequest,
    current_user: User = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Evaluates a webcam frame or 21-point hand landmarks against the target ISL sign.
    Returns predicted label, confidence, correctness, and supportive visual feedback.
    """
    return recognition_service.process_sign_prediction(db, request, current_user=current_user)

@router.get("/model-info")
def get_model_info():
    """Returns metadata about the active ML model, supported vocabulary, and status."""
    metrics_path = os.path.join(ml_dir, "models", "metrics_report.json")
    metrics = {}
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, "r") as f:
                metrics = json.load(f)
        except Exception:
            metrics = {}

    return {
        "is_configured": global_predictor.is_configured(),
        "model_type": "RandomForest Landmark Classifier",
        "supported_classes": global_predictor.classes,
        "classes_count": len(global_predictor.classes),
        "metrics": metrics,
    }
