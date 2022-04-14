from django.http import HttpRequest
from rest_framework import serializers as srz
from rest_framework.reverse import reverse
from .models import Article, Post, User
from rest_framework_simplejwt.views import TokenObtainPairView


class DynamicModelSerializer(srz.ModelSerializer):

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = self.fields
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class UserSerializer(srz.ModelSerializer):
    
    
    followers_url = srz.SerializerMethodField()
    following_url = srz.SerializerMethodField()

    followers = srz.SerializerMethodField()
    following = srz.SerializerMethodField()

    posts = srz.SerializerMethodField()
    articles = srz.SerializerMethodField()

    def get_followers(self, instance):
        return len(instance.followers_id)

    def get_following(self, instance):
        return len(instance.following_id)

    def get_posts(self, instance):
        return len(instance.posts_id)


    def get_articles(self, instance):
        return len(instance.articles_id)
        

    def get_followers_url(self, instance):
        request: HttpRequest = self.context.get("request")
        if not request:
            return None
        if request.user != instance:
            return reverse("user-followers", kwargs={"at": instance.at}, request=request)
        
        return reverse("user-followers", request=request)

    def get_following_url(self, instance):
        request: HttpRequest = self.context.get("request")
        if not request:
            return None
        if request.user != instance:
            return reverse("user-following", kwargs={"at": instance.at}, request=request)
        
        return reverse("user-following", request=request)

    class Meta:
        model = User
        fields = ('at', 'username', 'bio', 'followers', 'following', 'last_login', 'created_on', 'is_public', 'total_likes', 'articles', 'posts', 'logo', 'total_likes', 'is_active', 'following_url', 'followers_url', 'timeline_posts', 'timeline_articles')


class UserRegisterSerializer(srz.ModelSerializer):
    password2 = srz.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ('at', 'username', 'password', 'password2')
        extra_kwargs={
            'password': {
                'style':{'input_type': 'password'},
                'write_only': True
                }
        }


    def create(self, validated_data):
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2', None)
        if password != password2:
            raise srz.ValidationError({"password": "Passwords must match."})
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UserLessSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ('at', 'username')


class ArticleSerializer(srz.ModelSerializer):
    article_url = srz.HyperlinkedIdentityField(
        view_name='article-detail',
        lookup_field="id"
    )

    comments_url = srz.HyperlinkedIdentityField(
        view_name="article-comments",
        lookup_field="id"
    )

    author_url = srz.SerializerMethodField()
    author = srz.SerializerMethodField()

    comments = srz.SerializerMethodField(read_only=True)

    def get_comments(self, instance):
        return len(instance.comments_id) if instance.comments_id else 0


    def get_author_url(self, instance):
        request = self.context.get("request")
        if not instance.author_id or not request:
            return None

        user = User.objects.get(id=instance.author_id)
        return reverse("user-detail", kwargs={"at": user.at}, request=request)

    def get_author(self, instance):
        request = self.context.get("request")
        if not instance.author_id or not request:
            return None

        user = User.objects.get(id=instance.author_id)
        return user.at
    class Meta:
        model = Article
        fields = '__all__'


class PostSerializer(DynamicModelSerializer):


    post_url = srz.HyperlinkedIdentityField(
        view_name='post-detail',
        lookup_field="id"
    )
    comments_url = srz.HyperlinkedIdentityField(
        view_name="post-comments",
        lookup_field="id"
    )
    parent_url = srz.SerializerMethodField()
    author_url = srz.SerializerMethodField()
    author = srz.SerializerMethodField()

    comments = srz.SerializerMethodField(read_only=True)

    def get_comments(self, instance):
        return len(instance.comments_id) if instance.comments_id else 0


    def get_parent_url(self, instance):
        request = self.context.get("request")
        if not instance.parent_id or not request:
            return None

        return reverse("post-detail", kwargs={"id": instance.parent_id}, request=request)

    type = srz.SerializerMethodField()

    def get_type(self, instance):
        return instance.type
    
    def get_author_url(self, instance):
        request = self.context.get("request")
        if not instance.author_id or not request:
            return None

        user = User.objects.get(id=instance.author_id)
        return reverse("user-detail", kwargs={"at": user.at}, request=request)

    def get_author(self, instance):
        request = self.context.get("request")
        if not instance.author_id or not request:
            return None

        user = User.objects.get(id=instance.author_id)
        return user.at
    class Meta:
        model = Post
        fields = '__all__'


class CreateCommentSerializer(DynamicModelSerializer):

    class Meta:
        model = Post
        fields = ('body',)