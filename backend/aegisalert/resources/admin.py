from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'location', 'quantity', 'status', 'last_updated')
    list_filter = ('type', 'status', 'location')
    search_fields = ('name', 'location__name')  # Assuming 'location' has a 'name' field
    list_editable = ('quantity', 'status')  # Allow editing these fields directly from the list view
    ordering = ('-last_updated',)  # Order by last_updated in descending order