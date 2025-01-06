from django.contrib.gis import admin
from .models import SafeZone

@admin.register(SafeZone)
class SafeZoneAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'location')