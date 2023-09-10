import uuid
import secrets
import string
from django.http import JsonResponse
import json
import base64
from datetime import datetime
from rest_framework import serializers
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .models import UserProfile, SessionData, SessionMember, PostDB, FileDB, CommentDB, AssignmentPostDB, AssignmentSubmissionDB
from .serializers import UserProfileSerializer, UserRegistrationSerializer, SessionDataSerializer, SessionMemberSerializer, PostDBSerializer, FileDBSerializer, CommentDBSerializer, AssignmentPostDBSerializer, AssignmentSubmissionDBSerializer

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
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        try:
            profile = UserProfile.objects.get(user=user)

            if profile is not None:
                return data
            else:
                raise serializers.ValidationError("Not Verified Profile.")
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("Not Verified Profile.")
        

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
    user_profile = UserProfile.objects.get_or_create(user=user, is_verified=True)
    serializer = UserProfileSerializer(user_profile)
    return Response(serializer.data, status=status.HTTP_201_CREATED)



#============================================== Profile page view
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        profile = UserProfile.objects.get(user=user)
        profile_serializer = UserProfileSerializer(profile)
        return Response(profile_serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, user_id):
        user = User.objects.get(id=user_id)
        profile = UserProfile.objects.get(user=user)
        serializer = UserProfileSerializer(instance=profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": 'ok'}, status=status.HTTP_200_OK)
        
        if 'profile_pic' in request.FILES:
            profile.profile_pic = request.FILES['profile_pic']
            profile.save()
            return Response({"status":"Profile save"},status=status.HTTP_200_OK)

        return Response({"status": 'not ok'}, status=status.HTTP_400_BAD_REQUEST)


#============================================== Home Page SessionView
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
                join_session.append(SessionData.objects.get(token=each.token))
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
    


#============================================== Home page Session Joining
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


class LeaveSessionView(APIView):
    def delete(self, request, session_id, token):
        session_member_model = SessionMember.objects.get(session=session_id, member=request.user, token=token)
        session_member_model.delete()
        return Response({"status": "Leave session successfull"}, status=status.HTTP_200_OK)



#================================================= Sigle Session Page
class SingleSessionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get(self, request, id):
        try:
            session = SessionData.objects.get(id=id)
            session_members = SessionMember.objects.filter(session=session)
            posts = PostDB.objects.filter(session=session)
            files = FileDB.objects.filter(session=session)
            assignments = AssignmentPostDB.objects.filter(session=session)
            submissions = AssignmentSubmissionDB.objects.filter(session=session)
            serializer_posts = PostDBSerializer(posts, many=True)
            serializer_session = SessionDataSerializer(session)
            serializer_members = SessionMemberSerializer(session_members, many=True)
            serializer_assignments = AssignmentPostDBSerializer(assignments, many=True)
            serializer_submissions = AssignmentSubmissionDBSerializer(submissions, many=True)

            serialized_files = []
            for file in files:
                serialized_file = FileDBSerializer(file, context={'request': request}).data
                with file.file.open('rb') as f:
                    serialized_file['file_data'] = base64.b64encode(f.read()).decode('utf-8')
                serialized_files.append(serialized_file)
            

            submitted_assignment_array=[]
            unsubmitted_assignment_array = []
            if session.host.id!=request.user.id:
                for each in assignments:
                    try:
                        target = AssignmentSubmissionDB.objects.get(session=session, assignment=each, submit_by=request.user)
                        serializer = AssignmentPostDBSerializer(each)
                        submitted_assignment_array.append(serializer.data)
                    except Exception:
                        serializer = AssignmentPostDBSerializer(each)
                        unsubmitted_assignment_array.append(serializer.data)
            
            data = {
                "session": serializer_session.data,
                "posts": serializer_posts.data,
                "files": serialized_files,
                "members": serializer_members.data,
                "assignments": serializer_assignments.data,
                "submitted_assignment":submitted_assignment_array,
                "unsubmitted_assignment": unsubmitted_assignment_array,
                "submissions": serializer_submissions.data,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception:
            return Response({"status": "Bad Request"},status=status.HTTP_400_BAD_REQUEST)
    

    def post(self, request, id, format=None):
        try:
            post_data = json.loads(request.data.get('post_data'))
            session = post_data.get('session')
            if post_data.get('post_body') and post_data.get('creator'):
                post_body = post_data.get('post_body')
                creator = post_data.get('creator')
                post_serializer = PostDBSerializer(data={'session': session, 'post_body': post_body, 'creator': creator})
                if post_serializer.is_valid():
                    post = post_serializer.save()
                else:
                    return Response({'message': 'Error creating post', 'errors': post_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            file_serializer = FileDBSerializer()
            for file in request.FILES.getlist('files'):
                if post_data.get('post_body') and post_data.get('creator'):
                    file_serializer = FileDBSerializer(data={'session':session , 'post_id': post.id , 'file': file})
                else:
                    file_serializer = FileDBSerializer(data={'session':session, 'file': file})

                if file_serializer.is_valid():
                    file_serializer.save()
                else:
                    return Response({'message': 'Error creating file', 'errors': file_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Post and files created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': 'Error creating post and files', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, id):
        session_data = json.loads(request.data.get('session_data'))
        edited_title = session_data.get('title')
        edited_details = session_data.get('details')
        target_session = SessionData.objects.get(id=id)
        serializer = SessionDataSerializer(instance=target_session, data={'title':edited_title, 'details':edited_details, 'host': request.user.id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, reqeust, id):
        session = SessionData.objects.get(id=id)
        session.delete()
        return Response({"status":"Session Deleted"}, status=status.HTTP_200_OK)




#==================================== Session Member CRUD View
class SessionMemberView(APIView):
    def delete(self, request, session_id, token, user_id):
        target_session_member = SessionMember.objects.get(session=session_id, member=user_id, token=token)
        target_session_member.delete()
        return Response({"status": "Remove Member clicked"}, status=status.HTTP_204_NO_CONTENT)
    



#===================================== Single Post Crud
class SinglePostView(APIView):
    
    def put(self, request, session_id, post_id):
        post_data = json.loads(request.data.get('post_data'))
        post_body = post_data.get('post_body')
        creator = post_data.get('creator')
        try:
            session = SessionData.objects.get(id=session_id)
            post = PostDB.objects.get(id=post_id ,session=session, creator=creator)
            serializer_post = PostDBSerializer(instance=post, data={'session': session.id, 'post_body': post_body, 'creator': creator})           
            file_serializer = FileDBSerializer()

            for file in request.FILES.getlist('files'):
                file_serializer = FileDBSerializer(data={'session':session.id, 'post_id': post_id, 'file':file})
                if file_serializer.is_valid():
                    file_serializer.save()
                else:
                    return Response({'message': 'Error creating file', 'errors': file_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
            if serializer_post.is_valid():
                serializer_post.save()
                return Response(serializer_post.data, status=status.HTTP_200_OK)
            return Response(serializer_post.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as E:
            return Response({"status": "You are not permitted"}, status=status.HTTP_401_UNAUTHORIZED)
        

    def delete(self, request, session_id, post_id):
        post = PostDB.objects.get(id=post_id, session=session_id)
        post.delete()
        return Response({"status": "Delete Button Clicked."}, status=status.HTTP_200_OK)


    
#====================================== Post Comment View
class PostCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id, post_id):
        comments = CommentDB.objects.filter(session=session_id, post_id=post_id)
        serializer = CommentDBSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, session_id, post_id):
        serializer = CommentDBSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


#======================================= Single File View
class SingleFileView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, file_id):
        print(file_id)
        file = FileDB.objects.get(id=file_id)
        file.delete()
        return Response({"status": "File Deleted"}, status=status.HTTP_204_NO_CONTENT)
    


#======================================= Assignment View
class AssignmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        post_data = json.loads(request.data.get('post_data'))
        session = post_data.get('session')
        creator = post_data.get('creator')
        title = post_data.get('title')
        body = post_data.get('body')
        deadline = post_data.get('deadline')
        file = request.FILES.get('file')

        serializer = AssignmentPostDBSerializer(data={
            "session": session,
            "creator": creator,
            "title": title,
            "body": body,
            "files": file,
            "deadline": datetime.fromisoformat(deadline)
        })

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class AssignmentCRUD(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, session_id, assignment_id):
        post_data = json.loads(request.data.get('post_data'))
        print(post_data)
        session = post_data.get('session')
        creator = post_data.get('creator')
        title = post_data.get('title')
        body = post_data.get('body')
        deadline = post_data.get('deadline')
        file = request.FILES.get('file')

        target_assignment = AssignmentPostDB.objects.get(id=assignment_id, session=session_id)
        print(target_assignment)
        serializer = AssignmentPostDBSerializer(instance=target_assignment, data={
            "session": session,
            "creator": creator,
            "title": title,
            "body": body,
            "files": file,
            "deadline": datetime.fromisoformat(deadline)
        })
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "edited success"}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, session_id, assignment_id):
        target_assignment = AssignmentPostDB.objects.get(id=assignment_id, session=session_id)
        target_assignment.delete()
        return Response({"status": "Assignment Deleted"}, status=status.HTTP_204_NO_CONTENT)



class AssignmentSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id, assignment_id):
        submissions = AssignmentSubmissionDB.objects.filter(session=session_id)
        serializer = AssignmentSubmissionDBSerializer(submissions, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self, request, session_id, assignment_id):
        post_data = json.loads(request.data.get('post_data'))
        session= post_data.get('session')
        assignment = post_data.get('assignment')
        submit_by = post_data.get('submit_by')
        file = request.FILES.get('file')

        try:
            submit = AssignmentSubmissionDB.objects.get(assignment=assignment,submit_by=submit_by)
            return Response(status=status.HTTP_302_FOUND)
        except Exception:
            serializer = AssignmentSubmissionDBSerializer(data={
                "session":session,
                "assignment":assignment,
                "submit_by": submit_by,
                "file":file,
            })
            if serializer.is_valid():
                serializer.save()
                return Response({"status":"Assignment Submitted"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class SubmittedAssignmentView(APIView):
#     def get(self, request):
#         pass
    