"""
Vocabulary App — Serializers
"""
from rest_framework import serializers
from .models import Vocabulary, UserVocabulary


class VocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Vocabulary
        fields = ['id', 'word', 'reading', 'meaning_vi', 'example', 'category', 'difficulty']


class UserVocabularySerializer(serializers.ModelSerializer):
    word       = serializers.CharField(source='vocab.word', read_only=True)
    reading    = serializers.CharField(source='vocab.reading', read_only=True)
    meaning_vi = serializers.CharField(source='vocab.meaning_vi', read_only=True)
    example    = serializers.CharField(source='vocab.example', read_only=True)
    category   = serializers.CharField(source='vocab.category', read_only=True)
    remember_rate = serializers.IntegerField(read_only=True)

    class Meta:
        model  = UserVocabulary
        fields = [
            'id', 'word', 'reading', 'meaning_vi', 'example', 'category',
            'learned_at', 'next_review', 'ease_factor', 'interval_days',
            'correct_count', 'wrong_count', 'remember_rate',
        ]


class VocabReviewSerializer(serializers.Serializer):
    """Input for POST /api/vocabulary/review/"""
    vocab_id   = serializers.IntegerField()
    is_correct = serializers.BooleanField()
    quality    = serializers.IntegerField(min_value=0, max_value=5, default=3)  # SM-2 quality rating


class VocabStatsSerializer(serializers.Serializer):
    """Aggregated vocabulary statistics for the current user."""
    totalLearned  = serializers.IntegerField()
    rememberRate  = serializers.IntegerField()
    newToday      = serializers.IntegerField()
    studySpeed    = serializers.IntegerField()
    needReview    = serializers.IntegerField()
    weeklyData    = serializers.ListField()
    categories    = serializers.ListField()
    difficultWords = serializers.ListField()
