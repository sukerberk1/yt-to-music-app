from django.db import models
import uuid # for eventually assigning id


# Create your models here.

class Audio(models.Model):
    yt_id = models.UUIDField(default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=150)
    author = models.CharField(max_length=100)
    image_url = models.URLField()
    duration_seconds = models.IntegerField()
    file = models.FileField()

    def __str__(self) -> str:
        return self.author + self.title