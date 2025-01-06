# views.py
from rest_framework.generics import ListAPIView
from .models import SafeZone
from .serializers import SafeZoneSerializer

class SafeZoneListView(ListAPIView):
    queryset = SafeZone.objects.all()
    serializer_class = SafeZoneSerializer