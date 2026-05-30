"""
Server-Sent Events (SSE) view for real-time dashboard updates.
Uses plain Django view (NOT DRF @api_view) because StreamingHttpResponse
is incompatible with DRF's response wrapping.
"""
import time
import json
import random
from django.http import StreamingHttpResponse, JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model


def _authenticate_from_request(request):
    """
    Authenticates a user from either:
    - Authorization: Bearer <token> header, OR
    - ?token=<token> query parameter (required for EventSource which cannot set headers)
    Returns the User instance or None.
    """
    User = get_user_model()
    token_str = None

    # 1. Try Authorization header first
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    if auth_header.startswith("Bearer "):
        token_str = auth_header[7:]

    # 2. Fall back to query parameter (for EventSource API)
    if not token_str:
        token_str = request.GET.get("token")

    if not token_str:
        return None

    try:
        access_token = AccessToken(token_str)
        user = User.objects.get(id=access_token["user_id"])
        return user
    except Exception:
        return None


def _get_realtime_metrics():
    """Simulates real-time server/system metrics."""
    cpu_load = random.randint(12, 38)
    ram_usage = f"{(random.randint(3100, 3600) / 1024):.1f} GB / 8 GB"
    active_db = random.randint(40, 58)
    return {
        "cpu": f"{cpu_load}%",
        "ram": ram_usage,
        "db": f"{active_db} Active",
    }


def _get_periodic_alert():
    """Generates motivational educational milestone alerts."""
    alerts = [
        "Học viên Minh Nguyễn vừa học thuộc 15 từ vựng TOEIC! 🚀",
        "Streak học tập của Trần Thế Anh đã tăng lên 43 ngày! 🔥",
        "Server LinguaFlow hoạt động với độ trễ cực thấp: 14ms! ⚡",
        "Lớp học lập trình web cơ bản có thêm 5 thành viên mới! 👨‍💻",
        "Học viên Vũ Thu vừa đạt điểm tuyệt đối bài kiểm tra Kanji N3! 🎉",
        "LinguaBot AI vừa tối ưu hóa 32 dòng code Python thành công! 🤖",
        "Bài kiểm tra TOEIC mới đã được thêm vào hệ thống! 📝",
        "AI nhận ra bạn học tốt nhất vào buổi sáng – hãy duy trì nhé! ☀️",
    ]
    return random.choice(alerts)


def _sse_generator():
    """
    Yields SSE-formatted events indefinitely.
    Initial connection event + metrics update every 10 seconds.
    """
    # Immediately send connection success on first connect
    initial_payload = {
        "type": "connection_status",
        "metrics": _get_realtime_metrics(),
        "alert": "Kết nối luồng sự kiện thời gian thực thành công! ✅",
    }
    yield f"data: {json.dumps(initial_payload, ensure_ascii=False)}\n\n"

    while True:
        time.sleep(10)
        event_payload = {
            "type": "metrics_update",
            "metrics": _get_realtime_metrics(),
            "alert": _get_periodic_alert() if random.random() > 0.4 else None,
        }
        yield f"data: {json.dumps(event_payload, ensure_ascii=False)}\n\n"


def sse_event_stream(request):
    """
    Plain Django view that streams Server-Sent Events.
    GET /api/dashboard/events/?token=<access_token>
    """
    user = _authenticate_from_request(request)
    if not user:
        return JsonResponse({"error": "Unauthorized. Provide a valid Bearer token."}, status=401)

    response = StreamingHttpResponse(_sse_generator(), content_type="text/event-stream; charset=utf-8")
    response["Cache-Control"] = "no-cache, no-store"
    response["X-Accel-Buffering"] = "no"
    response["Connection"] = "keep-alive"
    # Allow cross-origin access from frontend dev server
    response["Access-Control-Allow-Origin"] = "*"
    return response
