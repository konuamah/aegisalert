from django.urls import path
from .views import (
    GetCSRFToken,
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserProfileView,
    UserNotificationsView
)

urlpatterns = [
    path('csrf/', GetCSRFToken.as_view(), name='csrf_token'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('notifications/', UserNotificationsView.as_view(), name='notifications'),
]