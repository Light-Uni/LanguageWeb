"""
LinguaFlow — Root URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/auth/',       include('apps.users.urls')),
    path('api/dashboard/',  include('apps.dashboard.urls')),
    path('api/courses/',    include('apps.courses.urls')),
    path('api/vocabulary/', include('apps.vocabulary.urls')),
    path('api/planner/',    include('apps.planner.urls')),
    path('api/profile/',    include('apps.users.profile_urls')),
    path('api/admin-panel/',include('apps.users.admin_urls')),
    path('api/ai/',         include('apps.ai.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
