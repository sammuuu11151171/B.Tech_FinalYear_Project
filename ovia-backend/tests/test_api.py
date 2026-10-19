import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_auth_login_seed_student():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "student@ovia.edu", "password": "Student@ovia2026"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"

def test_auth_login_seed_admin():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@ovia.edu", "password": "Admin@ovia2026"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "admin"

def test_auth_invalid_credentials():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "student@ovia.edu", "password": "WrongPassword!"},
    )
    assert response.status_code == 401

def test_get_lessons():
    response = client.get("/api/v1/lessons")
    assert response.status_code == 200
    lessons = response.json()
    assert len(lessons) > 0
    # Verify first lesson is A
    assert lessons[0]["sign_label"] == "A"

def test_get_quizzes():
    response = client.get("/api/v1/quizzes")
    assert response.status_code == 200
    quizzes = response.json()
    assert len(quizzes) > 0

def test_quiz_detail_omits_answers():
    response = client.get("/api/v1/quizzes/1")
    assert response.status_code == 200
    quiz = response.json()
    assert len(quiz["questions"]) > 0
    for q in quiz["questions"]:
        assert "correct_answer" not in q

def test_role_based_access_denied_for_student():
    # Login as student
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@ovia.edu", "password": "Student@ovia2026"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Student trying to access admin endpoint must receive 403 Forbidden
    admin_resp = client.get("/api/v1/admin/overview", headers=headers)
    assert admin_resp.status_code == 403

def test_admin_access_allowed():
    # Login as admin
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@ovia.edu", "password": "Admin@ovia2026"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    admin_resp = client.get("/api/v1/admin/overview", headers=headers)
    assert admin_resp.status_code == 200
    data = admin_resp.json()
    assert "total_users" in data
    assert data["total_users"] >= 3

def test_rag_chatbot():
    # Login as student
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@ovia.edu", "password": "Student@ovia2026"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    chat_resp = client.post(
        "/api/v1/chatbot/ask",
        json={"message": "How do I perform the sign for K in Indian Sign Language?"},
        headers=headers,
    )
    assert chat_resp.status_code == 200
    data = chat_resp.json()
    assert data["is_grounded"] == True
    assert len(data["sources"]) > 0
    assert "K" in data["answer"] or "index" in data["answer"].lower()

def test_recognition_predict():
    # Test valid landmarks input for 'A'
    landmarks = [{"x": 0.0, "y": 0.0, "z": 0.0} for _ in range(21)]
    predict_resp = client.post(
        "/api/v1/recognition/predict",
        json={"target_sign": "A", "landmarks": landmarks},
    )
    assert predict_resp.status_code == 200
    data = predict_resp.json()
    assert "predicted_sign" in data
    assert "confidence" in data
    assert "status" in data
