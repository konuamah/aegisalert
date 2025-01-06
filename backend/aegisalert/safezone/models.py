from django.contrib.gis.db import models

class SafeZone(models.Model):
    name = models.CharField(max_length=100)
    location = models.PointField()  # Stores (longitude, latitude)

    def __str__(self):
        return self.name