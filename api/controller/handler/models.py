from django.db import models

# Create your models here.


class Settings(models.Model):
    json_url = models.CharField(max_length=500)
    vmix_url = models.CharField(max_length=500)
    replay_start_recording_interval = models.IntegerField(default=2)
    replay_set_speed_value = models.FloatField(default=0.8)
    replay_export_switch = models.BooleanField(default=True)
    check_interval = models.IntegerField(default=1)
    sleep_duration = models.IntegerField(default=10)
    sleep_window_input = models.IntegerField(default=16)
    homepen1num_input = models.IntegerField(default=10)
    homepen2num_input = models.IntegerField(default=15)
    awaypen1num_input = models.IntegerField(default=13)
    awaypen2num_input = models.IntegerField(default=14)
    quickplay_input = models.IntegerField(default=15)
    export_folder = models.CharField(max_length=500, default="")


class Logs(models.Model):
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
