from pytube import YouTube
from backend.settings import MEDIA_ROOT

yt_link = "https://www.youtube.com/watch?v="


def download_audio(video_id):
    video = YouTube(yt_link+video_id)
    audio = video.streams.get_audio_only()
    result = audio.download(MEDIA_ROOT)
    return result