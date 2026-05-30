from rest_framework import serializers
from .models import AIChatLog

class ChatMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["user", "assistant"])
    content = serializers.CharField()

class AIChatRequestSerializer(serializers.Serializer):
    messages = ChatMessageSerializer(many=True)
    language = serializers.ChoiceField(choices=["vi", "en", "ja"], required=False, default="vi")
    context = serializers.ChoiceField(
        choices=["toeic", "japanese", "programming", "general"], 
        required=False, 
        default="general"
    )

class AIGrammarCheckSerializer(serializers.Serializer):
    text = serializers.CharField()
    language = serializers.ChoiceField(choices=["en", "ja"], required=False, default="en")

class AICodeReviewSerializer(serializers.Serializer):
    code = serializers.CharField()
    language = serializers.CharField(required=False, default="python")

class AIChatLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChatLog
        fields = ["id", "prompt", "response", "context", "timestamp", "xp_earned"]
        read_only_fields = fields
