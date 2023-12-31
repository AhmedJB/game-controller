from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GetStatus, SettingsViewSet, LatestLogsView, Execute, Stop

router = DefaultRouter()
router.register('settings', SettingsViewSet, basename="settings")


urlpatterns = [
    path("status", GetStatus.as_view()),
    path("logs", LatestLogsView.as_view()),
    path("start", Execute.as_view()),
    path("stop", Stop.as_view()),
    path("", include(router.urls)),
]
