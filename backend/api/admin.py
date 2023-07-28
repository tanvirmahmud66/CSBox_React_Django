from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .models import UserProfile, SessionData, SessionMember, PostDB, CommentDB
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
    list_display = ('id', 'user', 'bio', 'gender', 'profession', 'work_at', 'study_at', 'college', 'school')
    list_filter = ('bio', 'gender', 'profession', 'work_at', 'study_at', 'college', 'school')
    search_fields = ('bio', 'gender', 'profession', 'work_at', 'study_at', 'college', 'school')


class SessionDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'host', 'details', 'token')
    list_filter = ('title', 'host', 'details', 'token')
    search_fields = ('title', 'host', 'details', 'token')


class SessionMemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'member', 'token')
    list_filter = ('session', 'member', 'token')
    search_fields = ('session', 'member', 'token')


class PostDBAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'creator', 'is_announcement', 'post_body', 'has_file', 'created', 'updated')
    list_filter = ('session', 'creator', 'is_announcement', 'post_body', 'has_file', 'created', 'updated')
    search_fields = ('session', 'creator', 'is_announcement', 'post_body', 'has_file', 'created', 'updated')


class CommentDBAdmin(admin.ModelAdmin):
    list_display = ('id', 'commenter', 'post_id', 'session', 'comment_body', 'created', 'updated')
    list_filter = ('session', 'comment_body', 'created', 'updated')
    search_fields = ('commenter', 'post_id', 'session', 'comment_body', 'created', 'updated')



#=============== Model Registration
admin.site.register(User, UserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(SessionData, SessionDataAdmin)
admin.site.register(SessionMember, SessionMemberAdmin)
admin.site.register(PostDB, PostDBAdmin)
admin.site.register(CommentDB, CommentDBAdmin)
