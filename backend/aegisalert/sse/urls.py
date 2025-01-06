from django.urls import path
from .views import resource_updates
from .views import announcement_updates

urlpatterns = [
        path('announcements/', announcement_updates, name='announcement_updates'),
    path('resources/', resource_updates, name='resource_updates'),
]