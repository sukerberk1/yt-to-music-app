from django.shortcuts import render
from rest_framework import viewsets
from .models import Audio
from .serializers import AudioSerializer

# Create your views here.

class AudioViewSet(viewsets.ModelViewSet):
    serializer_class = AudioSerializer
    queryset = Audio.objects.all()