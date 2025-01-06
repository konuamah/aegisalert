from django.http import StreamingHttpResponse
import json
from resources.models import Resource  
from resources.serializers import ResourceSerializer  
from announcements.models import Announcement
from announcements.serializers import AnnouncementSerializer
import time

def resource_updates(request):
    def event_stream():
        while True:
            # Fetch the latest resources
            resources = Resource.objects.all()
            serializer = ResourceSerializer(resources, many=True)
            yield f"data: {json.dumps(serializer.data)}\n\n"  # SSE format
            time.sleep(5)  # Wait for 5 seconds before sending the next update

    # Return a StreamingHttpResponse with the event stream
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

def announcement_updates(request):
    def event_stream():
        while True:
            # Fetch the latest announcements
            announcements = Announcement.objects.all().order_by('-timestamp')
            serializer = AnnouncementSerializer(announcements, many=True)
            yield f"data: {json.dumps(serializer.data)}\n\n"  # SSE format
            time.sleep(5)  # Wait for 5 seconds before sending the next update

    # Return a StreamingHttpResponse with the event stream
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')