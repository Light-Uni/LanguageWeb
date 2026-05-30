"""
Planner App — Views
Full CRUD for study tasks.
"""
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import StudyTask
from .serializers import StudyTaskSerializer, StudyTaskCreateSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/planner/tasks/ — List tasks (filter by ?date=YYYY-MM-DD)
    POST /api/planner/tasks/ — Create new task
    """
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend]
    filterset_fields   = ['scheduled_date', 'subject', 'is_completed']

    def get_queryset(self):
        qs = StudyTask.objects.filter(user=self.request.user)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(scheduled_date=date)
        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudyTaskCreateSerializer
        return StudyTaskSerializer

    def list(self, request, *args, **kwargs):
        queryset  = self.get_queryset()
        serializer = StudyTaskSerializer(queryset, many=True)
        return Response(serializer.data)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/planner/tasks/{id}/ — Get task
    PUT    /api/planner/tasks/{id}/ — Update task
    PATCH  /api/planner/tasks/{id}/ — Partial update (e.g. mark complete)
    DELETE /api/planner/tasks/{id}/ — Delete task
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyTask.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        return StudyTaskCreateSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # Always allow partial updates
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'Task đã được xóa.'}, status=status.HTTP_200_OK)
