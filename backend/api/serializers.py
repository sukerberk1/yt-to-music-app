from rest_framework import serializers
from .models import Audio
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = "__all__"
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
