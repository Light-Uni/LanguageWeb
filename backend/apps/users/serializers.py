"""
Users App — Serializers
Handles auth (register, login) and profile serialization.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User


# ─── JWT Custom Token ─────────────────────────────────────────────────────────

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends the JWT token with user info in the payload,
    so the frontend doesn't need a separate /profile call after login.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name']    = user.get_full_name() or user.username
        token['email']   = user.email
        token['role']    = user.role
        token['xp']      = user.xp_total
        token['level']   = user.level
        token['streak']  = user.streak_days
        token['initials']= user.initials
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user profile data alongside tokens
        user = self.user
        data['user'] = {
            'id':       user.id,
            'name':     user.get_full_name() or user.username,
            'email':    user.email,
            'role':     user.role,
            'xp':       user.xp_total,
            'level':    user.level,
            'streak':   user.streak_days,
            'initials': user.initials,
            'avatar':   user.avatar.url if user.avatar else None,
        }
        return data


# ─── Register ─────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password         = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    name             = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['email', 'name', 'password', 'password_confirm', 'role']
        extra_kwargs = {
            'role':  {'default': 'student'},
            'email': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Mật khẩu không khớp.'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email này đã được sử dụng.'})
        return data

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        validated_data.pop('password_confirm')
        first, *rest = name.split(' ', 1)
        user = User.objects.create_user(
            username    = validated_data['email'],
            email       = validated_data['email'],
            password    = validated_data['password'],
            first_name  = first,
            last_name   = rest[0] if rest else '',
            role        = validated_data.get('role', 'student'),
        )
        return user


# ─── Profile ──────────────────────────────────────────────────────────────────

class ProfileSerializer(serializers.ModelSerializer):
    name     = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    level    = serializers.SerializerMethodField()
    avatar   = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            'id', 'name', 'email', 'role', 'bio', 'avatar',
            'xp_total', 'level', 'streak_days', 'last_study',
            'toeic_target', 'jlpt_target', 'initials', 'date_joined',
        ]
        read_only_fields = ['id', 'email', 'xp_total', 'streak_days', 'date_joined']

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_initials(self, obj):
        return obj.initials

    def get_level(self, obj):
        return obj.level

    def get_avatar(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
        return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)

    class Meta:
        model  = User
        fields = ['name', 'bio', 'avatar', 'toeic_target', 'jlpt_target']

    def update(self, instance, validated_data):
        name = validated_data.pop('name', None)
        if name:
            parts = name.split(' ', 1)
            instance.first_name = parts[0]
            instance.last_name  = parts[1] if len(parts) > 1 else ''
        return super().update(instance, validated_data)


# ─── Admin User List ──────────────────────────────────────────────────────────

class AdminUserSerializer(serializers.ModelSerializer):
    name  = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            'id', 'name', 'email', 'role', 'xp_total',
            'streak_days', 'level', 'date_joined', 'last_login', 'is_active',
        ]

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_level(self, obj):
        return obj.level
