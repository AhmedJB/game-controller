from django.db import models

# Create your models here.


class Settings(models.Model):
    json_url = models.CharField(max_length=500)
    vmix_url = models.CharField(max_length=500)
