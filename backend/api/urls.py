from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-user/<str:id>/<str:username>/verified/', views.create_profile, name='user-verification'),


    path('api-overview/', views.api_overview, name='api-overview'),
    path('user-reg/', views.UserRegistration.as_view(), name='user-registration'),
    path('forget-password/check-email/', views.CheckEmailView.as_view(), name='forget-password-email'),
    path('forget-password/check-code/', views.CheckVerifyCodeView.as_view(), name='forget-password-code'),
    path('forget-password/reset-password/', views.ResetPasswordView.as_view(), name='forget-password-reset'),
    path('profile/<int:user_id>/', views.ProfileView.as_view(), name='profile'),


    path('new-session/', views.SessionView.as_view(), name='new-session'),
    path('join-session/', views.JoinSessionView.as_view(), name='join-session'),
    path('leave-session/<int:session_id>/<str:token>/', views.LeaveSessionView.as_view(), name='leave-session'),
    path('remove-member/<int:session_id>/<str:token>/<int:user_id>/', views.SessionMemberView.as_view(), name='remove-member'),
    path('block-member/<int:session_id>/<str:token>/<int:user_id>/', views.SessionMemberBlacklistView.as_view(), name='session_member_block'),
    path('single-session/<int:id>/', views.SingleSessionView.as_view(), name='single-session'),
    path('single-post/<int:session_id>/<int:post_id>/', views.SinglePostView.as_view(), name='single-post-crud'),
    path('post-comment/<int:session_id>/<int:post_id>/', views.PostCommentView.as_view(), name='post-comment'),
    path('post-comment/<int:session_id>/<int:post_id>/<int:comment_id>/', views.PostCommentCRUD.as_view(), name='post-comment-crud'),
    path('single-file/<int:file_id>/', views.SingleFileView.as_view(), name='single-file'),
    path('session/assignment/<int:session_id>/', views.AssignmentView.as_view(), name='assignment'),
    path('session/single-assignment/<int:session_id>/<int:assignment_id>/', views.AssignmentCRUD.as_view(), name='assignment-delete'),
    path('submission/<int:session_id>/<int:assignment_id>/', views.AssignmentSubmitView.as_view(), name='assignment-submit'),
    # path('submitted/assignment-list/<int:session_id>/<int:assignment>/', views.SubmittedAssignmentView.as_view, name='submitted assignment')
 
]

