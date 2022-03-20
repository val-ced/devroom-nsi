
from django.contrib import admin
from django.urls import path, include
from django.urls.conf import re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from . import views

urlpatterns = [
    path("", views.routes),
    # Auth
    path('user/auth/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('user/auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('user/auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # Public information on users
    path("users/<str:at>/", views.UserAPIView.as_view(), name="user-detail") ,
    path("users/<str:at>/followers/", views.UserFollowersAPIView.as_view(), name='user-followers') ,
    path("users/<str:at>/following/", views.UserFollowingAPIView.as_view(), name='user-following') ,
    path("users/<str:at>/articles/", views.UserArticleAPIView.as_view()) ,
    path("users/<str:at>/posts/", views.UserPostsAPIView.as_view()) ,

    # Follow user
    path("users/<str:at>/follow/", views.follow_user, name="user-follow") ,
    path("users/<str:at>/unfollow/", views.unfollow_user, name="user-unfollow") ,

    # Public information on posts
    path("posts/<str:id>/", views.PostAPIView.as_view(), name="post-detail") ,
    path("posts/<str:id>/comments/", views.CommentsAPIView.as_view(), name="post-comments") ,

    # Public information on articles
    path("articles/<str:id>/", views.ArticleAPIView.as_view(), name="article-detail") ,
    path("articles/<str:id>/comments/", views.CommentsAPIView.as_view(), name="article-comments") ,

    # Private information on current user
    path("user/", views.MeAPIView.as_view()) ,
    # List followers
    path("user/followers/", views.MeFollowersAPIView.as_view(), name='user-followers') ,
    # List following
    path("user/following/", views.MeFollowingAPIView.as_view(), name='user-following') ,
    # List articles
    path("user/articles/", views.UserArticleAPIView.as_view()) ,
    # Create a new article
    path("user/articles/new/", views.ArticleCreateAPIView.as_view(), name='article-create') ,
    # Delete an article
    path("user/articles/<str:id>/delete/", views.ArticleDestroyAPIView.as_view(), name='article-destroy') ,
    # Update an article
    path("user/articles/<str:id>/edit/", views.ArticleEditAPIView.as_view(), name='article-edit') ,
    # Comment an article
    # It doesn't have to be the own user's article
    path("user/articles/<str:id>/comment/", views.CommentArticleAPIView.as_view(), name='article-comment') ,
    # Like an article
    # It doesn't have to be the own user's article
    path("user/articles/<str:id>/like/", views.like_article, name='article-like') ,
    path("user/articles/<str:id>/unlike/", views.unlike_article, name='article-like') ,

    path("user/articles/liked/", views.LikedArticlesAPIView.as_view(), name='article-like') ,
    # List user's posts
    path("user/posts/", views.UserPostsAPIView.as_view()) ,
    # List user's comments
    path("user/comments/", views.UserCommentsAPIView.as_view()) ,
    # Create a new post
    path("user/posts/new/", views.PostCreateAPIView.as_view(), name="post-create") ,
    # Add a comment to the refered post.
    # It doesn't have to be the own user's post/comment
    path("user/posts/<str:id>/comment/", views.CommentCreateAPIView.as_view(), name="post-comment") ,
    # Like a post/comment.
    # It doesn't have to be the own user's post/comment
    path("user/posts/<str:id>/like/", views.like_post, name="post-like") ,
    path("user/posts/<str:id>/unlike/", views.unlike_post, name="post-like") ,
    # Edit a post/comment
    path("user/posts/<str:id>/edit/", views.PostEditAPIView.as_view(), name="post-edit") ,
    # Delete posts and comments
    path("user/posts/<str:id>/delete/", views.PostDestroyAPIView.as_view(), name="post-destroy") ,
    path("user/posts/liked/", views.LikedPostsAPIView.as_view(), name="posts-liked") ,
    # Register a new user
    path("user/register/", views.UserRegisterAPIView.as_view(), name='user-register') ,
]
