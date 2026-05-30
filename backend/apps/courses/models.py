"""
Courses App — Models
Courses, Lessons, Questions, User Progress
"""
from django.db import models
from django.conf import settings


class Course(models.Model):
    CATEGORY_CHOICES = [
        ('toeic', 'TOEIC Prep'),
        ('japanese', 'Japanese Learning'),
        ('programming', 'Programming & Coding'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=50)  # e.g., N5-N1, Beginner, 700+, etc.
    thumbnail = models.CharField(max_length=500, null=True, blank=True)
    duration_days = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class Lesson(models.Model):
    LESSON_TYPES = [
        ('text', 'Text & Markdown'),
        ('video', 'Video Lecture'),
        ('quiz', 'Quiz & Practice'),
    ]

    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, default='')
    order = models.PositiveIntegerField(default=1)
    lesson_type = models.CharField(max_length=10, choices=LESSON_TYPES, default='text')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'lessons'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Question(models.Model):
    Q_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('fill_in_blank', 'Fill in the Blank'),
        ('code', 'Code Submission'),
    ]

    lesson = models.ForeignKey(Lesson, related_name='questions', on_delete=models.CASCADE, null=True, blank=True)
    part = models.IntegerField(null=True, blank=True)  # For TOEIC Parts 1-7, or JLPT divisions
    content = models.TextField()  # Question text / task prompt
    options_json = models.JSONField(default=list, blank=True)  # List of answers or configuration
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, default='')
    q_type = models.CharField(max_length=20, choices=Q_TYPES, default='multiple_choice')
    audio = models.CharField(max_length=500, null=True, blank=True)  # TOEIC listening
    image = models.CharField(max_length=500, null=True, blank=True) # TOEIC pictures
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'questions'

    def __str__(self):
        return f"Question {self.id} ({self.q_type}) - Lesson: {self.lesson.title if self.lesson else 'None'}"


class UserCourse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_courses', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='user_courses', on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress_pct = models.IntegerField(default=0)  # Percentage completed (0-100)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'user_courses'
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"


class UserAnswer(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name='user_answers', on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    time_taken_sec = models.IntegerField(default=0)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_answers'

    def __str__(self):
        return f"{self.user.username} - Q{self.question.id} - {'Correct' if self.is_correct else 'Incorrect'}"
