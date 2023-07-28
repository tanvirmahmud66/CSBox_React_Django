from rest_framework import serializers 
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site

from .models import User, UserProfile, SessionData, SessionMember, PostDB, CommentDB

#============================================================== Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)
        user = User.objects.create_user(**validated_data)

        # Sending welcome email and email confirmation linke to the user
        link = f"http://127.0.0.1:8000/api/verify-user/{user.username}/verified/"
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




#========================== User Profile Serializer

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'




#========================= SessoinData Serializer

class SessionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionData
        fields = '__all__'



#========================= SessionMember Serializer

class SessionMemeberSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionMember
        fields = '__all__'



#=========================== PostDB Serializer

class PostDBSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostDB
        fields = '__all__'




#=========================== CommentDB Serializers

class CommentDBSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentDB
        fields = '__all__'

