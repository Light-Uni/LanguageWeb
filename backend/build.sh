#!/usr/bin/env bash
# ─── Render Build Script ───────────────────────────────────────────────────────
# Render chạy script này trước khi start gunicorn.
# Thực hiện: cài dependencies, collect static, chạy migrate.

set -o errexit   # Dừng ngay nếu có lỗi

pip install --upgrade pip
pip install -r requirements.txt

# Thu thập static files (cần cho admin Django nếu dùng)
python manage.py collectstatic --no-input

# Chạy database migrations tự động
python manage.py migrate --no-input

echo "✅ Build hoàn tất — sẵn sàng khởi động server."
