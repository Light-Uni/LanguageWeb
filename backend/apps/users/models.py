"""
Users App — Custom User Model
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user with LinguaFlow-specific fields."""

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]

    JLPT_CHOICES = [
        ('N5', 'N5'), ('N4', 'N4'), ('N3', 'N3'),
        ('N2', 'N2'), ('N1', 'N1'),
    ]

    # Profile
    avatar      = models.CharField(max_length=500, null=True, blank=True)
    bio         = models.TextField(blank=True, default='')
    role        = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    # Learning Stats
    xp_total    = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0)
    last_study  = models.DateField(null=True, blank=True)

    # Targets
    toeic_target = models.IntegerField(default=750)
    jlpt_target  = models.CharField(max_length=2, choices=JLPT_CHOICES, default='N3')

    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.email})"

    @property
    def initials(self):
        parts = self.get_full_name().split()
        if len(parts) >= 2:
            return (parts[0][0] + parts[-1][0]).upper()
        return self.username[:2].upper()

    @property
    def level(self):
        """XP-based level: every 500 XP = 1 level."""
        return max(1, self.xp_total // 500 + 1)
