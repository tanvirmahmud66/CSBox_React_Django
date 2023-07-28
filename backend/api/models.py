from django.db import models
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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    bio = models.CharField(max_length=300, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    profession = models.CharField(max_length=300, null=True, blank=True)
    work_at = models.CharField(max_length=300, null=True, blank=True)
    study_at = models.CharField(max_length=300, null=True, blank=True)
    college = models.CharField(max_length=300, null=True, blank=True)
    school = models.CharField(max_length=300, null=True, blank=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profile"
    
    def __str__(self):
        return self.user.username
    

#====================================================== Session Model
class SessionData(models.Model):
    title = models.CharField(max_length=300)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    details = models.CharField(max_length=300, blank=True, null=True)
    token = models.CharField(max_length=5)

    class Meta:
        verbose_name = "Session Data"
        verbose_name_plural = "Session Data"

    def __str__(self):
        return self.title


#======================================================= Session Member
class SessionMember(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    member = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    token = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        verbose_name = "Session Member"
        verbose_name_plural = "Sesson Member"

    def __str__(self):
        return self.member.user.username
    

#======================================================= Post Model
class PostDB(models.Model):
    session = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    is_announcement = models.BooleanField(default=False, null=True, blank=True)
    post_body = models.TextField()
    has_file = models.BooleanField(default=False, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Post Database"
        verbose_name_plural = "Post Database"
        ordering = ['-updated', '-created']

    def __str__(self):
        return self.postBody[0:15]
    

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
