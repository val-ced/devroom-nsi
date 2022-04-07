import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { User } from "../../Types/Interfaces/User";
import { devroomApiAuth } from "./apiAuth";

interface PostRequest {
  body: string;
}

interface ArticleRequest {
  body: string;
  title: string;
}

const meApi = devroomApiAuth.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "user/"
    }),
    getMeFollowers: builder.query<Pagination<User>, number | void>({
      query: (limit) =>
        `user/followers/?limit=${limit || 10}&offset=${limit || 10}`
    }),
    getMeFollowing: builder.query<Pagination<User>, number | void>({
      query: (limit) =>
        `user/following/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMePosts: builder.query<Pagination<Post>, number | void>({
      query: (limit) => `user/posts/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMeArticles: builder.query<Pagination<Article>, number | void>({
      query: (limit) =>
        `user/articles/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMePostsLiked: builder.query<Pagination<Post>, number | void>({
      query: (limit) =>
        `user/posts/liked/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMeArticlesLiked: builder.query<Pagination<Article>, number | void>({
      query: (limit) =>
        `user/articles/liked/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMeComments: builder.query<Pagination<Post>, number | void>({
      query: (limit) =>
        `user/comments/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMeTLPosts: builder.query<Pagination<Post>, number | void>({
      query: (limit) =>
        `user/timeline/posts/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMeTLArticles: builder.query<Pagination<Article>, number | void>({
      query: (limit) =>
        `user/timeline/articles/?limit${limit || 10}&offset=${limit || 10}`
    }),

    newPost: builder.mutation<Post, PostRequest>({
      query: (post) => ({
        url: `user/posts/new/`,
        method: "POST",
        body: post
      })
    }),
    newArticle: builder.mutation<Article, ArticleRequest>({
      query: (article) => ({
        url: `user/article/new/`,
        method: "POST",
        body: article
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMeFollowersQuery,
  useLazyGetMeFollowersQuery,
  useGetMeFollowingQuery,
  useLazyGetMeFollowingQuery,
  useGetMeArticlesQuery,
  useLazyGetMeArticlesQuery,
  useGetMePostsQuery,
  useLazyGetMePostsQuery,
  useGetMeCommentsQuery,
  useLazyGetMeCommentsQuery,
  useGetMePostsLikedQuery,
  useLazyGetMePostsLikedQuery,
  useGetMeArticlesLikedQuery,
  useLazyGetMeArticlesLikedQuery,
  useGetMeTLPostsQuery,
  useLazyGetMeTLPostsQuery,
  useGetMeTLArticlesQuery,
  useLazyGetMeTLArticlesQuery,

  useNewPostMutation,
  useNewArticleMutation
} = meApi;
