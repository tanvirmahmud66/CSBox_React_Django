import uuid
import secrets
import string
from django.http import JsonResponse
import json

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .models import UserProfile, SessionData, SessionMember
from .serializers import UserProfileSerializer, UserRegistrationSerializer, SessionDataSerializer, SessionMemberSerializer

# Create your views here.
#------------------------- Json web token access token and refresh token-------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.id
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

#======================================================================================================================

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

#=======================================================================================================================

#=========================================== Api Overview
@api_view(['GET'])
def api_overview(request):
    api = {
        "all-api": "/api/api-overview/",
        "user-registration": {
             "method": "POST",
             "headers":{
                "Content-Type":"application/json"
             },
             "url" : "/api/user-reg/",
             "required": 'username, first_name, last_name, email, password, password2',
             "aditional_msg": "password and password2 must be ckeck from frontend",
        },
        "account-verification": {
            "method": "POST/GET",
            "headers":{
                "Content-Type":"application/json"
             },
             "url" : "verify-user/<int:id>/<str:username>/verified/",
        }
        
    }
    return Response(api)


#============================================= User Registration
class UserRegistration(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({
                "msg": "User Created Successfully",
                "data": serializer.data,
                "status": status.HTTP_201_CREATED,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#============================================= Verify User and create Profile
@api_view(['GET']) 
def create_profile(request, id, username):
    print(username)
    user = User.objects.get(id=id,username=username)
    user_profile = UserProfile.objects.create(user=user, is_verified=True)
    serializer = UserProfileSerializer(user_profile)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class SessionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        join_session = []
        user = User.objects.get(id=request.user.id)
        session = SessionData.objects.filter(host=request.user)
        serializer = SessionDataSerializer(session, many=True)
        if SessionMember.objects.filter(member=request.user).exists():
            member_session = SessionMember.objects.filter(member=request.user)
            for each in member_session:
                join_session.append(SessionData.objects.get(token=each))
            join_session_serializer = SessionDataSerializer(join_session, many=True)
            data = {
                "user":{
                    "id":user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                },
                "data": serializer.data,
                "join": join_session_serializer.data
            }
            return Response(data, status=status.HTTP_200_OK)   
        data = {
            "user":{
                "id":user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            },
            "data": serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)

    
    
    def post(self, request):
        serializer = SessionDataSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({
                "data": serializer.data,
                "status": status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class JoinSessionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        token = request.data['token']
        try:
            session = SessionData.objects.get(token=token)
            if session.host.id==request.user.id:
                return Response({"message":"Not Acceptable"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            try:
                is_session_member = SessionMember.objects.get(session=session, member=request.user, token=token)
                if is_session_member is not None:
                    return Response({"message":"Not Acceptable"}, status=status.HTTP_208_ALREADY_REPORTED)
            except Exception as E:
                new_member = SessionMember.objects.create(session=session, member=request.user, token=token)
                serializer = SessionMemberSerializer(new_member)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as E:
            return Response({"message":"Not found"}, status=status.HTTP_404_NOT_FOUND)





        