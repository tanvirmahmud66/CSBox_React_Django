from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .models import UserProfile, SessionData, SessionMember, PostDB, FileDB,CommentDB, AssignmentPostDB, AssignmentSubmissionDB
# Register your models here.


#=========================== List View
class UserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    ordering = ('username',)
    filter_horizontal = ()




class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'profile_pic','bio', 'gender', 'profession', 'work_at', 'study_at', 'college', 'school', 'linkedIn', 'github', 'website')
    list_filter = ('bio', 'gender', 'profession', 'work_at', 'study_at', 'college', 'school')
    search_fields = ('bio', 'gender', 'profession', 'work_at', 'study_at', 'college', 'school')


class SessionDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'host','details', 'token', 'created')
    list_filter = ('title', 'host', 'details', 'token')
    search_fields = ('title', 'host', 'details', 'token')


class SessionMemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'member', 'token')
    list_filter = ('session', 'member', 'token')
    search_fields = ('session', 'member', 'token')


class PostDBAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'creator',  'post_body',  'created', 'updated')
    list_filter = ('session', 'creator', 'post_body', 'created', 'updated')
    search_fields = ('session', 'creator', 'post_body', 'created', 'updated')

class FileDBAdmin(admin.ModelAdmin):
    list_display=('session','post_id','file','created_at')
    list_filter = ('session', 'post_id','file', 'created_at')
    search_fields = ('session','post_id', 'file')


class AssignmentPostDBAdmin(admin.ModelAdmin):
    list_display=('id','session','creator','title','body','files','created','deadline')
    list_filter = ('session','creator','title','created','deadline')
    search_fields=('session','creator','title','created','deadline')


class CommentDBAdmin(admin.ModelAdmin):
    list_display = ('id', 'commenter', 'post_id', 'session', 'comment_body', 'created', 'updated')
    list_filter = ('session', 'comment_body', 'created', 'updated')
    search_fields = ('commenter', 'post_id', 'session', 'comment_body', 'created', 'updated')


class AssignmentSubmissionDBAdmin(admin.ModelAdmin):
    list_display = ('id','session','assignment','submit_by','file','submitted','submit_at')
    list_filter = ('session','assignment','submit_by')
    search_fields = ('session','assignment','submit_by')


#=============== Model Registration
admin.site.register(User, UserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(SessionData, SessionDataAdmin)
admin.site.register(SessionMember, SessionMemberAdmin)
admin.site.register(PostDB, PostDBAdmin)
admin.site.register( FileDB, FileDBAdmin)
admin.site.register(CommentDB, CommentDBAdmin)
admin.site.register(AssignmentPostDB, AssignmentPostDBAdmin)
admin.site.register(AssignmentSubmissionDB, AssignmentSubmissionDBAdmin)
