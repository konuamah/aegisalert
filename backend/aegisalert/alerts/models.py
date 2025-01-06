from django.db import models

class SensorData(models.Model):
    type = models.CharField(max_length=50)  # e.g., rainfall, seismic, fire
    value = models.FloatField()  # e.g., rainfall in mm, seismic magnitude
    location = models.CharField(max_length=100)  # e.g., latitude, longitude
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.value} at {self.location}"
    

class AlertMessage(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message