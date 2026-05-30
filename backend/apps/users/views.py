"""
Users App — Views
Auth endpoints: register, login, logout, token refresh.
"""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    AdminUserSerializer,
)


# ─── Auth Views ───────────────────────────────────────────────────────────────

class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — Returns access + refresh tokens with user info."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Creates a new user account."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Auto-login: return tokens after registration
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Đăng ký thành công!',
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id':       user.id,
                'name':     user.get_full_name() or user.username,
                'email':    user.email,
                'role':     user.role,
                'xp':       user.xp_total,
                'level':    user.level,
                'streak':   user.streak_days,
                'initials': user.initials,
                'avatar':   None,
            }
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    """POST /api/auth/logout/ — Blacklists the refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Đăng xuất thành công.'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Token không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)


# ─── Profile Views ────────────────────────────────────────────────────────────

class ProfileView(APIView):
    """GET + PUT /api/profile/ — View and update current user's profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # Return full profile after update
        full = ProfileSerializer(request.user, context={'request': request})
        return Response(full.data)


# ─── Admin Views ──────────────────────────────────────────────────────────────

class AdminUserListView(generics.ListAPIView):
    """GET /api/admin-panel/users/ — List all users (admin only)."""
    serializer_class   = AdminUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        return User.objects.all().order_by('-date_joined')


class AdminStatsView(APIView):
    """GET /api/admin-panel/stats/ — Platform statistics (admin only)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)

        from django.utils import timezone
        from datetime import timedelta
        today = timezone.now().date()

        total_users  = User.objects.count()
        active_today = User.objects.filter(last_login__date=today).count()

        return Response({
            'totalUsers':   total_users,
            'activeToday':  active_today,
            'coursesTotal': 48,        # Will be dynamic when courses are seeded
            'revenueMonth': 128500000,  # Placeholder
        })


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / DELETE /api/admin-panel/users/{id}/ — Manage individual users (admin only)."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        return User.objects.all()

    def update(self, request, *args, **kwargs):
        if self.request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if self.request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        return super().destroy(request, *args, **kwargs)

