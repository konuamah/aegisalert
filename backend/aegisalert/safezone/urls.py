# urls.py
from django.urls import path
from .views import SafeZoneListView

urlpatterns = [
    path('safezones-list/', SafeZoneListView.as_view(), name='safezone-list'),
]