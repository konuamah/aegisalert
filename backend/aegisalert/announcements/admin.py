from django.contrib import admin
from .models import Announcement

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = ('title', 'status', 'timestamp')
    
    # Add filters for the status field
    list_filter = ('status',)
    
    # Add search functionality for the title and message fields
    search_fields = ('title', 'message')
    
    # Make the timestamp field read-only in the admin form
    readonly_fields = ('timestamp',)
    
    # Customize the ordering of announcements in the admin list
    ordering = ('-timestamp',)