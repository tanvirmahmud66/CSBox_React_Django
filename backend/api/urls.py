from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



    path('api-overview/', views.api_overview, name='api-overview'),
    path('user-reg/', views.UserRegistration.as_view(), name='user-registration'),
    path('profile/<int:user_id>/', views.ProfileView.as_view(), name='profile'),
    path('new-session/', views.SessionView.as_view(), name='new-session'),
    path('join-session/', views.JoinSessionView.as_view(), name='join-session'),
    path('leave-session/<int:session_id>/<str:token>/', views.LeaveSessionView.as_view(), name='leave-session'),
    path('single-session/<int:id>/', views.SingleSessionView.as_view(), name='single-session'),
    path('single-post/<int:session_id>/<int:post_id>/', views.SinglePostView.as_view(), name='single-post-crud'),
    path('post-comment/<int:session_id>/<int:post_id>/', views.PostCommentView.as_view(), name='post-comment'),
    path('single-file/<int:file_id>/', views.SingleFileView.as_view(), name='single-file'),


    path('verify-user/<str:id>/<str:username>/verified/', views.create_profile, name='user-verification'),
]

