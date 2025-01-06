from rest_framework import generics
from .models import Announcement
from .serializers import AnnouncementSerializer
import requests

class AnnouncementList(generics.ListAPIView):
    queryset = Announcement.objects.all().order_by('-timestamp')
    serializer_class = AnnouncementSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        self.trigger_sse_update()  # Trigger SSE update after creation

    def trigger_sse_update(self):
        # Notify the SSE stream that announcements have been updated
        requests.get('http://localhost:8000/sse/announcements/')  # Trigger SSE update