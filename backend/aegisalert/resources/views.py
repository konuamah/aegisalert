from rest_framework import generics
from .models import Resource
from .serializers import ResourceSerializer
import requests

class ResourceListCreateView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        self.trigger_sse_update()  # Trigger SSE update after creation

    def trigger_sse_update(self):
        # Notify the SSE stream that resources have been updated
        requests.get('http://localhost:8000/sse/resources/')  # Trigger SSE update

class ResourceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.trigger_sse_update()  # Trigger SSE update after update

    def perform_destroy(self, instance):
        instance.delete()
        self.trigger_sse_update()  # Trigger SSE update after deletion

    def trigger_sse_update(self):
        # Notify the SSE stream that resources have been updated
        requests.get('http://localhost:8000/sse/resources/')  # Trigger SSE update