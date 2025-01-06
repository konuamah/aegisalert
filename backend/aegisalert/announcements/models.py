from django.db import models

class Announcement(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('upcoming', 'Upcoming'),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title