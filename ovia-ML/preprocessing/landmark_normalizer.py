import numpy as np
from typing import List, Union

def normalize_landmarks(landmarks: Union[List[dict], np.ndarray]) -> np.ndarray:
    """
    Normalizes 21 3D hand landmarks (x, y, z) to be scale and translation invariant.
    1. Sets wrist (point 0) as origin (0, 0, 0).
    2. Computes the maximum distance from wrist to any landmark (bounding scale).
    3. Divides all coordinates by this scale to normalize within [-1, 1].
    Returns a 1D feature vector of length 63.
    """
    if isinstance(landmarks, list):
        if len(landmarks) == 0:
            return np.zeros(63, dtype=np.float32)
        # Check if items are dicts or objects with x, y, z
        if hasattr(landmarks[0], 'x'):
            coords = np.array([[lm.x, lm.y, lm.z] for lm in landmarks], dtype=np.float32)
        elif isinstance(landmarks[0], dict):
            coords = np.array([[lm['x'], lm['y'], lm.get('z', 0.0)] for lm in landmarks], dtype=np.float32)
        else:
            coords = np.array(landmarks, dtype=np.float32)
    else:
        coords = np.array(landmarks, dtype=np.float32)

    if coords.ndim == 1:
        coords = coords.reshape(-1, 3)

    if len(coords) != 21:
        raise ValueError(f"Expected 21 landmarks, received {len(coords)}")

    # Translate wrist (landmark 0) to origin
    wrist = coords[0]
    translated = coords - wrist

    # Normalize by maximum Euclidean distance (palm/hand span)
    distances = np.linalg.norm(translated, axis=1)
    max_dist = np.max(distances)
    if max_dist > 1e-6:
        normalized = translated / max_dist
    else:
        normalized = translated

    return normalized.flatten()
