from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



    path('api-overview/', views.api_overview, name='api-overview'),
    path('user-reg/', views.UserRegistration.as_view(), name='user-registration'),
    path('new-session/', views.SessionView.as_view(), name='new-session'),
    path('join-session/', views.JoinSessionView.as_view(), name='join-session'),



    path('verify-user/<str:id>/<str:username>/verified/', views.create_profile, name='user-verification'),
]