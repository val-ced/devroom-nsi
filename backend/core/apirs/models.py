import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver
from djongo import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import (models as djm)
from django.utils.translation import gettext_lazy as _

from django.utils.timezone import now


class UserManager(BaseUserManager):
    def create_user(self, at: str, username: str, password: str, **other_fileds):
        
        followers = other_fileds.get("followers")
        following = other_fileds.get("following")

        print(followers, following)
        
        if not at:
            raise ValueError(_("You must provide an email adress"))

        user = self.model(at=at, username=username, **other_fileds)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, at: str, username: str, password: str, **other_fields):
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)

        if other_fields.get("is_staff") is not True:
            raise ValueError("Superuser must be assigned to is_staff=True")
        if other_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must be assigned to is_superuser=True")

        return self.create_user(at, username, password, **other_fields)

class User(AbstractBaseUser, PermissionsMixin):
    at = djm.CharField(max_length=10, unique=True)
    username = djm.CharField(max_length=15, null=False)
    bio = djm.TextField(max_length=250)
    is_staff = djm.BooleanField(default=False)
    is_active = djm.BooleanField(default=False)
    is_public = djm.BooleanField(default=True)
    created_on = djm.DateTimeField(null=False, default=now)
    followers = models.ArrayReferenceField(to="self", related_name="my_followers", default=[], blank=True, editable=False)
    following = models.ArrayReferenceField(to="self", related_name="my_followings", default=[], blank=True, editable=False)
    posts = models.ArrayReferenceField(to="Post", default=[], editable=False)
    articles = models.ArrayReferenceField(to="Article",default=[], editable=False)
    # notifications = models.ArrayField()
    liked_posts = models.ArrayReferenceField(to="Post", default=[], related_name="my_liked_posts", editable=False)
    liked_articles = models.ArrayReferenceField(to="Article", default=[], related_name="my_liked_articles", editable=False)
    logo = djm.ImageField(upload_to="logos", default='')
    total_likes = djm.IntegerField(default=0, editable=False)

    USERNAME_FIELD = "at"
    REQUIRED_FIELDS = ["username", "password"]

    objects = UserManager()

    def __str__(self) -> str:
        return "<User %s>" % self.at


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(to="User", on_delete=models.CASCADE, null=False)
    likes = models.IntegerField(default=0, editable=False)
    body = models.TextField(null=False, blank=False)
    comments = models.ArrayReferenceField(to="Post", blank=True, related_name="my_comments", on_delete=models.CASCADE)
    date = models.DateTimeField(default=now, editable=False)
    parent = models.ForeignKey(to="Post", related_name="my_parent", on_delete=models.CASCADE, null=True, blank=True)
    # is_public = models.BooleanField(default=True)

    def __str__(self) -> str:
        return "<Post %s>" % self.id

@receiver(post_save, sender=Post)
def add_to_author(sender, instance: Post, created: bool, *args, **kwargs):
    if created:
        instance.author.posts_id.add(instance.id)
        instance.author.save()


class Article(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(to="User", related_name="my_author", on_delete=models.CASCADE, null=False)
    likes = models.IntegerField(default=0, editable=False)
    body = models.TextField(null=False, blank=False)
    comments = models.ArrayReferenceField(to="Post", blank=True, on_delete=models.CASCADE)
    date = models.DateTimeField(default=now, editable=False)
    # is_public = models.BooleanField(default=True)


@receiver(post_save, sender=Article)
def add_to_author(sender, instance: Article, created: bool, *args, **kwargs):
    if created:
        instance.author.articles_id.add(instance.id)
        instance.author.save()


