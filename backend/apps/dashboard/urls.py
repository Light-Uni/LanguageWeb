"""
Dashboard URL patterns
Mounted at: /api/dashboard/
"""
from django.urls import path
from .views import (
    DashboardStatsView,
    DashboardHeatmapView,
    DashboardScheduleView,
    WeeklyProgressView,
)
from .sse_views import sse_event_stream

urlpatterns = [
    path('stats/',           DashboardStatsView.as_view(),    name='dashboard-stats'),
    path('heatmap/',         DashboardHeatmapView.as_view(),  name='dashboard-heatmap'),
    path('schedule/',        DashboardScheduleView.as_view(), name='dashboard-schedule'),
    path('weekly-progress/', WeeklyProgressView.as_view(),   name='weekly-progress'),
    path('events/',          sse_event_stream,                name='dashboard-sse-events'),
]
