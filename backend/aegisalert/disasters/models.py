from django.contrib.gis.db import models
from django.contrib.gis.geos import Point, Polygon
from django.contrib.gis.measure import D

class Disaster(models.Model):
    name = models.CharField(max_length=100)
    location = models.PointField()  # Stores (longitude, latitude)
    affected_radius = models.FloatField()  # in kilometers
    active = models.BooleanField(default=True)
    polygon = models.PolygonField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.polygon:
            # Convert radius to meters (PostGIS uses meters for buffering)
            buffer_distance = self.affected_radius * 1000
            # Create a buffer around the location
            self.polygon = self.location.buffer(buffer_distance)
        super().save(*args, **kwargs)