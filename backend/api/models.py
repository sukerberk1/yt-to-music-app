from django.db import models
from django.contrib.auth.models import User
import uuid # for eventually assigning id

# Create your models here.


class Audio(models.Model):
    yt_id = models.CharField(max_length=100)
    title = models.CharField(max_length=150)
    author = models.CharField(max_length=100)
    image_url = models.URLField()
    duration_seconds = models.IntegerField()
    file = models.FileField()
    lib = models.ManyToManyField(User, related_name="audiolib")

    def __str__(self) -> str:
        return self.author + self.title

