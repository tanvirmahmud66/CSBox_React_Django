from rest_framework import serializers 
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .utils import Util
import secrets
import json
import string
from .models import User 
from django.contrib.sites.shortcuts import get_current_site

from .models import User, UserProfile, SessionData, SessionMember, PostDB, CommentDB, FileDB, AssignmentPostDB, AssignmentSubmissionDB, SessionMemberBlockList

#============================================================== Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        password = data['password']
        print(password)
        if len(password) < 8:
            raise serializers.ValidationError("Password must have at least 8 character")
        
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)
        user = User.objects.create_user(**validated_data)

        # Sending welcome email and email confirmation linke to the user
        link = f"http://127.0.0.1:3000/#/account/{user.id}/{user.username}/verified"
        subject = 'Welcome to Our Website'
        html_message = render_to_string('welcome.html', {'username': user.username, 'link': link})
        body = strip_tags(html_message)
        data = {
            'subject':subject,
            'body':body,
            'to_email':user.email
        }
        Util.send_email(data)

        return user
# ==============================================================================================================



#----------------------------------------------------------- User Related Serializer
class UserRelatedField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        user = User.objects.get(pk=value.pk)
        profile = UserProfile.objects.get(user=user)

        user_data = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "profile": {
                "is_verified": profile.is_verified,
                "profile_pic": profile.profile_pic_url(),
                "bio": profile.bio,
                "gender": profile.gender,
                "profession": profile.profession,
                "work_at": profile.work_at,
                "study_at": profile.study_at,
                "college": profile.college,
                "school": profile.school,
                "linkedIn": profile.linkedIn,
                "github": profile.github,
                "website": profile.website,
            }
        }
        return user_data



#========================== User Profile Serializer

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserRelatedField(queryset=User.objects.all())
    class Meta:
        model = UserProfile
        fields = '__all__'




#-------------------------- Token generate ---------------------- 
token_set = set()
def generate_token(length):
    characters = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(characters) for _ in range(length))
    length = len(token_set)
    token_set.add(token)
    if len(token_set)==length+1:
        return token
    else:
        generate_token(5)


#========================= SessoinData Serializer

class SessionDataSerializer(serializers.ModelSerializer):
    host = UserRelatedField(queryset=User.objects.all())
    hostProfile = serializers.SerializerMethodField()

    class Meta:
        model = SessionData
        fields = '__all__'
    
    def create(self, validated_data):
        new_token = generate_token(5)
        new_session = SessionData.objects.create(**validated_data, token=new_token)
        return new_session
    
    def get_hostProfile(self, obj):
        profile = UserProfile.objects.get(user=obj.host)
        profile_data = {
            "is_verified": profile.is_verified,
            "profile_pic": profile.profile_pic.url if profile.profile_pic else None,
            "bio": profile.bio,
            "gender": profile.gender,
            "profession": profile.profession,
            "work_at": profile.work_at,
            "study_at": profile.study_at,
            "college": profile.college,
            "school": profile.school,
            "linkedIn": profile.linkedIn,
            "github": profile.github,
            "website": profile.website,
        }
        return profile_data



#========================= SessionMember Serializer

class SessionMemberSerializer(serializers.ModelSerializer):
    member = UserRelatedField(queryset=User.objects.all())
    class Meta:
        model = SessionMember
        fields = '__all__'
    
    def get_user(self, obj):
        return obj.user.username



#=========================== PostDB Serializer

class PostDBSerializer(serializers.ModelSerializer):
    creator = UserRelatedField(queryset=User.objects.all())
    class Meta:
        model = PostDB
        fields = '__all__'
    
    def create(self, validated_data):
        new_post = PostDB.objects.create(**validated_data)
        return new_post



#================================== FileDB Serializer

class FileDBSerializer(serializers.ModelSerializer):
    file_data = serializers.SerializerMethodField()

    class Meta:
        model = FileDB
        fields='__all__'

    def get_file_data(self, obj):
        try:
            with obj.file.open('rb') as f:
                return f.read()
        except Exception:
            return None
        


#========================== AssignmentPostDB Serializers
class AssignmentPostDBSerializer(serializers.ModelSerializer):
    creator = UserRelatedField(queryset=User.objects.all())
    file_data = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentPostDB
        fields = '__all__'

    def get_file_data(self, obj):
        return obj.get_file_data()


#============================ AssignmentSubmissionDB Serializer
class AssignmentSubmissionDBSerializer(serializers.ModelSerializer):
    submit_by = UserRelatedField(queryset=User.objects.all())
    file_data = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentSubmissionDB
        fields = '__all__'
    
    def get_file_data(self, obj):
        return obj.get_file_data()


#=========================== CommentDB Serializers

class CommentDBSerializer(serializers.ModelSerializer):
    commenter = UserRelatedField(queryset=User.objects.all())
    class Meta:
        model = CommentDB
        fields = '__all__'



#============================ Session Member Blacklist Serializer
class SessionMemberBlocklistSerializer(serializers.ModelSerializer):
    member = UserRelatedField(queryset=User.objects.all())

    class Meta:
        model = SessionMemberBlockList
        fields = '__all__'
