"""
Courses App — Serializers
"""
from rest_framework import serializers
from .models import Course, Lesson, Question, UserCourse, UserAnswer


class QuestionSerializer(models.ModelSerializer if False else serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'lesson', 'part', 'content', 'options_json', 
            'correct_answer', 'explanation', 'q_type', 'audio', 'image'
        ]


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'order', 'lesson_type']


class LessonDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'content', 'order', 'lesson_type', 'questions']


class CourseSerializer(serializers.ModelSerializer):
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)
    enrolled = serializers.SerializerMethodField()
    progress_pct = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'level', 
            'thumbnail', 'duration_days', 'lesson_count', 'enrolled', 'progress_pct'
        ]

    def get_enrolled(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return UserCourse.objects.filter(user=user, course=obj).exists()
        return False

    def get_progress_pct(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            user_course = UserCourse.objects.filter(user=user, course=obj).first()
            return user_course.progress_pct if user_course else 0
        return 0


class CourseDetailSerializer(CourseSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['lessons']


class UserCourseSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = UserCourse
        fields = ['id', 'user', 'course', 'enrolled_at', 'progress_pct', 'completed_at', 'course_details']
        read_only_fields = ['user', 'enrolled_at', 'progress_pct', 'completed_at']


class UserAnswerSubmitSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_answer = serializers.CharField(max_length=255)
    time_taken_sec = serializers.IntegerField(default=0)


class QuestionFeedbackSerializer(serializers.Serializer):
    is_correct = serializers.BooleanField()
    correct_answer = serializers.CharField()
    explanation = serializers.CharField()
