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
        # ── TOEIC Words (Cambridge Dictionary) ──────────────────────────────────
        # A
        {"word": "Accomplish",   "meaning_vi": "Hoàn thành, đạt được",              "example": "She accomplished all of her targets ahead of schedule.",                  "category": "TOEIC", "difficulty": 2},
        {"word": "Adjacent",     "meaning_vi": "Liền kề, tiếp giáp",               "example": "The conference room is adjacent to the main lobby.",                      "category": "TOEIC", "difficulty": 2},
        {"word": "Allocate",     "meaning_vi": "Phân bổ, phân phối",               "example": "Funds were allocated equally among the three departments.",               "category": "TOEIC", "difficulty": 2},
        {"word": "Amendment",    "meaning_vi": "Sửa đổi, điều chỉnh hợp đồng",     "example": "An amendment to the contract was signed by both parties.",               "category": "TOEIC", "difficulty": 2},
        {"word": "Assemble",     "meaning_vi": "Tập hợp, lắp ráp",                 "example": "Workers assembled the new equipment in under two hours.",                 "category": "TOEIC", "difficulty": 2},
        # B
        {"word": "Budget",       "meaning_vi": "Ngân sách, kinh phí",               "example": "The project came in under budget by 15 per cent.",                       "category": "TOEIC", "difficulty": 1},
        # C
        {"word": "Collaborate",  "meaning_vi": "Hợp tác, cộng tác",                "example": "The two firms collaborated on developing the new software.",              "category": "TOEIC", "difficulty": 2},
        {"word": "Compensate",   "meaning_vi": "Bù đắp, đền bù thiệt hại",         "example": "The airline compensated passengers for the delayed flight.",              "category": "TOEIC", "difficulty": 2},
        {"word": "Comply",       "meaning_vi": "Tuân thủ, chấp hành",               "example": "All staff must comply with the new data protection regulations.",         "category": "TOEIC", "difficulty": 2},
        {"word": "Consecutive",  "meaning_vi": "Liên tiếp, liên tục",               "example": "Sales increased for the fifth consecutive quarter.",                     "category": "TOEIC", "difficulty": 2},
        {"word": "Coordinate",   "meaning_vi": "Phối hợp, điều phối",               "example": "She coordinates travel arrangements for senior executives.",              "category": "TOEIC", "difficulty": 2},
        # D
        {"word": "Deadline",     "meaning_vi": "Hạn chót, thời hạn nộp",            "example": "We must submit the report before Friday's deadline.",                    "category": "TOEIC", "difficulty": 1},
        {"word": "Delegate",     "meaning_vi": "Ủy quyền, giao phó nhiệm vụ",      "example": "A good manager knows how to delegate tasks efficiently.",                "category": "TOEIC", "difficulty": 2},
        {"word": "Determine",    "meaning_vi": "Xác định, quyết định",              "example": "We need to determine the cause of the production delay.",                "category": "TOEIC", "difficulty": 2},
        {"word": "Discrepancy",  "meaning_vi": "Sự chênh lệch, mâu thuẫn số liệu", "example": "The auditor found a discrepancy in the financial records.",             "category": "TOEIC", "difficulty": 3},
        # E
        {"word": "Elaborate",    "meaning_vi": "Giải thích chi tiết, triển khai",   "example": "Could you elaborate on your proposal for the new system?",              "category": "TOEIC", "difficulty": 2},
        {"word": "Eligible",     "meaning_vi": "Đủ điều kiện, đủ tiêu chuẩn",      "example": "Only full-time employees are eligible for the pension scheme.",           "category": "TOEIC", "difficulty": 2},
        {"word": "Endorse",      "meaning_vi": "Chứng thực, ký hậu, ủng hộ",       "example": "The CEO endorsed the merger after reviewing the financial data.",         "category": "TOEIC", "difficulty": 2},
        {"word": "Expedite",     "meaning_vi": "Thúc đẩy, xử lý nhanh",            "example": "The manager asked to expedite the shipment to meet the deadline.",       "category": "TOEIC", "difficulty": 2},
        # F
        {"word": "Facilitate",   "meaning_vi": "Tạo điều kiện, thúc đẩy",          "example": "New software has facilitated communication between remote teams.",       "category": "TOEIC", "difficulty": 2},
        {"word": "Forecast",     "meaning_vi": "Dự báo, dự đoán kết quả",          "example": "The sales forecast for next quarter looks very positive.",               "category": "TOEIC", "difficulty": 2},
        # I
        {"word": "Implement",    "meaning_vi": "Thực hiện, triển khai",             "example": "The new HR policy will be implemented from next month.",                "category": "TOEIC", "difficulty": 2},
        {"word": "Incentive",    "meaning_vi": "Ưu đãi, khuyến khích",             "example": "The company offers performance incentives to boost productivity.",      "category": "TOEIC", "difficulty": 2},
        {"word": "Inventory",    "meaning_vi": "Hàng tồn kho, danh mục hàng hóa",  "example": "An inventory check revealed that three items were out of stock.",       "category": "TOEIC", "difficulty": 2},
        # M
        {"word": "Mandatory",    "meaning_vi": "Bắt buộc, cưỡng bức",              "example": "Attendance at the safety training is mandatory for all employees.",      "category": "TOEIC", "difficulty": 2},
        {"word": "Merchandise",  "meaning_vi": "Hàng hóa, sản phẩm thương mại",    "example": "The new merchandise will be displayed at the trade fair.",              "category": "TOEIC", "difficulty": 2},
        # N
        {"word": "Negotiate",    "meaning_vi": "Đàm phán, thương lượng",            "example": "Both sides agreed to negotiate the terms of the contract.",             "category": "TOEIC", "difficulty": 2},
        # O
        {"word": "Objective",    "meaning_vi": "Mục tiêu, mục đích cụ thể",         "example": "The team's main objective is to increase market share by 10%.",         "category": "TOEIC", "difficulty": 2},
        {"word": "Optimize",     "meaning_vi": "Tối ưu hóa, cải tiến hiệu quả",    "example": "We redesigned the workflow to optimize production efficiency.",           "category": "TOEIC", "difficulty": 2},
        {"word": "Outstanding",  "meaning_vi": "Chưa thanh toán / Xuất sắc",       "example": "There are still three outstanding invoices from last month.",            "category": "TOEIC", "difficulty": 2},
        # P
        {"word": "Preliminary",  "meaning_vi": "Sơ bộ, ban đầu",                   "example": "A preliminary report will be sent to shareholders next week.",          "category": "TOEIC", "difficulty": 2},
        {"word": "Proceed",      "meaning_vi": "Tiến hành, tiến tới",               "example": "Once the contract is signed, we may proceed with the project.",          "category": "TOEIC", "difficulty": 1},
        {"word": "Proficient",   "meaning_vi": "Thành thạo, giỏi về",              "example": "Candidates must be proficient in both English and Japanese.",            "category": "TOEIC", "difficulty": 2},
        # R
        {"word": "Reimburse",    "meaning_vi": "Hoàn tiền, bồi hoàn chi phí",      "example": "The company will reimburse travel expenses within 30 days.",             "category": "TOEIC", "difficulty": 2},
        {"word": "Remuneration", "meaning_vi": "Thù lao, khoản thưởng công",       "example": "Remuneration packages include base salary and performance bonus.",       "category": "TOEIC", "difficulty": 3},
        {"word": "Revenue",      "meaning_vi": "Doanh thu, thu nhập doanh nghiệp",  "example": "The company's annual revenue grew by 12% year on year.",                "category": "TOEIC", "difficulty": 2},
        # S
        {"word": "Scrutinize",   "meaning_vi": "Xem xét kỹ lưỡng, kiểm tra chặt",  "example": "The board will scrutinize the budget proposal before approval.",         "category": "TOEIC", "difficulty": 3},
        {"word": "Stipulate",    "meaning_vi": "Quy định, đặt điều khoản",         "example": "The lease stipulates that pets are not permitted on the premises.",      "category": "TOEIC", "difficulty": 3},
        {"word": "Subsequent",   "meaning_vi": "Tiếp sau, kế tiếp",                "example": "The initial results were good; subsequent tests confirmed the findings.", "category": "TOEIC", "difficulty": 2},
        {"word": "Surplus",      "meaning_vi": "Thặng dư, dư thừa",                "example": "A budget surplus allowed the firm to invest in new equipment.",          "category": "TOEIC", "difficulty": 2},
        # T
        {"word": "Tentative",    "meaning_vi": "Tạm thời, chưa xác định chắc",     "example": "We have set a tentative date for the product launch in July.",           "category": "TOEIC", "difficulty": 2},
        {"word": "Transaction",  "meaning_vi": "Giao dịch, nghiệp vụ kinh doanh",  "example": "All financial transactions must be recorded in the ledger.",             "category": "TOEIC", "difficulty": 2},
        # V
        {"word": "Verify",       "meaning_vi": "Xác minh, kiểm tra tính xác thực",  "example": "Please verify your identity before accessing the system.",              "category": "TOEIC", "difficulty": 2},
        {"word": "Voucher",      "meaning_vi": "Phiếu mua hàng, chứng từ thanh toán","example": "Employees receive a meal voucher worth 50,000 VND per day.",           "category": "TOEIC", "difficulty": 1},

        # ── JLPT N5 Words (Jdict) ───────────────────────────────────────────────
        {"word": "日", "reading": "にち・ひ",     "meaning_vi": "Ngày / Mặt trời",    "example": "日曜日（にちようび）日本語（にほんご）", "category": "JLPT_N5", "difficulty": 1},
        {"word": "月", "reading": "つき・げつ",   "meaning_vi": "Tháng / Mặt trăng",  "example": "月曜日（げつようび）来月（らいげつ）",  "category": "JLPT_N5", "difficulty": 1},
        {"word": "火", "reading": "ひ・か",       "meaning_vi": "Lửa",                "example": "火曜日（かようび）花火（はなび）",      "category": "JLPT_N5", "difficulty": 1},
        {"word": "水", "reading": "みず・すい",   "meaning_vi": "Nước",               "example": "水曜日（すいようび）水道（すいどう）",  "category": "JLPT_N5", "difficulty": 1},
        {"word": "木", "reading": "き・もく",     "meaning_vi": "Cây / Gỗ",           "example": "木曜日（もくようび）木村（きむら）",    "category": "JLPT_N5", "difficulty": 1},
        {"word": "金", "reading": "かね・きん",   "meaning_vi": "Vàng / Tiền",        "example": "金曜日（きんようび）お金（おかね）",    "category": "JLPT_N5", "difficulty": 1},
        {"word": "土", "reading": "つち・ど",     "meaning_vi": "Đất",                "example": "土曜日（どようび）土地（とち）",        "category": "JLPT_N5", "difficulty": 1},
        {"word": "山", "reading": "やま・さん",   "meaning_vi": "Núi",                "example": "富士山（ふじさん）登山（とざん）",      "category": "JLPT_N5", "difficulty": 1},
        {"word": "川", "reading": "かわ・せん",   "meaning_vi": "Sông",               "example": "川（かわ）神奈川（かながわ）",          "category": "JLPT_N5", "difficulty": 1},
        {"word": "田", "reading": "た・でん",     "meaning_vi": "Ruộng lúa",          "example": "田中（たなか）水田（すいでん）",        "category": "JLPT_N5", "difficulty": 1},
        {"word": "人", "reading": "ひと・じん",   "meaning_vi": "Người",              "example": "人（ひと）日本人（にほんじん）",        "category": "JLPT_N5", "difficulty": 1},
        {"word": "大", "reading": "おお・だい",   "meaning_vi": "To lớn",             "example": "大学（だいがく）大きい（おおきい）",    "category": "JLPT_N5", "difficulty": 1},
        {"word": "小", "reading": "ちい・しょう", "meaning_vi": "Nhỏ bé",             "example": "小学校（しょうがっこう）小さい（ちいさい）","category": "JLPT_N5", "difficulty": 1},
        {"word": "上", "reading": "うえ・じょう", "meaning_vi": "Trên",               "example": "上（うえ）上手（じょうず）",            "category": "JLPT_N5", "difficulty": 1},
        {"word": "下", "reading": "した・か",     "meaning_vi": "Dưới",               "example": "下（した）地下（ちか）",                "category": "JLPT_N5", "difficulty": 1},
        {"word": "中", "reading": "なか・ちゅう", "meaning_vi": "Giữa / Trong",       "example": "中（なか）中学校（ちゅうがっこう）",    "category": "JLPT_N5", "difficulty": 1},
        {"word": "本", "reading": "ほん・もと",   "meaning_vi": "Sách / Gốc rễ",      "example": "本（ほん）日本（にほん）",              "category": "JLPT_N5", "difficulty": 1},
        {"word": "語", "reading": "ご・かた",     "meaning_vi": "Ngôn ngữ / Nói",     "example": "日本語（にほんご）英語（えいご）",      "category": "JLPT_N5", "difficulty": 1},
        {"word": "学", "reading": "がく・まな",   "meaning_vi": "Học tập",            "example": "大学（だいがく）学生（がくせい）",      "category": "JLPT_N5", "difficulty": 1},
        {"word": "年", "reading": "ねん・とし",   "meaning_vi": "Năm",                "example": "今年（ことし）来年（らいねん）",        "category": "JLPT_N5", "difficulty": 1},
        {"word": "時", "reading": "じ・とき",     "meaning_vi": "Thời gian / Giờ",    "example": "何時（なんじ）時間（じかん）",          "category": "JLPT_N5", "difficulty": 1},
        {"word": "国", "reading": "くに・こく",   "meaning_vi": "Quốc gia / Đất nước","example": "国（くに）外国（がいこく）",            "category": "JLPT_N5", "difficulty": 1},
        {"word": "見", "reading": "み・けん",     "meaning_vi": "Nhìn / Xem",         "example": "見る（みる）見学（けんがく）",          "category": "JLPT_N5", "difficulty": 1},
        {"word": "聞", "reading": "き・ぶん",     "meaning_vi": "Nghe / Hỏi",         "example": "聞く（きく）新聞（しんぶん）",          "category": "JLPT_N5", "difficulty": 1},
        {"word": "言", "reading": "い・げん",     "meaning_vi": "Nói / Lời nói",      "example": "言う（いう）言語（げんご）",            "category": "JLPT_N5", "difficulty": 1},
        {"word": "食", "reading": "た・しょく",   "meaning_vi": "Ăn / Thức ăn",       "example": "食べる（たべる）食事（しょくじ）",      "category": "JLPT_N5", "difficulty": 1},

        # ── JLPT N4 Words (Jdict) ───────────────────────────────────────────────
        {"word": "会", "reading": "あ・かい",     "meaning_vi": "Gặp / Hội họp",      "example": "会う（あう）会社（かいしゃ）",          "category": "JLPT_N4", "difficulty": 2},
        {"word": "社", "reading": "しゃ",         "meaning_vi": "Công ty / Xã hội",   "example": "会社（かいしゃ）社会（しゃかい）",      "category": "JLPT_N4", "difficulty": 2},
        {"word": "電", "reading": "でん",         "meaning_vi": "Điện",               "example": "電気（でんき）電車（でんしゃ）",        "category": "JLPT_N4", "difficulty": 2},
        {"word": "車", "reading": "くるま・しゃ", "meaning_vi": "Xe / Ô tô",           "example": "電車（でんしゃ）自動車（じどうしゃ）",  "category": "JLPT_N4", "difficulty": 2},
        {"word": "駅", "reading": "えき",         "meaning_vi": "Ga tàu / Bến xe",    "example": "駅（えき）駅前（えきまえ）",            "category": "JLPT_N4", "difficulty": 2},
        {"word": "道", "reading": "みち・どう",   "meaning_vi": "Đường / Con đường",   "example": "道（みち）北海道（ほっかいどう）",      "category": "JLPT_N4", "difficulty": 2},
        {"word": "友", "reading": "とも・ゆう",   "meaning_vi": "Bạn bè",             "example": "友達（ともだち）友人（ゆうじん）",      "category": "JLPT_N4", "difficulty": 2},
        {"word": "家", "reading": "いえ・か",     "meaning_vi": "Nhà / Gia đình",      "example": "家（いえ）家族（かぞく）",              "category": "JLPT_N4", "difficulty": 2},
        {"word": "体", "reading": "からだ・たい", "meaning_vi": "Cơ thể / Thể chất",   "example": "体（からだ）体育（たいいく）",          "category": "JLPT_N4", "difficulty": 2},
        {"word": "手", "reading": "て・しゅ",     "meaning_vi": "Tay",                "example": "手（て）上手（じょうず）",              "category": "JLPT_N4", "difficulty": 2},

        # ── JLPT N3 Words (Jdict) ───────────────────────────────────────────────
        {"word": "決", "reading": "き・けつ",     "meaning_vi": "Quyết định",          "example": "決める（きめる）決定（けってい）",      "category": "JLPT_N3", "difficulty": 2},
        {"word": "意", "reading": "い",           "meaning_vi": "Ý nghĩa / Chú ý",    "example": "意味（いみ）注意（ちゅうい）",          "category": "JLPT_N3", "difficulty": 2},
        {"word": "考", "reading": "かんが・こう", "meaning_vi": "Suy nghĩ / Xem xét", "example": "考える（かんがえる）考え方（かんがえかた）","category": "JLPT_N3", "difficulty": 2},
        {"word": "感", "reading": "かん",         "meaning_vi": "Cảm xúc / Cảm nhận", "example": "感じる（かんじる）感謝（かんしゃ）",    "category": "JLPT_N3", "difficulty": 2},
        {"word": "知", "reading": "し・ち",       "meaning_vi": "Biết / Nhận thức",   "example": "知る（しる）知識（ちしき）",            "category": "JLPT_N3", "difficulty": 2},
        {"word": "続", "reading": "つづ・ぞく",   "meaning_vi": "Tiếp tục / Liên tục", "example": "続く（つづく）続ける（つづける）",      "category": "JLPT_N3", "difficulty": 2},
        {"word": "変", "reading": "か・へん",     "meaning_vi": "Thay đổi / Kỳ lạ",   "example": "変わる（かわる）大変（たいへん）",      "category": "JLPT_N3", "difficulty": 2},
        {"word": "働", "reading": "はたら・どう", "meaning_vi": "Làm việc",            "example": "働く（はたらく）労働（ろうどう）",      "category": "JLPT_N3", "difficulty": 2},
        {"word": "集", "reading": "あつ・しゅう", "meaning_vi": "Tập hợp / Thu thập", "example": "集まる（あつまる）集中（しゅうちゅう）","category": "JLPT_N3", "difficulty": 2},
        {"word": "情", "reading": "なさ・じょう", "meaning_vi": "Tình cảm / Thông tin","example": "感情（かんじょう）情報（じょうほう）",  "category": "JLPT_N3", "difficulty": 3},
        {"word": "煩雑", "reading": "はんざつ",   "meaning_vi": "Phức tạp, rắc rối",   "example": "手続きが煩雑だ。",                       "category": "JLPT_N3", "difficulty": 3},
        {"word": "概念", "reading": "がいねん",   "meaning_vi": "Khái niệm",           "example": "概念を理解する。",                       "category": "JLPT_N3", "difficulty": 2},

        # ── Programming ─────────────────────────────────────────────────────────
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
