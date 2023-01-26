from rest_framework import serializers
from .models import Audio

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = (
            'yt_id',
            'title',
            'author',
            'image_url',
            'duration_seconds'
        )