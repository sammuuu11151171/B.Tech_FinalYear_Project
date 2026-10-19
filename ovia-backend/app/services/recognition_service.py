import sys
import os
from typing import Optional
from sqlalchemy.orm import Session

# Add ovia-ML to sys.path
ml_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ovia-ML"))
if ml_dir not in sys.path:
    sys.path.insert(0, ml_dir)

from inference.predictor import global_predictor
from app.models.progress import PracticeAttempt
from app.models.user import User
from app.schemas.recognition import PredictRequest, PredictResponse

def process_sign_prediction(
    db: Session,
    request: PredictRequest,
    current_user: Optional[User] = None,
) -> PredictResponse:
    # Run ML prediction
    result = global_predictor.predict(
        target_sign=request.target_sign,
        landmarks=request.landmarks,
        image_base64=request.image_base64,
    )

    # If authenticated user, save practice attempt record
    if current_user and result.get("predicted_sign"):
        attempt = PracticeAttempt(
            user_id=current_user.id,
            lesson_id=request.lesson_id,
            target_sign=request.target_sign.upper().strip(),
            predicted_sign=result["predicted_sign"],
            confidence=result["confidence"],
            is_correct=result["is_correct"],
            feedback_notes=result["feedback"],
        )
        db.add(attempt)
        db.commit()

    return PredictResponse(
        predicted_sign=result.get("predicted_sign"),
        confidence=result.get("confidence", 0.0),
        is_correct=result.get("is_correct", False),
        status=result.get("status", "error"),
        feedback=result.get("feedback", "Unable to evaluate sign."),
        target_sign=result.get("target_sign", request.target_sign),
        top_candidates=result.get("top_candidates", []),
        inference_time_ms=result.get("inference_time_ms", 0.0),
    )
