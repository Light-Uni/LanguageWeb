"""
Management command: fetch_dictionary_data
=========================================
Fetches real vocabulary data from free public dictionary APIs and populates
the Vocabulary table with authentic definitions, POS, examples, and audio URLs.

Sources:
  English (TOEIC): Free Dictionary API  — https://api.dictionaryapi.dev
                   (Cambridge-sourced definitions via the open API)
  Japanese (JLPT): Jisho API            — https://jisho.org/api/v1/search/words

Usage:
  python manage.py fetch_dictionary_data
  python manage.py fetch_dictionary_data --category TOEIC
  python manage.py fetch_dictionary_data --category JLPT_N5
  python manage.py fetch_dictionary_data --update-existing
"""

import time
import logging
import requests
from django.core.management.base import BaseCommand, CommandError
from apps.vocabulary.models import Vocabulary

logger = logging.getLogger(__name__)

# ── TOEIC word list (high-frequency business English) ─────────────────────────
TOEIC_WORDS = [
    # A
    ("Accomplish",   "TOEIC", 2),
    ("Adjacent",     "TOEIC", 2),
    ("Allocate",     "TOEIC", 2),
    ("Amendment",    "TOEIC", 2),
    ("Assemble",     "TOEIC", 2),
    ("Authorize",    "TOEIC", 2),
    # B
    ("Budget",       "TOEIC", 1),
    ("Beneficial",   "TOEIC", 2),
    # C
    ("Collaborate",  "TOEIC", 2),
    ("Compensate",   "TOEIC", 2),
    ("Comply",       "TOEIC", 2),
    ("Consecutive",  "TOEIC", 2),
    ("Coordinate",   "TOEIC", 2),
    ("Credentials",  "TOEIC", 2),
    # D
    ("Deadline",     "TOEIC", 1),
    ("Delegate",     "TOEIC", 2),
    ("Determine",    "TOEIC", 2),
    ("Discrepancy",  "TOEIC", 3),
    # E
    ("Elaborate",    "TOEIC", 2),
    ("Eligible",     "TOEIC", 2),
    ("Endorse",      "TOEIC", 2),
    ("Expedite",     "TOEIC", 2),
    # F
    ("Facilitate",   "TOEIC", 2),
    ("Forecast",     "TOEIC", 2),
    # I
    ("Implement",    "TOEIC", 2),
    ("Incentive",    "TOEIC", 2),
    ("Inventory",    "TOEIC", 2),
    # M
    ("Mandatory",    "TOEIC", 2),
    ("Merchandise",  "TOEIC", 2),
    # N
    ("Negotiate",    "TOEIC", 2),
    # O
    ("Objective",    "TOEIC", 2),
    ("Optimize",     "TOEIC", 2),
    ("Outstanding",  "TOEIC", 2),
    # P
    ("Preliminary",  "TOEIC", 2),
    ("Proceed",      "TOEIC", 1),
    ("Proficient",   "TOEIC", 2),
    # R
    ("Reimburse",    "TOEIC", 2),
    ("Remuneration", "TOEIC", 3),
    ("Revenue",      "TOEIC", 2),
    # S
    ("Scrutinize",   "TOEIC", 3),
    ("Stipulate",    "TOEIC", 3),
    ("Subsequent",   "TOEIC", 2),
    ("Surplus",      "TOEIC", 2),
    # T
    ("Tentative",    "TOEIC", 2),
    ("Transaction",  "TOEIC", 2),
    # V
    ("Verify",       "TOEIC", 2),
    ("Voucher",      "TOEIC", 1),
]

# ── JLPT vocabulary list (word + category + difficulty) ───────────────────────
JLPT_WORDS = [
    # N5 — most basic kanji and vocabulary
    ("日本語",   "JLPT_N5", 1),
    ("学校",     "JLPT_N5", 1),
    ("先生",     "JLPT_N5", 1),
    ("学生",     "JLPT_N5", 1),
    ("友達",     "JLPT_N5", 1),
    ("家族",     "JLPT_N5", 1),
    ("食べる",   "JLPT_N5", 1),
    ("飲む",     "JLPT_N5", 1),
    ("見る",     "JLPT_N5", 1),
    ("聞く",     "JLPT_N5", 1),
    ("行く",     "JLPT_N5", 1),
    ("来る",     "JLPT_N5", 1),
    ("電車",     "JLPT_N5", 1),
    ("駅",       "JLPT_N5", 1),
    ("時間",     "JLPT_N5", 1),
    # N4
    ("会社",     "JLPT_N4", 2),
    ("仕事",     "JLPT_N4", 2),
    ("電話",     "JLPT_N4", 2),
    ("旅行",     "JLPT_N4", 2),
    ("料理",     "JLPT_N4", 2),
    ("病院",     "JLPT_N4", 2),
    ("医者",     "JLPT_N4", 2),
    ("練習",     "JLPT_N4", 2),
    ("準備",     "JLPT_N4", 2),
    ("説明",     "JLPT_N4", 2),
    # N3
    ("経験",     "JLPT_N3", 2),
    ("決定",     "JLPT_N3", 2),
    ("集中",     "JLPT_N3", 2),
    ("情報",     "JLPT_N3", 2),
    ("発展",     "JLPT_N3", 2),
    ("感情",     "JLPT_N3", 3),
    ("知識",     "JLPT_N3", 3),
    ("煩雑",     "JLPT_N3", 3),
    ("概念",     "JLPT_N3", 2),
    ("労働",     "JLPT_N3", 2),
]

# ── Vietnamese meaning lookup for TOEIC words (since dict API gives EN→EN) ────
TOEIC_MEANINGS_VI = {
    "Accomplish":   "Hoàn thành, đạt được",
    "Adjacent":     "Liền kề, tiếp giáp",
    "Allocate":     "Phân bổ, phân phối",
    "Amendment":    "Sửa đổi, điều chỉnh hợp đồng",
    "Assemble":     "Tập hợp, lắp ráp",
    "Authorize":    "Ủy quyền, cho phép",
    "Budget":       "Ngân sách, kinh phí",
    "Beneficial":   "Có lợi, có ích",
    "Collaborate":  "Hợp tác, cộng tác",
    "Compensate":   "Bù đắp, đền bù thiệt hại",
    "Comply":       "Tuân thủ, chấp hành",
    "Consecutive":  "Liên tiếp, liên tục",
    "Coordinate":   "Phối hợp, điều phối",
    "Credentials":  "Bằng cấp, thông tin xác thực",
    "Deadline":     "Hạn chót, thời hạn nộp",
    "Delegate":     "Ủy quyền, giao phó nhiệm vụ",
    "Determine":    "Xác định, quyết định",
    "Discrepancy":  "Sự chênh lệch, mâu thuẫn số liệu",
    "Elaborate":    "Giải thích chi tiết, triển khai",
    "Eligible":     "Đủ điều kiện, đủ tiêu chuẩn",
    "Endorse":      "Chứng thực, ký hậu, ủng hộ",
    "Expedite":     "Thúc đẩy, xử lý nhanh",
    "Facilitate":   "Tạo điều kiện, thúc đẩy",
    "Forecast":     "Dự báo, dự đoán kết quả",
    "Implement":    "Thực hiện, triển khai",
    "Incentive":    "Ưu đãi, khuyến khích",
    "Inventory":    "Hàng tồn kho, danh mục hàng hóa",
    "Mandatory":    "Bắt buộc, cưỡng bức",
    "Merchandise":  "Hàng hóa, sản phẩm thương mại",
    "Negotiate":    "Đàm phán, thương lượng",
    "Objective":    "Mục tiêu, mục đích cụ thể",
    "Optimize":     "Tối ưu hóa, cải tiến hiệu quả",
    "Outstanding":  "Chưa thanh toán / Xuất sắc",
    "Preliminary":  "Sơ bộ, ban đầu",
    "Proceed":      "Tiến hành, tiến tới",
    "Proficient":   "Thành thạo, giỏi về",
    "Reimburse":    "Hoàn tiền, bồi hoàn chi phí",
    "Remuneration": "Thù lao, khoản thưởng công",
    "Revenue":      "Doanh thu, thu nhập doanh nghiệp",
    "Scrutinize":   "Xem xét kỹ lưỡng, kiểm tra chặt",
    "Stipulate":    "Quy định, đặt điều khoản",
    "Subsequent":   "Tiếp sau, kế tiếp",
    "Surplus":      "Thặng dư, dư thừa",
    "Tentative":    "Tạm thời, chưa xác định chắc",
    "Transaction":  "Giao dịch, nghiệp vụ kinh doanh",
    "Verify":       "Xác minh, kiểm tra tính xác thực",
    "Voucher":      "Phiếu mua hàng, chứng từ thanh toán",
}

# Vietnamese meanings for JLPT words (from Jdict)
JLPT_MEANINGS_VI = {
    "日本語": "Tiếng Nhật",
    "学校":   "Trường học",
    "先生":   "Thầy giáo, cô giáo",
    "学生":   "Học sinh, sinh viên",
    "友達":   "Bạn bè",
    "家族":   "Gia đình",
    "食べる": "Ăn",
    "飲む":   "Uống",
    "見る":   "Xem, nhìn",
    "聞く":   "Nghe, hỏi",
    "行く":   "Đi",
    "来る":   "Đến, tới",
    "電車":   "Tàu điện, tàu điện ngầm",
    "駅":     "Nhà ga, bến tàu",
    "時間":   "Thời gian, giờ",
    "会社":   "Công ty",
    "仕事":   "Công việc",
    "電話":   "Điện thoại",
    "旅行":   "Du lịch, đi du lịch",
    "料理":   "Nấu ăn, món ăn",
    "病院":   "Bệnh viện",
    "医者":   "Bác sĩ",
    "練習":   "Luyện tập, thực hành",
    "準備":   "Chuẩn bị",
    "説明":   "Giải thích",
    "経験":   "Kinh nghiệm",
    "決定":   "Quyết định",
    "集中":   "Tập trung",
    "情報":   "Thông tin",
    "発展":   "Phát triển",
    "感情":   "Cảm xúc, tình cảm",
    "知識":   "Kiến thức, tri thức",
    "煩雑":   "Phức tạp, rắc rối",
    "概念":   "Khái niệm",
    "労働":   "Lao động, làm việc",
}


class Command(BaseCommand):
    help = (
        "Fetch real vocabulary data from Free Dictionary API (English) "
        "and Jisho API (Japanese) and save to the database."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--category",
            type=str,
            default="ALL",
            help="Which category to fetch: TOEIC | JLPT_N5 | JLPT_N4 | JLPT_N3 | ALL",
        )
        parser.add_argument(
            "--update-existing",
            action="store_true",
            default=False,
            help="Update existing vocabulary rows with fresh dictionary data.",
        )
        parser.add_argument(
            "--delay",
            type=float,
            default=0.6,
            help="Seconds to wait between API calls (default: 0.6).",
        )

    # ── helpers ────────────────────────────────────────────────────────────────

    def _fetch_english(self, word: str) -> dict | None:
        """Call the Free Dictionary API for one English word."""
        url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word.lower()}"
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 404:
                self.stdout.write(self.style.WARNING(f"  [WARN] '{word}' not found in dictionary."))
                return None
            resp.raise_for_status()
            data = resp.json()
        except Exception as exc:
            self.stdout.write(self.style.ERROR(f"  [ERROR] Network error for '{word}': {exc}"))
            return None

        entry = data[0] if data else {}
        meanings = entry.get("meanings", [])

        pos = ""
        definition_en = ""
        example = ""
        audio_url = ""

        if meanings:
            first = meanings[0]
            pos = first.get("partOfSpeech", "")
            defs = first.get("definitions", [])
            if defs:
                definition_en = defs[0].get("definition", "")
                example = defs[0].get("example", "")

        # Grab first available audio
        phonetics = entry.get("phonetics", [])
        for ph in phonetics:
            if ph.get("audio"):
                audio_url = ph["audio"]
                break

        return {
            "pos": pos,
            "definition_en": definition_en,
            "example": example,
            "audio_url": audio_url,
        }

    def _fetch_japanese(self, word: str) -> dict | None:
        """Call the Jisho API for one Japanese word."""
        url = "https://jisho.org/api/v1/search/words"
        try:
            resp = requests.get(url, params={"keyword": word}, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except Exception as exc:
            self.stdout.write(self.style.ERROR(f"  [ERROR] Network error for '{word}': {exc}"))
            return None

        results = data.get("data", [])
        if not results:
            self.stdout.write(self.style.WARNING(f"  [WARN] '{word}' not found in Jisho."))
            return None

        # Find the result that exactly matches our word
        entry = None
        for r in results:
            for kana in r.get("japanese", []):
                if kana.get("word") == word or kana.get("reading") == word:
                    entry = r
                    break
            if entry:
                break
        if not entry:
            entry = results[0]  # fallback to first result

        japanese_info = entry.get("japanese", [{}])[0]
        reading = japanese_info.get("reading", "")

        senses = entry.get("senses", [])
        pos = ""
        definition_en = ""
        example = ""

        if senses:
            first_sense = senses[0]
            pos_list = first_sense.get("parts_of_speech", [])
            pos = pos_list[0] if pos_list else ""
            eng_defs = first_sense.get("english_definitions", [])
            definition_en = "; ".join(eng_defs[:3]) if eng_defs else ""

        return {
            "reading": reading,
            "pos": pos,
            "definition_en": definition_en,
            "example": example,
            "audio_url": "",
        }

    # ── main entry point ───────────────────────────────────────────────────────

    def handle(self, *args, **options):
        category_filter = options["category"].upper()
        update_existing = options["update_existing"]
        delay = options["delay"]

        self.stdout.write(self.style.HTTP_INFO(
            f"\nLinguaFlow - Dictionary data fetcher\n"
            f"   Category: {category_filter}  |  Update existing: {update_existing}\n"
        ))

        # Determine which word lists to process
        work_items: list[tuple[str, str, int]] = []

        if category_filter in ("ALL", "TOEIC"):
            work_items.extend(TOEIC_WORDS)

        jlpt_cats = [c for c in ("JLPT_N5", "JLPT_N4", "JLPT_N3") if category_filter in ("ALL", c)]
        if jlpt_cats:
            work_items.extend(w for w in JLPT_WORDS if w[1] in jlpt_cats)

        if not work_items:
            raise CommandError(f"No words to process for category='{category_filter}'.")

        created_count = 0
        updated_count = 0
        skipped_count = 0
        error_count   = 0

        for word, category, difficulty in work_items:
            is_japanese = category.startswith("JLPT")

            # Skip if already exists and --update-existing not set
            existing = Vocabulary.objects.filter(word=word, category=category).first()
            if existing and not update_existing:
                skipped_count += 1
                continue

            safe_word = word.encode('ascii', 'backslashreplace').decode('ascii')
            self.stdout.write(f"  Fetching: {safe_word} [{category}]...")

            # Fetch from appropriate API
            if is_japanese:
                api_data = self._fetch_japanese(word)
            else:
                api_data = self._fetch_english(word)

            if api_data is None:
                error_count += 1
                time.sleep(delay)
                continue

            # Build defaults
            defaults = {
                "difficulty":    difficulty,
                "pos":           api_data.get("pos", ""),
                "definition_en": api_data.get("definition_en", ""),
                "audio_url":     api_data.get("audio_url", ""),
            }

            if api_data.get("example"):
                defaults["example"] = api_data["example"]

            if is_japanese and api_data.get("reading"):
                defaults["reading"] = api_data["reading"]

            # Set Vietnamese meaning
            if is_japanese:
                defaults["meaning_vi"] = JLPT_MEANINGS_VI.get(word, "")
            else:
                defaults["meaning_vi"] = TOEIC_MEANINGS_VI.get(word, "")

            if existing:
                for field, value in defaults.items():
                    if value:  # Only overwrite non-empty values
                        setattr(existing, field, value)
                existing.save()
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f"    [OK] Updated  [{category}] {safe_word}"))
            else:
                Vocabulary.objects.create(
                    word=word,
                    category=category,
                    **defaults,
                )
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"    [OK] Created  [{category}] {safe_word}"))

            time.sleep(delay)

        self.stdout.write(self.style.SUCCESS(
            f"\nDone!\n"
            f"   Created : {created_count}\n"
            f"   Updated : {updated_count}\n"
            f"   Skipped : {skipped_count} (already in DB, use --update-existing to refresh)\n"
            f"   Errors  : {error_count}\n"
        ))
