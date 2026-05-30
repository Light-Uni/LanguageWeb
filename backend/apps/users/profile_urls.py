"""
Profile URL patterns
Mounted at: /api/profile/
"""
from django.urls import path
from .views import ProfileView

urlpatterns = [
    path('', ProfileView.as_view(), name='profile'),
]
