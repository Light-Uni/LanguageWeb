"""
Users App — Auth URL patterns
Mounted at: /api/auth/
"""
from django.urls import path
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, LogoutView

def health_check(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('health/',         health_check,                name='health-check'),
    path('login/',          LoginView.as_view(),        name='auth-login'),
    path('register/',       RegisterView.as_view(),      name='auth-register'),
    path('logout/',         LogoutView.as_view(),        name='auth-logout'),
    path('token/refresh/',  TokenRefreshView.as_view(),  name='token-refresh'),
]
