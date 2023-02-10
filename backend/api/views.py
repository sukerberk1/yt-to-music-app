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
import json

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
        # user_data_serialized contains hashed user password - it mustnt be leaked
    else:
        return Response({'message':"Couldn't authenticate user"}, 401)
    user = User.objects.get(id=user_data_serialized['id'])
    audiolib = user.audiolib.all()
    audiolib_serialized = AudioSerializer(audiolib, many=True).data
    return Response(audiolib_serialized)
    

@api_view(['GET', 'POST'])
def getUserFromToken(request):
    authenticator = JWTAuthentication()
    res = authenticator.authenticate(request)
    if res is not None:
        user_data, token = res
        user_data_serialized = UserSerializer(user_data).data
        return Response(user_data_serialized)
    else:
        return Response({'message':"Couldn't authenticate user"}, 401)


@api_view(['POST'])
def addNewAudio(request):
    authenticator = JWTAuthentication()
    res = authenticator.authenticate(request)
    if res is not None:
        user_data, token = res
        user_data_serialized = UserSerializer(user_data).data
        userObject = User.objects.get(id=user_data_serialized['id'])
        data = json.loads(request.body)
        is_already_uploaded = Audio.objects.filter(yt_id=data['yt_id'])
        if len(is_already_uploaded)>1:
            return Response({'message':'Audio already in the database'})
        audio = Audio.objects.create(yt_id=data['yt_id'],
                            title=data['title'], 
                            author=data['author'], 
                            image_url=data['image_url'], 
                            duration_seconds=data['duration_seconds'], 
                            file='/rhbeuiofgnrouiffnof.mp3')
        userObject.audiolib.add(audio)
        return Response({'message':'Audio successfully added'}, 200)
    else:
        return Response({'message':"Couldn't authenticate user"}, 401)
        