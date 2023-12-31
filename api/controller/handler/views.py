from django.shortcuts import render
from .worker.worker import Worker
from .models import *
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import authentication, permissions, status
from rest_framework.response import Response
from .serializer import SettingsSerializer, LogsSerializer
from .models import Settings
import threading
from django.utils import timezone
from datetime import timedelta

# Create your views here.


def get_settings():
    s = Settings.objects.first()
    if s:
        return s
    else:
        s = Settings.objects.create(json_url="", vmix_url="")
        s.save()
        return s


# worker instance
w = Worker()


def run_worker():
    w.run()


class GetStatus(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": w.status}, status=status.HTTP_200_OK)


class LatestLogsView(APIView):
    def get(self, request, format=None):
        # Calculate one day ago
        one_day_ago = timezone.now() - timedelta(days=1)

        # Fetch logs older than one day
        logs_to_delete = Logs.objects.filter(date__lt=one_day_ago)

        # Fetch latest logs excluding those to be deleted
        latest_logs = Logs.objects.exclude(
            pk__in=logs_to_delete.values_list('pk', flat=True)).order_by('-date')[:10]

        # Serialize the logs to be returned
        serializer = LogsSerializer(latest_logs, many=True)

        # Delete logs older than one day
        logs_to_delete.delete()

        return Response(serializer.data)


class Stop(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        w.stop_script()
        return Response({"failed": False})


class Execute(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        worker_thread = threading.Thread(target=run_worker)
        worker_thread.start()
        return Response({"failed": False})


class SettingsViewSet(ModelViewSet):
    serializer_class = SettingsSerializer

    def get_queryset(self):
        # Assuming you only want one instance, return the first one if available
        return Settings.objects.all()

    def list(self, request, *args, **kwargs):
        # Attempt to get the existing instance
        existing_settings = self.get_queryset().first()

        if existing_settings:
            # If settings instance already exists, serialize and return it
            serializer = self.get_serializer(existing_settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If no instance exists, create a new one and return it
            new_settings = Settings.objects.create()
            serializer = self.get_serializer(new_settings)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        # Check if there is an existing instance
        existing_settings = Settings.objects.first()

        if existing_settings:
            # If settings instance already exists, update it
            serializer = self.get_serializer(
                existing_settings, data=request.data)
        else:
            # If no instance exists, create a new one
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        # For PUT requests, update the existing instance
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        # For PATCH requests, update the existing instance
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
