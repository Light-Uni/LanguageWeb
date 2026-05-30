"""
Vocabulary App — Models
Word bank + spaced repetition tracking per user.
"""
from django.db import models
from django.conf import settings


class Vocabulary(models.Model):
    """Global vocabulary bank (TOEIC + JLPT + Programming terms)."""

    CATEGORY_CHOICES = [
        ('TOEIC',       'TOEIC Business'),
        ('JLPT_N5',     'JLPT N5'),
        ('JLPT_N4',     'JLPT N4'),
        ('JLPT_N3',     'JLPT N3'),
        ('JLPT_N2',     'JLPT N2'),
        ('JLPT_N1',     'JLPT N1'),
        ('Programming', 'Programming'),
    ]

    DIFFICULTY_CHOICES = [
        (1, 'Easy'),
        (2, 'Medium'),
        (3, 'Hard'),
    ]

    word        = models.CharField(max_length=200)
    reading     = models.CharField(max_length=200, blank=True, default='')  # For Japanese (hiragana/furigana)
    meaning_vi  = models.TextField()                                          # Vietnamese meaning
    example     = models.TextField(blank=True, default='')
    category    = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='TOEIC')
    difficulty  = models.IntegerField(choices=DIFFICULTY_CHOICES, default=2)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table    = 'vocabulary'
        ordering    = ['category', 'word']
        unique_together = [['word', 'category']]

    def __str__(self):
        return f"[{self.category}] {self.word}"


class UserVocabulary(models.Model):
    """
    Spaced repetition tracking per user-word pair.
    Uses SM-2 algorithm fields: ease_factor, interval_days, next_review.
    """
    user          = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vocab_progress')
    vocab         = models.ForeignKey(Vocabulary, on_delete=models.CASCADE, related_name='user_progress')
    learned_at    = models.DateTimeField(auto_now_add=True)
    next_review   = models.DateField(null=True, blank=True)
    ease_factor   = models.FloatField(default=2.5)   # SM-2 ease factor
    interval_days = models.IntegerField(default=1)   # Days until next review
    correct_count = models.IntegerField(default=0)
    wrong_count   = models.IntegerField(default=0)

    class Meta:
        db_table        = 'user_vocabulary'
        unique_together = [['user', 'vocab']]
        ordering        = ['next_review']

    def __str__(self):
        return f"{self.user.username} — {self.vocab.word}"

    @property
    def remember_rate(self):
        total = self.correct_count + self.wrong_count
        return round((self.correct_count / total) * 100) if total > 0 else 0
