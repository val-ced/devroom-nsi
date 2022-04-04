from datetime import datetime
from django.http import Http404, HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.request import HttpRequest
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Article, Post, User
from .serializers import ArticleSerializer, CreateCommentSerializer, PostSerializer, UserLessSerializer, UserRegisterSerializer, UserSerializer


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

class UserRegisterAPIView(CreateAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        reg_serializer = UserRegisterSerializer(data=request.data)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                return Response(status=status.HTTP_201_CREATED)
        
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserAPIView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "at"


class UserFollowersAPIView(ListAPIView):
    serializer_class = UserLessSerializer
    lookup_field = "at"

    def get_queryset(self):
        user = User.objects.get(at=self.kwargs.get(self.lookup_field))
        following = [u for i in user.followers_id if (u:=User.objects.get(id=i))]
        return following


class UserFollowingAPIView(ListAPIView):
    serializer_class = UserLessSerializer
    lookup_field = "at"

    def get_queryset(self):
        user = User.objects.get(at=self.kwargs.get(self.lookup_field))
        following = [u for i in user.following_id if (u:=User.objects.get(id=i))]
        return following


class MeFollowingAPIView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        following = [u for i in user.following_id if (u:=User.objects.get(id=i))]
        return following


class MeFollowersAPIView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        followers = [u for i in user.followers_id if (u:=User.objects.get(id=i))]
        return followers


class MeAPIView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        if not isinstance(self.request.user, AnonymousUser):
            queryset = self.get_queryset()
            obj = get_object_or_404(queryset, at=self.request.user.at)
            return obj
        raise Http404()



class UserArticleAPIView(ListAPIView):
    serializer_class = ArticleSerializer
    lookup_field = "at"

    def get_queryset(self):
        if (at:=self.kwargs.get(self.lookup_field)):
            user = User.objects.get(at=at)
        else:
            user = self.request.user
        articles = [a for i in user.articles_id if (a:=Article.objects.get(id=i))]
        return articles


class UserPostsAPIView(ListAPIView):
    serializer_class = PostSerializer
    lookup_field = "at"

    type = "P"

    def get_queryset(self):
        if (at:=self.kwargs.get(self.lookup_field)):
            user = User.objects.get(at=at)
        elif self.request.user.is_authenticated:
            user = self.request.user
        else:
            raise Http404
        posts = [p for i in user.posts_id if (p:=Post.objects.get(id=i)) and p.type == self.type]
        return posts

class UserCommentsAPIView(UserPostsAPIView):
    type = "C"


class PostAPIView(RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "id"

    def get_object(self):
        post = get_object_or_404(Post, id=self.kwargs.get(self.lookup_field))
        # if post.is_public:
        return post
        # raise Http404()

class ArticleCreateAPIView(CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: ArticleSerializer):
        serializer.save(author=self.request.user)

class ArticleDestroyAPIView(RetrieveDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "id"
    
    permission_classes = [IsAuthenticated]


class ArticleEditAPIView(RetrieveUpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "id"
    
    permission_classes = [IsAuthenticated]

    

class PostCreateAPIView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: PostSerializer):
        serializer.save(author=self.request.user)
        return Response(serializer.data)

class CommentArticleAPIView(PostCreateAPIView):
    def perform_create(self, serializer: PostSerializer):
        article: Article | None = Article.objects.get(id=self.kwargs.get("id"))
        if article:
            instance = serializer.save(author=self.request.user, type="C")
            article.comments.add(instance)
            article.save()
            return Response(serializer.data)
        
        

class PostDestroyAPIView(RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "id"
    
    permission_classes = [IsAuthenticated]


class PostEditAPIView(RetrieveUpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = "id"
    
    permission_classes = [IsAuthenticated]

class CommentsAPIView(ListAPIView):
    serializer_class = PostSerializer
    lookup_field = "id"

    def get_queryset(self):
        article = None
        post = None
        try:
            article = Article.objects.get(id=self.kwargs.get(self.lookup_field))
        except Article.DoesNotExist:
            pass

        try:

            post = Post.objects.get(id=self.kwargs.get(self.lookup_field))

        except Post.DoesNotExist:
            pass

        if not (post or article):
            raise Http404

        if post:
            comments = [c for i in post.comments_id if (c:=Post.objects.get(id=i))]
        
        if article:
            comments = [c for i in article.comments_id if (c:=Post.objects.get(id=i))]

            
        return comments

class CommentCreateAPIView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = CreateCommentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_create(self, serializer: CreateCommentSerializer):
        parent: Post | None = Post.objects.get(id=self.kwargs.get(self.lookup_field))
        if not parent is None:
            instance = serializer.save(author=self.request.user, parent=parent, type="C")
            parent.comments.add(instance)
            parent.save()
            return Response(serializer.data)
        
        raise HttpResponseNotFound

class ArticleAPIView(RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = "id"

    def get_object(self):
        article = get_object_or_404(Article, id=self.kwargs.get(self.lookup_field))
        # if article.is_public:
        return article

class LikedPostsAPIView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        me = self.request.user
        liked_posts = [Post.objects.get(id=id) for id in me.liked_posts_id]
        return liked_posts
        

class LikedArticlesAPIView(ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        me = self.request.user
        liked_articles = [Article.objects.get(id=id) for id in me.liked_articles_id]
        return liked_articles

@api_view(('PATCH',))
@permission_classes((IsAuthenticated,))
def follow_user(request: HttpRequest, at: str):
    me: User = request.user
    user = get_object_or_404(User, at=at)

    if user == me:
        return HttpResponseForbidden({"error": "You can not follow yourself."})

    if me.id not in user.followers_id: 
        user.followers.add(me)
        user.save()
        if user.id not in me.following_id:
            me.following.add(user)
            me.save()
        return Response({"success": "You follow this user"})

    return Response({"error": "You already follow this user."})

@api_view(('PATCH',))
@permission_classes((IsAuthenticated,))
def unfollow_user(request: HttpRequest, at: str):
    me: User = request.user
    user = get_object_or_404(User, at=at)

    if user == me:
        return HttpResponseForbidden({"error": "You can not unfollow yourself."})

    if me.id in user.followers_id:
        user.followers.remove(me)
        user.save()
        if user.id in me.following_id:
            me.following.remove(user)
            me.save()
        return Response({"success": "You unfollow this user"})

    return Response({"error": "You do not follow this user."})


def like_or_unlike(request: HttpRequest, id: str, type = "post"):
    assert type == "post" or type == "article"
    me = request.user
    item = None
    liked = None
    liked_ids = None
    if type == "post":
        item = get_object_or_404(Post, id=id)
        liked = me.liked_posts
        liked_ids = me.liked_posts_id
    elif type == "article":
        item = get_object_or_404(Article, id=id)
        liked = me.liked_articles
        liked_ids = me.liked_articles_id
    
    if not item.id in liked_ids: 
        item.likes += 1
        item.save()
        liked.add(item)
        me.save()
        item.author.total_likes += 1
        item.author.save()

        return Response({"success": f"You liked this {type}."})

    else:
        item.likes -= 1
        item.save()
        liked.remove(item)
        me.save()
        item.author.total_likes -= 1
        item.author.save()

        return Response({"success": f"You unliked liked this {type}."})

@api_view(('PATCH',))
@permission_classes((IsAuthenticated,))
def like_switch_post(request: HttpRequest, id: str):
    return like_or_unlike(request, id)

    

@api_view(('PATCH',))
@permission_classes((IsAuthenticated,))
def like_switch_article(request: HttpRequest, id: str):
    return like_or_unlike(request, id, type = "article")


class TimelineAPIView(ListAPIView):
    serializer_class_articles = ArticleSerializer
    serializer_class_posts = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset_articles(self):
        user = self.request.user
        articles = [Article.objects.get(id=a) for a in user.timeline_articles_id]
        return articles


    def get_queryset_posts(self):
        user = self.request.user
        posts = [Post.objects.get(id=a) for a in user.timeline_posts_id]
        return posts

    
    def list(self, request, *args, **kwargs):
        pass
        

class TimelinePostsAPIView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        posts = [Post.objects.get(id=a) for a in user.timeline_posts_id]
        return posts


class TimelineArticlesAPIView(ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        articles = [Article.objects.get(id=a) for a in user.timeline_articles_id]
        return articles

@api_view(('GET',))
def csrf(request: HttpRequest):
    res = Response()
    now = datetime.utcnow()
    res.set_cookie("csrftoken", get_token(request), expires=now.replace(year=now.year+1).strftime('%a, %d %b %Y %H:%M:%S'), secure=False, samesite="Lax")

    return res