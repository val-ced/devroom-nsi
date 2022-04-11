import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { User } from "../../Types/Interfaces/User";
import { devroomApiAuth } from "./apiAuth";

export interface PostRequest {
  body: string;
}

export interface ArticleRequest {
  body: string;
  title: string;
}

const meApi = devroomApiAuth.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "user/"
    }),
    getMeFollowers: builder.query<
      Pagination<User>,
      { limit?: number; page?: number } | void
    >({
      query: (q) =>
        `user/followers/${
          q
            ? `?limit=${q.limit || 10}&offset=${
                ((q.page || 1) - 1) * (q.limit || 10)
              }`
            : ""
        }`
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
    editPost: builder.mutation<Post, PostRequest & { uuid: string }>({
      query: ({ body, uuid }) => ({
        url: `user/posts/${uuid}/edit/`,
        method: "PUT",
        body: { body }
      })
    }),
    deletePost: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `user/posts/${uuid}/delete/`,
        method: "DELETE"
      })
    }),
    newArticle: builder.mutation<Article, ArticleRequest>({
      query: (article) => ({
        url: `user/articles/new/`,
        method: "POST",
        body: article
      })
    }),
    editArticle: builder.mutation<Article, ArticleRequest & { uuid: string }>({
      query: ({ body, title, uuid }) => ({
        url: `user/articles/${uuid}/edit/`,
        method: "PUT",
        body: { body, title }
      })
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `user/articles/${uuid}/delete/`,
        method: "DELETE"
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
  useEditPostMutation,
  useDeletePostMutation,

  useNewArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation
} = meApi;
