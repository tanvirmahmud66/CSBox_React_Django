from django.urls import path
from . import views

urlpatterns = [
    path('api-overview/', views.api_overview, name='api-overview'),
    path('user-reg/', views.UserRegistration.as_view(), name='user-registration'),
    


    path('verify-user/<str:pk>/verified/', views.create_profile, name='user-verification'),
]