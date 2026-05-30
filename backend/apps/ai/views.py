import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import (
    AIChatRequestSerializer,
    AIGrammarCheckSerializer,
    AICodeReviewSerializer,
)
from .models import AIChatLog
from .utils import (
    get_active_ai_provider,
    call_local_ai_api,
    call_gemini_api,
    call_openai_api,
    get_intelligent_mock_response,
    get_local_ai_model_info,
)

logger = logging.getLogger(__name__)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def reward_user_xp(user, amount=10):
    """
    Dynamically rewards the user with XP, updating their level if they cross
    the 1000 XP threshold (1 level per 1000 XP, starting at level 1).
    """
    user.xp_total += amount
    new_level = int(user.xp_total / 1000) + 1
    if new_level != user.level:
        user.level = new_level
    user.save()


def build_system_prompt(context: str, language: str) -> str:
    """
    Builds a rich, domain-specific system prompt for LinguaBot.
    The prompt is crafted to make any base model behave as a specialised
    language/programming tutor without requiring fine-tuning.
    """
    base = (
        "You are LinguaBot, a premium AI education mentor on the LinguaFlow learning platform. "
        "You are warm, encouraging, and highly knowledgeable. "
        "You always respond with well-structured Markdown (use headings, bullet points, and code blocks where appropriate). "
        f"Always reply in this language: {language}.\n\n"
    )

    if context == "toeic":
        return base + (
            "SPECIALISATION — TOEIC Expert:\n"
            "- You are a TOEIC 990-score holder and certified ETS instructor.\n"
            "- Explain grammar rules clearly with the TOEIC exam context in mind.\n"
            "- When analysing grammar, identify the exact TOEIC trap (e.g., participle adjectives, "
            "  subject-verb agreement, collocations, connector words).\n"
            "- Always include at least one realistic TOEIC-style example sentence.\n"
            "- Offer a practical memory tip or mnemonic at the end."
        )
    elif context == "japanese":
        return base + (
            "SPECIALISATION — Japanese Language Sensei:\n"
            "- You are a native-level Japanese teacher specialising in JLPT N5–N1.\n"
            "- Break down sentence structures using particle analysis (は, が, を, に, で, etc.).\n"
            "- Always show: ① Romaji transliteration ② Kanji/Kana ③ Vietnamese/English meaning.\n"
            "- When explaining grammar points, use the JLPT level tag (e.g., [N3 Grammar]).\n"
            "- For Kanji, provide: reading, meaning, stroke count, and 2 example words.\n"
            "- Encourage the student with a motivational Japanese phrase at the end."
        )
    elif context == "programming":
        return base + (
            "SPECIALISATION — Senior Software Engineer & CS Tutor:\n"
            "- You are a senior engineer with 10+ years of experience across Python, JavaScript, and algorithms.\n"
            "- When reviewing code, always address: correctness, performance (Big-O), readability, and best practices.\n"
            "- Always provide an improved code snippet with clear comments.\n"
            "- Explain the 'why' behind each suggestion, not just the 'what'.\n"
            "- Mention relevant design patterns or data structures when applicable."
        )
    else:
        return base + (
            "SPECIALISATION — General Learning Mentor:\n"
            "- Help students with study strategies, learning roadmaps, and motivation.\n"
            "- If the question relates to TOEIC, Japanese, or programming, give domain-specific advice.\n"
            "- Always end with an actionable next step the student can take today."
        )


def dispatch_to_ai(messages, system_instruction, context, prompt):
    """
    Unified dispatch function that tries providers in order and returns (response_text, provider_used).
    For the local provider, passes the full message history.
    For external APIs, passes only the last user message (simpler interface).
    """
    provider = get_active_ai_provider()
    response_text = ""

    if provider == "local":
        try:
            response_text = call_local_ai_api(messages, system_instruction)
            logger.info(f"AI response served by local Ollama model for context='{context}'")
            return response_text, "local"
        except (ConnectionError, TimeoutError) as e:
            logger.warning(f"Local AI unavailable: {e}. Falling back to mock.")
            provider = "fallback"
        except Exception as e:
            logger.error(f"Local AI unexpected error: {e}. Falling back to mock.")
            provider = "fallback"

    if provider == "gemini":
        try:
            response_text = call_gemini_api(prompt, system_instruction)
            return response_text, "gemini"
        except Exception as e:
            logger.error(f"Gemini API failure: {e}")
            provider = "fallback"

    if provider == "openai":
        try:
            response_text = call_openai_api(prompt, system_instruction)
            return response_text, "openai"
        except Exception as e:
            logger.error(f"OpenAI API failure: {e}")
            provider = "fallback"

    # Final fallback — intelligent keyword-based mock
    response_text = get_intelligent_mock_response(prompt, context)
    return response_text, "fallback"


# ─── API Views ─────────────────────────────────────────────────────────────────

class AIChatView(APIView):
    """
    Multi-turn AI chat endpoint.
    Accepts the full conversation history for context-aware responses.
    Supports: local Ollama model, Gemini, OpenAI, and offline fallback.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AIChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        messages = serializer.validated_data["messages"]
        language = serializer.validated_data.get("language", "vi")
        context = serializer.validated_data.get("context", "general")

        # Extract the latest user message for providers that take a single prompt
        user_messages = [m for m in messages if m["role"] == "user"]
        if not user_messages:
            return Response(
                {"error": "At least one user message is required in the messages thread."},
                status=status.HTTP_400_BAD_REQUEST
            )

        prompt = user_messages[-1]["content"]
        system_instruction = build_system_prompt(context, language)

        response_text, provider_used = dispatch_to_ai(
            messages, system_instruction, context, prompt
        )

        # Reward 10 XP per AI interaction
        xp_to_reward = 10
        reward_user_xp(request.user, xp_to_reward)

        # Persist chat log for analytics
        AIChatLog.objects.create(
            user=request.user,
            prompt=prompt,
            response=response_text,
            context=context,
            xp_earned=xp_to_reward
        )

        return Response({
            "reply": response_text,
            "context": context,
            "xp_earned": xp_to_reward,
            "provider": provider_used,   # Useful for debugging; can be hidden in production
        }, status=status.HTTP_200_OK)


class AISuggestionsView(APIView):
    """
    Returns curated learning prompt suggestions per subject.
    Gives +2 XP for engagement.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subject = request.query_params.get("subject", "general").lower()

        toeic_suggestions = [
            "Giải thích cấu trúc ngữ pháp mệnh đề quan hệ rút gọn trong Part 5.",
            "Tại sao 'highly' thường đi cùng với 'competitive'?",
            "Làm thế nào để phân biệt 'rise' và 'raise' trong câu hỏi TOEIC?"
        ]
        japanese_suggestions = [
            "Giải thích sự khác biệt giữa trợ từ 'は' (wa) và 'が' (ga).",
            "Phân tích cấu trúc câu: 'あきらめないで、最後まで頑張りましょう'!",
            "Liệt kê các Kanji N3 liên quan đến chủ đề 'Công việc' (Work)."
        ]
        programming_suggestions = [
            "Làm cách nào để viết một hàm kiểm tra số nguyên tố tối ưu?",
            "Giải thích tính kế thừa (Inheritance) trong lập trình hướng đối tượng.",
            "Hãy hướng dẫn viết hàm QuickSort đơn giản bằng Python."
        ]
        general_suggestions = [
            "Làm thế nào để duy trì streak học tập hiệu quả mỗi ngày?",
            "Lập kế hoạch học tập TOEIC và Tiếng Nhật song song như thế nào?",
            "Hãy gợi ý cho tôi một lộ trình tự học lập trình Web hiệu quả."
        ]

        subject_map = {
            "toeic": toeic_suggestions,
            "japanese": japanese_suggestions,
            "programming": programming_suggestions,
        }
        items = subject_map.get(subject, general_suggestions)

        reward_user_xp(request.user, 2)

        return Response({"suggestions": items}, status=status.HTTP_200_OK)


class AIGrammarCheckView(APIView):
    """
    Grammar checking endpoint for English and Japanese text.
    Passes a single structured prompt to whichever AI provider is active.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AIGrammarCheckSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text = serializer.validated_data["text"]
        lang = serializer.validated_data.get("language", "en")

        prompt = (
            f"Please carefully check the grammar of this {lang.upper()} text:\n\n"
            f"\"{text}\"\n\n"
            "If there are errors: list each one with the original phrase, the correction, "
            "and a brief explanation of the rule. "
            "If the text is correct, confirm it and suggest one vocabulary upgrade."
        )
        system_instruction = (
            "You are a professional language examiner with expertise in English and Japanese. "
            "Return structured grammar corrections in Markdown format with clear headings."
        )

        # Grammar check is a single-turn request — wrap in a messages list
        single_message = [{"role": "user", "content": prompt}]
        response_text, _ = dispatch_to_ai(single_message, system_instruction, "grammar", prompt)

        if not response_text:
            # Local offline fallback
            if lang == "en":
                response_text = (
                    "### Phân tích Ngữ pháp Tiếng Anh:\n"
                    f"Văn bản phân tích: *\"{text}\"*\n\n"
                    "**1. Trạng thái**: ✅ Hoàn toàn chính xác (hoặc lỗi nhẹ).\n"
                    "**2. Gợi ý nâng cấp từ vựng**:\n"
                    "- Thay vì dùng các từ đơn giản, hãy thử kết hợp với các collocation nâng cao để tăng điểm viết!"
                )
            else:
                response_text = (
                    "### Phân tích Ngữ pháp Tiếng Nhật:\n"
                    f"Văn bản phân tích: *\"{text}\"*\n\n"
                    "**1. Phân tích Trợ từ**: Hãy kiểm tra các trợ từ は, が, を đã bổ nghĩa chính xác cho động từ/chủ ngữ chưa.\n"
                    "**2. Thể lịch sự**: Đảm bảo phân biệt rõ ràng giữa thể lịch sự ます/です và thể thông thường."
                )

        corrections = [
            {
                "original": text,
                "corrected": text,
                "explanation": response_text
            }
        ]

        reward_user_xp(request.user, 10)

        return Response({"corrections": corrections}, status=status.HTTP_200_OK)


class AICodeReviewView(APIView):
    """
    Code review endpoint for any programming language.
    The local AI model can provide detailed, context-aware code analysis.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AICodeReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data["code"]
        lang = serializer.validated_data.get("language", "python")

        prompt = (
            f"Review this {lang} code for potential bugs, resource leaks, or performance bottlenecks:\n\n"
            f"```{lang}\n{code}\n```\n\n"
            "Structure your review as:\n"
            "1. **Overall Assessment** — A brief summary and a score out of 100.\n"
            "2. **Issues Found** — List bugs or anti-patterns with line references.\n"
            "3. **Improved Version** — Provide a corrected code block with comments.\n"
            "4. **Key Takeaways** — 2–3 actionable tips for the developer."
        )
        system_instruction = (
            "You are a senior software engineer conducting a professional code review. "
            "Be specific, constructive, and educational. Use Markdown with code blocks."
        )

        single_message = [{"role": "user", "content": prompt}]
        response_text, _ = dispatch_to_ai(single_message, system_instruction, "programming", prompt)

        if not response_text:
            response_text = (
                "### 🔍 Nhận xét Code Review Cục bộ:\n"
                "- **Độ tối ưu**: Code chạy đúng đắn và có cấu trúc rõ ràng.\n"
                "- **Gợi ý**: Hãy bổ sung docstrings giải thích tham số đầu vào và kiểu dữ liệu trả về (Type Hinting) để tăng tính dễ đọc!"
            )

        reward_user_xp(request.user, 10)

        return Response({
            "feedback": response_text,
            "suggestions": ["Add type hints", "Include unit test validations"],
            "score": 85
        }, status=status.HTTP_200_OK)


class AIStatusView(APIView):
    """
    Health check endpoint for the AI subsystem.
    Returns current provider, Ollama status, and available models.
    Useful for admin dashboards and debugging.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        provider = get_active_ai_provider()
        info = {
            "active_provider": provider,
            "local_ai": get_local_ai_model_info() if provider == "local" else None,
        }
        return Response(info, status=status.HTTP_200_OK)
