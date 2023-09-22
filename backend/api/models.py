from django.db import models
import os
import base64
from django.conf import settings
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

#============================================================ custom user model ===========================
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field must be set.")
        if not email:
            raise ValueError("The Email field must be set.")
        
        user = self.model(username=username, email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    
#============================================================================================================================


#================================== User Profile Model
class UserProfile(models.Model):

    DEFAULT_PROFILE_PIC = 'default_profile_pic.webp'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    profile_pic = models.ImageField(upload_to='profilePic/',default=DEFAULT_PROFILE_PIC,null=True, blank=True)
    bio = models.CharField(max_length=300, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    profession = models.CharField(max_length=300, null=True, blank=True)
    work_at = models.CharField(max_length=300, null=True, blank=True)
    study_at = models.CharField(max_length=300, null=True, blank=True)
    college = models.CharField(max_length=300, null=True, blank=True)
    school = models.CharField(max_length=300, null=True, blank=True)
    linkedIn = models.CharField(max_length=300,null=True, blank=True)
    github = models.CharField(max_length=300,null=True, blank=True)
    website = models.CharField(max_length=300,null=True, blank=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profile"
    
    def profile_pic_url(self):
        if self.profile_pic:
            return self.profile_pic.url
        return settings.STATIC_URL + self.DEFAULT_PROFILE_PIC
    
    def __str__(self):
        return self.user.username
    

#====================================================== Session Model
class SessionData(models.Model):
    title = models.CharField(max_length=300)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    details = models.CharField( max_length=300, blank=True, null=True)
    token = models.CharField(max_length=5, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Session Data"
        verbose_name_plural = "Session Data"
        ordering = ['-created']

    def __str__(self):
        return self.title
    

@receiver(pre_save, sender=SessionData)
def update_folder_name(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
        except sender.DoesNotExist:
            return

        if old_instance.title != instance.title:
            old_folder_path = os.path.join(settings.MEDIA_ROOT, 'uploads', old_instance.title)
            new_folder_path = os.path.join(settings.MEDIA_ROOT, 'uploads', instance.title)

            if os.path.exists(old_folder_path):
                os.rename(old_folder_path, new_folder_path)


#======================================================= Session Member
class SessionMember(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        verbose_name = "Session Member"
        verbose_name_plural = "Sesson Member"

    def __str__(self):
        return self.session.token
    

#======================================================= Post Model
class PostDB(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    post_body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Post Database"
        verbose_name_plural = "Post Database"
        ordering = ['-created']

    def __str__(self):
        return self.post_body[0:15]
    


#======================================================= Assignment Model
class AssignmentPostDB(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=400)
    body = models.TextField(blank=True, null=True)
    files = models.FileField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()

    class Meta:
        verbose_name = "Assignments Post Model"
        verbose_name_plural = "Assignments Post Model"
        ordering = ['-created']

    def get_file_data(self):
        try:
            with self.files.open('rb') as f:
                file_data = f.read()
                return base64.b64encode(file_data).decode('utf-8')
        except Exception:
            return None

    def __str__(self):
        return self.title
    

#====================================================== Assignment Submission Model
class AssignmentSubmissionDB(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    assignment = models.ForeignKey(AssignmentPostDB, on_delete=models.CASCADE)
    submit_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField()
    submitted = models.BooleanField(default=False)
    submit_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Assignment Submission DB"
        verbose_name_plural = "Assignment Submission DB"
        ordering = ['-submit_at']
    
    def get_file_data(self):
        try:
            with self.file.open('rb') as f:
                file_data = f.read()
                return base64.b64encode(file_data).decode('utf-8')
        except Exception:
            return None

    def __str__(self):
        return self.file.name
    
    


#============================================= File Model

def get_file_upload_path(instance, filename):
    return os.path.join('uploads', instance.session.title, filename)

class FileDB(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    post_id = models.IntegerField(null=True, blank=True)
    file = models.FileField(upload_to=get_file_upload_path)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Documents Model"
        verbose_name_plural = "Documents Model"
        ordering = ['-created_at']

    def __str__(self):
        return self.file.name

    

    

#======================================================= Comment Model
class CommentDB(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    post_id = models.ForeignKey(PostDB, on_delete=models.CASCADE)
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    comment_body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Comment Database"
        verbose_name_plural = "Comment Database"
    
    def __str__(self):
        return self.comment_body
    

#===================================================== Session Member Blacklist
class SessionMemberBlockList(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=5)

    class Meta:
        verbose_name = "Session Member Blocklist"
        verbose_name_plural = "Session Member Blocklist"

    def __str__(self):
        return self.token
