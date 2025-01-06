from django.urls import path
from .views import ResourceListCreateView, ResourceRetrieveUpdateDestroyView

urlpatterns = [
    # Endpoint for listing and creating resources
    path('resources-list-create/', ResourceListCreateView.as_view(), name='resource-list-create'),

    # Endpoint for retrieving, updating, and deleting a specific resource
    path('resources/<int:pk>/', ResourceRetrieveUpdateDestroyView.as_view(), name='resource-retrieve-update-destroy'),
]