from django.db import models
from safezone.models import SafeZone  # Correct import path

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('medical', 'Medical Supplies'),
        ('rescue', 'Rescue Teams'),
        ('food', 'Food Supplies'),
        ('shelter', 'Shelter'),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=RESOURCE_TYPES)
    location = models.ForeignKey(SafeZone, on_delete=models.CASCADE)  # Reference to SafeZone model
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=50, default='available')  # e.g., available, deployed, in-use
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.type}) at {self.location}"