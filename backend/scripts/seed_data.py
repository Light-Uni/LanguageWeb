"""
Seeder script to populate initial database data for LinguaFlow
Run using: python scripts/seed_data.py
"""
import os
import sys
import django
from datetime import date, datetime, timedelta

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "linguaflow.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from apps.courses.models import Course, Lesson, Question, UserCourse
from apps.vocabulary.models import Vocabulary, UserVocabulary
from apps.planner.models import StudyTask, StudySession

User = get_user_model()


def seed_database():
    print("Starting database seeding...")

    # 1. Create Users
    print("Creating users...")
    admin_user, created = User.objects.get_or_create(
        username="admin@linguaflow.com",
        defaults={
            "email": "admin@linguaflow.com",
            "role": "admin",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    if created:
        admin_user.set_password("adminpass")
        admin_user.save()
        print("Created admin user.")
    else:
        print("Admin user already exists.")

    student_user, created = User.objects.get_or_create(
        username="nguyen.an@email.com",
        defaults={
            "email": "nguyen.an@email.com",
            "role": "student",
            "xp_total": 4250,
            "streak_days": 42,
            "last_study": date.today(),
            "toeic_target": 750,
            "jlpt_target": "N3"
        }
    )
    if created:
        student_user.set_password("studentpass")
        student_user.save()
        print("Created student user.")
    else:
        # Update details to match mock user
        student_user.xp_total = 4250
        student_user.streak_days = 42
        student_user.last_study = date.today()
        student_user.save()
        print("Student user updated.")

    # 2. Create Courses
    print("Creating courses...")
    c_toeic, _ = Course.objects.get_or_create(
        title="Luyện thi TOEIC 990 điểm",
        defaults={
            "description": "Chuẩn ETS · AI phân tích điểm yếu · Lộ trình cá nhân hóa",
            "category": "toeic",
            "level": "ETS 2025",
            "duration_days": 120
        }
    )

    c_japanese, _ = Course.objects.get_or_create(
        title="Tiếng Nhật JLPT N5-N1",
        defaults={
            "description": "Học bảng chữ cái Hiragana, Katakana, Kanji và từ vựng chuẩn JLPT.",
            "category": "japanese",
            "level": "N5-N1",
            "duration_days": 90
        }
    )

    c_programming, _ = Course.objects.get_or_create(
        title="Lập trình Python & Web cơ bản",
        defaults={
            "description": "Khóa học nền tảng lập trình Python, JavaScript và phát triển tư duy thuật toán.",
            "category": "programming",
            "level": "Beginner",
            "duration_days": 30
        }
    )

    # Enroll student in courses
    UserCourse.objects.get_or_create(user=student_user, course=c_toeic, defaults={"progress_pct": 79})
    UserCourse.objects.get_or_create(user=student_user, course=c_japanese, defaults={"progress_pct": 64})
    UserCourse.objects.get_or_create(user=student_user, course=c_programming, defaults={"progress_pct": 51})
    print("Courses created & student enrolled.")

    # 3. Create Lessons
    print("Creating lessons...")
    # TOEIC Lessons
    l_toeic_1, _ = Lesson.objects.get_or_create(
        course=c_toeic, title="TOEIC Listening Overview",
        defaults={"order": 1, "lesson_type": "text", "content": "Welcome to TOEIC Listening. This course covers Part 1 to Part 4."}
    )
    l_toeic_2, _ = Lesson.objects.get_or_create(
        course=c_toeic, title="TOEIC Listening Part 1-3 Practice",
        defaults={"order": 2, "lesson_type": "quiz", "content": "Complete this quiz to test your listening skills."}
    )
    l_toeic_3, _ = Lesson.objects.get_or_create(
        course=c_toeic, title="TOEIC Reading Part 7 Practice",
        defaults={"order": 3, "lesson_type": "quiz", "content": "Practice reading comprehension with company memos."}
    )

    # Japanese Lessons
    l_jp_1, _ = Lesson.objects.get_or_create(
        course=c_japanese, title="Bảng chữ cái Hiragana & Katakana",
        defaults={"order": 1, "lesson_type": "text", "content": "Learn Japanese alphabet: あいうえお, アイウエオ."}
    )
    l_jp_2, _ = Lesson.objects.get_or_create(
        course=c_japanese, title="Kanji N5 cơ bản",
        defaults={"order": 2, "lesson_type": "text", "content": "Learn first 16 Kanji: 日, 月, 火, 水, 木, 金, 土, 山, 川, 田, 人, 大, 小, 上, 下, 中."}
    )

    # Programming Lessons
    l_pr_1, _ = Lesson.objects.get_or_create(
        course=c_programming, title="Python Basics — Variables & Types",
        defaults={"order": 1, "lesson_type": "text", "content": "Basic variables: string, int, float, boolean."}
    )
    l_pr_2, _ = Lesson.objects.get_or_create(
        course=c_programming, title="Control Flow — if/else, loops",
        defaults={"order": 2, "lesson_type": "text", "content": "Conditionals (if/elif/else) and loops (for/while)."}
    )
    print("Lessons created.")

    # 4. Create Questions
    print("Creating questions...")
    # TOEIC Part 1
    Question.objects.get_or_create(
        lesson=l_toeic_2,
        content="What is the man doing?",
        defaults={
            "part": 1,
            "q_type": "multiple_choice",
            "options_json": [
                "He is talking on the phone.",
                "He is working on a computer.",
                "He is reading a book.",
                "He is writing a letter."
            ],
            "correct_answer": "He is working on a computer.",
            "explanation": "The picture shows a man sitting at a desk working on a computer."
        }
    )
    # TOEIC Part 2
    Question.objects.get_or_create(
        lesson=l_toeic_2,
        content="When will the meeting start?",
        defaults={
            "part": 2,
            "q_type": "multiple_choice",
            "options_json": ["At 9 AM", "At 10 AM", "At 11 AM"],
            "correct_answer": "At 9 AM",
            "explanation": "The response indicates the meeting starts at 9 AM."
        }
    )
    # TOEIC Part 3
    Question.objects.get_or_create(
        lesson=l_toeic_2,
        content="What are the speakers discussing?",
        defaults={
            "part": 3,
            "q_type": "multiple_choice",
            "options_json": [
                "A project deadline",
                "A business trip",
                "A job interview",
                "A product launch"
            ],
            "correct_answer": "A project deadline",
            "explanation": "They mention they need to finish the report before the deadline."
        }
    )
    # TOEIC Reading Part 7
    Question.objects.get_or_create(
        lesson=l_toeic_3,
        content="[Passage]\nTo: All Staff\nFrom: HR Department\nDate: May 15, 2025\nSubject: Annual Performance Reviews\n\nPlease be advised that annual performance reviews will be conducted from June 1–30. All managers are required to schedule one-on-one meetings with their direct reports within this period.\n\n[Question] When will performance reviews take place?",
        defaults={
            "part": 7,
            "q_type": "multiple_choice",
            "options_json": ["May 1–31", "June 1–30", "July 1–31", "August 1–31"],
            "correct_answer": "June 1–30",
            "explanation": "According to the passage, reviews will take place from June 1-30."
        }
    )
    Question.objects.get_or_create(
        lesson=l_toeic_3,
        content="[Passage]\nTo: All Staff\nFrom: HR Department\nDate: May 15, 2025\nSubject: Annual Performance Reviews\n\nEmployees should prepare a self-assessment form available on the company intranet by May 25. For questions, contact HR at hr@company.com.\n\n[Question] What must employees submit by May 25?",
        defaults={
            "part": 7,
            "q_type": "multiple_choice",
            "options_json": ["A resume", "A self-assessment form", "A project report", "A time sheet"],
            "correct_answer": "A self-assessment form",
            "explanation": "The memo requests employees prepare a self-assessment form by May 25."
        }
    )
    print("Questions created.")

    # 5. Create Vocabulary
    print("Creating vocabulary list...")
    vocab_items = [
        # TOEIC Words
        {"word": "Accomplish", "meaning_vi": "Hoàn thành, đạt được", "example": "She accomplished all her goals this year.", "category": "TOEIC", "difficulty": 2},
        {"word": "Adjacent", "meaning_vi": "Liền kề, gần bên", "example": "The office is adjacent to the conference room.", "category": "TOEIC", "difficulty": 2},
        {"word": "Allocate", "meaning_vi": "Phân bổ, phân phối", "example": "We need to allocate more resources to marketing.", "category": "TOEIC", "difficulty": 2},
        {"word": "Amendment", "meaning_vi": "Sửa đổi, bổ sung", "example": "The contract amendment was signed yesterday.", "category": "TOEIC", "difficulty": 2},
        {"word": "Collaborate", "meaning_vi": "Hợp tác, cộng tác", "example": "The two companies decided to collaborate on the project.", "category": "TOEIC", "difficulty": 2},
        {"word": "Deadline", "meaning_vi": "Hạn chót, thời hạn", "example": "We must meet the project deadline.", "category": "TOEIC", "difficulty": 1},
        {"word": "Remuneration", "meaning_vi": "Thù lao, tiền công", "example": "He received generous remuneration for his services.", "category": "TOEIC", "difficulty": 3},
        {"word": "Stipulate", "meaning_vi": "Quy định, đặt điều kiện", "example": "The agreement stipulates that payments must be made on time.", "category": "TOEIC", "difficulty": 3},
        
        # JLPT N5 Words
        {"word": "日", "reading": "にち・ひ", "meaning_vi": "Ngày / Mặt trời", "example": "日曜日 (Chủ nhật)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "月", "reading": "つき・げつ", "meaning_vi": "Tháng / Mặt trăng", "example": "月曜日 (Thứ hai)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "火", "reading": "ひ・か", "meaning_vi": "Lửa", "example": "火曜日 (Thứ ba)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "水", "reading": "みず・すい", "meaning_vi": "Nước", "example": "水曜日 (Thứ tư)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "木", "reading": "き・もく", "meaning_vi": "Cây / Gỗ", "example": "木曜日 (Thứ năm)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "金", "reading": "かね・きん", "meaning_vi": "Vàng / Tiền", "example": "金曜日 (Thứ sáu)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "土", "reading": "つち・ど", "meaning_vi": "Đất", "example": "土曜日 (Thứ bảy)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "山", "reading": "やま・さん", "meaning_vi": "Núi", "example": "富士山 (Núi Phú Sĩ)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "川", "reading": "かわ・せん", "meaning_vi": "Sông", "example": "メコン川 (Sông Mekong)", "category": "JLPT_N5", "difficulty": 1},
        {"word": "田", "reading": "た・でん", "meaning_vi": "Ruộng lúa", "example": "山田さん (Anh Yamada)", "category": "JLPT_N5", "difficulty": 1},

        # JLPT N3 Words
        {"word": "煩雑", "reading": "はんざつ", "meaning_vi": "Phức tạp, rắc rối", "example": "手続きが煩雑だ。", "category": "JLPT_N3", "difficulty": 3},
        {"word": "概念", "reading": "がいねん", "meaning_vi": "Khái niệm", "example": "概念を理解する。", "category": "JLPT_N3", "difficulty": 2},

        # Programming
        {"word": "Polymorphism", "meaning_vi": "Đa hình (OOP)", "example": "Polymorphism simplifies code maintenance.", "category": "Programming", "difficulty": 3},
    ]

    for item in vocab_items:
        vocab, _ = Vocabulary.objects.get_or_create(
            word=item["word"],
            category=item["category"],
            defaults={
                "reading": item.get("reading", ""),
                "meaning_vi": item["meaning_vi"],
                "example": item["example"],
                "difficulty": item["difficulty"]
            }
        )
        # Add to user vocabulary progress
        UserVocabulary.objects.get_or_create(
            user=student_user,
            vocab=vocab,
            defaults={
                "next_review": date.today(),
                "correct_count": 5 if item["word"] in ["Deadline", "日"] else 1,
                "wrong_count": 5 if item["word"] in ["Remuneration", "煩雑"] else 0,
            }
        )

    print("Vocabulary seeded.")

    # 6. Create Study Tasks
    print("Creating study tasks...")
    # Today's date
    today = date.today()
    tomorrow = today + timedelta(days=1)

    StudyTask.objects.get_or_create(
        user=student_user,
        title="TOEIC Listening Part 1-2",
        defaults={
            "subject": "TOEIC",
            "scheduled_date": today,
            "time_slot": "08:00:00",
            "duration_min": 30,
            "color": "#3B82F6",
            "is_completed": True
        }
    )

    StudyTask.objects.get_or_create(
        user=student_user,
        title="Kanji N3: 火・水・木",
        defaults={
            "subject": "Japanese",
            "scheduled_date": today,
            "time_slot": "10:00:00",
            "duration_min": 20,
            "color": "#8B5CF6",
            "is_completed": False
        }
    )

    StudyTask.objects.get_or_create(
        user=student_user,
        title="Python OOP Basics",
        defaults={
            "subject": "Programming",
            "scheduled_date": today,
            "time_slot": "14:00:00",
            "duration_min": 45,
            "color": "#10B981",
            "is_completed": False
        }
    )

    StudyTask.objects.get_or_create(
        user=student_user,
        title="TOEIC Mock Test Part 7",
        defaults={
            "subject": "TOEIC",
            "scheduled_date": tomorrow,
            "time_slot": "09:00:00",
            "duration_min": 60,
            "color": "#3B82F6",
            "is_completed": False
        }
    )

    # Add a study session for the heatmap (last 10 days)
    for i in range(10):
        session_date = today - timedelta(days=i)
        # Skip some days
        if i in [2, 5]:
            continue
        started = datetime.combine(session_date, datetime.min.time()) + timedelta(hours=19)
        StudySession.objects.get_or_create(
            user=student_user,
            started_at=started,
            defaults={
                "subject": "TOEIC" if i % 2 == 0 else "Japanese",
                "ended_at": started + timedelta(minutes=45),
                "duration_min": 45,
                "xp_earned": 25,
                "notes": f"Seeded study session for day -{i}"
            }
        )

    print("Study tasks & sessions seeded successfully.")
    print("Database seeding completed!")


if __name__ == "__main__":
    seed_database()
