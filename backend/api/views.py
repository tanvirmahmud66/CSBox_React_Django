
import uuid
import secrets
import string
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import serializers

from .models import User
from .models import UserProfile
from .serializers import UserProfileSerializer, UserRegistrationSerializer

# Create your views here.

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
        
    }
    return JsonResponse(api)


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
def create_profile(request, pk):
    user = User.objects.get(username=pk)
    user_profile = UserProfile.objects.create(user=user, is_verified=True)
    serializer = UserProfileSerializer(user_profile)
    return Response(serializer.data, status=status.HTTP_201_CREATED)