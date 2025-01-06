# disasters/urls.py
from django.urls import path
from .views import DisasterCreateView  # Import the class-based view
from .views import DisasterListView  # Import the class-based view
from .views import DisasterDetailView  # Import the class-based view

urlpatterns = [
    path('add-disasters/', DisasterCreateView.as_view(), name='disaster-create'),
    path('disaster-list/', DisasterListView.as_view(), name='disaster-list'),
    path('disaster-detail/<int:pk>/', DisasterDetailView.as_view(), name='disaster-detail'),
]