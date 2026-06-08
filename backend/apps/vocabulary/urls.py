"""
Vocabulary URL patterns
Mounted at: /api/vocabulary/
"""
from django.urls import path
from .views import VocabularyListView, UserVocabularyListView, VocabReviewView, VocabStatsView, DictionaryLookupView

urlpatterns = [
    path('',        VocabularyListView.as_view(),     name='vocab-list'),
    path('my/',     UserVocabularyListView.as_view(),  name='my-vocab'),
    path('review/', VocabReviewView.as_view(),         name='vocab-review'),
    path('stats/',  VocabStatsView.as_view(),          name='vocab-stats'),
    path('lookup/', DictionaryLookupView.as_view(),    name='vocab-lookup'),
]
