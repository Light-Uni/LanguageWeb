"""
Courses URL Configuration
Mounted at: /api/courses/
"""
from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    CourseEnrollView,
    LessonDetailView,
    QuestionListView,
    QuestionSubmitView,
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('<int:pk>/enroll/', CourseEnrollView.as_view(), name='course-enroll'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/submit/', QuestionSubmitView.as_view(), name='question-submit'),
]
