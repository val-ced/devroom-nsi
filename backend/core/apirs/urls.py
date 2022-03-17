
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
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # Public information on users
    path("users/<str:at>/", views.UserAPIView.as_view(), name="user-detail") ,
    path("users/<str:at>/followers/", views.UserFollowersAPIView.as_view(), name='user-followers') ,
    path("users/<str:at>/following/", views.UserFollowingAPIView.as_view(), name='user-following') ,
    path("users/<str:at>/articles/", views.UserArticleAPIView.as_view()) ,
    path("users/<str:at>/posts/", views.UserPostsAPIView.as_view()) ,

    # Public information on posts
    path("posts/<str:id>/", views.PostAPIView.as_view(), name="post-detail") ,
    path("posts/<str:id>/comments/", views.CommentsAPIView.as_view(), name="post-comments") ,

    # Public information on articles
    path("articles/<str:id>/", views.ArticleAPIView.as_view(), name="article-detail") ,
    path("articles/<str:id>/comments/", views.CommentsAPIView.as_view(), name="article-comments") ,

    # Private information on current user
    path("user/", views.MeAPIView.as_view()) ,
    path("user/followers/", views.MeFollowersAPIView.as_view(), name='user-followers') ,
    path("user/following/", views.MeFollowingAPIView.as_view(), name='user-following') ,
    path("user/articles/", views.UserArticleAPIView.as_view()) ,
    path("user/posts/", views.UserPostsAPIView.as_view()) ,
    path("user/posts/new/", views.PostCreateAPIView.as_view(), name="post-create") ,
    path("user/posts/<str:id>/delete/", views.PostDestroyAPIView.as_view(), name="post-destroy") ,
    path("user/register/", views.UserRegisterAPIView.as_view(), name='user-register') ,
]
