from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Audio
from .serializers import AudioSerializer, UserSerializer
from django.contrib.auth.models import User

# Create your views here.

class AudioViewSet(viewsets.ModelViewSet):
    serializer_class = AudioSerializer
    queryset = Audio.objects.all()

class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)   