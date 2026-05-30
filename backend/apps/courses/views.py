"""
Courses App — Views
"""
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Course, Lesson, Question, UserCourse, UserAnswer
from .serializers import (
    CourseSerializer,
    CourseDetailSerializer,
    LessonDetailSerializer,
    UserCourseSerializer,
    UserAnswerSubmitSerializer,
    QuestionFeedbackSerializer,
)


class CourseListView(generics.ListAPIView):
    """
    GET /api/courses/?category=toeic
    List all courses, optionally filtered by category.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = Course.objects.all()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class CourseDetailView(generics.RetrieveAPIView):
    """
    GET /api/courses/{id}/
    Retrieve course details, including the list of lessons.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CourseDetailSerializer
    queryset = Course.objects.all()


class CourseEnrollView(APIView):
    """
    POST /api/courses/{id}/enroll/
    Enroll the authenticated user in the course.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        user_course, created = UserCourse.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'progress_pct': 0}
        )
        if not created:
            return Response(
                {"message": "Bạn đã tham gia khoá học này rồi."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Award XP for enrollment
        request.user.xp_total += 20
        request.user.save(update_fields=['xp_total'])

        serializer = UserCourseSerializer(user_course, context={'request': request})
        return Response({
            "message": f"Đăng ký thành công khoá học {course.title}!",
            "enrollment": serializer.data,
            "xp_earned": 20
        }, status=status.HTTP_201_CREATED)


class LessonDetailView(generics.RetrieveAPIView):
    """
    GET /api/courses/lessons/{id}/
    Retrieve lesson content, including any questions/quiz questions.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = LessonDetailSerializer
    queryset = Lesson.objects.all()


class QuestionListView(generics.ListAPIView):
    """
    GET /api/questions/?part=1&q_type=multiple_choice
    Retrieve a list of questions, filterable by lesson, part, or type.
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        qs = Question.objects.all()
        lesson_id = self.request.query_params.get('lesson')
        part = self.request.query_params.get('part')
        q_type = self.request.query_params.get('q_type')

        if lesson_id:
            qs = qs.filter(lesson_id=lesson_id)
        if part:
            qs = qs.filter(part=part)
        if q_type:
            qs = qs.filter(q_type=q_type)
        return qs

    def get_serializer_class(self):
        # We can use the simple QuestionSerializer here
        from .serializers import QuestionSerializer
        return QuestionSerializer


class QuestionSubmitView(APIView):
    """
    POST /api/questions/submit/
    Submit an answer to a question. Grades the answer, updates user answers and progress.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserAnswerSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        question = get_object_or_404(Question, id=data['question_id'])
        
        # Compare answers (case insensitive, trimmed)
        selected = data['selected_answer'].strip().lower()
        correct = question.correct_answer.strip().lower()
        is_correct = (selected == correct)

        # Record UserAnswer
        user_answer = UserAnswer.objects.create(
            user=request.user,
            question=question,
            is_correct=is_correct,
            time_taken_sec=data['time_taken_sec']
        )

        # Update stats & xp
        xp_earned = 0
        if is_correct:
            xp_earned = 10
            request.user.xp_total += xp_earned
            request.user.save(update_fields=['xp_total'])

        # Update course progress if the question belongs to a lesson
        progress_pct = None
        if question.lesson:
            course = question.lesson.course
            user_course = UserCourse.objects.filter(user=request.user, course=course).first()
            if user_course:
                # Simple progress calculation:
                # Count total questions in all lessons of this course
                # and how many the user has answered correctly
                total_questions = Question.objects.filter(lesson__course=course).count()
                if total_questions > 0:
                    correct_user_answers = UserAnswer.objects.filter(
                        user=request.user,
                        question__lesson__course=course,
                        is_correct=True
                    ).values('question').distinct().count()
                    
                    user_course.progress_pct = min(100, int((correct_user_answers / total_questions) * 100))
                    if user_course.progress_pct == 100 and not user_course.completed_at:
                        user_course.completed_at = timezone.now()
                    user_course.save(update_fields=['progress_pct', 'completed_at'])
                    progress_pct = user_course.progress_pct

        return Response({
            "is_correct": is_correct,
            "correct_answer": question.correct_answer,
            "explanation": question.explanation,
            "xp_earned": xp_earned,
            "progress_pct": progress_pct
        }, status=status.HTTP_200_OK)
