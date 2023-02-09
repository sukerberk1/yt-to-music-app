from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Audio
from .serializers import AudioSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.

class AudioViewSet(viewsets.ModelViewSet):
    serializer_class = AudioSerializer
    queryset = Audio.objects.all()

class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # permission_classes = (IsAuthenticated,)   


@api_view(['GET', 'POST'])
def userAudioLib(request):
    authenticator = JWTAuthentication()
    res = authenticator.authenticate(request)
    if res is not None:
        user_data, token = res
        user_data_serialized = UserSerializer(user_data).data
        user_data_serialized.pop("password") # delete password for security reasons - it mustnt be shown
    else:
        return Response({'message':"Couldn't authenticate user"})
    user = User.objects.get(id=user_data_serialized['id'])
    audiolib = user.audiolib.all()
    audiolib_serialized = AudioSerializer(audiolib, many=True).data
    return Response(audiolib_serialized)
    
    