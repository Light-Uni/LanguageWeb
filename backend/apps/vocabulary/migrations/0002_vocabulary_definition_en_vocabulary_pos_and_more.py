# Generated manually - adds dictionary API fields to Vocabulary model

import django.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vocabulary', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vocabulary',
            name='pos',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AddField(
            model_name='vocabulary',
            name='definition_en',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='vocabulary',
            name='audio_url',
            field=models.URLField(blank=True, default='', max_length=500),
        ),
    ]
