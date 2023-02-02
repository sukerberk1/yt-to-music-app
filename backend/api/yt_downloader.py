from pytube import YouTube

yt_link = "https://www.youtube.com/watch?v="

def download_audio(video_id, user):
    audio = YouTube(yt_link+video_id)
    audio.download()
    #...TBD