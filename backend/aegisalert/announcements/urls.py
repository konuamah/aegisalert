from django.urls import path
from .views import AnnouncementList

urlpatterns = [
    path('announcements/', AnnouncementList.as_view(), name='announcement_list'),
]