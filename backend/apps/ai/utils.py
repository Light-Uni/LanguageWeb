import os
import json
import requests
import logging

logger = logging.getLogger(__name__)

# ─── Provider Selection ────────────────────────────────────────────────────────

def get_active_ai_provider():
    """
    Determines which AI provider to use based on environment configuration.

    Priority order:
      1. 'local'   — Self-hosted Ollama server (no API key required)
      2. 'gemini'  — Google Gemini API (requires GEMINI_API_KEY)
      3. 'openai'  — OpenAI GPT API (requires OPENAI_API_KEY)
      4. 'fallback' — Local keyword-based mock responses

    Set AI_PROVIDER=local in .env to use your own model.
    """
    explicit = os.getenv("AI_PROVIDER", "").lower()
    if explicit == "local":
        return "local"
    if explicit == "gemini" and os.getenv("GEMINI_API_KEY"):
        return "gemini"
    if explicit == "openai" and os.getenv("OPENAI_API_KEY"):
        return "openai"

    # Auto-detect from keys if AI_PROVIDER is not set
    if os.getenv("GEMINI_API_KEY"):
        return "gemini"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"

    return "fallback"


# ─── Local AI via Ollama ───────────────────────────────────────────────────────

def call_local_ai_api(messages, system_instruction=None):
    """
    Sends a multi-turn chat request to a locally running Ollama server.

    Args:
        messages: List of dicts with 'role' ('user'|'assistant') and 'content' keys.
                  This supports full conversation history for multi-turn chat.
        system_instruction: Optional string to set the AI persona and constraints.

    Returns:
        str: The assistant's reply text.

    Raises:
        ConnectionError: If Ollama is not running or not reachable.
        ValueError: If the response structure is unexpected.

    Setup:
        1. Install Ollama: https://ollama.com/download
        2. Pull your preferred model: `ollama pull qwen2.5:7b`
        3. Set in .env: AI_PROVIDER=local, LOCAL_AI_MODEL=qwen2.5:7b
    """
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    model_name = os.getenv("LOCAL_AI_MODEL", "qwen2.5:7b")
    url = f"{ollama_host}/api/chat"

    # Build the message list for Ollama (OpenAI-compatible format)
    ollama_messages = []

    if system_instruction:
        ollama_messages.append({
            "role": "system",
            "content": system_instruction
        })

    # Append full conversation history for coherent multi-turn responses
    for msg in messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role in ("user", "assistant") and content:
            ollama_messages.append({"role": role, "content": content})

    payload = {
        "model": model_name,
        "messages": ollama_messages,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "top_p": 0.9,
            "num_predict": 1024,   # Max tokens to generate
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
    except requests.exceptions.ConnectionError:
        raise ConnectionError(
            f"Cannot connect to Ollama at {ollama_host}. "
            "Please ensure Ollama is installed and running. "
            "Download at: https://ollama.com/download"
        )
    except requests.exceptions.Timeout:
        raise TimeoutError(
            f"Ollama request timed out after 120 seconds. "
            f"The model '{model_name}' may need more time on your hardware. "
            "Consider using a smaller quantized model (e.g., qwen2.5:7b-q4_K_M)."
        )

    data = response.json()

    try:
        return data["message"]["content"]
    except (KeyError, TypeError):
        raise ValueError(
            f"Unexpected response structure from Ollama: {json.dumps(data)[:200]}"
        )


def get_local_ai_model_info():
    """
    Returns info about the currently configured local model and whether Ollama is reachable.
    Useful for health checks and the admin panel.
    """
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    model_name = os.getenv("LOCAL_AI_MODEL", "qwen2.5:7b")

    try:
        resp = requests.get(f"{ollama_host}/api/tags", timeout=5)
        if resp.status_code == 200:
            loaded_models = [m["name"] for m in resp.json().get("models", [])]
            model_ready = any(model_name in m for m in loaded_models)
            return {
                "status": "online",
                "host": ollama_host,
                "configured_model": model_name,
                "model_ready": model_ready,
                "available_models": loaded_models,
            }
    except requests.exceptions.RequestException:
        pass

    return {
        "status": "offline",
        "host": ollama_host,
        "configured_model": model_name,
        "model_ready": False,
        "available_models": [],
    }


# ─── External API Providers (kept as optional fallbacks) ──────────────────────

def call_gemini_api(prompt, system_instruction=None):
    """
    Sends a request to Google Gemini API (gemini-1.5-flash) using lightweight, native requests.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [
                {"text": system_instruction}
            ]
        }

    response = requests.post(url, headers=headers, json=payload, timeout=12)
    response.raise_for_status()
    data = response.json()

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise ValueError("Unexpected structure returned from Gemini API response.")


def call_openai_api(prompt, system_instruction=None):
    """
    Sends a request to OpenAI's GPT-4o-mini using standard HTTP POST requests.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured")

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload, timeout=12)
    response.raise_for_status()
    data = response.json()

    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise ValueError("Unexpected structure returned from OpenAI API response.")


# ─── Intelligent Offline Fallback ─────────────────────────────────────────────

def get_intelligent_mock_response(prompt, context=None):
    """
    Highly realistic offline/fallback responses based on content patterns in prompts.
    Provides users with a reasonable offline experience when no AI provider is available.
    """
    prompt_lower = prompt.lower()

    # 1. Japanese pattern
    if any(k in prompt_lower for k in ["nihongo", "japanese", "tiếng nhật", "kanji", "勉強", "n3", "n4", "n5"]):
        return (
            "Chào bạn! Tôi đã phân tích câu hỏi tiếng Nhật của bạn:\n\n"
            "### 💡 Cấu trúc Ngữ pháp liên quan:\n"
            "*   **～のは（～です）**: Danh từ hóa cụm động từ để lập làm chủ ngữ (Ví dụ: *日本語 được học のは thú vịです*).\n"
            "*   **～ために**: Chỉ mục đích rõ ràng ('Để làm gì...').\n\n"
            "### 📝 Ví dụ minh họa:\n"
            "1.  **日本語を勉強するのは面白いです。** (Học tiếng Nhật rất thú vị.)\n"
            "2.  **日本へ行くために、毎日日本語を勉強しています。** (Để đi Nhật, tôi đang học tiếng Nhật mỗi ngày.)\n\n"
            "👉 *Lưu ý*: Hãy nhớ ôn luyện tối thiểu 5 Kanji mỗi ngày bằng Spaced Repetition nhé!"
        )

    # 2. TOEIC pattern
    if any(k in prompt_lower for k in ["toeic", "part 5", "grammar", "part 7", "ets"]):
        return (
            "Chào bạn! Dưới đây là phân tích ngữ pháp ôn luyện **TOEIC Part 5 & 6**:\n\n"
            "### ⚡ Bẫy TOEIC thường gặp nhất:\n"
            "1.  **Tính từ phân từ (Participles as Adjectives)**:\n"
            "    *   Dùng đuôi **-ing** khi mô tả bản chất của sự vật/sự việc (Ví dụ: *The conference was boring*).\n"
            "    *   Dùng đuôi **-ed** khi mô tả cảm xúc của con người đối với sự vật (Ví dụ: *The employees were bored*).\n"
            "2.  **Trạng từ bổ nghĩa (Adverbs)**:\n"
            "    *   Trạng từ luôn đứng trước để bổ nghĩa cho một tính từ hoặc một động từ phân từ khác (Ví dụ: *highly recommended*).\n\n"
            "### 🎯 Câu hỏi thực chiến:\n"
            "*   *The board of directors found the proposal highly _______ (interest).* \n"
            "    *   *Đáp án*: **interesting** (vì đề cập đến bản chất của bản đề xuất - proposal)."
        )

    # 3. Programming pattern
    if any(k in prompt_lower for k in ["code", "python", "javascript", "algorithm", "hàm", "function", "oop", "fibonacci"]):
        return (
            "Chào bạn! Dưới đây là review và cài đặt tối ưu cho đoạn mã lập trình của bạn:\n\n"
            "### 💻 Code Python tối ưu (dùng kỹ thuật Memoization):\n"
            "```python\n"
            "def fib_optimized(n, memo={}):\n"
            "    if n in memo: return memo[n]\n"
            "    if n <= 1: return n\n"
            "    memo[n] = fib_optimized(n-1, memo) + fib_optimized(n-2, memo)\n"
            "    return memo[n]\n"
            "```\n\n"
            "### ⚙️ Phân tích hiệu năng:\n"
            "-   **Độ phức tạp thời gian**: Giảm từ $O(2^n)$ (đệ quy thông thường) xuống chỉ còn **$O(n)$**.\n"
            "-   **Độ phức tạp không gian**: **$O(n)$** do lưu trữ các trạng thái tính toán trong dictionary.\n\n"
            "💡 *Lời khuyên*: Bạn có thể tiếp tục chuyển đổi sang thuật toán lặp (Bottom-Up Iteration) để đạt độ phức tạp không gian $O(1)$!"
        )

    # 4. General fallback
    return (
        f"Tôi là trợ lý ảo **LinguaBot AI**! Tôi đã nhận được yêu cầu của bạn: \"{prompt}\"\n\n"
        "Hiện tại AI cục bộ chưa được khởi động. Hãy chạy Ollama và thử lại. "
        "Trong lúc đó, hãy đặt câu hỏi chứa các từ khóa như: *Tiếng Nhật, Kanji, TOEIC, Ngữ pháp, Python, JavaScript* để nhận phản hồi chi tiết!"
    )
