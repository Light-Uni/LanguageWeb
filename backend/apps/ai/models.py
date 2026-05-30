from django.db import models
from django.conf import settings

class AIChatLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ai_logs")
    prompt = models.TextField()
    response = models.TextField()
    context = models.CharField(max_length=50, blank=True) # toeic/japanese/programming/general
    timestamp = models.DateTimeField(auto_now_add=True)
    xp_earned = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.user.username} - {self.context} - {self.timestamp}"
