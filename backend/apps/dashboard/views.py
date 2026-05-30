"""
Dashboard App — Views
Provides aggregated stats, heatmap data, and today's schedule.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta, date
import random


class DashboardStatsView(APIView):
    """GET /api/dashboard/stats/ — Overall learning statistics for the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # In production, these would be computed from UserAnswer, StudySession, UserVocabulary
        # For now, return real user fields + computed mock stats
        return Response({
            'totalHours':          round(user.xp_total / 40, 1),
            'streak':              user.streak_days,
            'wordsLearned':        user.xp_total // 4,
            'xpTotal':             user.xp_total,
            'toeicProgress':       min(100, (user.xp_total // 50) % 100),
            'japaneseProgress':    min(100, (user.xp_total // 70) % 100),
            'programmingProgress': min(100, (user.xp_total // 90) % 100),
            'weakSkills':          ['TOEIC Part 5', 'Kanji N3', 'Python OOP'],
            'level':               user.level,
            'role':                user.role,
        })


class DashboardHeatmapView(APIView):
    """GET /api/dashboard/heatmap/ — 364 days of study activity."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # In production, aggregate from StudySession model
        # For now, generate realistic-looking data seeded by user ID
        today = date.today()
        random.seed(request.user.id)

        heatmap = []
        for i in range(363, -1, -1):
            d = today - timedelta(days=i)
            # Higher activity in recent months
            probability = 0.7 if i < 90 else (0.5 if i < 180 else 0.3)
            count = 0 if random.random() > probability else random.randint(1, 5)
            heatmap.append({
                'date':  d.isoformat(),
                'count': count,
            })

        return Response(heatmap)


class DashboardScheduleView(APIView):
    """GET /api/dashboard/schedule/ — Today's study tasks."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date().isoformat()

        # Try to get real tasks from planner
        try:
            from apps.planner.models import StudyTask
            tasks = StudyTask.objects.filter(
                user=request.user,
                scheduled_date=today,
            ).order_by('time_slot')

            from apps.planner.serializers import StudyTaskSerializer
            return Response(StudyTaskSerializer(tasks, many=True).data)
        except Exception:
            # Fallback to sample data
            return Response([
                {'id': '1', 'time': '08:00', 'subject': 'TOEIC Listening', 'duration': 30, 'color': '#3B82F6', 'done': False},
                {'id': '2', 'time': '14:00', 'subject': 'Kanji N3', 'duration': 20, 'color': '#8B5CF6', 'done': False},
                {'id': '3', 'time': '20:00', 'subject': 'Python OOP', 'duration': 45, 'color': '#10B981', 'done': False},
            ])


class WeeklyProgressView(APIView):
    """GET /api/dashboard/weekly-progress/ — 7-day learning chart data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        random.seed(request.user.id + 7)
        days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
        return Response([
            {
                'day':         d,
                'toeic':       random.randint(20, 90),
                'japanese':    random.randint(15, 75),
                'programming': random.randint(10, 60),
            }
            for d in days
        ])
