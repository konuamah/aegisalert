# serializers.py
from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import Disaster

class DisasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disaster
        fields = ['id', 'name', 'location', 'affected_radius', 'active','polygon']

    def create(self, validated_data):
        # Extract the location data from the validated data
        location_data = validated_data.pop('location', None)
        
        # Convert the location data into a Point object
        if location_data and isinstance(location_data, dict):
            coordinates = location_data.get('coordinates', [])
            if len(coordinates) == 2:
                validated_data['location'] = Point(coordinates[0], coordinates[1])
        
        # Create and return the Disaster instance
        return Disaster.objects.create(**validated_data)