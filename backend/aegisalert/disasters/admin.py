from django.contrib.gis import admin
from .models import Disaster

@admin.register(Disaster)
class DisasterAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'location', 'affected_radius', 'active')
    list_filter = ('active',)
    search_fields = ('name',)