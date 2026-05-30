"""
Planner App — Models
Study tasks and sessions.
"""
from django.db import models
from django.conf import settings


class StudyTask(models.Model):
    """A scheduled study session for a specific subject."""

    SUBJECT_CHOICES = [
        ('TOEIC',       'TOEIC'),
        ('Japanese',    'Japanese'),
        ('Programming', 'Programming'),
        ('Other',       'Other'),
    ]

    COLOR_CHOICES = [
        ('#3B82F6', 'Blue (TOEIC)'),
        ('#8B5CF6', 'Purple (Japanese)'),
        ('#10B981', 'Green (Programming)'),
        ('#F59E0B', 'Yellow (Other)'),
        ('#EC4899', 'Pink'),
        ('#6C63FF', 'Indigo'),
    ]

    user            = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    title           = models.CharField(max_length=200)
    subject         = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='TOEIC')
    scheduled_date  = models.DateField()
    time_slot       = models.TimeField(null=True, blank=True)
    duration_min    = models.IntegerField(default=30)
    color           = models.CharField(max_length=10, default='#3B82F6')
    is_completed    = models.BooleanField(default=False)
    notes           = models.TextField(blank=True, default='')
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table  = 'study_tasks'
        ordering  = ['scheduled_date', 'time_slot']

    def __str__(self):
        return f"{self.user.username} — {self.title} ({self.scheduled_date})"


class StudySession(models.Model):
    """A completed study session (for heatmap + stats)."""

    SUBJECT_CHOICES = StudyTask.SUBJECT_CHOICES

    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    subject      = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='TOEIC')
    started_at   = models.DateTimeField()
    ended_at     = models.DateTimeField(null=True, blank=True)
    duration_min = models.IntegerField(default=0)
    xp_earned    = models.IntegerField(default=0)
    notes        = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'study_sessions'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} — {self.subject} — {self.started_at.date()}"
