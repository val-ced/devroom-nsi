from django.shortcuts import get_object_or_404, render
from django.http.request import HttpRequest
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination

from . import JsonResponseError
from .serializers import ArticleSerializer, PostSerializer, UserSerializer, serialize_user

from .models import Article, User, Post

# Create your views here.
@api_view(('GET',))
def routes(request):
    host = request.META["HTTP_HOST"]
    http_v = request.META["wsgi.url_scheme"]
    url = f"{http_v}://{host}/api"
    return Response({
        "user": f"{url}/users/" + "{user_at}",
        "current_user": f"{url}/user" 
    })

@api_view(('GET',))
def users_routes(request):
    host = request.META["HTTP_HOST"]
    http_v = request.META["wsgi.url_scheme"]
    url = f"{http_v}://{host}/api"
    return Response({
        "user": f"{url}/" + "{user_at}",
        "followings": f"{url}/" + "{user_at}/{followings}",
        "followers": f"{url}/" + "{user_at}/{followers}",
    })


def __get_user(at: str):
    try: 
        user = User.objects.get(at=at)

        serializer = UserSerializer(user, many=False)

        return Response(serializer.data)

    except User.DoesNotExist:
        return JsonResponseError("User doesn't exist.") 

@api_view(("GET",))
def get_user(request, at: str): 
    return __get_user(at)


def paginate_f(l: list, limit: int = 20, page: int = 1, callback = serialize_user):

        if limit > 100:
            limit = 100
        elif limit <= 0:
            limit = 20

        beg = (limit * page) - 1 if page > 1 else 0
        end = beg+limit
        length = len(l)
        total_pages = (length // limit)
        if length < limit:
            total_pages+=1

        ids = l[beg:end]

        l = [u for i in ids if (u:=callback(User.objects.get(id=i)))]

        data = {
            "limit": limit,
            "current_page": page,
            "total_pages": total_pages,
            "data": l 
        }

        return data

def __get_user_followers(request, at: str):
    try:
        page = int(request.GET.get("page") or 1)
        limit = int(request.GET.get("limit") or 20)
        t_ids = list(User.objects.get(at=at).followers_id)

        data = paginate_f(t_ids, limit, page)
        return Response(data)

    except User.DoesNotExist:
        return JsonResponseError("User doesn't exist.")


def __get_user_followings(request, at: str):
    try:
        page = int(request.GET.get("page") or 1)
        limit = int(request.GET.get("limit") or 20)
        t_ids = list(User.objects.get(at=at).following_id)

        data = paginate_f(t_ids, limit, page)
        return Response(data)

    except User.DoesNotExist:
        return JsonResponseError("User doesn't exist.")

@api_view(("GET",))
def get_user_followers(request, at: str):
    return __get_user_followers(request, at)


@api_view(('GET',))
def get_user_followings(request, at: str):
    return __get_user_followings(request, at)


@api_view(("GET",))
def get_me(request):
    return __get_user(request.user.at)


@api_view(('GET',))
def get_me_followers(request):
    return __get_user_followers(request, request.user.at)


@api_view(('GET',))
def get_me_followings(request):
    return __get_user_followings(request, request.user.at)


# @api_view(('GET',))
# def get_user_posts(request, at: str):
#     try:
#         user = User.objects.get(at=at)
#         posts = [x for p in user.posts_id if (x:= Post.objects.get(id=p))]

#         serializer = PostSerializer(posts, many=True)

#         return Response(serializer.data)

#     except User.DoesNotExist:
#         return JsonResponseError("User doesn't exist.")
#     except Post.DoesNotExist:
#         return JsonResponseError("Post doesn't exist.")


# @api_view(('GET',))
# def get_user_articles(request, at: str):
#     try:
#         user = User.objects.get(at=at)
#         articles = [x for a in user.articles_id if (x:= Article.objects.get(id=a))]

#         serializer = ArticleSerializer(articles, many=True)

#         return Response(serializer.data)

#     except User.DoesNotExist:
#         return JsonResponseError("User doesn't exist.")
#     except Article.DoesNotExist:
#         return JsonResponseError("Article doesn't exist.")


# @api_view(('GET',))
# def get_user_article(request, at: str, uuid: str):
#     try:

#         article = Article.objects.get(id=uuid) 

#         if article.author.at != at:
#             return JsonResponseError("Unable to find the article.")

#         serializer = ArticleSerializer(article, many=False)

#         return Response(serializer.data)

#     except User.DoesNotExist:
#         return JsonResponseError("User doesn't exist.")
#     except Article.DoesNotExist:
#         return JsonResponseError("Article doesn't exist.")


# @api_view(('GET',))
# def get_user_post(request, at: str, uuid: str):
#     try:

#         post = Post.objects.get(id=uuid) 

#         if post.author.at != at:
#             return JsonResponseError("Unable to find the post.")

#         serializer = PostSerializer(post, many=False)

#         return Response(serializer.data)

#     except User.DoesNotExist:
#         return JsonResponseError("User doesn't exist.")
#     except Post.DoesNotExist:
#         return JsonResponseError("Post doesn't exist.")

class MyPaginator(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class PostViewSet(ListAPIView): 
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = MyPaginator

    def get_queryset(self, *args, **kwargs):
        at = self.kwargs.get("at")
        author = User.objects.get(at=at)
        posts = [Post.objects.get(id=i) for i in author.posts_id]
        serializer = PostSerializer(posts, many=True)
        return self.get_paginated_response(serializer)