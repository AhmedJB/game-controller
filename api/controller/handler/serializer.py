from .models import *
from rest_framework import serializers


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = "__all__"


class LogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = ('id', 'message', 'date')
