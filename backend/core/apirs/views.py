from django.http import Http404, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
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
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

class UserAPIView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "at"


class UserFollowersAPIView(ListAPIView):
    serializer_class = UserLessSerializer
    lookup_field = "at"

    def get_queryset(self):
        user = User.objects.get(at=self.kwargs.get(self.lookup_field))
        following = [u for i in user.following_id if (u:=User.objects.get(id=i))]
        return following


class UserFollowingAPIView(ListAPIView):
    serializer_class = UserLessSerializer
    lookup_field = "at"

    def get_queryset(self):
        user = User.objects.get(at=self.kwargs.get(self.lookup_field))
        followers = [u for i in user.followers_id if (u:=User.objects.get(id=i))]
        return followers


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