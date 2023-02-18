from django.shortcuts import render
from django.http import FileResponse
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Audio
from .serializers import AudioSerializer, UserSerializer, RegisterSerializer
from .yt_downloader import download_audio
import json
# Create your views here.

class AudioInfo(APIView):
    serializer_class = AudioSerializer
    permission_classes = [IsAuthenticated,]
    def post(self, request, *args,  **kwargs):
        data = json.loads(request.body)
        audio = Audio.objects.get(id=data['id'])
        serialized_audio = self.serializer_class(audio).data
        return Response(serialized_audio)


@api_view(['GET', 'POST'])
def user_audio_lib(request):
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
def get_user_from_token(request):
    authenticator = JWTAuthentication()
    res = authenticator.authenticate(request)
    if res is not None:
        user_data, token = res
        user_data_serialized = UserSerializer(user_data).data
        return Response(user_data_serialized)
    else:
        return Response({'message':"Couldn't authenticate user"}, 401)


@api_view(['POST'])
def add_new_audio(request):
    authenticator = JWTAuthentication()
    res = authenticator.authenticate(request)
    if res is not None:
        user_data, token = res
        user_data_serialized = UserSerializer(user_data).data
        user_object = User.objects.get(id=user_data_serialized['id'])
        data = json.loads(request.body)

        existing_audio_queryset = Audio.objects.filter(yt_id=data['yt_id'])
        # handling the case when the audio was already submitted on the server
        if len(existing_audio_queryset)>=1:
            is_in_userlib = len(user_object.audiolib.filter(yt_id=data['yt_id'])) > 0
            # if audio is already in DB, just add it to users lib
            if not is_in_userlib:
                user_object.audiolib.add(existing_audio_queryset.first())
                return Response({'message':'Audio successfully added'}, 200)
            # if its in DB and in users lib, do nothing
            return Response({'message':'Audio already in the database and user lib'}, 208)

        filepath = download_audio(data['yt_id']).split('\\')
        audio = Audio.objects.create(yt_id=data['yt_id'],
                            title=data['title'], 
                            author=data['author'], 
                            image_url=data['image_url'], 
                            duration_seconds=data['duration_seconds'], 
                            file=filepath[-1])
        user_object.audiolib.add(audio)
        serialized_audio = AudioSerializer(audio).data
        return Response(serialized_audio, 200)
    else:
        return Response({'message':"Couldn't authenticate user"}, 401)


class GetSong(APIView):
    serializer_class = AudioSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        song = Audio.objects.get(id=data['id'])        
        return FileResponse(song.file.open())


class UserRegistration(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User Created Successfully.",
        }, 201)