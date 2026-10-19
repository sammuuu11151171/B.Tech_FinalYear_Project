import os
import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.db.session import engine, Base, SessionLocal
from app.models.user import User
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt, QuizResponse
from app.models.progress import LessonProgress, PracticeAttempt
from app.models.audit import AuditLog
from app.core.security import hash_password

def create_sample_svgs(static_dir: str):
    """Generates visual SVG sign cards for verified ISL lessons."""
    signs_dir = os.path.join(static_dir, "uploads", "signs")
    os.makedirs(signs_dir, exist_ok=True)

    # Basic alphabet and number keys
    keys = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
    ]

    for key in keys:
        filepath = os.path.join(signs_dir, f"{key}.svg")
        if not os.path.exists(filepath):
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad_{key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="24" fill="url(#grad_{key})" />
  <circle cx="100" cy="100" r="70" fill="#ffffff" fill-opacity="0.15" />
  <text x="100" y="112" font-family="system-ui, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">{key}</text>
  <text x="100" y="165" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#e0e7ff" text-anchor="middle">ISL SIGN</text>
</svg>"""
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(svg_content)

def init_db(db: Session):
    Base.metadata.create_all(bind=engine)

    # 1. Seed Accounts if not present
    admin_user = db.query(User).filter(User.email == "admin@ovia.edu").first()
    if not admin_user:
        admin_user = User(
            email="admin@ovia.edu",
            hashed_password=hash_password("Admin@ovia2026"),
            full_name="System Administrator",
            role="admin",
            is_active=True,
        )
        db.add(admin_user)

    teacher_user = db.query(User).filter(User.email == "teacher@ovia.edu").first()
    if not teacher_user:
        teacher_user = User(
            email="teacher@ovia.edu",
            hashed_password=hash_password("Teacher@ovia2026"),
            full_name="Priya Deshmukh (ISL Educator)",
            role="teacher",
            is_active=True,
        )
        db.add(teacher_user)

    student_user = db.query(User).filter(User.email == "student@ovia.edu").first()
    if not student_user:
        student_user = User(
            email="student@ovia.edu",
            hashed_password=hash_password("Student@ovia2026"),
            full_name="Aarav Sharma",
            role="student",
            is_active=True,
        )
        db.add(student_user)

    db.commit()

    # 2. Seed Lessons
    if db.query(Lesson).count() == 0:
        lessons_data = [
            # Alphabets
            {
                "title": "Alphabet A - Closed Fist",
                "sign_label": "A",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter A in Indian Sign Language is formed by making a closed fist with thumb rested beside index finger.",
                "instructions": "1. Make a firm closed fist with your dominant hand.\n2. Keep your four fingers folded into the palm.\n3. Rest your thumb straight along the side of the curled index finger pointing upward.\n4. Hold at chest height facing outward.",
                "reference_image_url": "/static/uploads/signs/A.svg",
                "order_index": 1,
            },
            {
                "title": "Alphabet B - Open Flat Palm",
                "sign_label": "B",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter B is signed with all four fingers extended together vertically and thumb folded across the palm.",
                "instructions": "1. Extend index, middle, ring, and pinky straight upward.\n2. Press fingers firmly side-by-side.\n3. Fold your thumb across your palm horizontally.\n4. Palm faces directly forward.",
                "reference_image_url": "/static/uploads/signs/B.svg",
                "order_index": 2,
            },
            {
                "title": "Alphabet C - Curved Semi-circle",
                "sign_label": "C",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter C is visually represented by arching all fingers and thumb into a smooth letter C contour.",
                "instructions": "1. Curve your four fingers smoothly downward.\n2. Curve your thumb upward opposite the fingers.\n3. Keep the opening oriented horizontally to display the letter shape.\n4. Hold hand relaxed at chest level.",
                "reference_image_url": "/static/uploads/signs/C.svg",
                "order_index": 3,
            },
            {
                "title": "Alphabet D - Index Upward with Base Arc",
                "sign_label": "D",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter D features an extended vertical index finger with the remaining fingers meeting the thumb.",
                "instructions": "1. Point the index finger vertically straight up.\n2. Form a loop with the thumb touching middle, ring, and pinky fingertips.\n3. Hold the palm oriented sideways so the loop and stem are distinct.",
                "reference_image_url": "/static/uploads/signs/D.svg",
                "order_index": 4,
            },
            {
                "title": "Alphabet E - Curled Claw",
                "sign_label": "E",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter E is articulated by curling all four fingertips inward with thumb pressed below.",
                "instructions": "1. Curl the four fingertips sharply toward the upper palm.\n2. Tuck the thumb flat under the tips of the fingers.\n3. Palm faces forward toward the viewer.",
                "reference_image_url": "/static/uploads/signs/E.svg",
                "order_index": 5,
            },
            {
                "title": "Alphabet K - Index and Middle Spread",
                "sign_label": "K",
                "category": "alphabet",
                "difficulty": "intermediate",
                "description": "The letter K features an extended V-split index and middle finger with thumb anchored between.",
                "instructions": "1. Extend index and middle fingers upward in a separated V configuration.\n2. Place thumb tip resting between the bases of index and middle.\n3. Fold ring and pinky fingers tightly into palm.",
                "reference_image_url": "/static/uploads/signs/K.svg",
                "order_index": 11,
            },
            {
                "title": "Alphabet L - Perpendicular Angle",
                "sign_label": "L",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter L forms a crisp 90-degree right angle between extended index and thumb.",
                "instructions": "1. Point index finger straight up.\n2. Extend thumb 90 degrees outward to the side.\n3. Curl middle, ring, and pinky into the palm.\n4. Palm faces outward.",
                "reference_image_url": "/static/uploads/signs/L.svg",
                "order_index": 12,
            },
            {
                "title": "Alphabet V - Victory Spread",
                "sign_label": "V",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "The letter V is signed by extending index and middle fingers in a clear split upward.",
                "instructions": "1. Extend index and middle fingers upward spread apart.\n2. Fold thumb over ring and pinky fingers.\n3. Palm faces forward.",
                "reference_image_url": "/static/uploads/signs/V.svg",
                "order_index": 22,
            },
            # Numbers
            {
                "title": "Number 1 - Single Index",
                "sign_label": "1",
                "category": "number",
                "difficulty": "beginner",
                "description": "Standard single-handed count for 1 in Indian Sign Language.",
                "instructions": "1. Raise dominant index finger vertically.\n2. Fold thumb over curled middle, ring, and pinky.\n3. Palm or back of hand faces forward steadily.",
                "reference_image_url": "/static/uploads/signs/1.svg",
                "order_index": 27,
            },
            {
                "title": "Number 2 - Dual Finger Count",
                "sign_label": "2",
                "category": "number",
                "difficulty": "beginner",
                "description": "Standard count for 2 in Indian Sign Language.",
                "instructions": "1. Raise index and middle fingers vertically.\n2. Keep thumb folded over ring and little fingers.\n3. Palm faces outward toward observer.",
                "reference_image_url": "/static/uploads/signs/2.svg",
                "order_index": 28,
            },
            {
                "title": "Number 3 - Triple Finger Count",
                "sign_label": "3",
                "category": "number",
                "difficulty": "beginner",
                "description": "Standard count for 3 in ISL curricula.",
                "instructions": "1. Extend index, middle, and ring fingers upward.\n2. Thumb holds pinky finger down against the palm.\n3. Palm faces outward.",
                "reference_image_url": "/static/uploads/signs/3.svg",
                "order_index": 29,
            },
            {
                "title": "Number 5 - Full Open Hand",
                "sign_label": "5",
                "category": "number",
                "difficulty": "beginner",
                "description": "Standard count for 5 with full palm extended.",
                "instructions": "1. Open dominant hand fully with all 5 digits extended.\n2. Space fingers comfortably.\n3. Palm oriented toward camera.",
                "reference_image_url": "/static/uploads/signs/5.svg",
                "order_index": 31,
            },
            {
                "title": "Number 8 - Dialectal & Two-Hand Count",
                "sign_label": "8",
                "category": "number",
                "difficulty": "intermediate",
                "description": "Indian Sign Language number 8 represented in standard curriculum.",
                "instructions": "1. Non-dominant hand displays open 5 fingers.\n2. Dominant hand shows 3 fingers adjacent to indicate 8.\n3. Alternatively, touch middle finger to thumb while keeping index, ring, pinky extended.",
                "reference_image_url": "/static/uploads/signs/8.svg",
                "order_index": 34,
            },
        ]

        for item in lessons_data:
            lesson = Lesson(**item)
            db.add(lesson)
        db.commit()

    # 3. Seed Initial Quizzes
    if db.query(Quiz).count() == 0:
        q1 = Quiz(
            title="ISL Alphabets Beginner Assessment",
            category="alphabet",
            description="Test your recognition of fundamental static ISL alphabet signs.",
            time_limit_seconds=180,
            passing_score=70,
            created_by=teacher_user.id if teacher_user else None,
            is_published=True,
        )
        db.add(q1)
        db.flush()

        questions_q1 = [
            {
                "quiz_id": q1.id,
                "question_text": "Which hand configuration represents the letter 'A' in Indian Sign Language?",
                "question_type": "multiple_choice",
                "options_json": json.dumps([
                    "Closed fist with thumb resting vertically along the index finger",
                    "Open flat palm with all fingers spread wide",
                    "Index and middle fingers extended in a V-shape",
                    "Index finger extended pointing horizontally to the side",
                ]),
                "correct_answer": "Closed fist with thumb resting vertically along the index finger",
                "points": 10,
                "order_index": 1,
            },
            {
                "quiz_id": q1.id,
                "question_text": "How is the static ISL sign for the letter 'L' formed?",
                "question_type": "multiple_choice",
                "options_json": json.dumps([
                    "Thumb and index finger held perpendicular at a 90-degree angle",
                    "All five fingers curled like a claw",
                    "Index and little finger extended like horns",
                    "Two index fingers crossed together",
                ]),
                "correct_answer": "Thumb and index finger held perpendicular at a 90-degree angle",
                "points": 10,
                "order_index": 2,
            },
            {
                "quiz_id": q1.id,
                "question_text": "Perform the ISL sign for letter 'B' using your webcam.",
                "question_type": "sign_practice",
                "options_json": json.dumps(["B"]),
                "correct_answer": "B",
                "target_sign": "B",
                "points": 15,
                "order_index": 3,
            },
        ]
        for q in questions_q1:
            db.add(QuizQuestion(**q))

        q2 = Quiz(
            title="ISL Numbers 1-10 Proficiency Quiz",
            category="number",
            description="Assess your ability to distinguish and perform single and two-digit numbers.",
            time_limit_seconds=180,
            passing_score=70,
            created_by=teacher_user.id if teacher_user else None,
            is_published=True,
        )
        db.add(q2)
        db.flush()

        questions_q2 = [
            {
                "quiz_id": q2.id,
                "question_text": "How many fingers are extended to sign the number 5 in ISL?",
                "question_type": "multiple_choice",
                "options_json": json.dumps(["All 5 fingers", "Only thumb and pinky", "3 fingers", "Index and thumb only"]),
                "correct_answer": "All 5 fingers",
                "points": 10,
                "order_index": 1,
            },
            {
                "quiz_id": q2.id,
                "question_text": "Demonstrate the ISL sign for number '1' using the webcam practice interface.",
                "question_type": "sign_practice",
                "options_json": json.dumps(["1"]),
                "correct_answer": "1",
                "target_sign": "1",
                "points": 15,
                "order_index": 2,
            },
        ]
        for q in questions_q2:
            db.add(QuizQuestion(**q))
        db.commit()

    # 4. Seed realistic learner progress for demo student Aarav
    if student_user and db.query(LessonProgress).filter(LessonProgress.user_id == student_user.id).count() == 0:
        now = datetime.now(timezone.utc)
        l_a = db.query(Lesson).filter(Lesson.sign_label == "A").first()
        l_b = db.query(Lesson).filter(Lesson.sign_label == "B").first()
        l_c = db.query(Lesson).filter(Lesson.sign_label == "C").first()
        l_k = db.query(Lesson).filter(Lesson.sign_label == "K").first()

        if l_a:
            db.add(LessonProgress(user_id=student_user.id, lesson_id=l_a.id, status="completed", completed_at=now - timedelta(days=2), last_accessed_at=now - timedelta(days=2)))
        if l_b:
            db.add(LessonProgress(user_id=student_user.id, lesson_id=l_b.id, status="completed", completed_at=now - timedelta(days=1), last_accessed_at=now - timedelta(days=1)))
        if l_c:
            db.add(LessonProgress(user_id=student_user.id, lesson_id=l_c.id, status="in_progress", last_accessed_at=now - timedelta(hours=3)))

        # Add practice attempts (including one struggle with 'K' to demonstrate the transparent rule-based revision system!)
        if l_a:
            db.add(PracticeAttempt(user_id=student_user.id, lesson_id=l_a.id, target_sign="A", predicted_sign="A", confidence=0.91, is_correct=True, feedback_notes="Great execution!"))
        if l_b:
            db.add(PracticeAttempt(user_id=student_user.id, lesson_id=l_b.id, target_sign="B", predicted_sign="B", confidence=0.88, is_correct=True, feedback_notes="Clean palm display."))
        if l_k:
            db.add(PracticeAttempt(user_id=student_user.id, lesson_id=l_k.id, target_sign="K", predicted_sign="V", confidence=0.55, is_correct=False, feedback_notes="Thumb position slipped."))
            db.add(PracticeAttempt(user_id=student_user.id, lesson_id=l_k.id, target_sign="K", predicted_sign="D", confidence=0.48, is_correct=False, feedback_notes="Middle finger bent."))

        db.commit()

    print("[init_db] Database initialized and verified seed data populated.")

if __name__ == "__main__":
    db = SessionLocal()
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
    create_sample_svgs(static_dir)
    init_db(db)
    db.close()
