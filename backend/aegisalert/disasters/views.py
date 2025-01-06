# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Disaster
from .serializers import DisasterSerializer
from .tasks import notify_users_about_disaster

class DisasterCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = DisasterSerializer(data=request.data)
        if serializer.is_valid():
            disaster = serializer.save()
            notify_users_about_disaster.delay(disaster.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DisasterListView(APIView):
    def get(self, request, *args, **kwargs):
        disasters = Disaster.objects.all()
        serializer = DisasterSerializer(disasters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DisasterDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            disaster = Disaster.objects.get(pk=pk)
        except Disaster.DoesNotExist:
            return Response({"error": "Disaster not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DisasterSerializer(disaster)
        return Response(serializer.data, status=status.HTTP_200_OK)