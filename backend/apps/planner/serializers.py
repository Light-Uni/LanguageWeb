"""
Planner App — Serializers
"""
from rest_framework import serializers
from .models import StudyTask, StudySession


class StudyTaskSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()
    done = serializers.BooleanField(source='is_completed')
    date = serializers.DateField(source='scheduled_date')

    class Meta:
        model  = StudyTask
        fields = ['id', 'title', 'subject', 'date', 'time', 'duration', 'color', 'done', 'notes']
        read_only_fields = ['id']

    def get_time(self, obj):
        if obj.time_slot:
            return obj.time_slot.strftime('%H:%M')
        return None

    # Map frontend field names → model field names
    def to_internal_value(self, data):
        if 'done' in data:
            data['is_completed'] = data.pop('done')
        if 'date' in data:
            data['scheduled_date'] = data.pop('date')
        if 'time' in data and data['time']:
            data['time_slot'] = data.pop('time')
        if 'duration' in data:
            data['duration_min'] = data.pop('duration')
        return super().to_internal_value(data)

    def get_fields(self):
        fields = super().get_fields()
        return fields


class StudyTaskCreateSerializer(serializers.ModelSerializer):
    time     = serializers.TimeField(source='time_slot', required=False, allow_null=True)
    date     = serializers.DateField(source='scheduled_date')
    done     = serializers.BooleanField(source='is_completed', required=False)
    duration = serializers.IntegerField(source='duration_min', required=False, default=30)

    class Meta:
        model  = StudyTask
        fields = ['id', 'title', 'subject', 'date', 'time', 'duration', 'color', 'done', 'notes']
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudySession
        fields = ['id', 'subject', 'started_at', 'ended_at', 'duration_min', 'xp_earned']
        read_only_fields = ['id']
