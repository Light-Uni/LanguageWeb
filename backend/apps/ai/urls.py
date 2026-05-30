from django.urls import path
from .views import (
    AIChatView,
    AISuggestionsView,
    AIGrammarCheckView,
    AICodeReviewView,
    AIStatusView,
)

urlpatterns = [
    path("chat/",          AIChatView.as_view(),         name="ai-chat"),
    path("suggestions/",   AISuggestionsView.as_view(),  name="ai-suggestions"),
    path("grammar-check/", AIGrammarCheckView.as_view(), name="ai-grammar-check"),
    path("code-review/",   AICodeReviewView.as_view(),   name="ai-code-review"),
    path("status/",        AIStatusView.as_view(),        name="ai-status"),
]
